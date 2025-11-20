import { getConfig } from "../core/config";
import { utils } from "../core/utils";

// List of exception animations that require special handling
export const imageAnimationExceptions = {
  // Add exceptions here when needed, similar to text animations
};

// Add interactive image animations if needed
export const interactiveImageAnimations = {
  // Add interactive animations here when needed
};

// Helper function to create image animation
const createImageAnimation = (
  element,
  initialState,
  finalState,
  defaults = {}
) => {
  // Get configuration
  const config = getConfig(element, defaults);

  // Get initial state
  const customInitialState = {
    opacity: 0,
    ...initialState(config),
  };

  // Create the base animation
  const tl = gsap.timeline();

  // Set initial state
  gsap.set(element, { visibility: "hidden" });

  // Add the animation
  tl.from(element, {
    ...customInitialState,
    duration: config.duration,
    ease: config.ease,
  });

  return tl;
};

const imageAnimations = {
  "img.1": {
    setup: (element) =>
      createImageAnimation(
        element,
        () => ({ clipPath: "inset(50% 50% 50% 50%)" }),
        () => ({ clipPath: "inset(0% 0% 0% 0%)" }),
        {
          duration: 1.5,
          ease: "power1.out",
        }
      ),
  },

  "img.2": {
    setup: (element) =>
      createImageAnimation(
        element,
        () => ({ borderRadius: "50%", scale: 0.5 }),
        () => ({ borderRadius: 0, scale: 1 }),
        {
          duration: 1,
          ease: "power2.out",
        }
      ),
  },

  "img.3": {
    setup: (element) =>
      createImageAnimation(
        element,
        () => ({ clipPath: "inset(100% 0% 0% 0%)" }),
        () => ({ clipPath: "inset(0% 0% 0% 0%)" }),
        {
          duration: 1.5,
          ease: "power2.inOut",
        }
      ),
  },

  "img.4": {
    setup: (element) =>
      createImageAnimation(
        element,
        () => ({ clipPath: "inset(0% 50% 0% 50%)" }),
        () => ({ clipPath: "inset(0% 0% 0% 0%)" }),
        {
          duration: 1,
          ease: "ease",
        }
      ),
  },

  "img.5": {
    setup: (element) =>
      createImageAnimation(
        element,
        () => ({ clipPath: "inset(0% 100% 0% 0%)" }),
        () => ({ clipPath: "inset(0% 0% 0% 0%)" }),
        {
          duration: 1,
          ease: "ease",
        }
      ),
  },

  "img.6": {
    setup: (element) =>
      createImageAnimation(
        element,
        () => ({ clipPath: "inset(0% 0% 0% 100%)" }),
        () => ({ clipPath: "inset(0% 0% 0% 0%)" }),
        {
          duration: 1,
          ease: "ease",
        }
      ),
  },

  "img.7": {
    setup: (element) =>
      createImageAnimation(
        element,
        (config) => ({ scale: config.scale || 1.5, filter: "blur(12px)" }),
        () => ({ scale: 1, filter: "blur(0px)" }),
        {
          duration: 1.5,
          ease: "power2.out",
        }
      ),
  },

  "img.8": {
    setup: (element) =>
      createImageAnimation(
        element,
        (config) => ({ y: config.y || 100, rotation: config.rotation || 5 }),
        () => ({ y: 0, rotation: 0 }),
        {
          duration: 1.2,
          ease: "power2.out",
        }
      ),
  },

  "img.9": {
    setup: (element) =>
      createImageAnimation(
        element,
        (config) => ({
          x: config.x || -200,
          rotation: config.rotation || -45,
          transformOrigin: config.transformOrigin || "center center",
        }),
        () => ({ x: 0, rotation: 0 }),
        {
          duration: 1.2,
          ease: "power2.out",
        }
      ),
  },
};

export const initImageAnimations = () => {
  const elements = document.querySelectorAll('[data-gsap^="img."]');

  elements.forEach((element) => {
    const animationType = element.getAttribute("data-gsap");
    const handler = imageAnimations[animationType];

    if (handler) {
      const animation = handler.setup(element);
      if (animation) {
        utils.handleAnimation(element, animation);
      }
    }
  });
};

// Add a cleanup function for when components are destroyed
export const cleanupImageAnimations = () => {
  Object.entries(interactiveImageAnimations).forEach(([type]) => {
    document.querySelectorAll(`[data-gsap="${type}"]`).forEach((element) => {
      if (element._cleanup) {
        element._cleanup();
        delete element._cleanup;
      }
    });
  });
};

export default imageAnimations;
