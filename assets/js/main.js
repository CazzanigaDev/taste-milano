/**
 * TASTE MILANO — main.js
 * Autrice: Elena Cazzaniga
 *
 * Funzionalità:
 * 1. Navbar sticky con effetto scroll
 * 2. Countdown al giorno del festival
 * 3. Slider sponsor infinito (loop CSS + JS duplicazione)
 * 4. Form newsletter con validazione
 * 5. Animazioni on scroll (Intersection Observer)
 */

document.addEventListener('DOMContentLoaded', function () {

  // ═══════════════════════════════════════════════
  // 1. NAVBAR — effetto scroll
  // ═══════════════════════════════════════════════
  const mainNav = document.getElementById('mainNav');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  });

  // Smooth scroll per tutti i link ancora interni
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // altezza navbar
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });

        // Chiudi navbar mobile se aperta
        const navCollapse = document.getElementById('navbarNav');
        if (navCollapse && navCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      }
    });
  });


  // ═══════════════════════════════════════════════
  // 2. COUNTDOWN
  // Imposta qui la data del festival
  // ═══════════════════════════════════════════════
  const festivalDate = new Date('2027-09-26T11:00:00');

  function aggiornaCountdown() {
    const now = new Date();
    const diff = festivalDate - now;

    if (diff <= 0) {
      // Festival già iniziato
      document.getElementById('countdown').innerHTML =
        '<p class="section-title text-center" style="color:var(--clr-accent)">🎉 Il festival è iniziato!</p>';
      return;
    } else {
       document.getElementById('countdown').innerHTML =
        '<p class="section-title text-center" style="color:var(--clr-accent)">Preparati! Il festival inizierà ' + diff + '🎉 </p>';
    }

    const giorni   = Math.floor(diff / (1000 * 60 * 60 * 24));
    const ore      = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minuti   = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secondi  = Math.floor((diff % (1000 * 60)) / 1000);

    // Formatta con zero iniziale se necessario
    const pad = (n) => String(n).padStart(2, '0');

    document.getElementById('cd-days').textContent    = pad(giorni);
    document.getElementById('cd-hours').textContent   = pad(ore);
    document.getElementById('cd-minutes').textContent = pad(minuti);
    document.getElementById('cd-seconds').textContent = pad(secondi);
  }

  // Avvia subito e aggiorna ogni secondo
  aggiornaCountdown();
  setInterval(aggiornaCountdown, 1000);


  // ═══════════════════════════════════════════════
  // 3. SPONSOR SLIDER — duplicazione per loop infinito
  // Il CSS anima translateX(-50%), la duplicazione
  // fa sembrare infinito il loop.
  // ═══════════════════════════════════════════════
  const sponsorTrack = document.getElementById('sponsorTrack');

  if (sponsorTrack) {
    // Duplica il contenuto per creare l'effetto loop
    const originalContent = sponsorTrack.innerHTML;
    sponsorTrack.innerHTML = originalContent + originalContent;

    // Pausa on hover
    sponsorTrack.addEventListener('mouseenter', function () {
      sponsorTrack.style.animationPlayState = 'paused';
    });
    sponsorTrack.addEventListener('mouseleave', function () {
      sponsorTrack.style.animationPlayState = 'running';
    });
  }


  // ═══════════════════════════════════════════════
  // 4. FORM NEWSLETTER — validazione
  // ═══════════════════════════════════════════════
  const form       = document.getElementById('newsletterForm');
  const nomeInput  = document.getElementById('nomeInput');
  const emailInput = document.getElementById('emailInput');
  const privacy    = document.getElementById('privacyCheck');
  const successMsg = document.getElementById('successMsg');
  const btnIscrivi = document.getElementById('btnIscrivi');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let valido = true;

      // Resetta stato precedente
      [nomeInput, emailInput, privacy].forEach(function (el) {
        el.classList.remove('is-invalid', 'is-valid');
      });

      // Valida nome
      if (!nomeInput.value.trim()) {
        nomeInput.classList.add('is-invalid');
        valido = false;
      } else {
        nomeInput.classList.add('is-valid');
      }

      // Valida email con regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('is-invalid');
        valido = false;
      } else {
        emailInput.classList.add('is-valid');
      }

      // Valida privacy
      if (!privacy.checked) {
        privacy.classList.add('is-invalid');
        valido = false;
      } else {
        privacy.classList.add('is-valid');
      }

      if (!valido) return;

      // Simula invio (feedback UX)
      btnIscrivi.disabled = true;
      btnIscrivi.textContent = 'Invio...';

      setTimeout(function () {
        // Mostra messaggio successo
        form.querySelector('.newsletter-form-wrap').classList.add('d-none');
        successMsg.classList.remove('d-none');
      }, 800);
    });
  }


  // ═══════════════════════════════════════════════
  // 5. ANIMAZIONI ON SCROLL — Intersection Observer
  // Aggiunge la classe .visible agli elementi
  // quando entrano nel viewport
  // ═══════════════════════════════════════════════
  const animElements = document.querySelectorAll(
    '.timeline-item, .countdown-block, .stat-num, .intro-img-wrap'
  );

  // Aggiunge lo stile iniziale nascosto
  animElements.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // Anima solo una volta
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  animElements.forEach(function (el) {
    observer.observe(el);
  });

  // Stagger delay sugli elementi timeline
  document.querySelectorAll('.timeline-item').forEach(function (el, i) {
    el.style.transitionDelay = (i * 0.1) + 's';
  });

});
