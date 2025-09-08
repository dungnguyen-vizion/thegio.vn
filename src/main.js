import FlowingWavesBackground from "./waves";
import ScrollPageController from "./scrollPage";
import "./styles/style.css";
import "./styles/scrollsession.css";
import "./styles/navigation.css";
import { navigation } from "./navigation";

navigation();

const wavesBackground = new FlowingWavesBackground("canvas-container");
wavesBackground.init();

// Initialize scroll page functionality when DOM is ready
document.addEventListener("DOMContentLoaded", async function () {
  const scrollController = new ScrollPageController();
  scrollController.init();

  // Initialize displacement effect
  try {
    console.log("Displacement effect initialized successfully");

    // Optional: enable drag functionality
  } catch (error) {
    console.error("Failed to initialize displacement effect:", error);
  }
});
