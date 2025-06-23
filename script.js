// ====== Efek Teks Dinamis di Hero Section ======
const dynamicTextElement = document.getElementById('dynamic-text');
const cursorElement = document.querySelector('.cursor');
const words = ["Programmer", "User Linux", "Marchine Learning", "Anime Lopers", "Game Gacha Hoyovers"]; // Kata-kata yang akan berkedip
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let animationTimeout; // Untuk menyimpan referensi timeout agar bisa dihentikan
let animationRunning = false; // Status apakah animasi sedang berjalan

const typingSpeed = 150; // Kecepatan mengetik
const deletingSpeed = 100; // Kecepatan menghapus
const delayBetweenWords = 1500; // Jeda sebelum mengetik/menghapus kata berikutnya

function typeEffect() {
    if (!animationRunning) return; // Hentikan jika animasi tidak seharusnya berjalan

    const currentWord = words[wordIndex];
    if (isDeleting) {
        charIndex--;
        dynamicTextElement.textContent = currentWord.substring(0, charIndex);
    } else {
        charIndex++;
        dynamicTextElement.textContent = currentWord.substring(0, charIndex);
    }

    let currentTypingSpeed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
        // Selesai mengetik satu kata
        isDeleting = true;
        currentTypingSpeed = delayBetweenWords;
    } else if (isDeleting && charIndex === 0) {
        // Selesai menghapus satu kata
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;

        // Cek jika sudah menyelesaikan satu siklus penuh (kembali ke kata pertama setelah semua kata diproses)
        if (wordIndex === 0 && !isDeleting) { // Tambahan !isDeleting untuk memastikan siklus baru dimulai
            animationRunning = false; // Setel animasi ke tidak berjalan
            clearTimeout(animationTimeout); // Hentikan timeout yang akan datang
            dynamicTextElement.textContent = ''; // Bersihkan teks
            cursorElement.style.opacity = '0'; // Sembunyikan kursor
            return; // Hentikan rekursi setTimeout di sini
        }
        currentTypingSpeed = 500; // Jeda singkat sebelum mengetik kata baru
    }

    animationTimeout = setTimeout(typeEffect, currentTypingSpeed);
}

function startTypeAnimation() {
    // Pastikan tidak ada animasi yang sedang berjalan sebelum memulai yang baru
    if (!animationRunning) {
        animationRunning = true;
        wordIndex = 0; // Reset ke kata pertama
        charIndex = 0;
        isDeleting = false;
        dynamicTextElement.textContent = ''; // Bersihkan teks sebelumnya
        cursorElement.style.opacity = '1'; // Tampilkan kursor
        typeEffect(); // Mulai animasi
    }
}

// ====== Intersection Observer untuk Hero Section ======
const heroSection = document.getElementById('home');

const observerOptions = {
    root: null, // Mengamati viewport
    rootMargin: '0px',
    threshold: 0.5 // Animasi akan dipicu ketika 50% dari hero section terlihat
};

const heroObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Jika Hero Section masuk ke viewport
            startTypeAnimation(); // Panggil fungsi untuk memulai animasi
        } else {
            // Jika Hero Section keluar dari viewport, hentikan animasi yang mungkin masih berjalan
            if (animationRunning) {
                clearTimeout(animationTimeout);
                animationRunning = false;
                dynamicTextElement.textContent = ''; // Bersihkan teks
                cursorElement.style.opacity = '0'; // Sembunyikan kursor
            }
        }
    });
}, observerOptions);

// Mulai mengamati Hero Section
heroObserver.observe(heroSection);


// ====== Efek Scroll Halus (Smooth Scrolling) ======
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - document.querySelector('.navbar').offsetHeight, // Sesuaikan dengan tinggi navbar
                behavior: 'smooth'
            });
        }
    });
});

// ====== Efek Mouse Trail (Titik-titik Bercahaya) ======
const mouseTrailContainer = document.querySelector('.mouse-trail-container');
const colors = [
    'var(--accent-color-green)',
    'var(--accent-color-pink)',
    'var(--accent-color-blue)',
    'var(--accent-color-yellow)'
];

let dotCount = 0;
const maxDots = 30; // Jumlah maksimum dot yang terlihat pada satu waktu

document.addEventListener('mousemove', (e) => {
    // Hanya tambahkan dot jika berada di dalam hero section
    const heroSection = document.getElementById('home');
    const rect = heroSection.getBoundingClientRect();

    // Cek apakah kursor berada di dalam area heroSection
    if (e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom) {

        const dot = document.createElement('div');
        dot.classList.add('mouse-trail-dot');

        // Posisi dot relatif terhadap viewport
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;

        // Pilih warna acak
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        dot.style.backgroundColor = randomColor;

        mouseTrailContainer.appendChild(dot);
        dotCount++;

        // Hapus dot tertua jika jumlahnya melebihi batas
        if (dotCount > maxDots) {
            if (mouseTrailContainer.firstChild) {
                mouseTrailContainer.firstChild.remove();
                dotCount--;
            }
        }

        // Hapus dot setelah animasinya selesai
        dot.addEventListener('animationend', () => {
            if (dot.parentNode === mouseTrailContainer) {
                dot.remove();
                dotCount--;
            }
        });
    }
});

// Tambahan: Smooth scroll untuk tombol "SEE MORE..."
document.querySelector('.see-more-btn').addEventListener('click', function(e) {
    e.preventDefault();
    const targetElement = document.getElementById('about'); // Mengarahkan ke bagian About
    if (targetElement) {
        window.scrollTo({
            top: targetElement.offsetTop - document.querySelector('.navbar').offsetHeight,
            behavior: 'smooth'
        });
    }
});

// Tambahan: Smooth scroll untuk tombol "Contact Me" di navbar
document.querySelector('.contact-btn').addEventListener('click', function(e) {
    e.preventDefault();
    const targetElement = document.getElementById('contact'); // Mengarahkan ke bagian Contact
    if (targetElement) {
        window.scrollTo({
            top: targetElement.offsetTop - document.querySelector('.navbar').offsetHeight,
            behavior: 'smooth'
        });
    }
});