/* finish.js: tooltips for icon-only header buttons (title = their accessible name). Nothing else. */
(function () {
  "use strict";
  var raf = 0;
  function tips() { raf = 0; [].forEach.call(document.querySelectorAll(".ibtn[aria-label]"), function (b) { var l = b.getAttribute("aria-label"); if (l && b.title !== l) b.title = l; }); }
  function queue() { if (!raf) raf = requestAnimationFrame(tips); }
  function init() { tips(); new MutationObserver(queue).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-label"] }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
