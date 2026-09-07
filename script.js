/* =====================================================
   DHANULA PERSONAL WEBSITE
   SUPABASE STORAGE CONFIGURATION
===================================================== */

const SUPABASE_URL = "https://widutbgygnamjlkaovrk.supabase.co";

function getPhotoUrl(fileName) {
    return `${SUPABASE_URL}/storage/v1/object/public/photos/${fileName}`;
}

function getStoryUrl(fileName) {
    return `${SUPABASE_URL}/storage/v1/object/public/stories/${fileName}`;
}

/* =====================================================
   DARK / LIGHT MODE SYSTEM
===================================================== */

const themeToggleBtn = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

document.documentElement.setAttribute('data-theme', savedTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        let currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/* =====================================================
   MOBILE NAVIGATION TOGGLE
===================================================== */

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
        mainNav.classList.toggle('show');
    });
}

/* =====================================================
   PHOTOS SECTION (INDIVIDUAL & ALBUM COLLECTIONS)
===================================================== */

const photoAlbums = [
    { title: "Photo 29", cover: "photo29.jpg", images: ["photo29.jpg"] },
    { title: "Photo 1", cover: "photo1.jpg", images: ["photo1.jpg"] },
    { title: "Photo 2", cover: "photo2.jpg", images: ["photo2.jpg"] },
    { title: "Photo 3", cover: "photo3.jpg", images: ["photo3.jpg"] },
    { title: "Photo 4", cover: "photo4.jpg", images: ["photo4.jpg"] },
    { title: "Photo 5", cover: "photo5.jpg", images: ["photo5.jpg"] },
    { title: "Photo 22", cover: "photo22.jpg", images: ["photo22.jpg"] },
    { title: "Photo 6", cover: "photo6.jpg", images: ["photo6.jpg"] },
    {
        title: "Special Album",
        cover: "photo7.jpg",
        images: [
            "photo7.jpg",  "photo8.jpg",  "photo9.jpg",  "photo10.jpg",
            "photo11.jpg", "photo12.jpg", "photo13.jpg", "photo14.jpg",
            "photo15.jpg", "photo16.jpg", "photo17.jpg", "photo18.jpg",
            "photo19.jpg", "photo20.jpg"
        ]
    },
    { title: "Photo 21", cover: "photo21.jpg", images: ["photo21.jpg"] },
    { title: "Photo 23", cover: "photo23.jpg", images: ["photo23.jpg"] },
    { title: "Photo 24", cover: "photo24.jpg", images: ["photo24.jpg"] },
    { title: "Photo 25", cover: "photo25.jpg", images: ["photo25.jpg"] },
    { title: "Photo 26", cover: "photo26.jpg", images: ["photo26.jpg"] },
    { title: "Photo 27", cover: "photo27.jpg", images: ["photo27.jpg"] },
    { title: "Photo 28", cover: "photo28.jpg", images: ["photo28.jpg"] },
    { title: "Photo 30", cover: "photo30.jpg", images: ["photo30.jpg"] },
    { title: "Photo 31", cover: "photo31.jpg", images: ["photo31.jpg"] },
    { title: "Photo 32", cover: "photo32.jpg", images: ["photo32.jpg"] },
    {
        title: "Album 33-34",
        cover: "photo33.jpg",
        images: ["photo33.jpg", "photo34.jpg"]
    },
    {
        title: "Album 35-51",
        cover: "photo35.jpg",
        images: [
            "photo35.jpg", "photo36.jpg", "photo37.jpg", "photo38.jpg",
            "photo39.jpg", "photo40.jpg", "photo41.jpg", "photo42.jpg",
            "photo43.jpg", "photo44.jpg", "photo45.jpg", "photo46.jpg",
            "photo47.jpg", "photo48.jpg", "photo49.jpg", "photo50.jpg",
            "photo51.jpg"
        ]
    }
];

let currentModalImages = [];
let currentModalIndex = 0;

function loadPhotos() {
    const gallery = document.getElementById("gallery");
    const loading = document.getElementById("photoLoading");
    const errorBox = document.getElementById("photoError");

    if (!gallery) return;

    gallery.innerHTML = "";
    if (loading) loading.style.display = "none";
    if (errorBox) errorBox.style.display = "none";

    photoAlbums.forEach((album) => {
        const card = document.createElement("div");
        card.className = "photo-card fade-in";

        const imageContainer = document.createElement("div");
        imageContainer.className = "photo-image";

        const img = document.createElement("img");
        img.src = getPhotoUrl(album.cover);
        img.alt = album.title;
        img.loading = "lazy";

        imageContainer.appendChild(img);

        // Album Badge එකක් එකතු කිරීම
        if (album.images.length > 1) {
            const badge = document.createElement("span");
            badge.className = "album-badge";
            badge.innerText = `+${album.images.length}`;
            imageContainer.appendChild(badge);
        }

        imageContainer.addEventListener("click", () => {
            const fullUrls = album.images.map(imgName => getPhotoUrl(imgName));
            openImageModal(fullUrls, 0, album.title);
        });

        card.appendChild(imageContainer);
        gallery.appendChild(card);
    });

    initScrollObserver();
}

/* =====================================================
   LIGHTBOX MODAL FUNCTIONS
===================================================== */

function openImageModal(images, index = 0, caption = "") {
    currentModalImages = images;
    currentModalIndex = index;

    const modal = document.getElementById("imageModal");
    const fullImg = document.getElementById("fullImage");
    const captionElement = document.getElementById("storyCaption");

    if (modal && fullImg) {
        fullImg.src = currentModalImages[currentModalIndex];
        if (captionElement) captionElement.innerText = caption;
        modal.classList.add("show");
    }
}

function closeImage() {
    const modal = document.getElementById("imageModal");
    if (modal) modal.classList.remove("show");
}

function nextModalImage() {
    if (currentModalImages.length <= 1) return;
    currentModalIndex = (currentModalIndex + 1) % currentModalImages.length;
    document.getElementById("fullImage").src = currentModalImages[currentModalIndex];
}

function prevModalImage() {
    if (currentModalImages.length <= 1) return;
    currentModalIndex = (currentModalIndex - 1 + currentModalImages.length) % currentModalImages.length;
    document.getElementById("fullImage").src = currentModalImages[currentModalIndex];
}

/* =====================================================
   SCROLL FADE-IN ANIMATION OBSERVER
===================================================== */

function initScrollObserver() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
}

// Page එක Load වෙද්දී Photos Load කිරීම
document.addEventListener("DOMContentLoaded", () => {
    loadPhotos();
});
