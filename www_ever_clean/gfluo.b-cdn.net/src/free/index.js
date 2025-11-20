import { GfluoBasic } from "./core";
export { basicAnimations } from "./animations";

// Initialize when GSAP is ready
window.addEventListener("load", function () {
  if (typeof window !== "undefined" && window.gsap && window.ScrollTrigger) {
    window.GfluoBasic = GfluoBasic;
    window.gfluoBasic = new GfluoBasic();
  } else {
    console.error("GfluoBasic is not supported in this environment");
  }
});
