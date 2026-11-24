/* ==========================================================================
   ConvertID — Google Analytics 4
   Loads GA4 only when CONVERTID_CONFIG.gaMeasurementId is set, and sends the
   site's key conversion events:

     generate_lead           contact form sent successfully
     contact_whatsapp_click  any WhatsApp (wa.me) link
     contact_email_click     any mailto: link (incl. the intro-message links)
     book_call_click         any Calendly link

   Each click event carries link_location (the page section the link sits in,
   e.g. "contact", "pricing", "footer") and page_language ("en" or "id").
   Link URLs are sent without their query string, so the pre-filled intro
   message text is never sent to Google.
   ========================================================================== */
(function () {
  'use strict';

  var CONFIG = window.CONVERTID_CONFIG || {};
  var id = CONFIG.gaMeasurementId;
  var host = window.location.hostname;

  // No ID, or a local preview: do nothing, and keep a no-op tracker so other
  // scripts can call it safely.
  window.convertidTrack = function () {};
  if (!id || host === 'localhost' || host === '127.0.0.1' || window.location.protocol === 'file:') return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id);

  var lang = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();

  window.convertidTrack = function (name, params) {
    var p = params || {};
    p.page_language = lang;
    gtag('event', name, p);
  };

  function locationOf(el) {
    if (el.closest('footer')) return 'footer';
    if (el.closest('header.site-header')) return 'header';
    var section = el.closest('section[id], .form-status');
    if (!section) return 'other';
    return section.classList && section.classList.contains('form-status') ? 'form_message' : section.id;
  }

  function stripQuery(href) {
    return href.split('?')[0];
  }

  // One delegated listener, so links added later (e.g. the email link in the
  // form's status message) are tracked too.
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    var name = null;

    if (/^mailto:/i.test(href)) name = 'contact_email_click';
    else if (/^https?:\/\/(api\.)?wa\.me\//i.test(href) || /^https?:\/\/api\.whatsapp\.com\//i.test(href)) name = 'contact_whatsapp_click';
    else if (/^https?:\/\/(www\.)?calendly\.com\//i.test(href)) name = 'book_call_click';

    if (!name) return;
    window.convertidTrack(name, {
      link_location: locationOf(link),
      link_text: (link.textContent || '').trim().slice(0, 100),
      link_url: stripQuery(href)
    });
  }, true);
})();
