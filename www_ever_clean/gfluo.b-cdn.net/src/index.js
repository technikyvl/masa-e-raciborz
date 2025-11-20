import { initTextAnimations } from "./animations/text";
import { initButtonAnimations } from "./animations/button";
import { initImageAnimations } from "./animations/image";
import { initElementAnimations } from "./animations/element";
import { GfluoBasic } from "./free/core";

class Gfluo {
  constructor(options = {}) {
    // First initialize basic features
    this.basicInstance = new GfluoBasic();

    // Then initialize pro features if GSAP exists
    if (typeof window === "undefined" || !window.gsap) {
      console.error("GSAP is not loaded");
      return;
    }

    // Register ScrollTrigger plugin for pro features
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.defaults({
        markers: false,
      });
    }

    // Store options and global rules
    this.options = options;
    this.globalRules = options.globalRules || {};
    this.animations = new Set();

    // Initialize pro features
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initializePro());
    } else {
      this.initializePro();
    }
  }

  initializePro() {
    // Apply global rules first
    this.applyGlobalRules();

    // Ensure ScrollTrigger is ready
    if (window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }

    // Initialize all animations in the correct order
    requestAnimationFrame(() => {
      initTextAnimations();
      initButtonAnimations();
      initImageAnimations();
      initElementAnimations();

      // Final ScrollTrigger refresh after all animations are initialized
      if (window.ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    });
  }

  applyGlobalRules() {
    if (!this.globalRules) return;

    // Process each global rule
    Object.entries(this.globalRules).forEach(([selector, animation]) => {
      // Find all matching elements that don't already have a data-gsap attribute
      const elements = document.querySelectorAll(
        `${selector}:not([data-gsap])`
      );

      // Apply the animation attribute to each element
      elements.forEach((element) => {
        // Set the animation type
        element.setAttribute("data-gsap", animation);

        // Set default scroll trigger if not specified
        if (
          !element.hasAttribute("gfluo-trigger") &&
          !element.hasAttribute("gfluo-scroll-start")
        ) {
          element.setAttribute("gfluo-scroll-start", "top 80%");
          element.setAttribute("gfluo-scroll-toggle", "play none none none");
        }
      });
    });
  }

  refresh() {
    // Simply reinitialize
    this.initializePro();
  }

  trackAnimation(animation) {
    if (animation) {
      this.animations.add(animation);
    }
  }

  getActiveAnimations() {
    return Array.from(this.animations);
  }
}

// Initialize when GSAP is ready
window.addEventListener("load", function () {
  if (typeof window !== "undefined" && window.gsap && window.ScrollTrigger) {
    window.Gfluo = Gfluo;
    // Allow passing options through a global gfluoOptions object
    const globalOptions = window.gfluoOptions || {};
    window.gfluo = new Gfluo(globalOptions);
  } else {
    console.error("Gfluo is not supported in this environment");
  }
});

export default Gfluo;
console.log("Gfluo loaded");
