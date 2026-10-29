/**
 * Runs before first paint: enables reveal hiding unless the visitor prefers reduced motion.
 * If the app's JavaScript never starts, everything is shown again after 4 s.
 */
export const motionInitScript = `(function(){try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;var d=document.documentElement;d.setAttribute("data-motion","");setTimeout(function(){if(!window.__revealReady)d.removeAttribute("data-motion")},4000)}catch(e){}})();`;
