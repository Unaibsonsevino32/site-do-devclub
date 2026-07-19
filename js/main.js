/* DevClub — animações e interações */
(function(){
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  ScrollTrigger.create({
    start: 'top -60',
    end: 99999,
    onUpdate: (self) => {
      header.classList.toggle('scrolled', self.scroll() > 60);
    }
  });

  /* ---------- mobile menu ---------- */
  const burger = document.getElementById('burgerBtn');
  const nav = document.getElementById('mainNav');
  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  /* ---------- hero video -> logo reveal -> content, replayable on click ---------- */
  const video = document.getElementById('heroVideo');
  const logoReveal = document.getElementById('heroLogoReveal');
  const replayHint = document.getElementById('replayHint');
  const heroFadeEls = document.querySelectorAll('.hero-fade');
  gsap.set(heroFadeEls, { y: 22 });

  let revealed = false;
  let settled = false;
  let settleTimer = null;

  function settleIntro(){
    if (settled) return;
    settled = true;
    gsap.to(logoReveal, { opacity: 0, scale: .9, y: -30, duration: 1.1, ease: 'power2.inOut' });
    gsap.to(video, { opacity: .4, duration: 1.4, ease: 'power2.out' });
    gsap.to(heroFadeEls, { opacity: 1, y: 0, duration: 1, stagger: .12, ease: 'power3.out' });
    replayHint.classList.add('visible');
  }

  function playReveal(){
    if (revealed) return;
    revealed = true;
    gsap.to(video, { opacity: .6, duration: 1.4, ease: 'power2.out' });
    gsap.fromTo(logoReveal,
      { opacity: 0, scale: .82, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 1.6, ease: 'power3.out' }
    );
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settleIntro, 3200);
  }

  video.addEventListener('timeupdate', () => {
    if (video.duration && video.currentTime >= video.duration - 2.2){
      playReveal();
    }
  });
  video.addEventListener('ended', () => {
    playReveal();
    video.pause();
  });

  function replayIntro(){
    clearTimeout(settleTimer);
    revealed = false;
    settled = false;
    replayHint.classList.remove('visible');
    gsap.killTweensOf([video, logoReveal, heroFadeEls]);
    gsap.set(logoReveal, { opacity: 0, scale: .82, y: 20 });
    gsap.set(video, { opacity: 1 });
    gsap.to(heroFadeEls, { opacity: 0, y: 22, duration: .4, ease: 'power2.in' });
    video.pause();
    video.currentTime = 0;
    video.play().catch(() => {});
  }

  document.querySelector('.hero').addEventListener('click', (e) => {
    if (e.target.closest('a, button:not(#replayHint)')) return;
    replayIntro();
  });
  replayHint.addEventListener('click', (e) => { e.stopPropagation(); replayIntro(); });

  /* hide the fixed hero overlay controls once the hero scrolls out of view */
  const scrollHintEl = document.querySelector('.scroll-hint');
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'bottom 90%',
    onEnter: () => { gsap.to([scrollHintEl, replayHint], { opacity: 0, duration: .3, overwrite: 'auto' }); replayHint.classList.remove('visible'); },
    onLeaveBack: () => {
      gsap.to(scrollHintEl, { opacity: 1, duration: .3, overwrite: 'auto' });
      if (settled) replayHint.classList.add('visible');
    }
  });

  /* ---------- generic reveal-up / reveal-left / reveal-right ---------- */
  gsap.utils.toArray('.reveal-up').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      }
    );
  });
  gsap.utils.toArray('.reveal-left').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, x: -50 },
      {
        opacity: 1, x: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      }
    );
  });
  gsap.utils.toArray('.reveal-right').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, x: 50 },
      {
        opacity: 1, x: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      }
    );
  });

  /* stagger children of grids for nicer entrance */
  [
    '.beneficios-grid', '.professores-grid', '.skills-grid', '.tech-grid'
  ].forEach(sel => {
    const grid = document.querySelector(sel);
    if (!grid) return;
    gsap.from(grid.children, {
      opacity: 0, y: 30, duration: .8, ease: 'power2.out', stagger: .08,
      scrollTrigger: { trigger: grid, start: 'top 85%' }
    });
  });

  /* ---------- hero parallax ---------- */
  gsap.to('.hero-video', {
    yPercent: 18, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-content', {
    yPercent: 25, opacity: .4, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* mouse-follow glow (transform-based to stay off the layout/paint path) */
  const glow = document.querySelector('.cursor-glow');
  let glowX = window.innerWidth / 2, glowY = window.innerHeight / 3;
  window.addEventListener('mousemove', (e) => { glowX = e.clientX; glowY = e.clientY; });
  gsap.ticker.add(() => {
    gsap.set(glow, { x: glowX, y: glowY });
  });

  /* ---------- formações horizontal scroll driven by page scroll ---------- */
  const formTrack = document.getElementById('formacoesTrack');
  const formBar = document.getElementById('formacoesBar');
  if (formTrack){
    function formScrollAmount(){
      return formTrack.scrollWidth - formTrack.parentElement.clientWidth;
    }
    ScrollTrigger.create({
      trigger: '.formacoes',
      start: 'top top',
      end: () => '+=' + (formScrollAmount() + window.innerHeight * .6),
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const dist = formScrollAmount();
        gsap.set(formTrack, { x: -dist * self.progress });
        gsap.set(formBar, { width: (18 + self.progress * 82) + '%' });
      }
    });
  }

  /* ---------- depoimentos manual horizontal drag/scroll parallax ---------- */
  const depTrack = document.getElementById('depoimentosTrack');
  if (depTrack){
    gsap.fromTo(depTrack,
      { x: 40 },
      {
        x: () => -(depTrack.scrollWidth - depTrack.parentElement.clientWidth + 40),
        ease: 'none',
        scrollTrigger: {
          trigger: '.depoimentos',
          start: 'top 60%',
          end: 'bottom top',
          scrub: 1
        }
      }
    );
  }

  /* ---------- counter animation ---------- */
  document.querySelectorAll('.counter').forEach((el) => {
    const target = +el.dataset.target;
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target, duration: 2, ease: 'power1.out',
          onUpdate: () => { el.textContent = Math.floor(obj.val).toLocaleString('pt-BR'); }
        });
      }
    });
  });

  /* ---------- mercado bars fill on scroll ---------- */
  gsap.utils.toArray('.mercado-bar').forEach((bar) => {
    gsap.fromTo(bar,
      { width: 0 },
      {
        width: bar.style.getPropertyValue('--w'), duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: bar, start: 'top 90%' }
      }
    );
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        if (openItem !== item){
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });

  /* ---------- smooth anchor offset for fixed header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

})();
