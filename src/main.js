import FlowingWavesBackground from "./waves";
import ScrollPageController from "./scrollPage";
import DisplacementEffect from "./displacement";
import "./style.css";
import "./scrollsession.css";

const wavesBackground = new FlowingWavesBackground("canvas-container");
wavesBackground.init();

const displacementEffect = new DisplacementEffect("#canvas", {
  width: 1920,
  height: 1080,
});

// Initialize scroll page functionality when DOM is ready
document.addEventListener("DOMContentLoaded", async function () {
  const scrollController = new ScrollPageController();
  scrollController.init();

  // Initialize displacement effect
  try {
    await displacementEffect.init();
    console.log("Displacement effect initialized successfully");

    // Optional: enable drag functionality
    displacementEffect.enableDrag();
  } catch (error) {
    console.error("Failed to initialize displacement effect:", error);
  }
});
