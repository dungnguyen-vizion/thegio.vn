export function navigation() {
  const navigate = document.querySelector(".navigate-items-mobile");

  const navButton = document.querySelector(".nav-button");
  navButton.addEventListener("click", () => {
    navButton.classList.toggle("menu-open");

    navigate.classList.toggle("open");
  });
}
