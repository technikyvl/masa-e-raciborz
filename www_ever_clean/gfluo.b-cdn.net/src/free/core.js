import { basicAnimations } from "./animations";
import { utils } from "../core/utils";

export class GfluoBasic {
  constructor() {
    // Check environment
    if (typeof window === "undefined" || !window.gsap) {
      console.error("GSAP is not loaded");
      return;
    }

    // Register ScrollTrigger
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    } else {
      console.error("ScrollTrigger plugin is not loaded");
      return;
    }

    // Initialize when DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initialize());
    } else {
      this.initialize();
    }
  }

  initialize() {
    const elements = document.querySelectorAll("[data-gsap^='free.']");

    elements.forEach((element) => {
      const animationType = element.getAttribute("data-gsap");
      const animation = basicAnimations[animationType];

      if (animation) {
        const tween = animation.setup(element);
        if (tween) {
          utils.handleAnimation(element, tween);
        }
      }
    });
  }
}

// Also export for window global
if (typeof window !== "undefined") {
  window.GfluoBasic = GfluoBasic;
}
