/* ============================================================
   CEPICA — Sitio Multipágina · Lógica Compartida
   Vanilla JS · 60fps · Zero Dependencies
   ============================================================ */
(function () {
  'use strict';

  /* ========== DATOS CENTRALES (fuente única) ========== */
  const CEPICA = {
    name: 'CEPICA',
    fullName: 'Consultores Especializados en Procesos Industriales, C.A.',
    years: 16,
    yearsLabel: '16+',
    horasHombre: 1000000,
    horasHombreLabel: '1.000.000+',
    disciplines: 6,
    projects: 150,
    phone: '+58 414-391-4966',
    phoneClean: '584143914966',
    email: 'info@cepica.com.ve',
    address: 'Edificio Plaza Catedral, Calle San Antonio, entre Carrera 5B y Calle Bermúdez, Sector Campo Obrero, Maturín, Estado Monagas, Venezuela',
    linkedin: 'https://www.linkedin.com/company/cepica',
    whatsappUrl: 'https://wa.me/584143914966?text=Buen%20d%C3%ADa%2C%20estoy%20interesado%20en%20los%20servicios%20de%20CEPICA.%20%C2%BFPodr%C3%ADan%20brindarme%20informaci%C3%B3n%3F',
    presidente: 'Vicmar Suárez'
  };

  /* Endpoint de formulario — reemplazar con ID real de Formspree */
  const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  /* ========== CONFIGURACIÓN DEL CARRUSEL ========== */
  const NUM_SLICES = 14;
  const SLIDE_INTERVAL = 5000;
  const HEADLINES = [
    'INGENIERÍA DE PRECISIÓN PARA LA INDUSTRIA PETROLERA',
    'MÁS DE 1.000.000 DE HORAS-HOMBRE EJECUTADAS',
    'SOLUCIONES INTEGRALES EPC DE CLASE MUNDIAL',
    'EXCELENCIA TÉCNICA AL SERVICIO DE VENEZUELA'
  ];
  const SLIDE_IMAGES = [
    'fotos/pexels-sejio402-6477213.jpg',
    'fotos/pexels-sergey-sergeev-2153675005-32845690.jpg',
    'fotos/pexels-th-ng-flight-simulator-2164127181-39463022.jpg',
    'fotos/vicmar_suarez.jpg'
  ];

  /* ========== CHATBOT RESPUESTAS (expandido) ========== */
  const CHATBOT_ANSWERS = {
    servicios: `Ofrecemos servicios integrales de ingeniería en ${CEPICA.disciplines} disciplinas: Civil, Eléctrica, Instrumentación y Automatización, Mecánica, Telecomunicaciones, y Procura y Asistencia Técnica. Cubrimos todo el ciclo EPC. <a href="servicios.html">Ver todos los servicios →</a>`,
    experiencia: `Tenemos más de ${CEPICA.yearsLabel} años de trayectoria y hemos ejecutado más de ${CEPICA.horasHombreLabel} horas-hombre en proyectos de alta complejidad para la industria petrolera, petroquímica y energética. <a href="nosotros.html">Conocer más →</a>`,
    contacto: `Puede contactarnos al ${CEPICA.phone}, escribirnos a ${CEPICA.email} o completar el formulario en nuestra página de contacto. Respondemos en menos de 24 horas hábiles. <a href="contacto.html">Ir a Contacto →</a>`,
    ubicacion: `Nuestra sede principal está en ${CEPICA.address}. <a href="contacto.html">Ver mapa →</a>`,
    civil: `Nuestra disciplina de Ingeniería Civil abarca diseño estructural, obras civiles, cimentaciones, edificaciones y estructuras metálicas para plantas de proceso. <a href="servicios.html#civil">Más detalles →</a>`,
    electrica: `En Ingeniería Eléctrica diseñamos sistemas de potencia, distribución, subestaciones, iluminación industrial y protección para instalaciones críticas. <a href="servicios.html#electrica">Más detalles →</a>`,
    instrumentacion: `Nuestra área de Instrumentación y Automatización cubre sistemas DCS/PLC, instrumentación de campo, lazos de control, SCADA y automatización de procesos. <a href="servicios.html#instrumentacion">Más detalles →</a>`,
    mecanica: `En Ingeniería Mecánica trabajamos con equipos a presión, tuberías de proceso, análisis de esfuerzos, HVAC industrial y sistemas mecánicos petroleros. <a href="servicios.html#mecanica">Más detalles →</a>`,
    telecomunicaciones: `Telecomunicaciones incluye redes de comunicación industrial, fibra óptica, radio, telefonía IP y conectividad para instalaciones remotas. <a href="servicios.html#telecomunicaciones">Más detalles →</a>`,
    procura: `Procura y Asistencia Técnica cubre gestión de compras técnicas, logística de materiales, asistencia en campo y supervisión de construcción. <a href="servicios.html#procura">Más detalles →</a>`,
    siaho: `SIAHO (Seguridad Industrial, Ambiente e Higiene Ocupacional) es un pilar fundamental de nuestra operación. Integramos la prevención de riesgos en cada fase del proyecto. <a href="servicios.html">Ver enfoque SIAHO →</a>`,
    cotizar: `Para solicitar una cotización, complete el formulario de contacto indicando el servicio de interés y una breve descripción de su proyecto. <a href="contacto.html">Solicitar cotización →</a>`,
    liderazgo: `CEPICA es liderada por ${CEPICA.presidente}, ingeniero con más de ${CEPICA.yearsLabel} años de trayectoria en el sector petrolero y energético. <a href="liderazgo.html">Conocer al equipo →</a>`
  };

  /* ========== ESTADO GLOBAL ========== */
  let currentSlide = 0;
  let slideTimer = null;
  let isTransitioning = false;
  let typingTimeout = null;
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let ringX = 0, ringY = 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ========== INIT ========== */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initPageTransition();
    initCursor();
    initNav();
    initDrawer();
    initReveal();
    initCounters();
    initTilt();
    initSmoothScroll();
    initForm();
    initServiceParams();
    initMap();
    initClock();
    initRipple();
    initChatbot();
    initFaqAccordion();
    initShutterCarousel();
    initTypingHeadline();
    initVideoObserver();
    initBackToTop();
    initReadingProgress();
    initLightbox();
    initStickyDisciplineNav();
  }

  /* ========== 1. PAGE TRANSITION ========== */
  function initPageTransition() {
    const wrapper = document.querySelector('.page-transition');
    if (!wrapper) return;
    requestAnimationFrame(() => {
      wrapper.classList.add('loaded');
    });

    if (prefersReducedMotion) return;

    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') ||
          href.startsWith('tel') || link.target === '_blank') return;
      if (!href.endsWith('.html') && !href.endsWith('/')) return;

      e.preventDefault();
      wrapper.classList.remove('loaded');
      setTimeout(() => { window.location.href = href; }, 250);
    });
  }

  /* ========== 2. CUSTOM CURSOR (bug corregido) ========== */
  function initCursor() {
    try {
      if (window.matchMedia('(max-width: 1024px)').matches) return;
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

      const dot = document.querySelector('.cursor-dot');
      const ring = document.querySelector('.cursor-ring');
      if (!dot || !ring) return;

      let cursorVisible = false;

      document.documentElement.classList.add('has-custom-cursor');

      document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!cursorVisible) {
          cursorVisible = true;
          dot.classList.add('visible');
          ring.classList.add('visible');
          cursorX = mouseX;
          cursorY = mouseY;
          ringX = mouseX;
          ringY = mouseY;
          dot.style.transform = 'translate3d(' + (mouseX - 4) + 'px,' + (mouseY - 4) + 'px, 0)';
          ring.style.transform = 'translate3d(' + (mouseX - 18) + 'px,' + (mouseY - 18) + 'px, 0)';
        }
      });

      document.documentElement.addEventListener('mouseleave', function () {
        dot.classList.remove('visible');
        ring.classList.remove('visible');
      });
      document.documentElement.addEventListener('mouseenter', function () {
        if (cursorVisible) {
          dot.classList.add('visible');
          ring.classList.add('visible');
        }
      });

      /* Delegación de eventos para hover */
      const hoverSelector = 'a, button, input, textarea, select, .svc-card, .fab, .indicator, .explore-card, [data-lightbox], .gallery__item';
      document.addEventListener('mouseover', function (e) {
        if (e.target.closest(hoverSelector)) {
          dot.classList.add('expand');
          ring.classList.add('expand');
        }
      });
      document.addEventListener('mouseout', function (e) {
        if (e.target.closest(hoverSelector)) {
          dot.classList.remove('expand');
          ring.classList.remove('expand');
        }
      });

      function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.25;
        cursorY += (mouseY - cursorY) * 0.25;
        dot.style.transform = 'translate3d(' + (cursorX - 4) + 'px,' + (cursorY - 4) + 'px, 0)';

        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.transform = 'translate3d(' + (ringX - 18) + 'px,' + (ringY - 18) + 'px, 0)';

        requestAnimationFrame(animateCursor);
      }
      requestAnimationFrame(animateCursor);

    } catch (err) {
      /* Si falla, el puntero nativo queda visible */
      document.documentElement.classList.remove('has-custom-cursor');
    }
  }

  /* ========== 3. SHUTTER CAROUSEL ========== */
  function initShutterCarousel() {
    const container = document.getElementById('shutter');
    const indicatorContainer = document.getElementById('slide-indicators');
    if (!container) return;
    if (prefersReducedMotion) {
      container.style.backgroundImage = "url('" + SLIDE_IMAGES[0] + "')";
      container.style.backgroundSize = 'cover';
      container.style.backgroundPosition = 'center';
      return;
    }

    SLIDE_IMAGES.forEach(function (src) {
      const img = new Image();
      img.src = src;
    });

    for (let i = 0; i < NUM_SLICES; i++) {
      const slice = document.createElement('div');
      slice.className = 'shutter-slice';
      const imgLayer = document.createElement('div');
      imgLayer.className = 'shutter-slice__img shutter-slice__img--current';
      imgLayer.style.backgroundImage = "url('" + SLIDE_IMAGES[0] + "')";
      imgLayer.style.width = '100vw';
      imgLayer.style.left = -(100 / NUM_SLICES) * i + 'vw';
      imgLayer.style.top = '0';
      imgLayer.style.height = '100%';
      imgLayer.style.position = 'absolute';
      imgLayer.style.backgroundSize = 'cover';
      imgLayer.style.backgroundPosition = 'center';
      slice.appendChild(imgLayer);
      container.appendChild(slice);
    }

    if (indicatorContainer) {
      for (let j = 0; j < SLIDE_IMAGES.length; j++) {
        const btn = document.createElement('button');
        btn.className = 'indicator' + (j === 0 ? ' active' : '');
        btn.setAttribute('aria-label', 'Diapositiva ' + (j + 1));
        btn.addEventListener('click', (function (idx) {
          return function () { goToSlide(idx); };
        })(j));
        indicatorContainer.appendChild(btn);
      }
    }

    if (!window.matchMedia('(hover: none)').matches) {
      container.addEventListener('mousemove', function (e) {
        const slices = container.querySelectorAll('.shutter-slice');
        const rect = container.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        slices.forEach(function (sl) {
          const sliceRect = sl.getBoundingClientRect();
          const sliceCenterX = sliceRect.left + sliceRect.width / 2 - rect.left;
          const dist = Math.abs(relX - sliceCenterX);
          const maxDist = rect.width / 3;
          const intensity = Math.max(0, 1 - dist / maxDist);
          sl.style.transform = 'scaleY(' + (1 + intensity * 0.03) + ')';
          sl.style.filter = 'brightness(' + (1 + intensity * 0.15) + ')';
        });
      });
      container.addEventListener('mouseleave', function () {
        container.querySelectorAll('.shutter-slice').forEach(function (sl) {
          sl.style.transform = '';
          sl.style.filter = '';
        });
      });
    }

    slideTimer = setInterval(function () {
      goToSlide((currentSlide + 1) % SLIDE_IMAGES.length);
    }, SLIDE_INTERVAL);
  }

  function goToSlide(index) {
    if (isTransitioning || index === currentSlide) return;
    isTransitioning = true;
    const container = document.getElementById('shutter');
    if (!container) return;
    const slices = container.querySelectorAll('.shutter-slice');
    const newImage = SLIDE_IMAGES[index];

    document.querySelectorAll('.indicator').forEach(function (ind, i) {
      ind.classList.toggle('active', i === index);
    });

    slices.forEach(function (slice, i) {
      setTimeout(function () {
        const currentImg = slice.querySelector('.shutter-slice__img--current');
        const newImg = document.createElement('div');
        newImg.className = 'shutter-slice__img shutter-slice__img--next';
        newImg.style.backgroundImage = "url('" + newImage + "')";
        newImg.style.width = '100vw';
        newImg.style.left = -(100 / NUM_SLICES) * i + 'vw';
        newImg.style.top = '0';
        newImg.style.height = '100%';
        newImg.style.position = 'absolute';
        newImg.style.backgroundSize = 'cover';
        newImg.style.backgroundPosition = 'center';
        newImg.style.transform = 'scaleY(0)';
        newImg.style.transformOrigin = 'center';
        newImg.style.transition = 'transform 0.5s cubic-bezier(.16,1,.3,1)';
        slice.insertBefore(newImg, currentImg);

        if (currentImg) {
          currentImg.style.transition = 'transform 0.4s cubic-bezier(.25,.46,.45,.94), opacity 0.4s';
          currentImg.style.transform = 'scaleY(0)';
          currentImg.style.transformOrigin = 'center';
          currentImg.style.opacity = '0';
        }

        setTimeout(function () { newImg.style.transform = 'scaleY(1)'; }, 100);
        setTimeout(function () {
          if (currentImg && currentImg.parentNode) currentImg.parentNode.removeChild(currentImg);
          newImg.classList.remove('shutter-slice__img--next');
          newImg.classList.add('shutter-slice__img--current');
          newImg.style.transition = '';
          newImg.style.transform = '';
          newImg.style.opacity = '';
          if (i === NUM_SLICES - 1) isTransitioning = false;
        }, 700);
      }, i * 60);
    });

    currentSlide = index;
    typeHeadline(HEADLINES[index] || HEADLINES[0]);
    clearInterval(slideTimer);
    slideTimer = setInterval(function () {
      goToSlide((currentSlide + 1) % SLIDE_IMAGES.length);
    }, SLIDE_INTERVAL);
  }

  /* ========== 4. TYPING HEADLINE ========== */
  function initTypingHeadline() {
    const el = document.getElementById('typing-headline');
    if (!el) return;
    if (prefersReducedMotion) {
      el.textContent = HEADLINES[0];
      return;
    }
    typeHeadline(HEADLINES[0]);
  }

  function typeHeadline(text) {
    const el = document.getElementById('typing-headline');
    if (!el) return;
    if (typingTimeout) clearTimeout(typingTimeout);

    let cursorEl = el.querySelector('.typing-cursor');
    el.textContent = '';
    if (cursorEl) {
      el.appendChild(cursorEl);
    } else {
      cursorEl = document.createElement('span');
      cursorEl.className = 'typing-cursor';
      cursorEl.textContent = '|';
      el.appendChild(cursorEl);
    }

    let charIndex = 0;
    function typeChar() {
      if (charIndex < text.length) {
        const textNode = document.createTextNode(text.charAt(charIndex));
        el.insertBefore(textNode, el.querySelector('.typing-cursor'));
        charIndex++;
        typingTimeout = setTimeout(typeChar, 45 + Math.random() * 30);
      }
    }
    typingTimeout = setTimeout(typeChar, 300);
  }

  /* ========== 5. NAVIGATION ========== */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 80);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ========== 6. MOBILE DRAWER ========== */
  function initDrawer() {
    const burger = document.getElementById('burger');
    const drawer = document.getElementById('drawer');
    if (!burger || !drawer) return;

    function openDrawer() {
      drawer.classList.add('open');
      burger.classList.add('burger--open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      const firstLink = drawer.querySelector('.drawer__link');
      if (firstLink) firstLink.focus();
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      burger.classList.remove('burger--open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      burger.focus();
    }

    burger.addEventListener('click', function () {
      if (drawer.classList.contains('open')) closeDrawer();
      else openDrawer();
    });

    drawer.querySelectorAll('.drawer__link, .drawer__cta').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    const overlay = drawer.querySelector('.drawer__overlay');
    if (overlay) overlay.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    /* Trampa de foco */
    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      const focusable = drawer.querySelectorAll('a, button');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ========== 7. REVEAL ON SCROLL ========== */
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;
    if (prefersReducedMotion) {
      reveals.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ========== 8. ANIMATED COUNTERS ========== */
  function initCounters() {
    const counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { observer.observe(el); });
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const useDots = el.dataset.format === 'dots';
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    if (prefersReducedMotion) {
      el.textContent = useDots ? target.toLocaleString('es-VE') + suffix : target + '+' + suffix;
      return;
    }

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      if (useDots) {
        el.textContent = value.toLocaleString('es-VE') + suffix;
      } else {
        el.textContent = value + (target < 100 ? '+' : '') + suffix;
      }
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ========== 9. 3D TILT ========== */
  function initTilt() {
    if (window.matchMedia('(max-width: 1024px)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;
    if (prefersReducedMotion) return;

    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -8;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02,1.02,1.02)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(.16,1,.3,1)';
        setTimeout(function () { card.style.transition = ''; }, 500);
      });
    });
  }

  /* ========== 10. SMOOTH SCROLL ========== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '#main') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
          return;
        }
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ========== 11. CONTACT FORM (envío real) ========== */
  function initForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    if (!form || !feedback) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      let valid = true;

      /* Validar campos */
      const validators = [
        { id: 'name', required: true, msg: 'Ingrese su nombre completo.' },
        { id: 'email', required: true, type: 'email', msg: 'Ingrese un correo electrónico válido.' },
        { id: 'message', required: true, msg: 'Describa brevemente su proyecto.' }
      ];

      validators.forEach(function (v) {
        const input = form.querySelector('#' + v.id);
        if (!input) return;
        const group = input.closest('.form-group');
        const errorEl = group ? group.querySelector('.form-group__error') : null;
        let fieldValid = true;

        if (v.required && !input.value.trim()) fieldValid = false;
        if (v.type === 'email' && input.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) fieldValid = false;

        if (group) group.classList.toggle('form-group--error', !fieldValid);
        if (errorEl) errorEl.textContent = fieldValid ? '' : v.msg;
        if (!fieldValid) valid = false;
      });

      if (!valid) {
        feedback.textContent = 'Por favor, corrija los campos marcados.';
        feedback.className = 'form-feedback error';
        feedback.style.display = 'block';
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const btnText = btn.querySelector('.btn__text') || btn;
      const btnLoading = btn.querySelector('.btn__loading');
      const originalText = btnText.textContent;
      btnText.textContent = 'Enviando...';
      if (btnLoading) btnLoading.style.display = 'inline-flex';
      btn.disabled = true;
      feedback.className = 'form-feedback';
      feedback.style.display = 'none';

      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          feedback.textContent = '✓ Solicitud enviada exitosamente. Nuestro equipo se comunicará con usted en las próximas 24 horas hábiles.';
          feedback.className = 'form-feedback success';
          form.reset();
          form.querySelectorAll('.form-group--error').forEach(function (g) { g.classList.remove('form-group--error'); });
          form.querySelectorAll('.form-group__error').forEach(function (e) { e.textContent = ''; });
        } else {
          throw new Error('Error del servidor');
        }
      } catch (err) {
        feedback.textContent = 'Error al enviar. Intente de nuevo o contáctenos por WhatsApp al ' + CEPICA.phone + '.';
        feedback.className = 'form-feedback error';
      } finally {
        btnText.textContent = originalText;
        if (btnLoading) btnLoading.style.display = 'none';
        btn.disabled = false;
      }
    });
  }

  /* ========== 12. URL PARAMS (preseleccionar servicio) ========== */
  function initServiceParams() {
    const select = document.getElementById('service');
    if (!select) return;
    const params = new URLSearchParams(window.location.search);
    const servicio = params.get('servicio');
    if (servicio) {
      const option = select.querySelector('option[value="' + servicio + '"]');
      if (option) {
        select.value = servicio;
      }
    }
  }

  /* ========== 13. LAZY MAP ========== */
  function initMap() {
    const container = document.getElementById('map-container');
    if (!container) return;
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const iframe = document.createElement('iframe');
          iframe.src = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Edificio+Plaza+Catedral,Calle+San+Antonio,Maturin,Monagas,Venezuela&zoom=16';
          iframe.loading = 'lazy';
          iframe.allowFullscreen = true;
          iframe.referrerPolicy = 'no-referrer-when-downgrade';
          iframe.title = 'Ubicación de CEPICA — Edificio Plaza Catedral, Maturín';
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = '0';
          const placeholder = container.querySelector('.map-placeholder');
          if (placeholder) placeholder.remove();
          container.appendChild(iframe);
          observer.unobserve(container);
        }
      });
    }, { rootMargin: '200px' });
    observer.observe(container);
  }

  /* ========== 14. RELOJ VET + ESTADO ABIERTO/CERRADO ========== */
  function initClock() {
    const clockEl = document.getElementById('vet-clock');
    const clockEl2 = document.getElementById('vet-clock-contact');
    const statusDot = document.querySelector('.contact-status__dot');
    const statusText = document.querySelector('.contact-status__text');

    function update() {
      const now = new Date();
      let vet;
      try {
        vet = new Date(now.toLocaleString('en-US', { timeZone: 'America/Caracas' }));
      } catch (e) {
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        vet = new Date(utc - 4 * 3600000);
      }
      const h = String(vet.getHours()).padStart(2, '0');
      const m = String(vet.getMinutes()).padStart(2, '0');
      const s = String(vet.getSeconds()).padStart(2, '0');
      if (clockEl) clockEl.textContent = h + ':' + m + ':' + s;
      if (clockEl2) clockEl2.textContent = h + ':' + m + ':' + s;

      /* [COMPLETAR: horario de atención real] — predeterminado: Lun-Vie 8:00–17:00 */
      const day = vet.getDay();
      const hour = vet.getHours();
      const isOpen = day >= 1 && day <= 5 && hour >= 8 && hour < 17;
      if (statusDot) {
        statusDot.classList.toggle('open', isOpen);
        statusDot.classList.toggle('closed', !isOpen);
      }
      if (statusText) {
        statusText.textContent = isOpen ? 'Abierto ahora' : 'Cerrado';
        statusText.style.color = isOpen ? '#27ae60' : '#c0392b';
      }
    }
    update();
    setInterval(update, 1000);
  }

  /* ========== 15. BUTTON RIPPLE ========== */
  function initRipple() {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn');
      if (!btn || prefersReducedMotion) return;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(function () { if (ripple.parentNode) ripple.remove(); }, 600);
    });
  }

  /* ========== 16. CHATBOT ========== */
  function initChatbot() {
    const fabBot = document.getElementById('fab-bot');
    const chatbot = document.getElementById('chatbot');
    const closeBtn = document.getElementById('chatbot-close');
    const body = document.getElementById('chatbot-body');
    const options = document.getElementById('chatbot-options');
    if (!fabBot || !chatbot) return;

    fabBot.addEventListener('click', function () {
      const isOpen = chatbot.classList.toggle('open');
      fabBot.setAttribute('aria-expanded', isOpen);
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        chatbot.classList.remove('open');
        fabBot.setAttribute('aria-expanded', 'false');
        fabBot.focus();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && chatbot.classList.contains('open')) {
        chatbot.classList.remove('open');
        fabBot.setAttribute('aria-expanded', 'false');
        fabBot.focus();
      }
    });

    if (options) {
      options.addEventListener('click', function (e) {
        const btn = e.target.closest('.chatbot__opt');
        if (!btn) return;
        const key = btn.dataset.q;
        const question = btn.textContent;

        const userMsg = document.createElement('div');
        userMsg.className = 'chatbot__msg chatbot__msg--user';
        userMsg.textContent = question;
        body.insertBefore(userMsg, options);

        setTimeout(function () {
          const botMsg = document.createElement('div');
          botMsg.className = 'chatbot__msg chatbot__msg--bot';
          botMsg.innerHTML = CHATBOT_ANSWERS[key] || 'Disculpe, no tengo información sobre eso. Contacte a nuestro equipo al ' + CEPICA.phone + '.';
          body.insertBefore(botMsg, options);
          body.scrollTop = body.scrollHeight;
        }, 400);
      });
    }
  }

  /* ========== 17. FAQ ACCORDION ========== */
  function initFaqAccordion() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      const header = item.querySelector('.faq-item__header');
      if (!header) return;
      header.addEventListener('click', function () {
        const isOpen = item.classList.contains('faq-item--open');
        items.forEach(function (other) {
          other.classList.remove('faq-item--open');
          const otherBtn = other.querySelector('.faq-item__header');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('faq-item--open');
          header.setAttribute('aria-expanded', 'true');
        }
      });

      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  }

  /* ========== 18. VIDEO OBSERVER ========== */
  function initVideoObserver() {
    const videos = document.querySelectorAll('video[muted]');
    if (!videos.length) return;
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        const v = entry.target;
        if (entry.isIntersecting) {
          v.play().catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.25 });
    videos.forEach(function (v) {
      v.pause();
      observer.observe(v);
    });
  }

  /* ========== 19. BACK TO TOP ========== */
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ========== 20. READING PROGRESS ========== */
  function initReadingProgress() {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;
    /* Solo en páginas internas */
    if (document.querySelector('.hero')) return;
    window.addEventListener('scroll', function () {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      bar.style.width = (window.scrollY / docHeight * 100) + '%';
    }, { passive: true });
  }

  /* ========== 21. LIGHTBOX ========== */
  function initLightbox() {
    let lightboxEl = null;
    let currentGroup = [];
    let currentIndex = 0;

    function createLightbox() {
      const lb = document.createElement('div');
      lb.className = 'lightbox';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', 'Visor de imágenes');
      lb.innerHTML = '<button class="lightbox__close" aria-label="Cerrar">&times;</button>' +
        '<button class="lightbox__nav lightbox__nav--prev" aria-label="Anterior">‹</button>' +
        '<img class="lightbox__img" alt="">' +
        '<button class="lightbox__nav lightbox__nav--next" aria-label="Siguiente">›</button>' +
        '<div class="lightbox__counter"></div>';
      document.body.appendChild(lb);
      lb.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
      lb.querySelector('.lightbox__nav--prev').addEventListener('click', function () { navigate(-1); });
      lb.querySelector('.lightbox__nav--next').addEventListener('click', function () { navigate(1); });
      lb.addEventListener('click', function (e) {
        if (e.target === lb) closeLightbox();
      });
      return lb;
    }

    function openLightbox(src, group, index) {
      if (!lightboxEl) lightboxEl = createLightbox();
      currentGroup = group;
      currentIndex = index;
      showImage();
      lightboxEl.classList.add('active');
      document.body.style.overflow = 'hidden';
      lightboxEl.querySelector('.lightbox__close').focus();
    }

    function closeLightbox() {
      if (!lightboxEl) return;
      lightboxEl.classList.remove('active');
      document.body.style.overflow = '';
    }

    function navigate(dir) {
      currentIndex = (currentIndex + dir + currentGroup.length) % currentGroup.length;
      showImage();
    }

    function showImage() {
      if (!lightboxEl) return;
      const img = lightboxEl.querySelector('.lightbox__img');
      const counter = lightboxEl.querySelector('.lightbox__counter');
      img.src = currentGroup[currentIndex];
      img.alt = 'Imagen ' + (currentIndex + 1) + ' de ' + currentGroup.length;
      counter.textContent = (currentIndex + 1) + ' / ' + currentGroup.length;
      lightboxEl.querySelector('.lightbox__nav--prev').style.display = currentGroup.length > 1 ? '' : 'none';
      lightboxEl.querySelector('.lightbox__nav--next').style.display = currentGroup.length > 1 ? '' : 'none';
    }

    document.addEventListener('click', function (e) {
      const trigger = e.target.closest('[data-lightbox]');
      if (!trigger) return;
      e.preventDefault();
      const groupName = trigger.dataset.lightbox;
      const allInGroup = document.querySelectorAll('[data-lightbox="' + groupName + '"]');
      const sources = [];
      let idx = 0;
      allInGroup.forEach(function (el, i) {
        const src = el.dataset.src || el.querySelector('img')?.src || '';
        if (src) {
          sources.push(src);
          if (el === trigger) idx = sources.length - 1;
        }
      });
      if (sources.length) openLightbox(sources[idx], sources, idx);
    });

    document.addEventListener('keydown', function (e) {
      if (!lightboxEl || !lightboxEl.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  /* ========== 22. STICKY DISCIPLINE NAV ========== */
  function initStickyDisciplineNav() {
    const nav = document.getElementById('discipline-nav');
    if (!nav) return;
    const links = nav.querySelectorAll('.discipline-nav__link');
    const sections = [];
    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const section = document.querySelector(href);
        if (section) sections.push({ el: section, link: link });
      }
    });
    if (!sections.length) return;

    window.addEventListener('scroll', function () {
      let current = sections[0];
      sections.forEach(function (s) {
        if (s.el.getBoundingClientRect().top <= 120) current = s;
      });
      links.forEach(function (l) { l.classList.remove('active'); });
      current.link.classList.add('active');
    }, { passive: true });
  }

  /* ========== ANALYTICS HOOK (comentado) ========== */
  /*
  // Google Analytics 4
  // window.dataLayer = window.dataLayer || [];
  // function gtag(){dataLayer.push(arguments);}
  // gtag('js', new Date());
  // gtag('config', 'G-XXXXXXXXXX');

  // Plausible
  // <script defer data-domain="cepica.com.ve" src="https://plausible.io/js/script.js"></script>
  */

})();
