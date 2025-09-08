import * as PIXI from "pixi.js";
import { gsap } from "gsap";

class DisplacementEffect {
  constructor(canvasSelector = "#canvas", options = {}) {
    this.canvasElement =
      typeof canvasSelector === "string"
        ? document.querySelector(canvasSelector)
        : canvasSelector;

    this.options = {
      baseUrl: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/106114/",
      displacementMapUrl: "displacementmap2.png?v=1",
      backgroundImageUrl: "public/wave.png",
      animationDuration: 5,
      ...options,
    };

    this.app = null;
    this.container = null;
    this.displacementSprite = null;
    this.displacementFilter = null;
    this.background = null;
    this.isInitialized = false;
  }

  async init() {
    try {
      // Check if canvas element exists
      if (!this.canvasElement) {
        console.error("Canvas element not found");
        throw new Error("Canvas element not found");
      }

      // Check if PIXI is loaded
      if (typeof PIXI === "undefined") {
        console.error("PIXI.js is not loaded");
        throw new Error("PIXI.js is not loaded");
      }

      // Check if GSAP is loaded
      if (typeof gsap === "undefined") {
        console.error("GSAP is not loaded");
        throw new Error("GSAP is not loaded");
      }

      // Create PIXI application (v8 syntax)
      this.app = new PIXI.Application();
      await this.app.init({
        canvas: this.canvasElement,
        width: this.options.width,
        height: this.options.height,
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
        antialias: true,
      });

      // Load assets using PIXI.Assets (v8 syntax)
      const displacementMapUrl =
        this.options.baseUrl + this.options.displacementMapUrl;
      const backgroundImageUrl = this.options.backgroundImageUrl;

      const [displacementTexture, backgroundTexture] = await Promise.all([
        PIXI.Assets.load(displacementMapUrl),
        PIXI.Assets.load(backgroundImageUrl),
      ]);

      this.setupScene(displacementTexture, backgroundTexture);
      this.isInitialized = true;
      return this;
    } catch (error) {
      console.error("Error initializing displacement effect:", error);
      throw error;
    }
  }

  setupScene(displacementTexture, backgroundTexture) {
    // Create container
    this.container = new PIXI.Container();

    // Create background sprite
    this.background = new PIXI.Sprite(backgroundTexture);

    // Create displacement sprite and filter
    this.displacementSprite = new PIXI.Sprite(displacementTexture);
    this.displacementFilter = new PIXI.DisplacementFilter({
      sprite: this.displacementSprite,
      scale: 20,
    });

    // Configure container
    this.container.filterArea = new PIXI.Rectangle(
      0,
      0,
      this.options.width - 20,
      this.options.height - 20
    );
    this.container.filters = [this.displacementFilter];

    // Set texture wrap mode
    displacementTexture.source.addressMode = "repeat";

    // Position and add children
    this.container.position.set(-10);
    this.container.addChild(this.background);
    this.container.addChild(this.displacementSprite);
    this.app.stage.addChild(this.container);

    // Start animation
    this.startAnimation();
  }

  startAnimation() {
    // Use GSAP for animation
    gsap.to(this.displacementSprite, {
      duration: this.options.animationDuration,
      ease: "none",
      repeat: -1,
      x: 512,
      y: 512,
    });
  }

  // Enable drag functionality
  enableDrag() {
    if (!this.container) return;

    this.container.eventMode = "static";
    this.container.cursor = "pointer";
    this.container
      .on("pointerdown", this.onDragStart.bind(this))
      .on("pointermove", this.onDragMove.bind(this))
      .on("pointerup", this.onDragEnd.bind(this))
      .on("pointerupoutside", this.onDragEnd.bind(this));
  }

  onDragStart(event) {
    this.data = event.data;
    this.lastPosition = this.data.getLocalPosition(this.container.parent);
  }

  onDragMove() {
    if (this.lastPosition && this.data) {
      var newPosition = this.data.getLocalPosition(this.container.parent);
      this.container.position.x += newPosition.x - this.lastPosition.x;
      this.container.position.y += newPosition.y - this.lastPosition.y;
      this.lastPosition = newPosition;
    }
  }

  onDragEnd() {
    this.data = null;
    this.lastPosition = null;
  }

  // Update canvas size
  resize(width, height) {
    if (this.app) {
      this.app.renderer.resize(width, height);
      this.options.width = width;
      this.options.height = height;

      if (this.container) {
        this.container.filterArea = new PIXI.Rectangle(
          0,
          0,
          width - 20,
          height - 20
        );
      }
    }
  }

  // Destroy the effect
  destroy() {
    if (this.app) {
      this.app.destroy(true);
      this.app = null;
    }
    this.isInitialized = false;
  }

  // Pause/resume animation
  pause() {
    gsap.globalTimeline.pause();
  }

  resume() {
    gsap.globalTimeline.resume();
  }
}

export default DisplacementEffect;
