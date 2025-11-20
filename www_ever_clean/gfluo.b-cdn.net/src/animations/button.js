import { getConfig } from "../core/config";
import { utils } from "../core/utils";

// Helper function for calculating percentages
const getPercentage = (value, total) => (value / total) * 100;

// Helper function to make element interactive
const makeInteractive = (element) => {
  // For interactive elements, we need to make them visible immediately
  gsap.set(element, {
    visibility: "visible",
    opacity: 1,
    immediateRender: true,
  });
};

// Interactive button animations collection
export const buttonAnimations = {
  "btn.1": {
    setup: (button) => {
      const config = getConfig(button, {
        duration: 0.3,
        ease: "power1.in",
        leaveEase: "power1.out",
        overlayColor: "#00000030",
      });

      makeInteractive(button);
      gsap.set(button, {
        overflow: "hidden",
        position: "relative",
      });

      const clipEl = document.createElement("div");
      clipEl.setAttribute("aria-hidden", "true");
      Object.assign(clipEl.style, {
        position: "absolute",
        backgroundColor: config.overlayColor,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "none",
      });
      button.appendChild(clipEl);

      const handleMouseEnter = (e) => {
        const rect = button.getBoundingClientRect();
        const percentTop = getPercentage(e.clientY - rect.top, rect.height);
        const percentLeft = getPercentage(e.clientX - rect.left, rect.width);

        gsap.set(clipEl, { display: "flex" });
        gsap.fromTo(
          clipEl,
          { clipPath: `circle(0% at ${percentLeft}% ${percentTop}%)` },
          {
            clipPath: `circle(141.4% at ${percentLeft}% ${percentTop}%)`,
            duration: config.duration,
            ease: config.ease,
          }
        );
      };

      const handleMouseLeave = (e) => {
        const rect = button.getBoundingClientRect();
        const percentTop = getPercentage(e.clientY - rect.top, rect.height);
        const percentLeft = getPercentage(e.clientX - rect.left, rect.width);

        gsap.to(clipEl, {
          clipPath: `circle(0% at ${percentLeft}% ${percentTop}%)`,
          overwrite: true,
          duration: config.duration,
          ease: config.leaveEase,
        });
      };

      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mouseleave", handleMouseLeave);

      // Return cleanup function
      return () => {
        button.removeEventListener("mouseenter", handleMouseEnter);
        button.removeEventListener("mouseleave", handleMouseLeave);
        if (clipEl && clipEl.parentNode) {
          clipEl.parentNode.removeChild(clipEl);
        }
      };
    },
  },

  "btn.2": {
    setup: (button) => {
      const config = getConfig(button, {
        duration: 0.2,
        scale: 1.1,
        pressScale: 0.95,
        pressScaleDuration: 0.05,
        releaseScaleDuration: 0.2,
        shadowBlur: 15,
        ease: "power2.out",
      });

      makeInteractive(button);

      gsap.set(button, { opacity: 1 });

      const handleMouseEnter = () => {
        const buttonColor = window.getComputedStyle(button).backgroundColor;
        gsap.to(button, {
          scale: config.scale,
          boxShadow: `0 0 ${config.shadowBlur}px ${buttonColor.replace(
            ")",
            ", 1)"
          )}`,
          duration: config.duration,
          ease: config.ease,
        });
      };

      const handleMouseDown = () => {
        gsap.to(button, {
          scale: config.pressScale,
          duration: config.pressScaleDuration,
        });
      };

      const handleMouseUp = () => {
        gsap.to(button, {
          scale: config.scale,
          duration: config.releaseScaleDuration,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(button, {
          boxShadow: "none",
          duration: config.duration,
          scale: 1,
          ease: config.ease,
        });
      };

      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mousedown", handleMouseDown);
      button.addEventListener("mouseup", handleMouseUp);
      button.addEventListener("mouseleave", handleMouseLeave);

      // Return cleanup function
      return () => {
        button.removeEventListener("mouseenter", handleMouseEnter);
        button.removeEventListener("mousedown", handleMouseDown);
        button.removeEventListener("mouseup", handleMouseUp);
        button.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
  },
  "btn.3": {
    setup: (button) => {
      const config = getConfig(button, {
        duration: 0.3,
        scale: 1.1,
        ease: "circ.out",
        maxTrailLength: 10,
        trailSize: 3,
      });

      makeInteractive(button);

      // Create and setup canvas
      const canvas = document.createElement("canvas");
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.pointerEvents = "none";
      button.appendChild(canvas);

      const ctx = canvas.getContext("2d");
      let trail = [];
      let isAnimating = false;
      let lastX, lastY;

      function resizeCanvas() {
        canvas.width = button.offsetWidth;
        canvas.height = button.offsetHeight;
      }
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      function drawTrail() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const style = window.getComputedStyle(button);
        const borderRadiusStr = style.borderRadius;

        let [topLeft, topRight, bottomRight, bottomLeft] = borderRadiusStr
          .split(" ")
          .map((v) => parseFloat(v));
        if (isNaN(topRight)) topRight = topLeft;
        if (isNaN(bottomRight)) bottomRight = topLeft;
        if (isNaN(bottomLeft)) bottomLeft = topRight;

        // Create clipping path
        ctx.beginPath();
        ctx.moveTo(topLeft, 0);
        ctx.lineTo(canvas.width - topRight, 0);
        ctx.quadraticCurveTo(canvas.width, 0, canvas.width, topRight);
        ctx.lineTo(canvas.width, canvas.height - bottomRight);
        ctx.quadraticCurveTo(
          canvas.width,
          canvas.height,
          canvas.width - bottomRight,
          canvas.height
        );
        ctx.lineTo(bottomLeft, canvas.height);
        ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - bottomLeft);
        ctx.lineTo(0, topLeft);
        ctx.quadraticCurveTo(0, 0, topLeft, 0);
        ctx.closePath();
        ctx.clip();

        trail.forEach((point, index) => {
          const size = (config.maxTrailLength - index) * config.trailSize;

          if (isFinite(point.x) && isFinite(point.y) && isFinite(size)) {
            const gradient = ctx.createRadialGradient(
              point.x,
              point.y,
              0,
              point.x,
              point.y,
              size
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${point.alpha})`);
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
          }

          point.alpha *= 0.92;
        });

        trail = trail.filter(
          (point) =>
            point.alpha >= 0.01 && isFinite(point.x) && isFinite(point.y)
        );

        if (trail.length > 0) {
          requestAnimationFrame(drawTrail);
        } else {
          isAnimating = false;
        }
      }

      function addPoint(x, y) {
        if (isFinite(x) && isFinite(y)) {
          trail.push({ x, y, alpha: 0.5 });
          if (trail.length > config.maxTrailLength) trail.shift();

          if (!isAnimating) {
            isAnimating = true;
            drawTrail();
          }
        }
      }

      const handleMouseMove = (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        addPoint(x, y);
        lastX = x;
        lastY = y;
      };

      const handleMouseLeave = () => {
        let i = 0;
        const exitInterval = setInterval(() => {
          if (i < 5 && isFinite(lastX) && isFinite(lastY)) {
            addPoint(lastX, lastY);
            i++;
          } else {
            clearInterval(exitInterval);
          }
        }, 32);

        gsap.to(button, {
          scale: 1,
          duration: config.duration,
          ease: config.ease,
        });
      };

      const handleMouseEnter = () => {
        gsap.to(button, {
          scale: config.scale,
          duration: config.duration,
          ease: config.ease,
        });
      };

      button.addEventListener("mousemove", handleMouseMove);
      button.addEventListener("mouseleave", handleMouseLeave);
      button.addEventListener("mouseenter", handleMouseEnter);

      // Return cleanup function
      return () => {
        button.removeEventListener("mousemove", handleMouseMove);
        button.removeEventListener("mouseleave", handleMouseLeave);
        button.removeEventListener("mouseenter", handleMouseEnter);
        window.removeEventListener("resize", resizeCanvas);
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      };
    },
  },
  "btn.4": {
    setup: (button) => {
      const config = getConfig(button, {
        duration: 0.3,
        initialBorderRadius: "50px",
        hoverBorderRadius: "0px",
        scale: 1.1,
        ease: "circ.out",
      });

      makeInteractive(button);

      // Initial setup
      gsap.set(button, {
        borderRadius: config.initialBorderRadius,
      });

      const handleMouseEnter = () => {
        gsap.killTweensOf(button);
        gsap.to(button, {
          duration: config.duration,
          borderRadius: config.hoverBorderRadius,
          scale: config.scale,
          ease: config.ease,
        });
      };

      const handleMouseLeave = () => {
        gsap.killTweensOf(button);
        gsap.to(button, {
          duration: config.duration,
          borderRadius: config.initialBorderRadius,
          scale: 1,
          ease: config.ease,
        });
      };

      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mouseleave", handleMouseLeave);

      // Return cleanup function
      return () => {
        button.removeEventListener("mouseenter", handleMouseEnter);
        button.removeEventListener("mouseleave", handleMouseLeave);
        gsap.killTweensOf(button);
        // Reset to initial state
        gsap.set(button, {
          borderRadius: config.initialBorderRadius,
          scale: 1,
        });
      };
    },
  },
  "btn.5": {
    setup: (button) => {
      const config = getConfig(button, {
        duration: 0.3,
        scale: 1.1,
        paddingMultiplier: 1.5,
        ease: "back.out(4)",
      });

      makeInteractive(button);

      const handleMouseEnter = () => {
        const computedStyle = window.getComputedStyle(button);
        const initialPaddingLeft = parseFloat(computedStyle.paddingLeft);
        const initialPaddingRight = parseFloat(computedStyle.paddingRight);

        gsap.to(button, {
          paddingLeft: initialPaddingLeft * config.paddingMultiplier,
          paddingRight: initialPaddingRight * config.paddingMultiplier,
          scale: config.scale,
          duration: config.duration,
          ease: config.ease,
        });
        button.dataset.initialPaddingLeft = initialPaddingLeft;
        button.dataset.initialPaddingRight = initialPaddingRight;
      };

      const handleMouseLeave = () => {
        const initialPaddingLeft = parseFloat(
          button.dataset.initialPaddingLeft
        );
        const initialPaddingRight = parseFloat(
          button.dataset.initialPaddingRight
        );

        gsap.to(button, {
          paddingLeft: initialPaddingLeft,
          paddingRight: initialPaddingRight,
          scale: 1,
          duration: config.duration,
          ease: config.ease,
        });
      };

      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mouseleave", handleMouseLeave);

      // Return cleanup function
      return () => {
        button.removeEventListener("mouseenter", handleMouseEnter);
        button.removeEventListener("mouseleave", handleMouseLeave);
        delete button.dataset.initialPaddingLeft;
        delete button.dataset.initialPaddingRight;
      };
    },
  },
  "btn.6": {
    setup: (button) => {
      const config = getConfig(button, {
        enterDuration: 0.3,
        leaveDuration: 0.3,
        moveDuration: 0.3,
        enterScale: 1.1,
        moveDivisor: 10,
        enterEase: "power2.out",
        leaveEase: "power2.out",
        moveEase: "power2.out",
      });

      gsap.set(button, { opacity: 1 });

      const handleMouseEnter = (e) => {
        gsap.to(button, {
          scale: config.enterScale,
          duration: config.enterDuration,
          ease: config.enterEase,
        });
      };

      const handleMouseLeave = (e) => {
        gsap.to(button, {
          scale: 1,
          x: 0,
          y: 0,
          duration: config.leaveDuration,
          ease: config.leaveEase,
        });
      };

      const handleMouseMove = (e) => {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const moveX = (e.clientX - centerX) / config.moveDivisor;
        const moveY = (e.clientY - centerY) / config.moveDivisor;

        gsap.to(button, {
          x: moveX,
          y: moveY,
          duration: config.moveDuration,
          ease: config.moveEase,
        });
      };

      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mouseleave", handleMouseLeave);
      button.addEventListener("mousemove", handleMouseMove);

      // Return cleanup function
      return () => {
        button.removeEventListener("mouseenter", handleMouseEnter);
        button.removeEventListener("mouseleave", handleMouseLeave);
        button.removeEventListener("mousemove", handleMouseMove);
        gsap.killTweensOf(button);
        // Reset to initial state
        gsap.set(button, {
          scale: 1,
          x: 0,
          y: 0,
        });
      };
    },
  },
  "btn.7": {
    setup: (button) => {
      const config = getConfig(button, {
        duration: 0.3,
        magneticPullStrength: 0.2,
        ease: "power2.out",
      });

      makeInteractive(button);

      // Create a span wrapper if it doesn't exist
      let text;
      if (!button.querySelector("span")) {
        const textContent = button.textContent;
        button.textContent = ""; // Clear the button
        text = document.createElement("span");
        text.textContent = textContent;
        text.style.display = "inline-block"; // Important for transforms
        text.style.pointerEvents = "none"; // Prevent text from interfering with mouse events
        button.appendChild(text);
      } else {
        text = button.querySelector("span");
        text.style.display = "inline-block";
        text.style.pointerEvents = "none";
      }

      gsap.set(text, { x: 0, y: 0 }); // Ensure initial position

      const handleMouseMove = (event) => {
        const rect = button.getBoundingClientRect();
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;
        const magneticPullX =
          (event.clientX - buttonCenterX) * config.magneticPullStrength;
        const magneticPullY =
          (event.clientY - buttonCenterY) * config.magneticPullStrength;

        gsap.to(text, {
          x: magneticPullX,
          y: magneticPullY,
          duration: config.duration,
          ease: config.ease,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(text, {
          x: 0,
          y: 0,
          duration: config.duration,
          ease: config.ease,
        });
      };

      button.addEventListener("mousemove", handleMouseMove);
      button.addEventListener("mouseleave", handleMouseLeave);

      // Return cleanup function
      return () => {
        button.removeEventListener("mousemove", handleMouseMove);
        button.removeEventListener("mouseleave", handleMouseLeave);
        gsap.set(text, { clearProps: "all" });
      };
    },
  },
  "btn.8": {
    setup: (element) => {
      const config = getConfig(element, {
        enterDuration: 0.2,
        enterEase: "power2.out",
        leaveDuration: 0.2,
        leaveEase: "power2.in",
        underlineBottom: "0",
        underlineHeight: "1px",
        underlineColor: "currentColor",
      });

      makeInteractive(element);

      // Set position relative on the parent element to contain children
      element.style.position = "relative";
      element.style.display = "inline-block"; // Prevent layout shifts

      // Create text span with more strict positioning
      const textSpan = document.createElement("span");
      Object.assign(textSpan.style, {
        position: "relative",
        display: "inline-block",
        color: "inherit",
        width: "100%",
        height: "100%",
        transform: "translateZ(0)", // Force GPU acceleration
        backfaceVisibility: "hidden", // Prevent flickering
      });
      textSpan.innerHTML = element.innerHTML;
      element.innerHTML = "";
      element.appendChild(textSpan);

      // Create underline with more strict positioning
      const underline = document.createElement("div");
      Object.assign(underline.style, {
        position: "absolute",
        bottom: config.underlineBottom,
        left: "0",
        width: "100%",
        height: config.underlineHeight,
        backgroundColor: config.underlineColor,
        transform: "scaleX(0)",
        transformOrigin: "left center",
        pointerEvents: "none",
        backfaceVisibility: "hidden", // Prevent flickering
        willChange: "transform", // Optimize for animations
      });
      textSpan.appendChild(underline);

      const handleMouseEnter = (e) => {
        const itemRect = element.getBoundingClientRect();
        const mouseX = e.clientX;
        const isMouseFromLeft = mouseX < itemRect.left + itemRect.width / 2;

        gsap.set(underline, {
          transformOrigin: isMouseFromLeft ? "left center" : "right center",
        });

        gsap.to(underline, {
          scaleX: 1,
          duration: config.enterDuration,
          ease: config.enterEase,
        });
      };

      const handleMouseLeave = (e) => {
        const itemRect = element.getBoundingClientRect();
        const mouseX = e.clientX;
        const isMouseToRight = mouseX > itemRect.left + itemRect.width / 2;

        gsap.set(underline, {
          transformOrigin: isMouseToRight ? "right center" : "left center",
        });

        gsap.to(underline, {
          scaleX: 0,
          duration: config.leaveDuration,
          ease: config.leaveEase,
        });
      };

      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
        element.innerHTML = textSpan.innerHTML;
      };
    },
  },
};

export const initButtonAnimations = () => {
  const elements = document.querySelectorAll('[data-gsap^="btn."]');

  elements.forEach((element) => {
    const animationType = element.getAttribute("data-gsap");
    const handler = buttonAnimations[animationType];

    if (handler) {
      handler.setup(element);
    }
  });
};

export default buttonAnimations;
