import { getConfig } from "../core/config";
import { utils } from "../core/utils";

// Helper function to create base animation timeline
const createElementAnimation = (
  element,
  initialState,
  finalState,
  defaults = {}
) => {
  // Get all configuration including transforms
  const config = getConfig(element, defaults);
  const { animationConfig, ...restConfig } = config;

  // Get initial state by combining custom transforms with animation-specific state
  const customInitialState = {
    opacity: 0,
    x: config.x || 0,
    y: config.y || 0,
    scale: config.scale || 1,
    rotation: config.rotation || 0,
    skewX: config.skewX || 0,
    skewY: config.skewY || 0,
    ...initialState(restConfig),
  };

  // Create the base animation
  const tl = gsap.timeline();

  // Add the animation
  tl.from(element, {
    ...customInitialState,
    duration: config.duration,
    ease: config.ease,
    ...animationConfig,
  });

  return tl;
};

// Interactive element animations collection
export const elementAnimations = {
  "el.4": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 0.75,
        x: -100,
        ease: "back.inOut(2)",
      });

      return createElementAnimation(
        element,
        (config) => ({
          x: config.x,
        }),
        (config) => ({
          x: 0,
        }),
        config
      );
    },
  },
  "el.5": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 0.5,
        scale: 0,
        ease: "power1.inOut",
      });

      return createElementAnimation(
        element,
        (config) => ({
          scale: config.scale,
        }),
        (config) => ({
          scale: 1,
        }),
        config
      );
    },
  },
  "el.2": {
    setup: (element) => {
      const config = getConfig(element, {
        scale: 1.1,
        duration: 0.1,
        bounds: null,
        axis: null,
      });

      // For interactive elements, we need to make them visible immediately
      gsap.set(element, { visibility: "visible", opacity: 1 });

      // Check if Draggable plugin is available
      if (!window.Draggable) {
        console.warn(
          "GSAP Draggable plugin is required for el.2 animation. Please include the plugin from: https://gsap.com/docs/v3/Plugins/Draggable/"
        );
        return;
      }

      gsap.registerPlugin(Draggable);
      const draggable = Draggable.create(element, {
        bounds: config.bounds,
        axis: config.axis,
        onPress: () => {
          gsap.to(element, {
            scale: config.scale,
            duration: config.duration,
          });
        },
        onRelease: () => {
          gsap.to(element, {
            scale: 1,
            duration: config.duration,
          });
        },
      })[0];

      return () => {
        draggable.kill();
      };
    },
  },
  "el.3": {
    setup: (element) => {
      // Check if device is mobile/tablet
      const isMobileOrTablet = window.matchMedia("(max-width: 990px)").matches;

      const config = getConfig(element, {
        enterDuration: 0.3,
        enterScale: 1.1,
        enterEase: "power2.out",
        leaveDuration: 0.3,
        leaveEase: "power2.out",
        moveDuration: 0.3,
        moveEase: "power2.out",
        moveDivisor: 10,
      });

      // For interactive elements, we need to make them visible immediately
      gsap.set(element, { visibility: "visible", opacity: 1 });

      // Only add event listeners if not on mobile/tablet
      if (!isMobileOrTablet) {
        const handleEnter = (e) => {
          gsap.to(element, {
            scale: config.enterScale,
            duration: config.enterDuration,
            ease: config.enterEase,
          });
        };

        const handleLeave = (e) => {
          gsap.to(element, {
            scale: 1,
            x: 0,
            y: 0,
            duration: config.leaveDuration,
            ease: config.leaveEase,
          });
        };

        const handleMove = (e) => {
          const rect = element.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const moveX = (e.clientX - centerX) / config.moveDivisor;
          const moveY = (e.clientY - centerY) / config.moveDivisor;

          gsap.to(element, {
            x: moveX,
            y: moveY,
            duration: config.moveDuration,
            ease: config.moveEase,
          });
        };

        element.addEventListener("mouseenter", handleEnter);
        element.addEventListener("mouseleave", handleLeave);
        element.addEventListener("mousemove", handleMove);

        return () => {
          element.removeEventListener("mouseenter", handleEnter);
          element.removeEventListener("mouseleave", handleLeave);
          element.removeEventListener("mousemove", handleMove);
        };
      }

      // Return empty cleanup function for mobile/tablet
      return () => {};
    },
  },
  "el.6": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 0.75,
        startY: 88,
        endY: 0,
        ease: "back.inOut(2)",
      });

      return createElementAnimation(
        element,
        (config) => ({
          y: config.startY,
        }),
        (config) => ({
          y: config.endY,
        }),
        config
      );
    },
  },
  "el.1": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 0.75,
        x: 88,
        ease: "back.inOut(2)",
      });

      return createElementAnimation(
        element,
        (config) => ({
          x: config.x,
        }),
        (config) => ({
          x: 0,
        }),
        config
      );
    },
  },
};

export const initElementAnimations = () => {
  const elements = document.querySelectorAll(
    '[data-gsap^="el."], [data-gsap^="btn."]'
  );

  elements.forEach((element) => {
    const animationType = element.getAttribute("data-gsap");
    const handler = elementAnimations[animationType];

    if (handler) {
      const animation = handler.setup(element);
      if (animation && typeof animation !== "function") {
        utils.handleAnimation(element, animation);
      } else if (animation && typeof animation === "function") {
        // For cleanup functions from interactive animations
        element._cleanup = animation;
      }
    }
  });
};

export default elementAnimations;
