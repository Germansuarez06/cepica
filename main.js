/* ============================================================
   CEPICA — Premium Corporate Platform
   Vanilla JS · 60fps · Zero Dependencies
   ============================================================ */
(function () {
  'use strict';

  /* ---------- CONFIG ---------- */
  var NUM_SLICES = 14;
  var SLIDE_INTERVAL = 5000;
  var HEADLINES = [
    'INGENIERÍA DE PRECISIÓN PARA LA INDUSTRIA PETROLERA',
    'MÁS DE 1.000.000 DE HORAS-HOMBRE EJECUTADAS',
    'SOLUCIONES INTEGRALES EPC DE CLASE MUNDIAL',
    'EXCELENCIA TÉCNICA AL SERVICIO DE VENEZUELA'
  ];
  var SLIDE_IMAGES = [
    'fotos/pexels-sejio402-6477213.jpg',
    'fotos/pexels-sergey-sergeev-2153675005-32845690.jpg',
    'fotos/pexels-th-ng-flight-simulator-2164127181-39463022.jpg',
    'fotos/pexels-sejio402-6477213.jpg'
  ];
  var CHATBOT_ANSWERS = {
    servicios: 'Ofrecemos servicios integrales de ingeniería en 6 disciplinas: Civil, Eléctrica, Instrumentación y Automatización, Mecánica, Telecomunicaciones, y Procura y Asistencia Técnica. Cubrimos todo el ciclo EPC (Ingeniería, Procura y Construcción).',
    experiencia: 'Tenemos más de 16 años de trayectoria y hemos ejecutado más de 1.000.000 de Horas-Hombre en proyectos de alta complejidad para la industria petrolera, petroquímica y energética de Venezuela.',
    contacto: 'Puede contactarnos al +58 414-391-4966, escribirnos a info@cepica.com.ve o completar el formulario en la sección de Contacto de esta página. Nuestro equipo responde en menos de 24 horas hábiles.',
    ubicacion: 'Nuestra sede principal está ubicada en el Edificio Plaza Catedral, Calle San Antonio, entre Carrera 5B y Calle Bermúdez, Sector Campo Obrero, Maturín, Estado Monagas, Venezuela.'
  };

  var currentSlide = 0;
  var slideTimer = null;
  var isTransitioning = false;
  var typingTimeout = null;
  var mouseX = 0, mouseY = 0;
  var cursorX = 0, cursorY = 0;
  var ringX = 0, ringY = 0;

  /* ========== DOM READY ========== */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initShutterCarousel();
    initTypingHeadline();
    initCursor();
    initNav();
    initDrawer();
    initReveal();
    initCounters();
    initTilt();
    initSmoothScroll();
    initForm();
    initMap();
    initClock();
    initRipple();
    initChatbot();
    initFaqAccordion();
  }

  /* ========== 1. SHUTTER CAROUSEL (14 Venetian Blind Slices) ========== */
  function initShutterCarousel() {
    var container = document.getElementById('shutter');
    var indicatorContainer = document.getElementById('slide-indicators');
    if (!container) return;

    // Preload images
    SLIDE_IMAGES.forEach(function (src) {
      var img = new Image();
      img.src = src;
    });

    // Create 14 slices
    for (var i = 0; i < NUM_SLICES; i++) {
      var slice = document.createElement('div');
      slice.className = 'shutter-slice';

      var imgLayer = document.createElement('div');
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

    // Create indicators
    for (var j = 0; j < SLIDE_IMAGES.length; j++) {
      (function (idx) {
        var btn = document.createElement('button');
        btn.className = 'indicator' + (idx === 0 ? ' active' : '');
        btn.setAttribute('aria-label', 'Slide ' + (idx + 1));
        btn.addEventListener('click', function () { goToSlide(idx); });
        indicatorContainer.appendChild(btn);
      })(j);
    }

    // Hover lens / slit effect
    container.addEventListener('mousemove', function (e) {
      var slices = container.querySelectorAll('.shutter-slice');
      var rect = container.getBoundingClientRect();
      var relX = e.clientX - rect.left;

      slices.forEach(function (sl, idx) {
        var sliceRect = sl.getBoundingClientRect();
        var sliceCenterX = sliceRect.left + sliceRect.width / 2 - rect.left;
        var dist = Math.abs(relX - sliceCenterX);
        var maxDist = rect.width / 3;
        var intensity = Math.max(0, 1 - dist / maxDist);

        var scaleY = 1 + intensity * 0.03;
        var brightness = 1 + intensity * 0.15;
        sl.style.transform = 'scaleY(' + scaleY + ')';
        sl.style.filter = 'brightness(' + brightness + ')';
      });
    });

    container.addEventListener('mouseleave', function () {
      var slices = container.querySelectorAll('.shutter-slice');
      slices.forEach(function (sl) {
        sl.style.transform = '';
        sl.style.filter = '';
      });
    });

    // Auto-advance
    slideTimer = setInterval(function () {
      var next = (currentSlide + 1) % SLIDE_IMAGES.length;
      goToSlide(next);
    }, SLIDE_INTERVAL);
  }

  function goToSlide(index) {
    if (isTransitioning || index === currentSlide) return;
    isTransitioning = true;

    var container = document.getElementById('shutter');
    var slices = container.querySelectorAll('.shutter-slice');
    var newImage = SLIDE_IMAGES[index];

    // Update indicators
    var indicators = document.querySelectorAll('.indicator');
    indicators.forEach(function (ind, i) {
      ind.classList.toggle('active', i === index);
    });

    // Staggered venetian blind transition
    slices.forEach(function (slice, i) {
      var delay = i * 60;

      setTimeout(function () {
        var currentImg = slice.querySelector('.shutter-slice__img--current');

        var newImg = document.createElement('div');
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

        currentImg.style.transition = 'transform 0.4s cubic-bezier(.25,.46,.45,.94), opacity 0.4s';
        currentImg.style.transform = 'scaleY(0)';
        currentImg.style.transformOrigin = 'center';
        currentImg.style.opacity = '0';

        setTimeout(function () {
          newImg.style.transform = 'scaleY(1)';
        }, 100);

        setTimeout(function () {
          if (currentImg.parentNode) currentImg.parentNode.removeChild(currentImg);
          newImg.classList.remove('shutter-slice__img--next');
          newImg.classList.add('shutter-slice__img--current');
          newImg.style.transition = '';
          newImg.style.transform = '';
          newImg.style.opacity = '';

          if (i === NUM_SLICES - 1) {
            isTransitioning = false;
          }
        }, 700);
      }, delay);
    });

    currentSlide = index;
    typeHeadline(HEADLINES[index] || HEADLINES[0]);

    clearInterval(slideTimer);
    slideTimer = setInterval(function () {
      var next = (currentSlide + 1) % SLIDE_IMAGES.length;
      goToSlide(next);
    }, SLIDE_INTERVAL);
  }

  /* ========== 2. TYPING HEADLINE ========== */
  function initTypingHeadline() {
    typeHeadline(HEADLINES[0]);
  }

  function typeHeadline(text) {
    var el = document.getElementById('typing-headline');
    if (!el) return;

    if (typingTimeout) clearTimeout(typingTimeout);

    var cursorEl = el.querySelector('.typing-cursor');
    el.textContent = '';
    if (cursorEl) {
      el.appendChild(cursorEl);
    } else {
      var c = document.createElement('span');
      c.className = 'typing-cursor';
      c.textContent = '|';
      el.appendChild(c);
    }

    var charIndex = 0;
    function typeChar() {
      if (charIndex < text.length) {
        var textNode = document.createTextNode(text.charAt(charIndex));
        el.insertBefore(textNode, el.querySelector('.typing-cursor'));
        charIndex++;
        typingTimeout = setTimeout(typeChar, 45 + Math.random() * 30);
      }
    }
    typingTimeout = setTimeout(typeChar, 300);
  }

  /* ========== 3. CUSTOM CURSOR (60fps) ========== */
  function initCursor() {
    if (window.matchMedia('(max-width: 1024px)').matches) return;
    if ('ontouchstart' in window) return;

    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animate() {
      cursorX += (mouseX - cursorX) * 0.25;
      cursorY += (mouseY - cursorY) * 0.25;
      dot.style.left = cursorX + 'px';
      dot.style.top = cursorY + 'px';

      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    var interactives = document.querySelectorAll('a, button, input, textarea, select, .svc-card, .fab, .indicator');
    interactives.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        dot.classList.add('expand');
        ring.classList.add('expand');
      });
      el.addEventListener('mouseleave', function () {
        dot.classList.remove('expand');
        ring.classList.remove('expand');
      });
    });
  }

  /* ========== 4. NAVIGATION ========== */
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    var sections = document.querySelectorAll('section[id]');
    var links = document.querySelectorAll('.nav__link');

    function onScroll() {
      var scrollY = window.scrollY;
      nav.classList.toggle('scrolled', scrollY > 80);

      var currentSection = '';
      sections.forEach(function (section) {
        var top = section.offsetTop - 120;
        if (scrollY >= top) currentSection = section.id;
      });

      links.forEach(function (link) {
        var href = link.getAttribute('href').substring(1);
        link.classList.toggle('active', href === currentSection);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ========== 5. MOBILE DRAWER ========== */
  function initDrawer() {
    var burger = document.getElementById('burger');
    var drawer = document.getElementById('drawer');
    if (!burger || !drawer) return;

    burger.addEventListener('click', function () {
      var isOpen = drawer.classList.toggle('open');
      burger.classList.toggle('burger--open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    drawer.querySelectorAll('.drawer__link, .drawer__cta').forEach(function (link) {
      link.addEventListener('click', function () {
        drawer.classList.remove('open');
        burger.classList.remove('burger--open');
        document.body.style.overflow = '';
      });
    });

    var overlay = drawer.querySelector('.drawer__overlay');
    if (overlay) {
      overlay.addEventListener('click', function () {
        drawer.classList.remove('open');
        burger.classList.remove('burger--open');
        document.body.style.overflow = '';
      });
    }
  }

  /* ========== 6. REVEAL ON SCROLL ========== */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ========== 7. ANIMATED COUNTERS ========== */
  function initCounters() {
    var counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
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
    var target = parseInt(el.dataset.target, 10);
    var useDots = el.dataset.format === 'dots';
    var duration = 2000;
    var start = performance.now();

    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(eased * target);

      if (useDots) {
        el.textContent = value.toLocaleString('es-VE');
      } else {
        el.textContent = value + (target < 100 ? '+' : '');
      }

      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ========== 8. 3D MAGNETIC TILT ========== */
  function initTilt() {
    if (window.matchMedia('(max-width: 1024px)').matches) return;

    var cards = document.querySelectorAll('[data-tilt]');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -8;
        var rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02,1.02,1.02)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(.16,1,.3,1)';
        setTimeout(function () { card.style.transition = ''; }, 500);
      });
    });
  }

  /* ========== 9. SMOOTH SCROLL ========== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = anchor.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ========== 10. CONTACT FORM ========== */
  function initForm() {
    var form = document.getElementById('contact-form');
    var feedback = document.getElementById('form-feedback');
    if (!form || !feedback) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('#name').value.trim();
      var email = form.querySelector('#email').value.trim();
      var message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        feedback.textContent = 'Por favor complete todos los campos obligatorios.';
        feedback.className = 'form-feedback error';
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Enviando...';
      btn.disabled = true;

      setTimeout(function () {
        feedback.textContent = '✓ Solicitud enviada exitosamente. Nuestro equipo se comunicará con usted en las próximas 24 horas hábiles.';
        feedback.className = 'form-feedback success';
        btn.textContent = originalText;
        btn.disabled = false;
        form.reset();
      }, 1500);
    });
  }

  /* ========== 11. LAZY MAP ========== */
  function initMap() {
    var container = document.getElementById('map-container');
    if (!container) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var iframe = document.createElement('iframe');
          iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.567!2d-63.1767!3d9.7457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMatur%C3%ADn%2C+Monagas!5e0!3m2!1ses!2sve!4v1700000000000!5m2!1ses!2sve';
          iframe.loading = 'lazy';
          iframe.allowFullscreen = true;
          iframe.referrerPolicy = 'no-referrer-when-downgrade';
          iframe.title = 'Ubicación de CEPICA en Maturín';
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = '0';

          var placeholder = container.querySelector('.map-placeholder');
          if (placeholder) placeholder.parentNode.removeChild(placeholder);
          container.appendChild(iframe);

          observer.unobserve(container);
        }
      });
    }, { rootMargin: '200px' });

    observer.observe(container);
  }

  /* ========== 12. FOOTER CLOCK (VET = UTC-4) ========== */
  function initClock() {
    var el = document.getElementById('vet-clock');
    if (!el) return;

    function update() {
      var now = new Date();
      var utc = now.getTime() + now.getTimezoneOffset() * 60000;
      var vet = new Date(utc - 4 * 3600000);
      var h = String(vet.getHours()).padStart(2, '0');
      var m = String(vet.getMinutes()).padStart(2, '0');
      var s = String(vet.getSeconds()).padStart(2, '0');
      el.textContent = h + ':' + m + ':' + s;
    }
    update();
    setInterval(update, 1000);
  }

  /* ========== 13. BUTTON RIPPLE ========== */
  function initRipple() {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement('span');
        ripple.className = 'ripple';
        var size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        setTimeout(function () { ripple.parentNode.removeChild(ripple); }, 600);
      });
    });
  }

  /* ========== 14. CHATBOT ========== */
  function initChatbot() {
    var fabBot = document.getElementById('fab-bot');
    var chatbot = document.getElementById('chatbot');
    var closeBtn = document.getElementById('chatbot-close');
    var body = document.getElementById('chatbot-body');
    var options = document.getElementById('chatbot-options');
    if (!fabBot || !chatbot) return;

    fabBot.addEventListener('click', function () {
      chatbot.classList.toggle('open');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        chatbot.classList.remove('open');
      });
    }

    if (options) {
      options.addEventListener('click', function (e) {
        var btn = e.target.closest('.chatbot__opt');
        if (!btn) return;

        var key = btn.dataset.q;
        var question = btn.textContent;

        var userMsg = document.createElement('div');
        userMsg.className = 'chatbot__msg chatbot__msg--user';
        userMsg.textContent = question;
        body.insertBefore(userMsg, options);

        setTimeout(function () {
          var botMsg = document.createElement('div');
          botMsg.className = 'chatbot__msg chatbot__msg--bot';
          botMsg.textContent = CHATBOT_ANSWERS[key] || 'Disculpe, no tengo información sobre eso. Por favor contacte a nuestro equipo directamente.';
          body.insertBefore(botMsg, options);
          body.scrollTop = body.scrollHeight;
        }, 500);
      });
    }
  }

  /* ========== 15. FAQ ACCORDION ========== */
  function initFaqAccordion() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var header = item.querySelector('.faq-item__header');
      if (!header) return;

      header.addEventListener('click', function () {
        var isOpen = item.classList.contains('faq-item--open');

        // Close all items first (only one open at a time)
        items.forEach(function (other) {
          other.classList.remove('faq-item--open');
          var otherBtn = other.querySelector('.faq-item__header');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        // If it was closed, open it
        if (!isOpen) {
          item.classList.add('faq-item--open');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

})();
