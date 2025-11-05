document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("main-content");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    toggleBtn.classList.toggle("active");
    mainContent.classList.toggle("shifted");
  });
});
