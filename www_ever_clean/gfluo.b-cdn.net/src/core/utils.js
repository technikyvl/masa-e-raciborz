// Utility functions
export const utils = {
  getDuration: (element, defaultDuration = 0.5) => {
    return (
      parseFloat(element.getAttribute("gfluo-duration")) || defaultDuration
    );
  },

  createScrollTrigger: (element, animation, scrollConfig = {}) => {
    // Get ScrollTrigger specific attributes
    const start = element.getAttribute("gfluo-scroll-start") || "top 80%";
    const end = element.getAttribute("gfluo-scroll-end");
    const scrub = element.getAttribute("gfluo-scroll-scrub");
    const toggleActions =
      element.getAttribute("gfluo-scroll-toggle") || "play none none reverse";
    const markers = element.getAttribute("gfluo-scroll-markers") === "true";
    const delay = parseFloat(element.getAttribute("gfluo-delay")) || 0;

    // Ensure ScrollTrigger is registered
    if (!window.gsap || !window.ScrollTrigger) {
      console.error("ScrollTrigger plugin is not registered");
      return;
    }

    // Create a paused timeline that includes any delay
    const mainTl = gsap.timeline({
      paused: true,
      onStart: () => {
        // Only change visibility when animation actually starts
        gsap.set(element, { visibility: "visible" });
      },
    });

    if (delay) {
      mainTl.add(gsap.timeline().to({}, { duration: delay }));
    }
    mainTl.add(animation);

    // Create the ScrollTrigger instance
    ScrollTrigger.create({
      trigger: element,
      animation: mainTl,
      start: start,
      end: end,
      scrub: scrub === "true" ? true : false,
      toggleActions: toggleActions,
      markers: markers,
      onEnter: () => {
        mainTl.play();
      },
      once: false,
    });

    // Force a refresh of ScrollTrigger
    ScrollTrigger.refresh();
  },

  splitText: (element, options = {}) => {
    if (!window.SplitType) {
      console.error("SplitType library is not loaded");
      return null;
    }
    try {
      return new SplitType(element, {
        types: options.types || "lines, words, chars",
        tagName: "span",
      });
    } catch (error) {
      console.error("Error splitting text:", error);
      return null;
    }
  },

  handleAnimation: (element, animation) => {
    const trigger = element.getAttribute("gfluo-trigger");
    const delay = parseFloat(element.getAttribute("gfluo-delay")) || 0;

    if (!animation) {
      console.error("No animation provided for element:", element);
      return;
    }

    // Set only visibility initially, not any transform properties
    gsap.set(element, { visibility: "hidden" });

    if (trigger === "load") {
      // For load triggers, we create a timeline
      const mainTl = gsap.timeline({
        onStart: () => {
          gsap.set(element, { visibility: "visible" });
        },
      });

      // Add delay if specified
      if (delay) {
        mainTl.add(gsap.timeline().to({}, { duration: delay }));
      }

      // Add the main animation
      mainTl.add(animation);

      // Play the animation on next frame
      requestAnimationFrame(() => {
        mainTl.play();
      });
    } else {
      // For scroll triggers, we don't set initial transform states
      // Only set visibility
      gsap.set(element, { visibility: "hidden" });
      utils.createScrollTrigger(element, animation);
    }
  },

  createBasicAnimation: (element, defaultInitialState = {}) => {
    const config = getConfig(element);

    // Merge default initial state with config
    const initialState = {
      opacity: config.opacity === 1 ? 0 : config.opacity,
      x: config.x,
      y: config.y,
      skewX: config.skewX,
      skewY: config.skewY,
      ...defaultInitialState,
    };

    // Set initial state
    gsap.set(element, initialState);

    // Create animation to neutral position
    return gsap.to(element, {
      opacity: 1,
      x: 0,
      y: 0,
      skewX: 0,
      skewY: 0,
      duration: config.duration,
      ease: config.ease,
      stagger: config.stagger,
    });
  },
};
