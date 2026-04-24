// Mobile navigation toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// Navbar scroll effect — transparent at top, frosted when scrolled
const navbar = document.getElementById('navbar');

function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a:not(.nav-cta)');

function updateActiveNav() {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === '#' + id) {
                    item.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Slideshows
document.querySelectorAll('.project-slideshow').forEach(slideshow => {
    const track = slideshow.querySelector('.slideshow-track');
    const imgs = Array.from(track.querySelectorAll('img'));
    const dots = Array.from(slideshow.querySelectorAll('.dot'));
    let current = 0;
    let timer;

    function goTo(index) {
        current = (index + imgs.length) % imgs.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => goTo(current + 1), 3500);
    }

    slideshow.querySelector('.slideshow-prev').addEventListener('click', e => {
        e.stopPropagation();
        goTo(current - 1);
        startTimer();
    });

    slideshow.querySelector('.slideshow-next').addEventListener('click', e => {
        e.stopPropagation();
        goTo(current + 1);
        startTimer();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', e => {
            e.stopPropagation();
            goTo(i);
            startTimer();
        });
    });

    startTimer();
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
let lightboxSet = [];
let lightboxIndex = 0;

const lightboxPrev = document.createElement('button');
lightboxPrev.className = 'lightbox-nav lightbox-nav-prev';
lightboxPrev.innerHTML = '&#8249;';
lightboxPrev.setAttribute('aria-label', 'Previous');
lightbox.appendChild(lightboxPrev);

const lightboxNext = document.createElement('button');
lightboxNext.className = 'lightbox-nav lightbox-nav-next';
lightboxNext.innerHTML = '&#8250;';
lightboxNext.setAttribute('aria-label', 'Next');
lightbox.appendChild(lightboxNext);

function openLightbox(images, index) {
    lightboxSet = images;
    lightboxIndex = index;
    lightboxImg.src = images[index].src;
    lightboxImg.alt = images[index].alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    const multi = images.length > 1;
    lightboxPrev.style.display = multi ? '' : 'none';
    lightboxNext.style.display = multi ? '' : 'none';
}

function lightboxGoTo(index) {
    lightboxIndex = (index + lightboxSet.length) % lightboxSet.length;
    lightboxImg.src = lightboxSet[lightboxIndex].src;
    lightboxImg.alt = lightboxSet[lightboxIndex].alt;
}

lightboxPrev.addEventListener('click', e => { e.stopPropagation(); lightboxGoTo(lightboxIndex - 1); });
lightboxNext.addEventListener('click', e => { e.stopPropagation(); lightboxGoTo(lightboxIndex + 1); });

document.querySelectorAll('.clickable-img').forEach(img => {
    img.addEventListener('click', () => {
        const slideshow = img.closest('.project-slideshow');
        if (slideshow) {
            const imgs = Array.from(slideshow.querySelectorAll('.clickable-img'));
            openLightbox(imgs, imgs.indexOf(img));
        } else {
            openLightbox([img], 0);
        }
    });
});

function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
}

lightbox.addEventListener('click', e => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        closeLightbox();
    }
});

document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxGoTo(lightboxIndex - 1);
    if (e.key === 'ArrowRight') lightboxGoTo(lightboxIndex + 1);
});
