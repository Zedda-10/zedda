document.getElementById("year").textContent = new Date().getFullYear();

const navLinks = document.querySelectorAll('.main-nav a');

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});
