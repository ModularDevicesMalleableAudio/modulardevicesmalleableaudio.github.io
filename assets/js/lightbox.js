/*
 * Image lightbox: click an image in the page content to see it as large as the
 * window allows, over a darkened page. The × button, Esc, a click anywhere, or
 * the browser's Back closes it again.
 *
 * Built on <dialog>, which brings the backdrop, the inert page behind it,
 * focus handling and Esc for free. Nothing here changes the page markup: the
 * images are found at load, and a browser without <dialog> or without script
 * simply shows them as it always did.
 *
 * Only images inside <main> are opened, so the header banner and footer icons
 * stay put, and an image that is already a link keeps its link. Of the
 * webapp / hardware figure pairs, only the visible half can be clicked, so
 * the viewer always shows the one the reader chose.
 *
 * The mobile bundle (scripts/build-mobile-docs.py) has its own viewer and
 * does not load this file.
 */
(function () {
  'use strict';

  var main = document.querySelector('main');
  if (!main || typeof HTMLDialogElement !== 'function') return;

  var images = Array.prototype.filter.call(main.querySelectorAll('img'), function (img) {
    return !img.closest('a');
  });
  if (!images.length) return;

  /*
   * Each image becomes a button for keyboard and screen-reader users. Its alt
   * text stays its accessible name, so it is announced as what it shows.
   */
  images.forEach(function (img) {
    img.setAttribute('data-lightbox', '');
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-haspopup', 'dialog');
  });

  var dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Image viewer');

  var closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'lightbox-close';
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.textContent = '×';

  var view = document.createElement('img');
  view.alt = '';

  dialog.append(closeButton, view);
  document.body.appendChild(dialog);

  /*
   * Opening adds a history entry, so the Back button or a phone's back
   * gesture closes the image instead of leaving the page. Closing any other
   * way steps back off that entry, so history is left as it was found.
   * A reload while open leaves a stale entry behind; it is cleared here.
   */
  if (history.state && history.state.lightbox) history.replaceState(null, '');

  function open(img) {
    view.src = img.currentSrc || img.src;
    view.alt = img.alt;
    // A raster is shown no larger than its own pixels, which would leave the
    // 700px-wide diagrams no bigger than on the page. Vectors fill the window.
    dialog.classList.toggle('lightbox-vector', /\.svg(?:[?#]|$)/i.test(view.src));
    dialog.showModal();
    history.pushState({ lightbox: true }, '');
  }

  main.addEventListener('click', function (event) {
    var img = event.target.closest('img[data-lightbox]');
    if (img) open(img);
  });

  main.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (!event.target.matches('img[data-lightbox]')) return;
    event.preventDefault(); // Space would otherwise scroll the page
    open(event.target);
  });

  // There is nothing to interact with in the viewer, so any click closes it:
  // the ×, the image, or the darkened page around it.
  dialog.addEventListener('click', function () {
    dialog.close();
  });

  dialog.addEventListener('close', function () {
    view.removeAttribute('src');
    if (history.state && history.state.lightbox) history.back();
  });

  window.addEventListener('popstate', function () {
    if (dialog.open) dialog.close();
  });
})();
