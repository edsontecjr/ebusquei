document.addEventListener('DOMContentLoaded', function () {
  // Carrossel
  const carousel = document.querySelector('.carousel');
  const slides = carousel.querySelectorAll('img');
  let currentIndex = 0;

  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.style.display = i === idx ? 'block' : 'none';
    });
  }

  showSlide(currentIndex);

  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }, 4000);
});
