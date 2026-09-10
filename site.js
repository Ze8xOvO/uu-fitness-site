'use strict';
document.querySelectorAll('.chapter').forEach(section=>{
  const buttons=[...section.querySelectorAll('.story')];
  const featured=section.querySelector('.featured');
  buttons.forEach(button=>button.addEventListener('click',()=>{
    buttons.forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    const img=featured.querySelector('img');img.src=button.dataset.screen;img.alt=button.dataset.title;
    featured.dataset.zoom=button.dataset.screen;featured.dataset.title=button.dataset.title;
    featured.setAttribute('aria-label','放大查看：'+button.dataset.title);
    section.querySelector('.shot-counter').textContent=button.dataset.index.padStart(2,'0')+' / '+String(buttons.length).padStart(2,'0');
    // On narrow screens the screenshot precedes the story list. Bring the selected image into view.
    if(window.matchMedia('(max-width: 800px)').matches){section.querySelector('.visual').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
  }));
});
const viewer=document.getElementById('viewer'),image=document.getElementById('viewer-img');let opener;
document.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>{
  opener=button;image.src=button.dataset.zoom;image.alt=button.dataset.title;
  document.getElementById('viewer-title').textContent=button.dataset.title;
  viewer.showModal();viewer.scrollTop=0;document.body.style.overflow='hidden';
}));
document.getElementById('close-viewer').addEventListener('click',()=>viewer.close());
viewer.addEventListener('close',()=>{document.body.style.overflow='';if(opener)opener.focus();});
viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();}});
const navLinks=[...document.querySelectorAll('.categories a')];
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(a=>{const active=a.hash==='#'+entry.target.id;a.classList.toggle('current',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}});},{rootMargin:'-20% 0px -55% 0px'});document.querySelectorAll('.chapter').forEach(section=>observer.observe(section));}
