// Initialise AOS animations
AOS.init();

// ----- Carousel logic ----- //
let current = 0;
const images = document.querySelectorAll('.carousel-img');
const interval = 5000;
let autoTimer; 

function showSlide(index) {
    images.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
    current = index;               
}

function nextSlide() {
    const next = (current + 1) % images.length;
    showSlide(next);
}

function prevSlide() {
    const prev = (current - 1 + images.length) % images.length;
    showSlide(prev);
}

// ----- Auto-scroll setup ----- //
function startAutoScroll() {
    stopAutoScroll();
    autoTimer = setInterval(nextSlide, interval);
}

function stopAutoScroll() {
    if (autoTimer) clearInterval(autoTimer);
}

startAutoScroll();

// ----- Pause on Hover ----- //
const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoScroll);
    carouselContainer.addEventListener('mouseleave', startAutoScroll);
}
