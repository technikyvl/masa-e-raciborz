import { utils } from "../core/utils";

export const basicAnimations = {
  "free.1": {
    setup: (element) => {
      gsap.set(element, { opacity: 1 });
      const split = utils.splitText(element, { types: "lines, words, chars" });

      if (!split) return null;

      split.chars.forEach((char) => {
        char.style.display = "inline-block";
        char.style.position = "relative";
      });

      const tl = gsap.timeline();

      tl.set(split.chars, { opacity: 0, y: 40 });

      return tl.to(split.chars, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: {
          each: 0.02,
          ease: "sine.inOut",
        },
      });
    },
  },
  "free.2": {
    setup: (element) => {
      gsap.set(element, { opacity: 1 });
      const split = utils.splitText(element, { types: "lines, words, chars" });

      if (!split) return null;

      split.chars.forEach((char) => {
        char.style.display = "inline-block";
        char.style.position = "relative";
      });

      gsap.set(split.chars, {
        transformOrigin: "center center",
        rotationY: -180,
        opacity: 0,
      });

      return gsap.to(split.chars, {
        rotationY: 0,
        opacity: 1,
        duration: 0.8,
        stagger: { amount: 1 },
        ease: "power2.out",
      });
    },
  },
  "free.3": {
    setup: (element) => {
      gsap.set(element, { opacity: 1 });
      const split = utils.splitText(element, { types: "lines, words, chars" });

      if (!split) return null;

      split.chars.forEach((char) => {
        char.style.display = "inline-block";
        char.style.position = "relative";
      });

      gsap.set(split.chars, {
        scale: 0,
        opacity: 0,
      });

      return gsap.to(split.chars, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: { amount: 0.8 },
        ease: "back.out(2)",
      });
    },
  },

  "free.4": {
    setup: (element) => {
      gsap.set(element, { opacity: 1 });
      const split = utils.splitText(element, { types: "lines, words" });

      if (!split) return null;

      // Add necessary positioning
      split.words.forEach((word) => {
        word.style.display = "inline-block";
        word.style.position = "relative";
      });

      // Set initial state
      gsap.set(split.words, {
        opacity: 0,
        x: "1em",
        position: "relative",
      });

      const wordAnimProps = {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: { amount: 0.2 },
        ease: "power2.out",
      };

      return gsap.to(split.words, wordAnimProps);
    },
  },
  "free.5": {
    setup: (element) => {
      gsap.set(element, { opacity: 1 });
      const split = utils.splitText(element, { types: "lines, words" });

      if (!split) return null;

      split.words.forEach((word) => {
        word.style.display = "inline-block";
        word.style.position = "relative";
      });

      gsap.set(split.words, {
        yPercent: 100,
        opacity: 0,
        position: "relative",
      });

      const wordAnimProps = {
        yPercent: 0,
        opacity: 1,
        duration: 0.5,
        stagger: { amount: 0.5 },
        ease: "back.out(2)",
      };

      return gsap.to(split.words, wordAnimProps);
    },
  },
  "free.6": {
    setup: (element) => {
      gsap.set(element, { opacity: 1 });
      const split = utils.splitText(element, { types: "lines, words" });

      if (!split) return null;

      // Add necessary styles for 3D transforms
      split.words.forEach((word) => {
        word.style.display = "inline-block";
        word.style.position = "relative";
      });

      const tl = gsap.timeline();
      const wordAnimProps = {
        rotationX: -90,
        duration: 0.6,
        stagger: { amount: 0.6 },
        ease: "power2.out",
      };

      // Set perspective on the container element
      gsap.set(element, { perspective: 1000 });

      // Set initial state
      gsap.set(split.words, {
        transformOrigin: "0% 50%", // Set transform origin
        transformStyle: "preserve-3d", // Enable 3D transforms
      });

      return tl.from(split.words, wordAnimProps);
    },
  },

  "free.7": {
    setup: (element) => {
      gsap.set(element, { opacity: 1 });
      const split = utils.splitText(element, { types: "lines, words, chars" });

      if (!split) return null;

      split.chars.forEach((char) => {
        char.style.display = "inline-block";
        char.style.position = "relative";
      });

      const tl = gsap.timeline();

      tl.set(split.chars, {
        opacity: 0,
        y: (i) => Math.sin(i * 0.5) * 40,
      });

      return tl.to(split.chars, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: { amount: 0.5 },
        ease: "elastic.out(1, 0.3)",
      });
    },
  },
  "free.8": {
    setup: (element) => {
      gsap.set(element, { opacity: 1 });
      const split = utils.splitText(element, { types: "lines, words, chars" });

      if (!split) return null;

      const charAnimProps = {
        opacity: 0,
        duration: 0.2,
        stagger: { amount: 0.8 },
        ease: "power1.out",
      };

      return gsap.from(split.chars, charAnimProps);
    },
  },
  "free.9": {
    setup: (element) => {
      gsap.set(element, { opacity: 1 });
      const split = utils.splitText(element, { types: "lines, words, chars" });

      if (!split) return null;

      split.chars.forEach((char) => {
        char.style.display = "inline-block";
        char.style.position = "relative";
      });

      const tl = gsap.timeline();

      tl.set(split.chars, { opacity: 0, scale: 3 });

      return tl.to(split.chars, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: { amount: 0.8 },
        ease: "power4.out",
      });
    },
  },
  "free.10": {
    setup: (element) => {
      gsap.set(element, { opacity: 0, x: -100 });
      return gsap.to(element, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    },
  },
  "free.11": {
    setup: (element) => {
      gsap.set(element, { opacity: 0, y: 100 });
      return gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    },
  },
};
