// Base configuration system
const defaultConfig = {
  // Base animation defaults
  duration: 0.8,
  ease: "power1.out",
  opacity: 0,

  // Scroll trigger defaults
  scroll: {
    start: "top 70%",
    toggleActions: "play none none none",
    markers: false, // for debugging
    scrub: false,
    once: true,
  },

  // Text animation defaults
  text: {
    stagger: 0.02,
    y: 50,
    x: 0,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    blur: 0,
    splitTypes: "lines, words, chars",
  },

  // Character animation defaults
  chars: {
    stagger: 0.02,
    y: 20,
    rotation: 0,
    scale: 1,
    blur: 0,
  },

  // Word animation defaults
  words: {
    stagger: 0.05,
    y: 20,
    x: 50,
    rotation: 0,
  },

  // Line animation defaults
  lines: {
    stagger: 0.1,
    y: 30,
  },

  // Scramble text defaults
  scramble: {
    speed: 0.3,
    chars: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    newClass: "scrambled",
    duration: 1,
  },

  // Special effects defaults
  effects: {
    blur: {
      amount: "20px",
      duration: 1,
    },
    elastic: {
      amplitude: 1,
      frequency: 0.3,
    },
    wave: {
      from: "center",
      ease: "sine.inOut",
    },
  },

  // Perspective settings for 3D animations
  perspective: {
    amount: 1000,
    origin: "50% 50%",
  },

  // Fallback settings
  fallback: {
    enabled: true,
    class: "animate-fallback",
    duration: "0.3s",
  },

  // Mobile optimization
  mobile: {
    reduceMotion: true,
    simplifyAnimations: true,
    disableParallax: true,
  },

  // Debug settings
  debug: {
    enabled: false,
    logLevel: "warn", // 'error' | 'warn' | 'info' | 'debug'
  },

  // Paragraph animation defaults
  paragraph: {
    duration: 0.8,
    stagger: 0.15,
    ease: "power2.out",
    opacity: 0,
  },
};

export const DEFAULT_ANIMATION_CONFIG = {
  duration: 0.8,
  stagger: 0,
  ease: "power2.out",
  x: 0,
  y: 0,
  skew: 0,
  skewX: 0,
  skewY: 0,
  opacity: 1,
};

export const getConfig = (element, defaults = {}) => {
  // Merge default animation config with provided defaults
  const config = { ...DEFAULT_ANIMATION_CONFIG, ...defaults };

  // Check if element is a valid DOM element
  if (!element || !element.hasAttribute) {
    console.warn("Invalid element provided to getConfig");
    return config;
  }

  // Get all attributes that start with "gfluo-" but exclude ScrollTrigger specific ones
  const attributes = Array.from(element.attributes || [])
    .map((attr) => attr.name)
    .filter(
      (name) => name.startsWith("gfluo-") && !name.startsWith("gfluo-scroll-")
    );

  // Process all attributes
  attributes.forEach((attr) => {
    const value = element.getAttribute(attr);
    const key = attr.replace("gfluo-", "");

    // Convert attribute value to appropriate type
    let parsedValue;
    if (value === "true") parsedValue = true;
    else if (value === "false") parsedValue = false;
    else if (!isNaN(value)) parsedValue = parseFloat(value);
    else parsedValue = value;

    // Store all properties in the config object
    config[key] = parsedValue;
  });

  return config;
};

// Helper to get specific animation type defaults
export const getAnimationDefaults = (type) => {
  switch (type) {
    case "chars":
      return defaultConfig.chars;
    case "words":
      return defaultConfig.words;
    case "lines":
      return defaultConfig.lines;
    case "paragraph":
      return defaultConfig.paragraph;
    case "scramble":
      return defaultConfig.scramble;
    default:
      return defaultConfig.text;
  }
};
