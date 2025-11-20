import { getConfig } from "../core/config";
import { utils } from "../core/utils";

// Helper function for split animations
const setupSplitAnimation = (element, defaultConfig, animationCallback) => {
  const config = getConfig(element, defaultConfig);
  const split = utils.splitText(element, { types: config.splitType });

  if (!split) return null;

  gsap.set(element, { opacity: 1 });

  const elements = config.useChars ? split.chars : split.words;
  elements.forEach((el) => {
    el.style.display = "inline-block";
    el.style.position = "relative";
    if (config.transformOrigin) {
      el.style.transformOrigin = config.transformOrigin;
    }
  });

  return animationCallback(split, config);
};

// Create animation props helper
const createAnimProps = (config) => ({
  x: config.x ?? 0,
  y: config.y ?? 0,
  scale: config.scale ?? 1,
  rotation: config.rotation ?? 0,
  opacity: config.opacity ?? 1,
  duration: config.duration ?? 0.5,
  stagger: config.stagger ?? 0,
  ease: config.ease ?? "power2.out",
});

// Custom text animations
export const customTextAnimations = {
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
          splitType: "lines, words, chars",
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
