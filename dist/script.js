(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  $('.replay-intro').addEventListener('click', () => window.startCafeOpening(true));
  const menuButton = $('.menu-btn');
  const nav = $('#nav');
  function setMenu(open, returnFocus = false) {
    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Close' : 'Menu';
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('click', event => { if (!event.target.closest('.hdr')) setMenu(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) setMenu(false, true); });
  matchMedia('(min-width: 861px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

  // Native smooth scrolling remains interruptible by wheel, touch and keyboard.
  const navLinks = $$('.nav a:not(.cta)');
  if ('IntersectionObserver' in window) {
    const active = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        navLinks.forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, {rootMargin: '-20% 0px -55% 0px'});
    ['welcome', 'story', 'drinks', 'journal', 'visit'].forEach(id => active.observe(document.getElementById(id)));
  }
  const progress = $('.progress');
  const header = $('.hdr');
  let framePending = false;
  function updateScroll() {
    if (scrollY < 100) navLinks.forEach(link => link.removeAttribute('aria-current'));
    const height = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${height > 0 ? Math.min(1, scrollY / height) : 0})`;
    header.classList.toggle('scrolled', scrollY > 30);
    framePending = false;
  }
  addEventListener('scroll', () => { if (!framePending) { framePending = true; requestAnimationFrame(updateScroll); } }, {passive:true});
  addEventListener('resize', updateScroll);
  updateScroll();

  if (!motion.matches && 'IntersectionObserver' in window) {
    const items = $$('.welcome .txt,.food-photo,.story .body,.story .pic,.drinks .lead,.drink,.journal-head,.journal-item,.visit h2,.contact li,.visit aside');
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); reveal.unobserve(entry.target); } });
    }, {threshold:.06, rootMargin:'0px 0px 35px 0px'});
    items.forEach(element => { element.classList.add('rv'); reveal.observe(element); });
    document.documentElement.classList.add('js');
    motion.addEventListener('change', event => { if (event.matches) { items.forEach(element => element.classList.add('in')); reveal.disconnect(); } });
  }

  // Image viewer: native dialog supplies focus containment and Escape handling.
  const photos = [
    {src:'assets/egg-in-fire.jpg',caption:'Egg in Fire — from the café’s August social post'},
    {src:'assets/strawberry-matcha.jpg',caption:'Strawberry Matcha — from the café’s August social post'},
    {src:'assets/coffee-and-brunch.jpg',caption:'Coffee & brunch — from the café’s July social post'},
    {src:'assets/courtyard-market.jpg',caption:'September market poster — archive, not an upcoming date'}
  ];
  const dialog = $('.lightbox');
  let current = 0;
  let opener = null;
  function showPhoto(index) {
    current = (index + photos.length) % photos.length;
    const photo = photos[current];
    $('#lightbox-image').src = photo.src;
    $('#lightbox-image').alt = photo.caption;
    $('#lightbox-caption').textContent = photo.caption;
    $('.lightbox-count').textContent = `${current + 1} / ${photos.length}`;
  }
  $$('[data-photo]').forEach(button => button.addEventListener('click', () => {
    opener = button;
    showPhoto(Number(button.dataset.photo));
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    $('.lightbox-close').focus();
  }));
  $('.lightbox-close').addEventListener('click', () => dialog.close());
  $('.photo-prev').addEventListener('click', () => showPhoto(current - 1));
  $('.photo-next').addEventListener('click', () => showPhoto(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') {event.preventDefault(); showPhoto(current + 1);}
    if (event.key === 'ArrowLeft') {event.preventDefault(); showPhoto(current - 1);}
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; if (opener) opener.focus(); });

  // Facebook is contacted only when a visitor chooses to load a reel.
  $$('.reel-load').forEach(button => button.addEventListener('click', () => {
    const shell = button.closest('[data-reel]');
    const reel = `https://www.facebook.com/reel/${shell.dataset.reel}/`;
    const iframe = document.createElement('iframe');
    iframe.title = button.getAttribute('aria-label').replace('Load ', '');
    iframe.src = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(reel)}&show_text=0&width=360`;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    shell.replaceChildren(iframe);
  }));
})();
