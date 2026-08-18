// ── Hamburger menu ──
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
hamburger.addEventListener('click', () => {
hamburger.classList.toggle('open');
mobileMenu.classList.toggle('open');
document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a').forEach(a => {
a.addEventListener('click', () => {
hamburger.classList.remove('open');
mobileMenu.classList.remove('open');
document.body.style.overflow = '';
});
});
}
// ── Form ──
function handleSubmit(e) {
e.preventDefault();
alert("Thanks for reaching out! This is a design-proposal demo site, so this form isn't wired up yet — please call (806) 771-7690 to reach the real Cast Iron Grill.");
e.target.reset();
}
// ── Gallery tabs ──
function switchTab(e, panelId) {
document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
document.querySelectorAll('.gallery-panel').forEach(p => p.classList.remove('active'));
e.currentTarget.classList.add('active');
document.getElementById('panel-' + panelId).classList.add('active');
}
// ── Lightbox ──
let allImgs = [];
let currentIdx = 0;
function openLightbox(el) {
const panel = el.closest('.gallery-panel');
allImgs = Array.from(panel.querySelectorAll('.gallery-item img'));
const img = el.querySelector('img');
currentIdx = allImgs.indexOf(img);
showLightboxImg(currentIdx);
document.getElementById('lightbox').classList.add('open');
document.body.style.overflow = 'hidden';
}
function showLightboxImg(idx) {
const img = allImgs[idx];
document.getElementById('lightbox-img').src = img.src;
document.getElementById('lightbox-img').alt = img.alt;
document.getElementById('lightbox-caption').textContent = img.alt + ' (' + (idx + 1) + ' / ' + allImgs.length + ')';
}
function shiftLightbox(dir) {
currentIdx = (currentIdx + dir + allImgs.length) % allImgs.length;
showLightboxImg(currentIdx);
}
function closeLightbox() {
document.getElementById('lightbox').classList.remove('open');
document.body.style.overflow = '';
}
function closeLightboxOnBg(e) {
if (e.target === document.getElementById('lightbox')) closeLightbox();
}
document.addEventListener('keydown', e => {
if (!document.getElementById('lightbox').classList.contains('open')) return;
if (e.key === 'ArrowRight') shiftLightbox(1);
if (e.key === 'ArrowLeft') shiftLightbox(-1);
if (e.key === 'Escape') closeLightbox();
});
// ── Scroll animations ──
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.style.opacity = '1';
entry.target.style.transform = 'translateY(0)';
}
});
}, { threshold: 0.1 });
document.querySelectorAll('.feature-item, .menu-item').forEach(el => observer.observe(el));
