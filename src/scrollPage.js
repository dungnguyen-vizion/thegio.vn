// Simple SplitText alternative for free use

import gsap from "gsap";
import { Observer } from "gsap/Observer";

class SimpleSplitText {
  constructor(element, options = {}) {
    this.element =
      typeof element === "string" ? document.querySelector(element) : element;
    this.options = { type: "chars", ...options };
    this.chars = [];
    this.words = [];
    this.lines = [];

    if (this.element) {
      this.split();
    }
  }

  split() {
    const text = this.element.textContent;
    this.element.innerHTML = "";

    if (this.options.type.includes("chars")) {
      const chars = text.split("");
      chars.forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char; // Use non-breaking space
        span.style.display = "inline-block";
        this.element.appendChild(span);
        this.chars.push(span);
      });
    }
  }
}

class ScrollPageController {
  constructor() {
    this.sections = null;
    this.images = null;
    this.headings = null;
    this.outerWrappers = null;
    this.innerWrappers = null;
    this.splitHeadings = null;
    this.currentIndex = -1;
    this.wrap = null;
    this.animating = false;
    this.observer = null;
  }

  init() {
    // Check if GSAP is loaded
    if (typeof gsap === "undefined") {
      console.error("GSAP is not loaded");
      return false;
    }

    // Register the Observer plugin
    gsap.registerPlugin(Observer);

    this.sections = document.querySelectorAll("section");
    this.images = document.querySelectorAll(".bg");
    this.headings = gsap.utils.toArray(".section-heading");
    this.outerWrappers = gsap.utils.toArray(".outer");
    this.innerWrappers = gsap.utils.toArray(".inner");

    // Check if we have the required elements
    if (this.sections.length === 0) {
      console.error("No sections found");
      return false;
    }

    if (this.headings.length === 0) {
      console.error("No headings found");
      return false;
    }

    this.splitHeadings = this.headings.map(
      (heading) =>
        new SimpleSplitText(heading, {
          type: "chars,words,lines",
          linesClass: "clip-text",
        })
    );

    this.wrap = gsap.utils.wrap(0, this.sections.length);

    gsap.set(this.outerWrappers, { yPercent: 100 });
    gsap.set(this.innerWrappers, { yPercent: -100 });

    this.setupObserver();
    this.gotoSection(0, 1);

    return true;
  }

  gotoSection(index, direction) {
    index = this.wrap(index); // make sure it's valid
    this.animating = true;
    let fromTop = direction === -1,
      dFactor = fromTop ? -1 : 1,
      tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power1.inOut" },
        onComplete: () => (this.animating = false),
      });

    if (this.currentIndex >= 0) {
      // The first time this function runs, current is -1
      gsap.set(this.sections[this.currentIndex], { zIndex: 0 });
      tl.to(this.images[this.currentIndex], { yPercent: -15 * dFactor }).set(
        this.sections[this.currentIndex],
        { autoAlpha: 0 }
      );
    }

    gsap.set(this.sections[index], { autoAlpha: 1, zIndex: 1 });
    tl.fromTo(
      [this.outerWrappers[index], this.innerWrappers[index]],
      {
        yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor),
      },
      {
        yPercent: 0,
      },
      0
    )
      .fromTo(
        this.images[index],
        { yPercent: 15 * dFactor },
        { yPercent: 0 },
        0
      )
      .fromTo(
        this.splitHeadings[index].chars,
        {
          autoAlpha: 0,
          yPercent: 150 * dFactor,
        },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1,
          ease: "power2",
          stagger: {
            each: 0.02,
            from: "random",
          },
        },
        0.2
      );

    this.currentIndex = index;
  }

  setupObserver() {
    this.observer = Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () =>
        !this.animating && this.gotoSection(this.currentIndex - 1, -1),
      onUp: () => !this.animating && this.gotoSection(this.currentIndex + 1, 1),
      tolerance: 10,
      preventDefault: true,
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.kill();
    }
  }
}

export default ScrollPageController;
export { SimpleSplitText };

// original: https://codepen.io/BrianCross/pen/PoWapLP
// horizontal version: https://codepen.io/GreenSock/pen/xxWdeMK
