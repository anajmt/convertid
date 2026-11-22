/* ==========================================================================
   ConvertID — interactions
   Progressive enhancement: the page reads fine without this script.
   ========================================================================== */
(function () {
  'use strict';

  var CONFIG = window.CONVERTID_CONFIG || {};
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Founding offer visibility ---------- */
  var founding = document.getElementById('founding-offer');
  if (founding && CONFIG.foundingOffer && CONFIG.foundingOffer.enabled === false) {
    founding.remove();
  }

  /* ---------- Header: shadow on scroll + mobile menu ---------- */
  var header = document.getElementById('site-header');
  var nav = document.getElementById('site-nav');
  var toggle = document.getElementById('nav-toggle');

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.nav-toggle-label').textContent = open ? 'Close' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (nav) {
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
  }
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });
  window.matchMedia('(min-width: 960px)').addEventListener('change', function (e) {
    if (e.matches) setMenu(false);
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Project dialogs ---------- */
  document.querySelectorAll('[data-dialog]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dialog = document.getElementById(btn.getAttribute('data-dialog'));
      if (!dialog) return;
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
        var closeBtn = dialog.querySelector('.dialog-close');
        if (closeBtn) closeBtn.focus();
      }
    });
  });
  // Close when the backdrop (outside the dialog box) is clicked
  document.querySelectorAll('.project-dialog').forEach(function (dialog) {
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });
  });

  /* ---------- Pre-select the form "need" from CTA links ---------- */
  var needSelect = document.getElementById('need');
  document.querySelectorAll('[data-need]').forEach(function (link) {
    link.addEventListener('click', function () {
      var want = link.getAttribute('data-need');
      if (needSelect && want) {
        var match = Array.prototype.find.call(needSelect.options, function (opt) { return opt.value === want; });
        if (match) needSelect.value = want;
      }
    });
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contact-form');
  if (!form) return;

  var statusBox = document.getElementById('form-status');
  var submitBtn = document.getElementById('submit-btn');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function normaliseUrl(value) {
    var v = value.trim();
    if (!v) return '';
    if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
    return v;
  }

  function isValidUrl(value) {
    try {
      var u = new URL(normaliseUrl(value));
      return (u.protocol === 'https:' || u.protocol === 'http:') && u.hostname.indexOf('.') > 0;
    } catch (err) {
      return false;
    }
  }

  // Each rule returns an error message, or '' when valid
  var rules = {
    name: function (v) {
      if (!v.trim()) return 'Please enter your name.';
      if (v.trim().length < 2) return 'Please enter at least 2 characters.';
      return '';
    },
    email: function (v) {
      if (!v.trim()) return 'Please enter your business email.';
      if (!EMAIL_RE.test(v.trim())) return 'Please enter a valid email address, for example name@yourbrand.com.';
      return '';
    },
    brand: function (v) {
      if (!v.trim()) return 'Please enter your brand name.';
      return '';
    },
    website: function (v) {
      if (!v.trim()) return ''; // optional
      if (!isValidUrl(v)) return 'Please enter a valid website, for example yourbrand.com.';
      return '';
    },
    need: function (v) {
      if (!v) return 'Please choose what you need help with.';
      return '';
    },
    message: function (v) {
      if (!v.trim()) return 'Please tell us a little about your brand and what you need.';
      if (v.trim().length < 10) return 'Please write at least 10 characters.';
      return '';
    }
  };

  function fieldEl(name) { return form.elements[name]; }

  function showError(name, message) {
    var input = fieldEl(name);
    var err = document.getElementById(name + '-error');
    if (!input || !err) return;
    err.textContent = message;
    err.hidden = !message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validateField(name) {
    var input = fieldEl(name);
    if (!input || !rules[name]) return true;
    var message = rules[name](input.value);
    showError(name, message);
    return !message;
  }

  function validateAll() {
    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      if (!validateField(name) && !firstInvalid) firstInvalid = fieldEl(name);
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  // Validate on blur once a field has been touched, then live-update while correcting
  Object.keys(rules).forEach(function (name) {
    var input = fieldEl(name);
    if (!input) return;
    var touched = false;
    input.addEventListener('blur', function () { touched = true; validateField(name); });
    input.addEventListener('input', function () { if (touched || input.getAttribute('aria-invalid') === 'true') validateField(name); });
    input.addEventListener('change', function () { if (touched) validateField(name); });
  });

  function setStatus(type, html) {
    if (!statusBox) return;
    statusBox.className = 'form-status is-' + type;
    statusBox.innerHTML = html;
    statusBox.hidden = false;
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.classList.toggle('is-loading', isLoading);
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? 'Sending…' : "Let's Talk";
  }

  var isIndonesian = (document.documentElement.lang || '').indexOf('id') === 0;
  var introSubject = isIndonesian ? 'Pertanyaan tentang ConvertID' : 'ConvertID enquiry';
  var introBody = isIndonesian
    ? 'Halo Ana,\n\nSaya tertarik dengan layanan email marketing ConvertID untuk brand fashion saya. Bisakah kita berdiskusi?\n\nTerima kasih'
    : 'Hi Ana,\n\nI\'m interested in ConvertID\'s email marketing for my fashion brand. Could we talk?\n\nThank you';
  var directEmail = '<a href="mailto:' + CONFIG.contactEmail + '?subject=' + encodeURIComponent(introSubject) + '&body=' + encodeURIComponent(introBody) + '">' + CONFIG.contactEmail + '</a>';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (statusBox) statusBox.hidden = true;

    // Honeypot: silently drop submissions where the hidden field was filled (bots only)
    if (fieldEl('company_fax') && fieldEl('company_fax').value) {
      return;
    }

    if (!validateAll()) {
      setStatus('error', 'Please fix the highlighted fields and try again.');
      return;
    }

    // No endpoint connected: be honest, do not pretend the message was sent
    if (!CONFIG.formEndpoint) {
      setStatus('info',
        'This contact form is not connected to an inbox yet, so your message has not been sent. ' +
        'Please email us directly at ' + directEmail + ' or ' +
        '<a href="' + (CONFIG.calendlyUrl || '#') + '" target="_blank" rel="noopener">book a 30-minute call</a>.');
      return;
    }

    var payload = {
      name: fieldEl('name').value.trim(),
      email: fieldEl('email').value.trim(),
      brand: fieldEl('brand').value.trim(),
      website: normaliseUrl(fieldEl('website').value),
      monthly_email_revenue: fieldEl('revenue').value || 'Not provided',
      need: fieldEl('need').value,
      message: fieldEl('message').value.trim(),
      source: window.location.href
    };

    setLoading(true);
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, 15000);

    fetch(CONFIG.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        setStatus('success', 'Thanks, your message has been sent. We will reply to you at <strong>' + payload.email.replace(/</g, '&lt;') + '</strong>.');
        form.reset();
      })
      .catch(function () {
        setStatus('error',
          'Something went wrong and your message was not sent. Please try again, or email us directly at ' + directEmail + '.');
      })
      .finally(function () {
        clearTimeout(timer);
        setLoading(false);
        if (statusBox && statusBox.focus) { statusBox.setAttribute('tabindex', '-1'); statusBox.focus(); }
      });
  });
})();
