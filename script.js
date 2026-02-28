/* ========================================
   INVITACIÓN DIGITAL – 50 AÑOS
   Script Principal
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initEnvelope();
    initCountdown();
    initScrollReveal();
    initNavigation();
    initCalendarButton();
    initGallery();
    initImageFadeIn();
    // Defer heavy animations until after envelope opens
});

/* =============================================
   ENVELOPE ANIMATION
   ============================================= */
function initEnvelope() {
    const seal = document.getElementById('seal');
    const envelope = document.getElementById('envelope');
    const envelopeScreen = document.getElementById('envelope-screen');
    const invitation = document.getElementById('invitation');
    const navMenu = document.getElementById('nav-menu');
    const musicBtn = document.getElementById('music-toggle');
    let opened = false;

    function openEnvelope() {
        if (opened) return;
        opened = true;

        if (navigator.vibrate) navigator.vibrate(50);
        envelope.classList.add('opening');
        playClickSound();

        // Start "Te Quiero" with fade-in
        MusicPlayer.startMusic();

        setTimeout(() => {
            envelopeScreen.classList.add('opened');

            setTimeout(() => {
                invitation.classList.remove('invitation-hidden');
                invitation.classList.add('invitation-visible');
                navMenu.classList.remove('nav-hidden');
                navMenu.classList.add('nav-visible');
                musicBtn.classList.add('active');

                setTimeout(() => {
                    envelopeScreen.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    triggerHeroAnimations();
                    // Start heavy animations AFTER envelope is gone
                    requestAnimationFrame(() => {
                        initParticles();
                        initPetals();
                    });
                }, 300);
            }, 600);
        }, 1200);
    }

    document.body.style.overflow = 'hidden';

    seal.addEventListener('click', openEnvelope);
    envelope.addEventListener('click', openEnvelope);
    seal.addEventListener('touchend', (e) => { e.preventDefault(); openEnvelope(); });
}

function playClickSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) { }
}

function triggerHeroAnimations() {
    const heroElements = document.querySelectorAll('#hero .reveal, #hero .reveal-delay-1, #hero .reveal-delay-2, #hero .reveal-delay-3, #hero .reveal-delay-4, #hero .reveal-delay-5');
    heroElements.forEach(el => el.classList.add('visible'));
}

/* =============================================
   COUNTDOWN TIMER
   ============================================= */
function initCountdown() {
    const targetDate = new Date('2026-04-11T19:00:00-06:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        updateNumber(daysEl, String(days).padStart(2, '0'));
        updateNumber(hoursEl, String(hours).padStart(2, '0'));
        updateNumber(minutesEl, String(minutes).padStart(2, '0'));
        updateNumber(secondsEl, String(seconds).padStart(2, '0'));
    }

    function updateNumber(el, newValue) {
        if (el.textContent !== newValue) {
            el.classList.add('flip');
            setTimeout(() => {
                el.textContent = newValue;
                el.classList.remove('flip');
            }, 300);
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* =============================================
   PHOTO GALLERY – SWIPEABLE CAROUSEL
   ============================================= */
function initGallery() {
    const track = document.getElementById('gallery-track');
    const slides = document.querySelectorAll('.gallery-slide');
    const dots = document.querySelectorAll('.gallery-dot');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');

    if (!track || slides.length === 0) return;

    let current = 0;
    const total = slides.length;
    let startX = 0;
    let isDragging = false;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let autoplayTimer = null;

    function goToSlide(index) {
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        current = index;
        currentTranslate = -current * 100;
        prevTranslate = currentTranslate;
        track.style.transform = `translateX(${currentTranslate}%)`;

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
        });

        // Update slide active class for zoom effect
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === current);
        });

        resetAutoplay();
    }

    // Button navigation
    prevBtn.addEventListener('click', () => goToSlide(current - 1));
    nextBtn.addEventListener('click', () => goToSlide(current + 1));

    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.index));
        });
    });

    // Touch/Swipe support
    const carousel = document.getElementById('gallery-carousel');

    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        track.style.transition = 'none';
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        const percentDiff = (diff / carousel.offsetWidth) * 100;
        currentTranslate = prevTranslate + percentDiff;
        track.style.transform = `translateX(${currentTranslate}%)`;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        isDragging = false;
        track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        const diff = currentTranslate - prevTranslate;
        const threshold = 20; // Percent threshold

        if (diff < -threshold) {
            goToSlide(current + 1);
        } else if (diff > threshold) {
            goToSlide(current - 1);
        } else {
            goToSlide(current); // Snap back
        }
    });

    // Mouse drag support for desktop
    carousel.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        track.style.transition = 'none';
        carousel.style.cursor = 'grabbing';
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const diff = e.clientX - startX;
        const percentDiff = (diff / carousel.offsetWidth) * 100;
        currentTranslate = prevTranslate + percentDiff;
        track.style.transform = `translateX(${currentTranslate}%)`;
    });

    carousel.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        carousel.style.cursor = 'grab';

        const diff = currentTranslate - prevTranslate;
        if (diff < -15) goToSlide(current + 1);
        else if (diff > 15) goToSlide(current - 1);
        else goToSlide(current);
    });

    carousel.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            goToSlide(current);
        }
    });

    // Autoplay (3 seconds for faster rotation)
    function resetAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
        autoplayTimer = setInterval(() => goToSlide(current + 1), 3000);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToSlide(current - 1);
        if (e.key === 'ArrowRight') goToSlide(current + 1);
    });

    // Initialize
    goToSlide(0);
    carousel.style.cursor = 'grab';
}

/* =============================================
   SCROLL REVEAL ANIMATIONS
   ============================================= */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                const children = entry.target.querySelectorAll('.reveal');
                children.forEach((child, i) => {
                    setTimeout(() => child.classList.add('visible'), i * 100);
                });
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* =============================================
   NAVIGATION
   ============================================= */
function initNavigation() {
    const toggle = document.getElementById('nav-toggle');
    const drawer = document.getElementById('nav-drawer');
    const overlay = document.getElementById('nav-overlay');
    const links = document.querySelectorAll('[data-nav]');

    function openMenu() {
        toggle.classList.add('open');
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        toggle.classList.remove('open');
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = 'auto';
    }

    toggle.addEventListener('click', () => {
        drawer.classList.contains('open') ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeMenu();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}

/* =============================================
   GOLDEN PARTICLES
   ============================================= */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
            this.fadingIn = true;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.fadingIn) {
                this.opacity += this.fadeSpeed;
                if (this.opacity >= 0.6) this.fadingIn = false;
            } else {
                this.opacity -= this.fadeSpeed;
                if (this.opacity <= 0) this.reset();
            }

            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity * 0.15})`;
            ctx.fill();
        }
    }

    // Fewer particles for better performance
    const particleCount = Math.min(25, Math.floor(window.innerWidth / 40));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        animationFrame = requestAnimationFrame(animate);
    }

    animate();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(animationFrame);
        else animate();
    });
}

/* =============================================
   FLOATING PETALS
   ============================================= */
function initPetals() {
    const container = document.getElementById('petals-container');
    if (!container || window.innerWidth < 480) return; // Skip on small phones

    const petalSymbols = ['✿', '❀', '❁', '✾', '✽'];

    function createPetal() {
        const petal = document.createElement('span');
        petal.className = 'petal';
        petal.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
        petal.style.left = Math.random() * 100 + '%';
        petal.style.fontSize = (Math.random() * 12 + 10) + 'px';
        petal.style.animationDuration = (Math.random() * 8 + 6) + 's';
        petal.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(petal);

        setTimeout(() => { if (petal.parentNode) petal.remove(); }, 16000);
    }

    setInterval(createPetal, 3500);
    for (let i = 0; i < 2; i++) setTimeout(createPetal, i * 800);
}

/* =============================================
   CALENDAR BUTTON
   ============================================= */
function initCalendarButton() {
    const btn = document.getElementById('btn-add-calendar');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const event = {
            title: '50 Años - José Renato y María Isabel',
            start: '20260411T190000',
            end: '20260412T010000',
            description: 'Celebración de 50 años de matrimonio. Recepción a las 7:00 PM en el Salón de Eventos Sol y Luna.',
            location: 'Salón de Eventos Sol y Luna'
        };

        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
        window.open(googleUrl, '_blank');
    });
}

/* =============================================
   MUSIC PLAYER – "Te Quiero" José Luis Perales
   with fade-in on envelope open
   ============================================= */
const MusicPlayer = (function initMusic() {
    const btn = document.getElementById('music-toggle');
    const iconOn = document.getElementById('music-icon-on');
    const iconOff = document.getElementById('music-icon-off');
    let isPlaying = false;
    let audio = null;
    let fadeInterval = null;
    const MAX_VOLUME = 0.7;
    const FADE_DURATION = 3000; // 3 seconds fade-in
    const FADE_STEPS = 60;

    function createAudio() {
        if (audio) return audio;
        audio = new Audio('te-quiero.mp3');
        audio.loop = true;
        audio.volume = 0;
        audio.preload = 'auto';
        return audio;
    }

    function fadeIn() {
        if (fadeInterval) clearInterval(fadeInterval);
        const stepTime = FADE_DURATION / FADE_STEPS;
        const volumeStep = MAX_VOLUME / FADE_STEPS;
        let currentStep = 0;

        // Start from 0 volume
        audio.volume = 0;

        fadeInterval = setInterval(() => {
            currentStep++;
            // Use easeInQuad for a smooth, natural volume rise
            const progress = currentStep / FADE_STEPS;
            const easedProgress = progress * progress; // quadratic ease-in
            audio.volume = Math.min(MAX_VOLUME, easedProgress * MAX_VOLUME);

            if (currentStep >= FADE_STEPS) {
                clearInterval(fadeInterval);
                fadeInterval = null;
                audio.volume = MAX_VOLUME;
            }
        }, stepTime);
    }

    function fadeOut(callback) {
        if (fadeInterval) clearInterval(fadeInterval);
        const stepTime = 800 / FADE_STEPS; // faster fade-out (0.8s)
        const startVolume = audio.volume;
        let currentStep = 0;

        fadeInterval = setInterval(() => {
            currentStep++;
            const progress = currentStep / FADE_STEPS;
            audio.volume = Math.max(0, startVolume * (1 - progress));

            if (currentStep >= FADE_STEPS) {
                clearInterval(fadeInterval);
                fadeInterval = null;
                audio.volume = 0;
                if (callback) callback();
            }
        }, stepTime);
    }

    // Start music (called when envelope opens)
    function startMusic() {
        createAudio();
        isPlaying = true;
        btn.classList.add('playing');
        iconOn.style.display = 'block';
        iconOff.style.display = 'none';

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                fadeIn();
            }).catch(() => {
                // Autoplay blocked — will start on first user interaction
                isPlaying = false;
                btn.classList.remove('playing');
                iconOn.style.display = 'block';
                iconOff.style.display = 'none';
            });
        }
    }

    // Toggle button
    btn.addEventListener('click', () => {
        createAudio();

        if (isPlaying) {
            // Pause with fade-out
            fadeOut(() => {
                audio.pause();
            });
            isPlaying = false;
            btn.classList.remove('playing');
            iconOn.style.display = 'none';
            iconOff.style.display = 'block';
        } else {
            // Resume/play with fade-in
            isPlaying = true;
            btn.classList.add('playing');
            iconOn.style.display = 'block';
            iconOff.style.display = 'none';

            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => fadeIn()).catch(() => { });
            }
        }
    });

    return { startMusic };
})();

/* =============================================
   TOUCH RIPPLE EFFECTS
   ============================================= */
(function initTouchEffects() {
    const buttons = document.querySelectorAll('.btn-location, .btn-calendar, .gallery-btn');

    buttons.forEach(btn => {
        btn.addEventListener('touchstart', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute; border-radius: 50%; background: rgba(255,255,255,0.4);
                width: 0; height: 0; left: ${x}px; top: ${y}px;
                transform: translate(-50%, -50%);
                animation: touchRipple 0.6s ease-out forwards; pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    const style = document.createElement('style');
    style.textContent = `@keyframes touchRipple { to { width: 200px; height: 200px; opacity: 0; } }`;
    document.head.appendChild(style);
})();

/* =============================================
   PARALLAX ON SCROLL
   ============================================= */
(function initParallax() {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
                    heroContent.style.opacity = Math.max(0, 1 - scrollY / 600);
                }
                ticking = false;
            });
            ticking = true;
        }
    });
})();

/* =============================================
   CONFETTI ON CELEBRATION
   ============================================= */
(function initCelebrationConfetti() {
    const celebrationSection = document.getElementById('celebration');
    if (!celebrationSection) return;

    let confettiTriggered = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !confettiTriggered) {
                confettiTriggered = true;
                launchConfetti(celebrationSection);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(celebrationSection);

    function launchConfetti(container) {
        const colors = ['#D4AF37', '#E8D48B', '#C9A84C', '#B8960C', '#FFD700', '#E8A87C'];
        const shapes = ['●', '■', '▲', '✦', '★'];

        for (let i = 0; i < 35; i++) {
            setTimeout(() => {
                const confetti = document.createElement('span');
                confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
                const randX = (Math.random() - 0.5) * 200;
                confetti.style.cssText = `
                    position: absolute; top: 15%; left: ${Math.random() * 100}%;
                    font-size: ${Math.random() * 12 + 8}px;
                    color: ${colors[Math.floor(Math.random() * colors.length)]};
                    pointer-events: none; z-index: 10; opacity: 0.8;
                    animation: confettiFall ${Math.random() * 3 + 2}s ease-out forwards;
                `;
                container.appendChild(confetti);
                setTimeout(() => confetti.remove(), 5000);
            }, i * 50);
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            0% { transform: translateY(0) rotate(0deg) scale(0); opacity: 0; }
            10% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
            100% { transform: translateY(400px) rotate(720deg) translateX(${(Math.random() - 0.5) * 200}px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
})();

/* =============================================
   TILT EFFECT ON CARDS
   ============================================= */
(function initTiltEffect() {
    const cards = document.querySelectorAll('.location-card, .gift-card, .photo-frame-border');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            if (e.gamma === null) return;
            const tiltX = Math.max(-10, Math.min(10, e.gamma)) / 10 * 3;
            const tiltY = Math.max(-10, Math.min(10, e.beta - 45)) / 10 * 3;

            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    card.style.transform = `perspective(800px) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`;
                }
            });
        });
    }
})();

/* =============================================
   LAZY LOAD IMAGES WITH FADE-IN
   ============================================= */
(function initImageFadeIn() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.6s ease';

        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });
})();
