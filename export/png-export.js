/* ============================================================
   PNG Export Module
   Royal Technologies | royaltechbd.com
   ============================================================ */

'use strict';

window.PNGExporter = (function () {

  /**
   * Export a canvas as a PNG file download.
   * @param {HTMLCanvasElement} canvas
   * @param {string} filename  e.g. "puzzle-geometry-1234567890.png"
   */
  function exportPNG(canvas, filename) {
    if (!canvas) {
      console.error('PNGExporter.export: no canvas provided');
      return;
    }

    filename = filename || ('puzzle-' + Date.now() + '.png');

    console.log('PNGExporter: Downloading "' + filename + '"…');

    // Flash the export button if present
    const btn = document.getElementById('btn-export');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '⏳ Downloading…';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
      }, 1500);
    }

    canvas.toBlob(function (blob) {
      if (!blob) {
        console.error('PNGExporter: canvas.toBlob() returned null');
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href     = url;
      link.download = filename;

      // Must be in the DOM for Firefox
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke object URL after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 2000);

      console.log('PNGExporter: download triggered for "' + filename + '"');
    }, 'image/png');
  }

  /**
   * Returns a data URL string for the canvas (PNG).
   * @param {HTMLCanvasElement} canvas
   * @returns {string}
   */
  function toDataURL(canvas) {
    if (!canvas) return '';
    return canvas.toDataURL('image/png');
  }

  return {
    export:     exportPNG,
    toDataURL:  toDataURL,
  };

})();
