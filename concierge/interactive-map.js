/* ── INTERACTIVE MAP (Leaflet + OpenStreetMap) ──────────────────────────
   Replaces the old Google Maps iframe embed, which was a dead end for this:
   you can't draw hoverable/clickable shapes on top of a bare iframe.

   Two pieces:
   - initCityBoundaryMap(): draws a city's REAL administrative boundary
     (from OpenStreetMap) as a hoverable, clickable polygon.
   - initNeighborhoodMap(): draws a city's real boundary, plus its
     neighborhoods. Neighborhood REGIONS are computed (nearest-point /
     Voronoi, clipped to the real city boundary) from real neighborhood
     center coordinates, because informal neighborhoods generally have no
     official boundary lines in OpenStreetMap (or anywhere public) — this
     is documented where each city's data file is generated. Neighborhood
     CENTER POINTS (the pins) are always real coordinates.
   ── */

(function (global) {
  const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const TILE_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';

  function baseMap(containerId, center, zoom) {
    const map = L.map(containerId, { scrollWheelZoom: false }).setView(center, zoom);
    L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION, maxZoom: 19 }).addTo(map);
    return map;
  }

  // ── Ray-casting point-in-polygon. `poly` is a GeoJSON-style ring:
  // [[lon,lat], [lon,lat], ...]. `pt` is [lon, lat]. ── */
  function pointInRing(pt, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];
      const intersect = (yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }
  function pointInGeometry(pt, geometry) {
    if (geometry.type === 'Polygon') {
      return pointInRing(pt, geometry.coordinates[0]);
    }
    if (geometry.type === 'MultiPolygon') {
      return geometry.coordinates.some((poly) => pointInRing(pt, poly[0]));
    }
    return false;
  }

  /* ── City-level: real boundary polygon(s), hover to outline, click to visit.
     opts.onHover(feature) / opts.onHoverEnd() are optional — fired on real
     mouseover/mouseout, AND (if opts.autoFocusOnMove is true) synthetically
     as the map is panned/zoomed, so a caller can drive an events panel etc.
     purely from where the map is currently centered, not just direct hover. ── */
  global.initCityBoundaryMap = function (containerId, opts) {
    const map = baseMap(containerId, opts.center, opts.zoom || 12);
    let focused = null;
    let layerRef = null;

    function setFocused(feature, lyr) {
      if (focused === feature) return;
      if (focused && focused._lyr) focused._lyr.setStyle(baseStyle);
      focused = feature || null;
      if (feature && lyr) {
        feature._lyr = lyr;
        lyr.setStyle(hoverStyle);
      }
      if (feature) {
        if (opts.onHover) opts.onHover(feature);
      } else if (opts.onHoverEnd) {
        opts.onHoverEnd();
      }
    }

    const baseStyle = { color: '#2a7fbf', weight: 2, fillColor: '#2a7fbf', fillOpacity: 0.08 };
    const hoverStyle = { color: '#e8a723', weight: 3, fillColor: '#e8a723', fillOpacity: 0.22 };

    fetch(opts.boundaryUrl)
      .then((r) => r.json())
      .then((fc) => {
        const layer = L.geoJSON(fc, {
          style: baseStyle,
          onEachFeature: function (feature, lyr) {
            lyr.on('mouseover', function () {
              setFocused(feature, lyr);
              lyr.bindTooltip(feature.properties.name + ' — click to explore', { sticky: true }).openTooltip();
            });
            lyr.on('mouseout', function () {
              setFocused(null);
              lyr.closeTooltip();
            });
            lyr.on('click', function () {
              if (opts.onClick) opts.onClick(feature);
            });
          },
        }).addTo(map);
        layerRef = layer;

        map.fitBounds(layer.getBounds(), { padding: [20, 20] });

        if (opts.autoFocusOnMove) {
          const minZoom = opts.autoFocusMinZoom || 0;
          const update = function () {
            if (map.getZoom() < minZoom) {
              setFocused(null);
              return;
            }
            const center = map.getCenter();
            const bounds = map.getBounds();
            let best = null;
            let bestDist = Infinity;
            layer.eachLayer(function (lyr) {
              const b = lyr.getBounds();
              if (!bounds.intersects(b)) return;
              const c = b.getCenter();
              const d = center.distanceTo(c);
              if (d < bestDist) {
                bestDist = d;
                best = lyr;
              }
            });
            if (best) setFocused(best.feature, best);
            else setFocused(null);
          };
          map.on('moveend zoomend', update);
        }
      })
      .catch(function () {
        const el = document.getElementById(containerId);
        if (el) el.insertAdjacentHTML('beforeend', '<p style="padding:1rem;font-size:0.8rem;color:var(--sub);">Map boundary data unavailable right now.</p>');
      });

    return map;
  };

  /* ── Neighborhood-level: real city boundary + computed neighborhood
     regions (nearest real center point, clipped to the real city boundary),
     with real center points shown as pins. Hover fills the whole region
     nearest to the cursor; click navigates to that neighborhood's page. ── */
  global.initNeighborhoodMap = function (containerId, opts) {
    const map = baseMap(containerId, opts.center, opts.zoom || 13);
    const canvas = L.DomUtil.create('canvas', 'neighborhood-voronoi-canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    map.getPanes().overlayPane.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let boundaryGeom = null;
    let neighborhoods = [];
    let hovered = null;

    function resizeCanvas() {
      const size = map.getSize();
      canvas.width = size.x;
      canvas.height = size.y;
      const topLeft = map.containerPointToLayerPoint([0, 0]);
      L.DomUtil.setPosition(canvas, topLeft);
    }

    function nearest(lon, lat) {
      let best = null;
      let bestDist = Infinity;
      for (const n of neighborhoods) {
        const dLat = n.lat - lat;
        const dLon = n.lon - lon;
        const d = dLat * dLat + dLon * dLon;
        if (d < bestDist) {
          bestDist = d;
          best = n;
        }
      }
      return best;
    }

    function draw() {
      resizeCanvas();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!boundaryGeom || !hovered) return;

      const step = 3; // sample every 3px for performance; fillRect covers the gaps
      ctx.fillStyle = 'rgba(232, 167, 35, 0.32)';
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const latlng = map.containerPointToLatLng([x, y]);
          const pt = [latlng.lng, latlng.lat];
          if (!pointInGeometry(pt, boundaryGeom)) continue;
          const nb = nearest(latlng.lng, latlng.lat);
          if (nb === hovered) {
            ctx.fillRect(x, y, step, step);
          }
        }
      }
    }

    function setHovered(nb) {
      if (hovered === nb) return;
      hovered = nb;
      draw();
      const tipEl = document.getElementById(containerId + '-tip');
      if (tipEl) tipEl.textContent = nb ? nb.name + ' — click to explore' : '';
    }

    Promise.all([fetch(opts.boundaryUrl).then((r) => r.json()), fetch(opts.neighborhoodsUrl).then((r) => r.json())]).then(
      function (results) {
        const boundaryFc = results[0];
        const nbData = results[1];
        boundaryGeom = boundaryFc.features[0].geometry;
        neighborhoods = nbData.neighborhoods;

        const boundaryLayer = L.geoJSON(boundaryFc, { style: { color: '#2a7fbf', weight: 2, fill: false } }).addTo(map);
        map.fitBounds(boundaryLayer.getBounds(), { padding: [10, 10] });

        neighborhoods.forEach(function (nb) {
          const marker = L.circleMarker([nb.lat, nb.lon], {
            radius: 6,
            color: '#1a3a5c',
            weight: 2,
            fillColor: '#fff',
            fillOpacity: 1,
          })
            .addTo(map)
            .bindTooltip(nb.name, { permanent: true, direction: 'top', className: 'nb-label', offset: [0, -6] });

          marker.on('mouseover', function () {
            setHovered(nb);
          });
          marker.on('mouseout', function () {
            setHovered(null);
          });
          marker.on('click', function () {
            window.location.href = nb.url;
          });
        });

        map.on('mousemove', function (e) {
          if (!boundaryGeom) return;
          const pt = [e.latlng.lng, e.latlng.lat];
          if (!pointInGeometry(pt, boundaryGeom)) {
            setHovered(null);
            return;
          }
          setHovered(nearest(e.latlng.lng, e.latlng.lat));
        });
        map.on('click', function (e) {
          if (!hovered) return;
          const pt = [e.latlng.lng, e.latlng.lat];
          if (!boundaryGeom || !pointInGeometry(pt, boundaryGeom)) return;
          window.location.href = hovered.url;
        });
        map.on('move zoom resize', draw);
        draw();
      },
    );

    return map;
  };
})(window);
