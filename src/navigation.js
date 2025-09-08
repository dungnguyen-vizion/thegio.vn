export function navigation() {
  const navigateContainer = document.getElementById("navigate-container");
  const navigate = document.createElement("div");
  navigate.classList.add("navigate-items");
  navigate.innerHTML = `
        <a href="#">Trang chủ</a>
        <a href="#">Giới thiệu</a>
        <a href="#">Sản phẩm</a>
        <a href="#">Tin tức</a>
        <a href="#">Liên hệ</a>
  `;
  navigateContainer.appendChild(navigate);

  const navButton = document.querySelector(".nav-button");
  navButton.addEventListener("click", () => {
    navButton.classList.toggle("menu-open");

    navigate.classList.toggle("open");
  });
}
