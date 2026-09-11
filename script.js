/* =====================================================
    DHANULA PERSONAL WEBSITE
    OPTIMIZED & UPDATED SCRIPT
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
    MOBILE NAVIGATION TOGGLE & AUTO-CLOSE
===================================================== */

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
        mainNav.classList.toggle('show');
    });

    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('show');
        });
    });
}

/* =====================================================
    STORIES & MEMORIES DATA & RENDERING
===================================================== */

const storiesData = {
    "2026": [
        { url: getStoryUrl("story23.jpg") },
        { url: getStoryUrl("story22.jpg") },
        { url: getStoryUrl("story21.jpg") },
        { url: getStoryUrl("story20.jpg") },
        { url: getStoryUrl("story19.jpg") },
        { url: getStoryUrl("story18.jpg") },
        { url: getStoryUrl("story17.jpg") },
        { url: getStoryUrl("story16.jpg") },
        { url: getStoryUrl("story15.jpg") },
        { url: getStoryUrl("story14.jpg") },
        { url: getStoryUrl("story13.jpg") },
        { url: getStoryUrl("story12.jpg") },
        { url: getStoryUrl("story11.jpg") },
        { url: getStoryUrl("story10.jpg") },
        { url: getStoryUrl("story9.jpg") },
        { url: getStoryUrl("story8.jpg") },
        { url: getStoryUrl("story7.jpg") },
        { url: getStoryUrl("story6.jpg") },
        { url: getStoryUrl("story5.jpg") },
        { url: getStoryUrl("story4.jpg") },
        { url: getStoryUrl("story3.jpg") },
        { url: getStoryUrl("story2.jpg") },
        { url: getStoryUrl("story1.jpg") }
    ],
    "2025": [
        { url: getPhotoUrl("photo4.jpg") },
        { url: getPhotoUrl("photo3.jpg") },
        { url: getPhotoUrl("photo2.jpg") }
    ]
};

let currentYear = "2026";
let currentStoryIndex = 0;
let storyAutoPlayInterval = null;

function renderStories() {
    const memoryGrid = document.getElementById("memoryGrid");
    const selectedTitle = document.getElementById("selectedTitle");
    const memoryCount = document.getElementById("memoryCount");

    if (!memoryGrid) return;

    const memories = storiesData[currentYear] || [];
    
    if (selectedTitle) selectedTitle.innerText = currentYear;
    if (memoryCount) memoryCount.innerText = `${memories.length} memories`;

    memoryGrid.innerHTML = "";

    if (memories.length === 0) {
        memoryGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px;'>No memories added for this year yet.</p>";
        return;
    }

    const itemsToShow = memories.slice(currentStoryIndex, currentStoryIndex + 2);

    if (itemsToShow.length < 2 && memories.length > 1) {
        itemsToShow.push(memories[0]);
    }

    itemsToShow.forEach((item, idx) => {
        const card = document.createElement("div");
        card.className = "memory-card fade-in appear";

        const img = document.createElement("img");
        img.src = item.url;
        img.alt = "Memory Image";
        img.onerror = function() { imageError(this); };

        card.appendChild(img);

        const targetIndex = (currentStoryIndex + idx) % memories.length;

        card.addEventListener("click", () => {
            const urls = memories.map(m => m.url);
            openImageModal(urls, targetIndex);
        });

        memoryGrid.appendChild(card);
    });
}

function startStoryAutoPlay() {
    stopStoryAutoPlay();
    storyAutoPlayInterval = setInterval(() => {
        nextPhotoOneByOne();
    }, 4000);
}

function stopStoryAutoPlay() {
    if (storyAutoPlayInterval) {
        clearInterval(storyAutoPlayInterval);
        storyAutoPlayInterval = null;
    }
}

function nextPhotoOneByOne() {
    const memories = storiesData[currentYear] || [];
    if (memories.length <= 1) return;

    currentStoryIndex = (currentStoryIndex + 1) % memories.length;
    renderStories();
}

function selectStory(year) {
    currentYear = year;
    currentStoryIndex = 0;

    document.querySelectorAll(".story-highlight").forEach(el => el.classList.remove("active"));
    
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add("active");
    }

    renderStories();
    startStoryAutoPlay();
}

function nextPhoto() {
    nextPhotoOneByOne();
    startStoryAutoPlay();
}

function prevPhoto() {
    const memories = storiesData[currentYear] || [];
    if (memories.length === 0) return;

    currentStoryIndex = (currentStoryIndex - 1 + memories.length) % memories.length;
    renderStories();
    startStoryAutoPlay();
}

function openStoryGallery() {
    const modal = document.getElementById("storyGalleryModal");
    const title = document.getElementById("galleryModalTitle");
    const grid = document.getElementById("storyGalleryGrid");
    const memories = storiesData[currentYear] || [];

    if (!modal || !grid) return;

    if (title) title.innerText = `${currentYear} All Memories`;
    grid.innerHTML = "";

    memories.forEach((item, index) => {
        const thumb = document.createElement("div");
        thumb.className = "gallery-thumb";

        const img = document.createElement("img");
        img.src = item.url;
        img.alt = "Gallery Thumbnail";
        img.onerror = function() { imageError(this); };

        thumb.appendChild(img);
        thumb.addEventListener("click", () => {
            closeStoryGallery();
            const urls = memories.map(m => m.url);
            openImageModal(urls, index);
        });

        grid.appendChild(thumb);
    });

    modal.classList.add("show");
}

function closeStoryGallery() {
    const modal = document.getElementById("storyGalleryModal");
    if (modal) modal.classList.remove("show");
}

function showNewStoryMessage() {
    alert("Add Year feature coming soon! You will be able to archive new years.");
}

function imageError(img) {
    img.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
}

/* =====================================================
    PHOTOS GALLERY SECTION (FIXED FIRST COVER IMAGE)
===================================================== */

const photoAlbums = [
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
    },
    {
        title: "Album 33-34",
        cover: "photo33.jpg",
        images: ["photo33.jpg", "photo34.jpg"]
    },
    { title: "Photo 32", cover: "photo32.jpg", images: ["photo32.jpg"] },
    { title: "Photo 31", cover: "photo31.jpg", images: ["photo31.jpg"] },
    { title: "Photo 30", cover: "photo30.jpg", images: ["photo30.jpg"] },
    { title: "Photo 29", cover: "photo29.jpg", images: ["photo29.jpg"] },
    { title: "Photo 28", cover: "photo28.jpg", images: ["photo28.jpg"] },
    { title: "Photo 27", cover: "photo27.jpg", images: ["photo27.jpg"] },
    { title: "Photo 26", cover: "photo26.jpg", images: ["photo26.jpg"] },
    { title: "Photo 25", cover: "photo25.jpg", images: ["photo25.jpg"] },
    { title: "Photo 24", cover: "photo24.jpg", images: ["photo24.jpg"] },
    { title: "Photo 23", cover: "photo23.jpg", images: ["photo23.jpg"] },
    { title: "Photo 22", cover: "photo22.jpg", images: ["photo22.jpg"] },
    { title: "Photo 21", cover: "photo21.jpg", images: ["photo21.jpg"] },
    {
        title: "Special Album",
        cover: "photo7.jpg",
        images: [
            "photo7.jpg", "photo8.jpg", "photo9.jpg", "photo10.jpg",
            "photo11.jpg", "photo12.jpg", "photo13.jpg", "photo14.jpg",
            "photo15.jpg", "photo16.jpg", "photo17.jpg", "photo18.jpg",
            "photo19.jpg", "photo20.jpg"
        ]
    },
    { title: "Photo 6", cover: "photo6.jpg", images: ["photo6.jpg"] },
    { title: "Photo 5", cover: "photo5.jpg", images: ["photo5.jpg"] },
    { title: "Photo 4", cover: "photo4.jpg", images: ["photo4.jpg"] },
    { title: "Photo 3", cover: "photo3.jpg", images: ["photo3.jpg"] },
    { title: "Photo 2", cover: "photo2.jpg", images: ["photo2.jpg"] },
    { title: "Photo 1", cover: "photo1.jpg", images: ["photo1.jpg"] }
];

let showingAllPhotos = false;
let currentModalImages = [];
let currentModalIndex = 0;
let slideshowInterval = null;

function loadPhotos() {
    const gallery = document.getElementById("gallery");
    const viewMoreBtn = document.getElementById("viewMoreBtn");

    if (!gallery) return;
    
    gallery.innerHTML = "";

    const displayCount = showingAllPhotos ? photoAlbums.length : 6;

    for (let i = 0; i < displayCount; i++) {
        const album = photoAlbums[i];

        const card = document.createElement("div");
        card.className = "photo-card fade-in appear";

        const imageContainer = document.createElement("div");
        imageContainer.className = "photo-image";

        const img = document.createElement("img");
        img.src = getPhotoUrl(album.cover);
        img.alt = album.title;
        img.loading = "lazy";
        img.onerror = function() { imageError(this); };

        imageContainer.appendChild(img);

        const badge = document.createElement("span");
        badge.className = "album-badge";
        badge.style.display = album.images.length > 1 ? "block" : "none";
        badge.innerText = `+${album.images.length}`;
        imageContainer.appendChild(badge);

        imageContainer.addEventListener("click", () => {
            const fullUrls = album.images.map(imgName => getPhotoUrl(imgName));
            openImageModal(fullUrls, 0);
        });

        card.appendChild(imageContainer);
        gallery.appendChild(card);
    }

    if (viewMoreBtn) {
        viewMoreBtn.innerText = showingAllPhotos ? "Show Less" : "View More";
    }

    initScrollObserver();
}

function toggleViewAllPhotos() {
    showingAllPhotos = !showingAllPhotos;
    loadPhotos();
}

/* =====================================================
    LIGHTBOX MODAL & SLIDESHOW
===================================================== */

function openImageModal(images, index = 0) {
    currentModalImages = images;
    currentModalIndex = index;

    const modal = document.getElementById("imageModal");
    const fullImg = document.getElementById("fullImage");
    const captionElement = document.getElementById("storyCaption");

    if (captionElement) {
        captionElement.innerText = "";
    }

    if (modal && fullImg) {
        fullImg.src = currentModalImages[currentModalIndex];
        modal.classList.add("show");
        startSlideshow();
    }
}

function startSlideshow() {
    stopSlideshow();
    if (currentModalImages.length > 1) {
        slideshowInterval = setInterval(() => {
            nextModalImage();
        }, 3000);
    }
}

function stopSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

function closeImage() {
    const modal = document.getElementById("imageModal");
    if (modal) modal.classList.remove("show");
    stopSlideshow();
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
    INTERSECTION OBSERVER & FORM HANDLER
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

function handleContactSubmit(e) {
    e.preventDefault();
    alert("Thank you! Your message has been sent successfully.");
    e.target.reset();
}

/* =====================================================
    INITIALIZATION & KEYBOARD CONTROLS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    renderStories();
    startStoryAutoPlay();
    loadPhotos();
    initScrollObserver();

    document.addEventListener("keydown", (e) => {
        const imageModal = document.getElementById("imageModal");
        const isModalOpen = imageModal && imageModal.classList.contains("show");

        if (e.key === "Escape") {
            closeImage();
            closeStoryGallery();
        } else if (e.key === "ArrowRight" && isModalOpen) {
            nextModalImage();
            startSlideshow();
        } else if (e.key === "ArrowLeft" && isModalOpen) {
            prevModalImage();
            startSlideshow();
        }
    });
});
