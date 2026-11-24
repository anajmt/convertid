/* ==========================================================================
   ConvertID — site configuration
   Edit this file to change links, the contact form destination and the
   founding offer. No build step is needed.
   ========================================================================== */
window.CONVERTID_CONFIG = {
  /* Public contact details. */
  contactEmail: 'ana@convertid.agency',
  calendlyUrl: 'https://calendly.com/anajumiati/30min',
  linkedinUrl: 'https://linkedin.com/in/anajumiati/',
  tiktokUrl: 'https://www.tiktok.com/@convertID.agency',
  instagramUrl: 'https://www.instagram.com/convertid.agency/',

  /*
   * Google Analytics 4 Measurement ID, for example 'G-ABC123XYZ9'.
   * Leave as '' to turn analytics off. See assets/js/analytics.js for the
   * events that are tracked.
   */
  gaMeasurementId: 'G-5DCRXQVFL7',

  /*
   * Contact form destination.
   * Leave as '' until a form service is connected. While it is empty the form
   * validates the input but does NOT claim the message was sent; it shows the
   * visitor the direct email address instead.
   *
   * To connect, paste an endpoint that accepts a JSON POST, for example:
   *   Formspree:  'https://formspree.io/f/your-form-id'
   *   Your own:   'https://api.yourdomain.com/contact'
   * See README.md ("Connecting the contact form").
   */
  formEndpoint: 'https://formspree.io/f/xoedlgnz',

  /*
   * Founding Client Partnership (US$1,750/month for three months, two places).
   * Set enabled to false to hide the offer everywhere it appears on the page.
   */
  foundingOffer: {
    enabled: true
  }
};
