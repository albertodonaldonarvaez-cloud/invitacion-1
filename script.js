/* ========================================
   INVITACIÓN DIGITAL – 50 AÑOS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initEnvelope();
    initCountdown();
    initScrollReveal();
    initNavigation();
    initCalendarButton();
    initGallery();
});

/* === ENVELOPE === */
function initEnvelope() {
    const seal = document.getElementById('seal');
    const envelope = document.getElementById('envelope');
    const envelopeScreen = document.getElementById('envelope-screen');
    const invitation = document.getElementById('invitation');
    const navMenu = document.getElementById('nav-menu');
    const musicBtn = document.getElementById('music-toggle');
    const printBtn = document.getElementById('print-btn');
    let opened = false;

    function openEnvelope() {
        if (opened) return;
        opened = true;

        if (navigator.vibrate) navigator.vibrate(50);
        envelope.classList.add('opening');

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
                printBtn.classList.add('active');

                setTimeout(() => {
                    envelopeScreen.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    triggerHeroAnimations();
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

function triggerHeroAnimations() {
    document.querySelectorAll('#hero .reveal, #hero [class*="reveal-delay"]')
        .forEach(el => el.classList.add('visible'));
}

/* === COUNTDOWN === */
function initCountdown() {
    const target = new Date('2026-04-11T19:00:00-06:00').getTime();
    const els = {
        d: document.getElementById('days'),
        h: document.getElementById('hours'),
        m: document.getElementById('minutes'),
        s: document.getElementById('seconds')
    };

    function update() {
        const diff = Math.max(0, target - Date.now());
        const d = Math.floor(diff / 864e5);
        const h = Math.floor((diff % 864e5) / 36e5);
        const m = Math.floor((diff % 36e5) / 6e4);
        const s = Math.floor((diff % 6e4) / 1e3);

        setNum(els.d, d); setNum(els.h, h); setNum(els.m, m); setNum(els.s, s);
    }

    function setNum(el, val) {
        const str = String(val).padStart(2, '0');
        if (el.textContent !== str) {
            el.classList.add('flip');
            setTimeout(() => { el.textContent = str; el.classList.remove('flip'); }, 300);
        }
    }

    update();
    setInterval(update, 1000);
}

/* === GALLERY CAROUSEL === */
function initGallery() {
    const track = document.getElementById('gallery-track');
    const slides = document.querySelectorAll('.gallery-slide');
    const dots = document.querySelectorAll('.gallery-dot');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    if (!track || !slides.length) return;

    let current = 0, startX = 0, isDragging = false, curT = 0, prevT = 0, autoTimer = null;
    const total = slides.length;
    const carousel = document.getElementById('gallery-carousel');

    function go(i) {
        if (i < 0) i = total - 1;
        if (i >= total) i = 0;
        current = i; curT = -i * 100; prevT = curT;
        track.style.transform = `translateX(${curT}%)`;
        dots.forEach((d, j) => d.classList.toggle('active', j === i));
        slides.forEach((s, j) => s.classList.toggle('active', j === i));
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = setInterval(() => go(current + 1), 3000);
    }

    prevBtn.addEventListener('click', () => go(current - 1));
    nextBtn.addEventListener('click', () => go(current + 1));
    dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.index)));

    // Touch swipe
    carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; isDragging = true; track.style.transition = 'none'; }, { passive: true });
    carousel.addEventListener('touchmove', e => { if (!isDragging) return; curT = prevT + ((e.touches[0].clientX - startX) / carousel.offsetWidth) * 100; track.style.transform = `translateX(${curT}%)`; }, { passive: true });
    carousel.addEventListener('touchend', () => { isDragging = false; track.style.transition = 'transform .5s ease'; const d = curT - prevT; d < -20 ? go(current + 1) : d > 20 ? go(current - 1) : go(current); });

    // Mouse drag
    carousel.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; track.style.transition = 'none'; });
    carousel.addEventListener('mousemove', e => { if (!isDragging) return; curT = prevT + ((e.clientX - startX) / carousel.offsetWidth) * 100; track.style.transform = `translateX(${curT}%)`; });
    carousel.addEventListener('mouseup', () => { if (!isDragging) return; isDragging = false; track.style.transition = 'transform .5s ease'; const d = curT - prevT; d < -15 ? go(current + 1) : d > 15 ? go(current - 1) : go(current); });
    carousel.addEventListener('mouseleave', () => { if (isDragging) { isDragging = false; track.style.transition = 'transform .5s ease'; go(current); } });

    go(0);
}

/* === SCROLL REVEAL === */
function initScrollReveal() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                e.target.querySelectorAll('.reveal').forEach((c, i) => setTimeout(() => c.classList.add('visible'), i * 100));
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* === NAVIGATION === */
function initNavigation() {
    const toggle = document.getElementById('nav-toggle');
    const drawer = document.getElementById('nav-drawer');
    const overlay = document.getElementById('nav-overlay');

    function close() { toggle.classList.remove('open'); drawer.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = 'auto'; }
    function open() { toggle.classList.add('open'); drawer.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }

    toggle.addEventListener('click', () => drawer.classList.contains('open') ? close() : open());
    overlay.addEventListener('click', close);

    document.querySelectorAll('[data-nav]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault(); close();
            const t = document.querySelector(link.getAttribute('href'));
            if (t) setTimeout(() => t.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
        });
    });

    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* === PARTICLES === */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [], af;

    function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
    resize();
    addEventListener('resize', resize);

    class P {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
            this.sz = Math.random() * 2.5 + .5; this.sx = (Math.random() - .5) * .3; this.sy = (Math.random() - .5) * .3;
            this.op = Math.random() * .5 + .1; this.fs = Math.random() * .005 + .002; this.fi = true;
        }
        update() {
            this.x += this.sx; this.y += this.sy;
            if (this.fi) { this.op += this.fs; if (this.op >= .6) this.fi = false; }
            else { this.op -= this.fs; if (this.op <= 0) this.reset(); }
            if (this.x < 0) this.x = canvas.width; if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height; if (this.y > canvas.height) this.y = 0;
        }
        draw() {
            ctx.beginPath(); ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212,175,55,${this.op})`; ctx.fill();
            ctx.beginPath(); ctx.arc(this.x, this.y, this.sz * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212,175,55,${this.op * .15})`; ctx.fill();
        }
    }

    const count = Math.min(25, Math.floor(innerWidth / 40));
    for (let i = 0; i < count; i++) particles.push(new P());

    function anim() { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); af = requestAnimationFrame(anim); }
    anim();
    document.addEventListener('visibilitychange', () => { document.hidden ? cancelAnimationFrame(af) : anim(); });
}

/* === PETALS === */
function initPetals() {
    const container = document.getElementById('petals-container');
    if (!container || innerWidth < 480) return;

    const symbols = ['✿', '❀', '❁', '✾', '✽'];

    function create() {
        const p = document.createElement('span');
        p.className = 'petal';
        p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        p.style.left = Math.random() * 100 + '%';
        p.style.fontSize = (Math.random() * 12 + 10) + 'px';
        p.style.animationDuration = (Math.random() * 8 + 6) + 's';
        p.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(p);
        setTimeout(() => { if (p.parentNode) p.remove(); }, 16000);
    }

    setInterval(create, 3500);
    for (let i = 0; i < 2; i++) setTimeout(create, i * 800);
}

/* === CELEBRATION CONFETTI === */
(function initConfetti() {
    const section = document.getElementById('celebration');
    if (!section) return;

    let fired = false;
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !fired) {
            fired = true;
            observer.disconnect();

            const colors = ['#D4AF37', '#E8D48B', '#C9A84C', '#B8960C', '#FFD700'];
            const shapes = ['●', '■', '✦', '★'];
            const count = innerWidth < 600 ? 15 : 25;

            for (let i = 0; i < count; i++) {
                const el = document.createElement('span');
                el.className = 'confetti';
                el.textContent = shapes[i % shapes.length];
                el.style.left = Math.random() * 100 + '%';
                el.style.top = '10%';
                el.style.fontSize = (Math.random() * 10 + 8) + 'px';
                el.style.color = colors[i % colors.length];
                el.style.setProperty('--fall-dur', (Math.random() * 2 + 2) + 's');
                el.style.setProperty('--fall-delay', (i * 0.04) + 's');
                el.style.setProperty('--spin', (Math.random() * 720 + 360) + 'deg');
                el.style.setProperty('--drift', ((Math.random() - 0.5) * 150) + 'px');
                section.appendChild(el);
                el.addEventListener('animationend', () => el.remove(), { once: true });
            }
        }
    }, { threshold: 0.4 });

    observer.observe(section);
})();

/* === CALENDAR === */
function initCalendarButton() {
    const btn = document.getElementById('btn-add-calendar');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('50 Años - José Renato y María Isabel')}&dates=20260411T190000/20260412T010000&details=${encodeURIComponent('Celebración de 50 años de matrimonio. Recepción a las 7:00 PM en el Salón de Eventos Sol y Luna.')}&location=${encodeURIComponent('Salón de Eventos Sol y Luna')}`;
        window.open(url, '_blank');
    });
}

/* === PRINT BUTTON === */
document.getElementById('print-btn').addEventListener('click', () => window.print());

/* === MUSIC PLAYER — "Te Quiero" === */
const MusicPlayer = (() => {
    const btn = document.getElementById('music-toggle');
    const iconOn = document.getElementById('music-icon-on');
    const iconOff = document.getElementById('music-icon-off');
    let playing = false, audio = null, fadeInt = null;
    const STEPS = 80;

    function init() {
        if (audio) return;
        audio = new Audio('te-quiero.mp3');
        audio.loop = true;
        audio.volume = 0;
    }

    function fadeIn() {
        if (fadeInt) clearInterval(fadeInt);
        audio.volume = 0;
        let step = 0;
        fadeInt = setInterval(() => {
            step++;
            const p = step / STEPS;
            audio.volume = Math.min(1, p * p * p); // cubic ease — smooth 5s rise to 100%
            if (step >= STEPS) { clearInterval(fadeInt); fadeInt = null; audio.volume = 1; }
        }, 5000 / STEPS); // 5 seconds total
    }

    function fadeOut(cb) {
        if (fadeInt) clearInterval(fadeInt);
        const start = audio.volume;
        let step = 0;
        fadeInt = setInterval(() => {
            step++;
            audio.volume = Math.max(0, start * (1 - step / STEPS));
            if (step >= STEPS) { clearInterval(fadeInt); fadeInt = null; audio.volume = 0; if (cb) cb(); }
        }, 800 / STEPS);
    }

    function setUI(on) {
        playing = on;
        btn.classList.toggle('playing', on);
        iconOn.style.display = on ? 'block' : 'none';
        iconOff.style.display = on ? 'none' : 'block';
    }

    function startMusic() {
        init();
        setUI(true);
        const p = audio.play();
        if (p) p.then(() => fadeIn()).catch(() => setUI(false));
    }

    btn.addEventListener('click', () => {
        init();
        if (playing) {
            fadeOut(() => audio.pause());
            setUI(false);
        } else {
            setUI(true);
            const p = audio.play();
            if (p) p.then(() => fadeIn()).catch(() => { });
        }
    });

    return { startMusic };
})();
