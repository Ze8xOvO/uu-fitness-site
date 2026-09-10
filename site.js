'use strict';
const features = {
  training: { title: '动作库', badge: '常用动作，随时找到。', alt: '按身体部位分类的训练动作库' },
  timer: { title: '组间休息计时', badge: '练得专注，歇得从容。', alt: '可选择预设时长和自定义时长的组间休息计时' },
  calendar: { title: '记录日历', badge: '每一个有记录的日子，都算数。', alt: '显示训练日期和部位的记录日历' },
  history: { title: '训练历史', badge: '记住这一次，为下一次准备。', alt: '可按动作部位和日期筛选的训练历史' }
};
const tabs = [...document.querySelectorAll('[data-feature]')];
const panelImage = document.getElementById('panel-image');
const panelZoom = document.getElementById('panel-zoom');
function activate(tab, focus = false) {
  const key = tab.dataset.feature;
  const feature = features[key];
  tabs.forEach(item => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  panelImage.src = `images/${key}.jpg`;
  panelImage.alt = feature.alt;
  panelZoom.dataset.image = panelImage.getAttribute('src');
  panelZoom.dataset.title = feature.title;
  document.getElementById('panel-category').textContent = feature.title;
  document.getElementById('panel-badge').textContent = feature.badge;
  document.getElementById('feature-panel').setAttribute('aria-labelledby', tab.id);
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activate(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activate(tabs[next], true); }
  });
});
const dialog = document.getElementById('image-dialog');
const largeImage = document.getElementById('dialog-image');
let opener;
document.querySelectorAll('.zoomable').forEach(button => button.addEventListener('click', () => {
  opener = button;
  largeImage.src = button.dataset.image;
  largeImage.alt = button.dataset.title;
  document.getElementById('dialog-title').textContent = button.dataset.title;
  dialog.showModal();
  dialog.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}));
document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) {
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
}});
dialog.addEventListener('close', () => { document.body.style.overflow = ''; if (opener) opener.focus(); });
const gallery = document.getElementById('gallery-track');
const previous = document.getElementById('gallery-prev');
const next = document.getElementById('gallery-next');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function moveGallery(direction) { gallery.scrollBy({left: direction * (gallery.querySelector('figure').offsetWidth + 28), behavior: reduceMotion.matches ? 'instant' : 'smooth'}); }
function updateGallery() { previous.disabled = gallery.scrollLeft < 3; next.disabled = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 3; }
previous.addEventListener('click', () => moveGallery(-1));
next.addEventListener('click', () => moveGallery(1));
gallery.addEventListener('scroll', updateGallery, {passive:true});
window.addEventListener('resize', updateGallery);
updateGallery();
