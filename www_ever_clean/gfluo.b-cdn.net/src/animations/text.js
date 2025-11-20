import { getConfig } from "../core/config";
import { utils } from "../core/utils";
import { customTextAnimations } from "./custom-text";

// Define base animation properties that are common across all animations
const createBaseAnimProps = (config) => ({
  // Position
  x: config.x ?? 0,
  y: config.y ?? 0,

  // Transform
  scale: config.scale ?? 1,
  rotation: config.rotation ?? 0,
  rotationX: config.rotationX ?? 0,
  rotationY: config.rotationY ?? 0,
  skewX: config.skewX ?? 0,
  skewY: config.skewY ?? 0,

  // Visibility
  opacity: config.opacity ?? 0,

  // Animation
  duration: config.duration ?? 0.5,
  stagger: config.stagger ?? 0,
  ease: config.ease ?? "power2.out",

  // Optional properties
  ...(config.transformOrigin && { transformOrigin: config.transformOrigin }),
  ...(config.letterSpacing && { letterSpacing: config.letterSpacing }),
  ...(config.force3D && { force3D: true }),
  ...(config.yPercent !== undefined && { yPercent: config.yPercent }),
});

// Helper to create final animation properties
const createAnimProps = (config, customProps = {}) => {
  const baseProps = {
    // Position
    x: config.x ?? 0,
    y: config.y ?? 0,

    // Transform properties
    scale: config.scale ?? 1,
    rotation: config.rotation ?? 0,
    rotationX: config.rotationX ?? 0,
    rotationY: config.rotationY ?? 0,
    skewX: config.skewX ?? 0,
    skewY: config.skewY ?? 0,

    // Visual properties
    opacity: config.opacity ?? 1,

    // Animation properties
    duration: config.duration ?? 0.5,
    stagger: config.stagger ?? 0,
    ease: config.ease ?? "power2.out",

    // Optional properties
    ...(config.transformOrigin && {
      transformOrigin: config.transformOrigin,
    }),
    ...(config.force3D && { force3D: true }),
    ...(config.filter && { filter: config.filter }),
  };

  // Merge with custom properties
  return { ...baseProps, ...customProps };
};

// Helper function to create base text animation timeline
const createTextAnimation = (element, defaultConfig = {}) => {
  // Get configuration with defaults merged with custom attributes
  const config = getConfig(element, {
    duration: 0.8,
    stagger: 0.03,
    ease: "power2.out",
    x: 0,
    y: 0,
    skewX: 0,
    skewY: 0,
    opacity: 1,
    ...defaultConfig,
  });

  // Split text based on type
  const splitTypes = defaultConfig.splitType || "lines, words, chars";
  const split = utils.splitText(element, { types: splitTypes });
  if (!split) return null;

  // Only set basic visibility
  gsap.set(element, { opacity: 1 });

  // Determine targets based on split type
  const targets = defaultConfig.useLines
    ? split.lines
    : defaultConfig.useChars
    ? split.chars
    : split.words;

  if (!targets || targets.length === 0) {
    console.warn("No text targets found for animation");
    return null;
  }

  // Style the targets with only basic positioning
  targets.forEach((target) => {
    target.style.display = "inline-block";
    target.style.position = "relative";
  });

  // Check for trigger type
  const trigger = element.getAttribute("gfluo-trigger");

  // Create animation based on trigger type
  if (trigger === "load") {
    // For load triggers, set initial state and animate TO final position
    gsap.set(targets, {
      opacity: config.opacity === 1 ? 0 : config.opacity,
      x: config.x,
      y: config.y,
      skewX: config.skewX,
      skewY: config.skewY,
    });

    return gsap.to(targets, {
      opacity: 1,
      x: 0,
      y: 0,
      skewX: 0,
      skewY: 0,
      duration: config.duration,
      stagger: config.stagger,
      ease: config.ease,
    });
  } else if (
    trigger === "scroll" ||
    element.hasAttribute("gfluo-scroll-start")
  ) {
    // For explicit scroll triggers, return a from() animation
    return gsap.from(targets, {
      opacity: config.opacity === 1 ? 0 : config.opacity,
      x: config.x,
      y: config.y,
      skewX: config.skewX,
      skewY: config.skewY,
      duration: config.duration,
      stagger: config.stagger,
      ease: config.ease,
    });
  } else {
    // For no trigger, just show the element without animation
    return gsap.to(targets, { duration: 0 });
  }
};

// Helper for interactive elements
const makeInteractive = (element) => {
  gsap.set(element, {
    visibility: "visible",
    opacity: 1,
    immediateRender: true,
  });
};

// Helper for text splitting
const splitTextWithCheck = (element, options = {}) => {
  return utils.splitText(element, options);
};

// List of exception animations that require special handling
export const textAnimationExceptions = {
  "txt.9": "interactive-mouse",
  "txt.10": "typewriter",
  "txt.11": "counter",
  "txt.12": "word-rotation",
  "txt.13": "glitch",
  // Add more exceptions as needed
};

// Add this helper function for initial state
const setInitialState = (element) => {
  gsap.set(element, {
    opacity: 0,
    immediateRender: true,
    force3D: true,
  });
};

// Add a new object to handle interactive animations
export const interactiveTextAnimations = {
  "txt.9": {
    setup: (element) => {
      makeInteractive(element);
      const split = splitTextWithCheck(element);
      if (!split) return null;

      // Set initial states
      gsap.set(split.chars, { opacity: 1 });

      const handleMouseMove = (e) => {
        const { clientX: mouseX, clientY: mouseY } = e;
        split.chars.forEach((char) => {
          const rect = char.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distanceX = mouseX - centerX;
          const distanceY = mouseY - centerY;

          const config = getConfig(element, { duration: 0.3 });

          gsap.to(char, {
            x: gsap.utils.clamp(-20, 20, distanceX / 10),
            y: gsap.utils.clamp(-20, 20, distanceY / 10),
            duration: config.duration,
            ease: "power2.out",
          });
        });
      };

      // Store the handler reference for cleanup
      element._mouseHandler = handleMouseMove;
      document.addEventListener("mousemove", handleMouseMove);

      // Return a cleanup function
      return () => {
        document.removeEventListener("mousemove", element._mouseHandler);
        delete element._mouseHandler;
      };
    },
    cleanup: (element) => {
      if (element._mouseHandler) {
        document.removeEventListener("mousemove", element._mouseHandler);
        delete element._mouseHandler;
      }
    },
  },
  "txt.10": {
    setup: (element) => {
      // Check if ScrollTrigger plugin is available
      if (!window.ScrollTrigger) {
        console.warn(
          "GSAP ScrollTrigger plugin is required for txt.10 animation. Please include the plugin from: https://gsap.com/docs/v3/Plugins/ScrollTrigger/"
        );
        return null;
      }

      makeInteractive(element);
      // Store original text and clear element
      const text = element.textContent;
      element.textContent = "";

      // Create and append typed text and cursor elements
      const textElement = document.createElement("span");
      textElement.className = "typed-text";
      element.appendChild(textElement);

      const cursor = document.createElement("span");
      cursor.className = "cursor";
      cursor.textContent = "|";
      element.appendChild(cursor);

      let typewriterTimeline;

      // Typewriter function
      function typeWriter(text, i = 0) {
        if (i < text.length) {
          textElement.innerHTML += text.charAt(i);
          i++;
          const config = getConfig(element, { typingSpeed: 0.07 });
          typewriterTimeline = gsap.delayedCall(config.typingSpeed, () =>
            typeWriter(text, i)
          );
        }
      }

      // Setup cursor animation
      const cursorAnimation = gsap.to(cursor, {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        duration: 0.6,
        ease: "expo.inOut",
      });

      // Create scroll trigger
      const scrollTrigger = ScrollTrigger.create({
        trigger: element,
        start: "top 90%",
        end: "bottom 0%",
        onEnter: () => {
          textElement.innerHTML = "";
          typeWriter(text);
          cursorAnimation.play();
        },
        onEnterBack: () => {
          textElement.innerHTML = "";
          typeWriter(text);
          cursorAnimation.play();
        },
        onLeave: () => {
          if (typewriterTimeline) typewriterTimeline.kill();
          textElement.innerHTML = "";
          cursorAnimation.play();
        },
        onLeaveBack: () => {
          if (typewriterTimeline) typewriterTimeline.kill();
          textElement.innerHTML = "";
          cursorAnimation.play();
        },
      });

      // Set initial visibility
      gsap.set(element, { opacity: 1 });

      // Return cleanup function
      return () => {
        if (typewriterTimeline) typewriterTimeline.kill();
        cursorAnimation.kill();
        scrollTrigger.kill();
        element.textContent = text; // Restore original text
      };
    },
    cleanup: (element) => {
      if (element._cleanup) {
        element._cleanup();
        delete element._cleanup;
      }
    },
  },
  "txt.11": {
    setup: (element) => {
      // Check if ScrollTrigger plugin is available
      if (!window.ScrollTrigger) {
        console.warn(
          "GSAP ScrollTrigger plugin is required for txt.11 animation. Please include the plugin from: https://gsap.com/docs/v3/Plugins/ScrollTrigger/"
        );
        return null;
      }

      makeInteractive(element);

      // Check if text contains a number
      const originalText = element.innerText;
      const targetValue = parseInt(element.innerText);

      if (isNaN(targetValue)) {
        // If no number found, just make the text visible and return
        gsap.set(element, { opacity: 1 });
        return null;
      }

      // Set initial state
      gsap.set(element, { opacity: 1 });
      element.innerText = "0";

      // Get configuration with duration and delay support
      const config = getConfig(element, {
        duration: 2,
        delay: 0,
        ease: "power2.out",
        start: "top 80%",
        toggleActions: "play none none none",
      });

      // Check if this is a load-triggered animation
      const isLoadTrigger = element.getAttribute("gfluo-trigger") === "load";

      // Create the animation with delay support
      const animation = gsap.to(element, {
        innerText: targetValue,
        duration: config.duration,
        delay: config.delay,
        snap: { innerText: 1 },
        ease: config.ease,
        scrollTrigger: !isLoadTrigger
          ? {
              trigger: element,
              start: config.start,
              toggleActions: config.toggleActions,
            }
          : null,
        onComplete: () => {
          element.innerText = originalText;
        },
      });

      // Return cleanup function
      return () => {
        if (animation) {
          animation.kill();
        }
        element.innerText = originalText;
      };
    },
    cleanup: (element) => {
      if (element._cleanup) {
        element._cleanup();
        delete element._cleanup;
      }
    },
  },
  "txt.12": {
    setup: (element) => {
      makeInteractive(element);
      const originalText = element.textContent.trim();
      const words = originalText.split(",").map((word) => word.trim());

      // Validation
      if (words.length < 2) {
        console.log(
          "Add more words divided by `,`. Element doesn't have enough words to animate:",
          element
        );
        return null;
      }

      // Setup DOM elements
      let currentIndex = 0;
      const wrapper = document.createElement("span");
      const changingWord = document.createElement("span");
      wrapper.appendChild(changingWord);
      element.textContent = "";
      element.appendChild(wrapper);
      changingWord.textContent = words[0];

      // Set initial state
      gsap.set(element, { opacity: 1 });

      // Get configuration
      const config = getConfig(element, {
        fadeDuration: 0.5,
        rotationInterval: 2000,
        yOffset: 20,
      });

      // Check for trigger type
      const isLoadTrigger = element.getAttribute("gfluo-trigger") === "load";

      // Rotation function
      function rotateWords() {
        gsap.to(changingWord, {
          duration: config.fadeDuration,
          opacity: 0,
          y: config.yOffset,
          onComplete: () => {
            currentIndex = (currentIndex + 1) % words.length;
            changingWord.textContent = words[currentIndex];
            gsap.to(changingWord, {
              duration: config.fadeDuration,
              opacity: 1,
              y: 0,
            });
          },
        });
      }

      // For load trigger, start with opacity 0
      if (isLoadTrigger) {
        gsap.set(changingWord, { opacity: 0 });
        gsap.to(changingWord, {
          opacity: 1,
          duration: config.fadeDuration,
          onComplete: () => {
            // Start interval immediately after initial fade in
            const intervalId = setInterval(
              rotateWords,
              config.rotationInterval
            );
            element._intervalId = intervalId;
          },
        });
      } else {
        // For scroll trigger, start rotation immediately
        const intervalId = setInterval(rotateWords, config.rotationInterval);
        element._intervalId = intervalId;
      }

      // Return cleanup function
      return () => {
        if (element._intervalId) {
          clearInterval(element._intervalId);
          delete element._intervalId;
        }
        element.textContent = originalText; // Restore original text
      };
    },
    cleanup: (element) => {
      if (element._cleanup) {
        element._cleanup();
        delete element._cleanup;
      }
      if (element._intervalId) {
        clearInterval(element._intervalId);
        delete element._intervalId;
      }
    },
  },
  "txt.13": {
    setup: (element) => {
      makeInteractive(element);
      // Get configuration
      const config = getConfig(element, {
        glitchChars: "!<>-_\\/[]{}—=+*^?#________",
        glitchProbability: 0.1,
        glitchInterval: 100,
        minOpacity: 0.5,
        skewAngle: 10,
        intermittent: true,
        minGlitchDuration: 0.5,
        maxGlitchDuration: 1.5,
        minNormalDuration: 2,
        maxNormalDuration: 5,
      });

      const originalText = element.textContent;
      gsap.set(element, { opacity: 1, whiteSpace: "nowrap" });

      // Glitch text generation
      function glitchText() {
        let newText = "";
        for (let i = 0; i < originalText.length; i++) {
          newText +=
            Math.random() < config.glitchProbability
              ? config.glitchChars[
                  Math.floor(Math.random() * config.glitchChars.length)
                ]
              : originalText[i];
        }
        element.textContent = newText;
      }

      // Animation functions
      function animateOpacity() {
        return gsap.to(element, {
          duration: 0.05,
          opacity: config.minOpacity,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut",
        });
      }

      function animateSkew() {
        return gsap.to(element, {
          duration: 0.05,
          skewX: config.skewAngle,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut",
        });
      }

      // Track active animations
      let glitchInterval;
      let opacityAnimation;
      let skewAnimation;
      let cycleTimeout;

      function startGlitch() {
        glitchInterval = setInterval(glitchText, config.glitchInterval);
        opacityAnimation = animateOpacity();
        skewAnimation = animateSkew();
      }

      function stopGlitch() {
        clearInterval(glitchInterval);
        if (opacityAnimation) opacityAnimation.kill();
        if (skewAnimation) skewAnimation.kill();
        gsap.to(element, { opacity: 1, skewX: 0, duration: 0.1 });
        element.textContent = originalText;
      }

      // Handle intermittent glitching
      if (config.intermittent) {
        function glitchCycle() {
          const glitchDuration = gsap.utils.random(
            config.minGlitchDuration,
            config.maxGlitchDuration
          );
          const normalDuration = gsap.utils.random(
            config.minNormalDuration,
            config.maxNormalDuration
          );

          startGlitch();
          cycleTimeout = gsap.delayedCall(glitchDuration, () => {
            stopGlitch();
            cycleTimeout = gsap.delayedCall(normalDuration, glitchCycle);
          });
        }

        glitchCycle();
      } else {
        startGlitch();
      }

      // Return cleanup function
      return () => {
        stopGlitch();
        if (cycleTimeout) cycleTimeout.kill();
        element.textContent = originalText;
      };
    },
    cleanup: (element) => {
      if (element._cleanup) {
        element._cleanup();
        delete element._cleanup;
      }
    },
  },
  "txt.20": {
    setup: (element) =>
      setupSplitAnimation(
        element,
        {
          duration: 0.5,
          stagger: { amount: 0.3, from: "start" },
          ease: "power2.out",
          opacity: 0,
          y: 30,
          splitType: "words",
          useChars: false,
        },
        (split, config) => gsap.from(split.words, createAnimProps(config))
      ),
  },
  "txt.21": {
    setup: (element) =>
      setupSplitAnimation(
        element,
        {
          duration: 0.6,
          stagger: { amount: 0.4, from: "center" },
          ease: "back.out(1.7)",
          opacity: 0,
          scale: 0.5,
          splitType: "lines, words,chars",
          useChars: true,
        },
        (split, config) => gsap.from(split.chars, createAnimProps(config))
      ),
  },
  "txt.22": {
    setup: (element) =>
      setupSplitAnimation(
        element,
        {
          duration: 0.4,
          stagger: { amount: 0.5, from: "random" },
          ease: "power3.out",
          opacity: 0,
          rotation: 45,
          splitType: "lines, words, chars",
          useChars: true,
        },
        (split, config) => gsap.from(split.chars, createAnimProps(config))
      ),
  },
  "txt.23": {
    setup: (element) =>
      setupSplitAnimation(
        element,
        {
          duration: 0.7,
          stagger: { amount: 0.6, from: "end" },
          ease: "elastic.out(1, 0.3)",
          opacity: 0,
          x: -50,
          splitType: "words",
          useChars: false,
        },
        (split, config) => gsap.from(split.words, createAnimProps(config))
      ),
  },
};

const textAnimations = {
  ...customTextAnimations,
  "par.1": {
    setup: (element) =>
      setupSplitAnimation(
        element,
        {
          duration: 0.8,
          stagger: { amount: 0.15 },
          ease: "power2.out",
          y: 20,
          opacity: 0,
          rotation: 0,
          scale: 1,
          splitType: "lines",
        },
        (split, config) => gsap.from(split.lines, createAnimProps(config))
      ),
  },
  "par.2": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 1,
        stagger: { amount: 0.15 },
        ease: "power2.out",
        x: -50,
        y: 0,
        skewX: 0,
        opacity: 0,
        rotation: 0,
        scale: 1,
        splitType: "lines",
      });

      const split = utils.splitText(element, { types: config.splitType });
      if (!split) return null;

      gsap.set(element, { opacity: 1 });
      split.lines.forEach((line) => {
        line.style.display = "inline-block";
        line.style.position = "relative";
      });

      return gsap.from(split.lines, {
        x: config.x,
        y: config.y,
        skewX: config.skewX,
        opacity: config.opacity,
        rotation: config.rotation,
        scale: config.scale,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
      });
    },
  },
  "par.3": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 1,
        stagger: { amount: 0.15 },
        ease: "circ.out",
        x: -20,
        y: 0,
        skewX: 0,
        opacity: 0,
        rotation: 0,
        scale: 1,
        splitType: "lines",
      });

      const split = utils.splitText(element, { types: config.splitType });
      if (!split) return null;

      gsap.set(element, { opacity: 1 });
      split.lines.forEach((line) => {
        line.style.display = "inline-block";
        line.style.position = "relative";
      });

      return gsap.from(split.lines, {
        x: config.x,
        y: config.y,
        skewX: config.skewX,
        opacity: config.opacity,
        rotation: config.rotation,
        scale: config.scale,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
      });
    },
  },
  "par.4": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 1,
        stagger: { amount: 0.15 },
        ease: "circ.out",
        x: 0,
        y: 20,
        scaleY: 0,
        opacity: 0,
        rotation: 0,
        scale: 1,
        splitType: "lines",
      });

      const split = utils.splitText(element, { types: config.splitType });
      if (!split) return null;

      gsap.set(element, { opacity: 1 });
      split.lines.forEach((line) => {
        line.style.display = "inline-block";
        line.style.position = "relative";
      });

      return gsap.from(split.lines, {
        x: config.x,
        y: config.y,
        scaleY: config.scaleY,
        opacity: config.opacity,
        rotation: config.rotation,
        scale: config.scale,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
      });
    },
  },
  "par.5": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 1,
        stagger: { amount: 0.15 },
        ease: "circ.out",
        x: 50,
        y: 0,
        skewX: 0,
        opacity: 0,
        rotation: 0,
        scale: 1,
        splitType: "lines",
      });

      const split = utils.splitText(element, { types: config.splitType });
      if (!split) return null;

      gsap.set(element, { opacity: 1 });
      split.lines.forEach((line) => {
        line.style.display = "inline-block";
        line.style.position = "relative";
      });

      return gsap.from(split.lines, {
        x: config.x,
        y: config.y,
        skewX: config.skewX,
        opacity: config.opacity,
        rotation: config.rotation,
        scale: config.scale,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
      });
    },
  },
  "par.6": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 0.8,
        stagger: { amount: 0.1 },
        ease: "power2.out",
        x: 0,
        y: 0,
        scale: 0.95,
        opacity: 0,
        rotation: 0,
        splitType: "lines",
        transformOrigin: "left center",
      });

      const split = utils.splitText(element, { types: config.splitType });
      if (!split) return null;

      gsap.set(element, { opacity: 1 });
      split.lines.forEach((line) => {
        line.style.display = "inline-block";
        line.style.position = "relative";
        line.style.transformOrigin = config.transformOrigin;
      });

      return gsap.from(split.lines, {
        x: config.x,
        y: config.y,
        scale: config.scale,
        opacity: config.opacity,
        rotation: config.rotation,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
      });
    },
  },
  "par.7": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 0.8,
        stagger: { amount: 0.1 },
        ease: "power2.out",
        x: 0,
        y: 0,
        scale: 0.75,
        opacity: 0,
        rotation: 0,
        splitType: "lines",
        transformOrigin: "100% 100%",
      });

      const split = utils.splitText(element, { types: config.splitType });
      if (!split) return null;

      gsap.set(element, { opacity: 1 });
      split.lines.forEach((line) => {
        line.style.display = "inline-block";
        line.style.position = "relative";
        line.style.transformOrigin = config.transformOrigin;
      });

      return gsap.from(split.lines, {
        x: config.x,
        y: config.y,
        scale: config.scale,
        opacity: config.opacity,
        rotation: config.rotation,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
      });
    },
  },
  "par.8": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 0.8,
        stagger: { amount: 0.03 },
        ease: "power2.out",
        x: 0,
        y: 20,
        opacity: 0,
        rotation: 0,
        scale: 1,
        splitType: "words",
      });

      const split = utils.splitText(element, { types: config.splitType });
      if (!split) return null;

      gsap.set(element, { opacity: 1 });
      split.words.forEach((word) => {
        word.style.display = "inline-block";
        word.style.position = "relative";
      });

      return gsap.from(split.words, {
        x: config.x,
        y: config.y,
        opacity: config.opacity,
        rotation: config.rotation,
        scale: config.scale,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
      });
    },
  },
  "par.9": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 0.8,
        stagger: { amount: 0.6 },
        ease: "power1.out",
        x: 0,
        y: 100,
        skewX: 20,
        opacity: 0,
        rotation: 0,
        scale: 1,
        splitType: "lines",
      });

      const split = utils.splitText(element, { types: config.splitType });
      if (!split) return null;

      gsap.set(element, { opacity: 1 });
      split.lines.forEach((line) => {
        line.style.display = "inline-block";
        line.style.position = "relative";
      });

      return gsap.from(split.lines, {
        x: config.x,
        y: config.y,
        skewX: config.skewX,
        opacity: config.opacity,
        rotation: config.rotation,
        scale: config.scale,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
      });
    },
  },
  "par.10": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 0.75,
        stagger: 0.075,
        ease: "power1.inOut",
        x: 0,
        y: 0,
        opacity: 0,
        splitType: "lines",
      });

      const split = utils.splitText(element, { types: config.splitType });
      if (!split) return null;

      return gsap.from(split.lines, {
        x: config.x,
        y: config.y,
        opacity: config.opacity,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
      });
    },
  },
  "txt.1": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 0.4,
        stagger: 0.03,
        ease: "power2.out",
        x: 0,
        y: -20,
        scale: 1,
        rotation: 0,
        skewX: 0,
        skewY: 0,
        opacity: 0,
        transformOrigin: "center center",
        splitType: "lines, words, chars",
        useChars: true,
      });

      const split = utils.splitText(element, { types: config.splitType });
      if (!split) return null;

      // Set initial visibility
      gsap.set(element, { opacity: 1 });
      split.chars.forEach((char) => {
        char.style.display = "inline-block";
        char.style.position = "relative";
      });

      const tl = gsap.timeline();

      // Add char animation
      tl.from(split.chars, {
        x: config.x,
        y: config.y,
        scale: config.scale,
        rotation: config.rotation,
        skewX: config.skewX,
        skewY: config.skewY,
        opacity: config.opacity,
        transformOrigin: config.transformOrigin,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
      });

      return tl;
    },
  },
  "txt.24": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 1,
        stagger: 0.1,
        ease: "steps(5)",
        x: 0,
        y: -20,
        scale: 0.2,
        rotation: 0,
        skewX: 0,
        skewY: 0,
        opacity: 0,
        transformOrigin: "center center",
        splitType: "lines, words, chars",
        useChars: true,
      });

      const split = utils.splitText(element, { types: config.splitType });
      if (!split) return null;

      // Set initial visibility
      gsap.set(element, { opacity: 1 });
      split.chars.forEach((char) => {
        char.style.display = "inline-block";
        char.style.position = "relative";
      });

      const tl = gsap.timeline();

      // Single animation with stepped scale
      tl.to(split.chars, {
        scale: 1,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
      });

      // Add other animations
      tl.from(
        split.chars,
        {
          x: config.x,
          y: config.y,
          rotation: config.rotation,
          skewX: config.skewX,
          skewY: config.skewY,
          opacity: config.opacity,
          transformOrigin: config.transformOrigin,
          duration: config.duration,
          stagger: config.stagger,
          ease: "steps(5)",
        },
        0
      );

      return tl;
    },
  },
  "txt.2": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 1,
        stagger: 0.03,
        ease: "power4.inOut",
        x: -20,
        y: 0,
        scale: 1,
        rotation: 0,
        skewX: 0,
        skewY: 0,
        opacity: 0,
        transformOrigin: "center center",
        splitType: "lines, words, chars",
      });

      // Split text and setup
      const split = utils.splitText(element, { types: config.splitType });
      if (!split) return null;

      // Set initial visibility
      gsap.set(element, { opacity: 1 });
      split.chars.forEach((char) => {
        char.style.display = "inline-block";
        char.style.position = "relative";
      });

      // Create timeline
      const tl = gsap.timeline();

      // Add char animation
      tl.from(split.chars, {
        x: config.x,
        y: config.y,
        scale: config.scale,
        rotation: config.rotation,
        skewX: config.skewX,
        skewY: config.skewY,
        opacity: config.opacity,
        transformOrigin: config.transformOrigin,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
      });

      return tl;
    },
  },
  "txt.3": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 1,
        stagger: 0.03,
        ease: "power4.inOut",
        x: -20,
        y: 0,
        scale: 1,
        rotation: 0,
        skewX: 0,
        skewY: 0,
        opacity: 0,
        transformOrigin: "center center",
        splitType: "lines, words, chars",
        useChars: true,
      });

      // Split text and setup
      const split = utils.splitText(element, { types: config.splitType });
      if (!split) return null;

      // Set initial visibility
      gsap.set(element, { opacity: 1 });
      split.chars.forEach((char) => {
        char.style.display = "inline-block";
        char.style.position = "relative";
      });

      // Create timeline
      const tl = gsap.timeline();

      // Add char animation
      tl.from(split.chars, {
        x: config.x,
        y: config.y,
        scale: config.scale,
        rotation: config.rotation,
        skewX: config.skewX,
        skewY: config.skewY,
        opacity: config.opacity,
        transformOrigin: config.transformOrigin,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
      });

      // Add element animation
      tl.to(
        element,
        {
          x: 0,
          y: 0,
          duration: config.duration,
          ease: config.ease,
        },
        "<"
      );

      return tl;
    },
  },
  "txt.4": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 1,
        stagger: 0.03,
        ease: "back.out(2)",
        x: -30,
        y: 0,
        scale: 1,
        rotation: 0,
        skewX: 20,
        skewY: 0,
        opacity: 0,
        transformOrigin: "center center",
        splitType: "lines, words, chars",
      });

      const split = utils.splitText(element, { types: config.splitType });
      if (!split) return null;

      gsap.set(element, { opacity: 1 });
      split.chars.forEach((char) => {
        char.style.display = "inline-block";
        char.style.position = "relative";
      });

      const tl = gsap.timeline();

      // Animate characters
      tl.from(split.chars, {
        x: config.x,
        y: config.y,
        scale: config.scale,
        rotation: config.rotation,
        skewX: config.skewX,
        skewY: config.skewY,
        opacity: config.opacity,
        transformOrigin: config.transformOrigin,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
      });

      // Animate the element simultaneously
      tl.to(
        element,
        {
          x: 0,
          y: 0,
          duration: config.duration,
          ease: config.ease,
        },
        "<"
      );

      return tl;
    },
  },
  "txt.5": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 0.75,
        stagger: 0.03,
        ease: "power2.out",
        x: 0,
        y: -20,
        scale: 1,
        rotation: 0,
        opacity: 0,
        splitType: "lines, words, chars",
        useChars: true,
      });

      const split = utils.splitText(element, { types: config.splitType });
      if (!split) return null;

      gsap.set(element, { opacity: 1 });
      split.chars.forEach((char) => {
        char.style.display = "inline-block";
        char.style.position = "relative";
      });

      return gsap.from(split.chars, {
        x: config.x,
        y: config.y,
        scale: config.scale,
        rotation: config.rotation,
        opacity: config.opacity,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
      });
    },
  },
  "txt.6": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 0.75,
        stagger: 0.1,
        ease: "back.inOut(2)",
        x: 0,
        y: 0,
        rotation: 0,
        scale: 0,
        opacity: 0,
        splitType: "lines, words, chars",
        useChars: true,
      });

      const split = utils.splitText(element, { types: config.splitType });
      if (!split) return null;

      gsap.set(element, { opacity: 1 });
      split.chars.forEach((char) => {
        char.style.display = "inline-block";
        char.style.position = "relative";
      });

      return gsap.from(split.chars, {
        x: config.x,
        y: config.y,
        rotation: config.rotation,
        scale: config.scale,
        opacity: config.opacity,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
      });
    },
  },
  "txt.7": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 1,
        ease: "power3.out",
        y: 30,
        x: 0,
        rotation: 0,
        skewX: 0,
        skewY: 0,
        scale: 0.5,
        filter: "blur(100px)",
        opacity: 0,
      });

      // Set initial visibility and style
      gsap.set(element, {
        opacity: config.opacity,
        y: config.y,
        x: config.x,
        rotation: config.rotation,
        skewX: config.skewX,
        skewY: config.skewY,
        scale: config.scale,
        filter: config.filter,
      });

      // Create animation
      return gsap.to(element, {
        opacity: 1,
        y: 0,
        x: 0,
        rotation: 0,
        skewX: 0,
        skewY: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: config.duration,
        ease: config.ease,
      });
    },
  },
  "txt.8": {
    setup: (element) => {
      const config = getConfig(element, {
        duration: 1.5,
        ease: "power2.out",
        scale: 0,
        x: 0,
        y: 0,
        opacity: 1,
        letterSpacing: "0.2em",
        filter: "blur(40px)",
        splitType: "lines, words, chars",
      });

      const split = utils.splitText(element, { types: config.splitType });
      if (!split) return null;

      // Set initial visibility
      gsap.set(element, { opacity: 1 });

      split.chars.forEach((char) => {
        char.style.display = "inline-block";
        char.style.position = "relative";
      });

      const tl = gsap.timeline();

      // Animate characters with scale and position
      tl.from(split.chars, {
        rotation: config.rotation,
        opacity: config.opacity,
        scale: config.scale,
        x: config.x,
        y: config.y,
        duration: config.duration,
        ease: config.ease,
        stagger: { amount: 0.6, from: "center" },
      });

      // Animate the element's properties
      tl.from(
        element,
        {
          letterSpacing: config.letterSpacing,
          filter: config.filter,
          duration: config.duration,
          ease: config.ease,
        },
        "<"
      );

      return tl;
    },
  },
  "txt.14": {
    setup: (element) =>
      setupSplitAnimation(
        element,
        {
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          y: -30,
          opacity: 0,
          splitType: "lines, words, chars",
          useChars: true,
        },
        (split, config) => gsap.from(split.chars, createAnimProps(config))
      ),
  },
  "txt.15": {
    setup: (element) =>
      setupSplitAnimation(
        element,
        {
          duration: 0.5,
          stagger: 0.02,
          ease: "power2.out",
          scale: 3,
          x: 50,
          opacity: 0,
          splitType: "lines, words, chars",
          useChars: true,
        },
        (split, config) => gsap.from(split.chars, createAnimProps(config))
      ),
  },
  "txt.16": {
    setup: (element) =>
      setupSplitAnimation(
        element,
        {
          duration: 0.75,
          stagger: 0.02,
          ease: "power2.out",
          scale: 2,
          opacity: 0,
          splitType: "lines, words, chars",
          useChars: true,
        },
        (split, config) => gsap.from(split.chars, createAnimProps(config))
      ),
  },
  "txt.17": {
    setup: (element) =>
      setupSplitAnimation(
        element,
        {
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          rotationX: -180,
          scale: 0.8,
          opacity: 0,
          transformOrigin: "50% 50% -50",
          splitType: "lines, words, chars",
          useChars: true,
          force3D: true,
        },
        (split, config) =>
          gsap.timeline().from(split.chars, createAnimProps(config))
      ),
  },
  "txt.18": {
    setup: (element) =>
      setupSplitAnimation(
        element,
        {
          duration: 1,
          stagger: 0.1,
          ease: "back.out",
          rotationY: -180,
          opacity: 0,
          splitType: "lines, words, chars",
          useChars: true,
          transformOrigin: "50% 50% -50",
          force3D: true,
        },
        (split, config) => gsap.from(split.chars, createAnimProps(config))
      ),
  },
  "txt.19": {
    setup: (element) =>
      setupSplitAnimation(
        element,
        {
          duration: 0.5,
          stagger: 0.03,
          ease: "back.out(2)",
          opacity: 0,
          x: () => gsap.utils.random(-100, 100),
          y: () => gsap.utils.random(-100, 100),
          rotation: () => gsap.utils.random(-180, 180),
          scale: () => gsap.utils.random(0.3, 2),
          splitType: "lines,chars", // Split into lines first, then chars
          useChars: true,
          transformOrigin: "50% 50%",
        },
        (split, config) => {
          return gsap.from(split.chars, createAnimProps(config));
        }
      ),
  },
  "free.5": {
    setup: (element) =>
      createTextAnimation(element, {
        useChars: false,
        y: 100,
        opacity: 0,
        stagger: { amount: 0.5 },
        ease: "back.out(2)",
      }),
  },
  "free.6": {
    setup: (element) => {
      const split = utils.splitText(element);
      if (!split) return null;

      gsap.set(element, { opacity: 1 });
      split.words.forEach((word) => {
        word.style.display = "inline-block";
        word.style.position = "relative";
      });

      gsap.set(split.words, {
        transformPerspective: 1000,
        transformOrigin: "0% 50%",
        rotationX: -90,
      });

      return gsap.to(split.words, {
        rotationX: 0,
        duration: 0.6,
        stagger: { amount: 0.6 },
        ease: "power2.out",
      });
    },
  },
  "free.7": {
    setup: (element) =>
      setupSplitAnimation(
        element,
        {
          duration: 0.5,
          stagger: { amount: 0.6, from: "random" },
          ease: "power1.out",
          opacity: 0,
          splitType: "words",
          useChars: false,
        },
        (split, config) => gsap.from(split.words, createAnimProps(config))
      ),
  },
  "free.8": {
    setup: (element) =>
      setupSplitAnimation(
        element,
        {
          duration: 0.2,
          stagger: { amount: 0.8 },
          ease: "power1.out",
          opacity: 0,
          splitType: "lines, words, chars",
          useChars: true,
        },
        (split, config) => gsap.from(split.chars, createAnimProps(config))
      ),
  },
  "free.9": {
    setup: (element) =>
      setupSplitAnimation(
        element,
        {
          duration: 0.2,
          stagger: { amount: 0.6 },
          ease: "power1.out",
          yPercent: 100,
          opacity: 0,
          splitType: "lines, words, chars",
          useChars: true,
        },
        (split, config) => gsap.from(split.chars, createAnimProps(config))
      ),
  },
};

export const initTextAnimations = () => {
  const elements = document.querySelectorAll(
    '[data-gsap^="txt."], [data-gsap^="par."], [data-gsap^="free."][data-gsap$="5"], [data-gsap^="free."][data-gsap$="6"], [data-gsap^="free."][data-gsap$="7"], [data-gsap^="free."][data-gsap$="8"], [data-gsap^="free."][data-gsap$="9"]'
  );

  elements.forEach((element) => {
    const animationType = element.getAttribute("data-gsap");

    // Handle interactive animations
    if (textAnimationExceptions[animationType]) {
      const handler = interactiveTextAnimations[animationType];
      if (handler) {
        handler.setup(element);
      }
      return;
    }

    // Handle regular animations
    const handler = textAnimations[animationType];
    if (handler) {
      const animation = handler.setup(element);
      if (animation) {
        utils.handleAnimation(element, animation);
      }
    } else {
      console.warn("No handler found for animation type:", animationType);
    }
  });
};

// Add a cleanup function for when components are destroyed
export const cleanupTextAnimations = () => {
  Object.keys(interactiveTextAnimations).forEach((type) => {
    document.querySelectorAll(`[data-gsap="${type}"]`).forEach((element) => {
      if (element._cleanup) {
        element._cleanup();
        delete element._cleanup;
      }
    });
  });
};

// Create a helper function for the common setup pattern
const setupSplitAnimation = (element, defaultConfig, animationCallback) => {
  const config = getConfig(element, defaultConfig);
  const split = utils.splitText(element, { types: config.splitType });

  if (!split) return null;

  gsap.set(element, { opacity: 1 });

  // Apply common styles to split elements
  const elements = config.useChars ? split.chars : split.words;
  elements.forEach((el) => {
    el.style.display = "inline-block";
    el.style.position = "relative";

    // Apply transform origin if specified
    if (config.transformOrigin) {
      el.style.transformOrigin = config.transformOrigin;
    }
  });

  return animationCallback(split, config);
};

export default textAnimations;
