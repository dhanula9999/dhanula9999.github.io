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
   STORIES & MEMORIES DATA
===================================================== */

const storiesData = {
    "2026": [
        { url: getStoryUrl("story1.jpg"), caption: "New Year Celebration 2026" },
        { url: getStoryUrl("story2.jpg"), caption: "Trip to Nuwara Eliya" },
        { url: getStoryUrl("story3.jpg"), caption: "Gathering with Friends" },
        { url: getStoryUrl("story4.jpg"), caption: "Special Moment" },
        { url: getStoryUrl("story5.jpg"), caption: "Weekend Vibes" },
        { url: getStoryUrl("story6.jpg"), caption: "Road Trip" },
        { url: getStoryUrl("story7.jpg"), caption: "Evening Sunset" },
        { url: getStoryUrl("story8.jpg"), caption: "Memorable Night" },
        { url: getStoryUrl("story9.jpg"), caption: "Fun Times" },
        { url: getStoryUrl("story10.jpg"), caption: "Chilling Out" }
    ],
    "2025": [
        { url: getPhotoUrl("photo2.jpg"), caption: "Birthday Celebration 2025" },
        { url: getPhotoUrl("photo3.jpg"), caption: "Beach Day" },
        { url: getPhotoUrl("photo4.jpg"), caption: "Catching up with mates" }
    ]
};

let currentYear = "2026";
let currentStoryIndex = 0;

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
        memoryGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: var(--text-secondary);'>No memories added for this year yet.</p>";
        return;
    }

    const itemsToShow = memories.slice(currentStoryIndex, currentStoryIndex + 2);

    itemsToShow.forEach((item, idx) => {
        const card = document.createElement("div");
        card.className = "memory-card fade-in appear";

        const img = document.createElement("img");
        img.src = item.url;
        img.alt = item.caption;
        img.onerror = function() { imageError(this); };

        card.appendChild(img);

        card.addEventListener("click", () => {
            const urls = memories.map(m => m.url);
            openImageModal(urls, currentStoryIndex + idx, item.caption);
        });

        memoryGrid.appendChild(card);
    });
}

function selectStory(year) {
    currentYear = year;
    currentStoryIndex = 0;

    document.querySelectorAll(".story-highlight").forEach(el => el.classList.remove("active"));
    const activeEl = event.currentTarget;
    if (activeEl) activeEl.classList.add("active");

    renderStories();
}

function nextPhoto() {
    const memories = storiesData[currentYear] || [];
    if (currentStoryIndex + 2 < memories.length) {
        currentStoryIndex += 2;
    } else {
        currentStoryIndex = 0;
    }
    renderStories();
}

function prevPhoto() {
    const memories = storiesData[currentYear] || [];
    if (currentStoryIndex - 2 >= 0) {
        currentStoryIndex -= 2;
    } else {
        currentStoryIndex = Math.max(0, memories.length - (memories.length % 2 || 2));
    }
    renderStories();
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
        img.alt = item.caption;

        thumb.appendChild(img);
        thumb.addEventListener("click", () => {
            closeStoryGallery();
            const urls = memories.map(m => m.url);
            openImageModal(urls, index, item.caption);
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
    alert("Add Year functionality allows you to create new archives.");
}

function imageError(img) {
    img.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
}

/* =====================================================
   PHOTOS SECTION (AUTOMATIC SLIDESHOW & INITIAL 6 PHOTOS)
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

let showingAllPhotos = false;
let currentModalImages = [];
let currentModalIndex = 0;
let slideshowInterval = null;
let cardSlideshowInterval = null;

function loadPhotos() {
    const gallery = document.getElementById("gallery");
    const viewMoreBtn = document.getElementById("viewMoreBtn");

    if (!gallery) return;
    
    // කලින් තිබූ card slideshow interval නවත්වන්න
    if (cardSlideshowInterval) clearInterval(cardSlideshowInterval);
    
    gallery.innerHTML = "";

    // Photos 6ක් පමණක් මුලින් පෙන්වීම (View More ක්ලික් කළ විට සියල්ල පෙන්වයි)
    const photosToDisplay = showingAllPhotos ? photoAlbums : photoAlbums.slice(0, 6);

    // Grid එකේ තිබෙන Photos තත්පර 5න් 5ට මාරු කිරීම සඳහා Index එකක් සකස් කිරීම
    let albumIndices = photosToDisplay.map(() => 0);
    let imgElements = [];

    photosToDisplay.forEach((album, cardIndex) => {
        const card = document.createElement("div");
        card.className = "photo-card fade-in appear";

        const imageContainer = document.createElement("div");
        imageContainer.className = "photo-image";

        const img = document.createElement("img");
        img.src = getPhotoUrl(album.images[0]);
        img.alt = album.title;
        img.loading = "lazy";
        
        imgElements.push({ imgElement: img, album: album, cardIndex: cardIndex });

        imageContainer.appendChild(img);

        if (album.images.length > 1) {
            const badge = document.createElement("span");
            badge.className = "album-badge";
            badge.innerText = `+${album.images.length}`;
            imageContainer.appendChild(badge);
        }

        imageContainer.addEventListener("click", () => {
            const fullUrls = album.images.map(imgName => getPhotoUrl(imgName));
            openImageModal(fullUrls, albumIndices[cardIndex], album.title);
        });

        card.appendChild(imageContainer);
        gallery.appendChild(card);
    });

    if (viewMoreBtn) {
        viewMoreBtn.innerText = showingAllPhotos ? "Show Less" : "View More";
    }

    // තත්පර 5න් 5ට Auto Slide වීම (Grid එකේ ඇති සියලුම Photos මාරු වේ)
    cardSlideshowInterval = setInterval(() => {
        imgElements.forEach(item => {
            if (item.album.images.length > 1) {
                albumIndices[item.cardIndex] = (albumIndices[item.cardIndex] + 1) % item.album.images.length;
                item.imgElement.src = getPhotoUrl(item.album.images[albumIndices[item.cardIndex]]);
            }
        });
    }, 5000);

    initScrollObserver();
}

function toggleViewAllPhotos() {
    showingAllPhotos = !showingAllPhotos;
    loadPhotos();
}

/* =====================================================
   LIGHTBOX MODAL & SLIDESHOW FUNCTIONS
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

        startSlideshow();
    }
}

function startSlideshow() {
    stopSlideshow();
    if (currentModalImages.length > 1) {
        slideshowInterval = setInterval(() => {
            nextModalImage();
        }, 5000);
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

function handleContactSubmit(e) {
    e.preventDefault();
    alert("Message sent successfully!");
}

// DOM Fully Loaded
document.addEventListener("DOMContentLoaded", () => {
    renderStories();
    loadPhotos();
});
