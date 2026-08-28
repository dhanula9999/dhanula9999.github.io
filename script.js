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
   PHOTOS SECTION (INDIVIDUAL & ALBUM COLLECTIONS)
===================================================== */

const photoAlbums = [
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
    // photo28.jpg මෙතැනින් ඇතුළත් කරන ලදී:
    { title: "Photo 28", cover: "photo28.jpg", images: ["photo28.jpg"] }
];

function loadPhotos() {
    const gallery = document.getElementById("gallery");
    const loading = document.getElementById("photoLoading");
    const errorBox = document.getElementById("photoError");

    gallery.innerHTML = "";
    if (loading) loading.style.display = "block";
    if (errorBox) errorBox.style.display = "none";

    const allGalleryCovers = photoAlbums.map(album => getPhotoUrl(album.cover));

    photoAlbums.forEach((album, index) => {
        const card = document.createElement("div");
        card.className = "photo-card";

        const imageContainer = document.createElement("div");
        imageContainer.className = "photo-image";

        const img = document.createElement("img");
        img.src = getPhotoUrl(album.cover);
        img.alt = album.title;
        img.loading = "lazy";

        if (album.images.length > 1) {
            const badge = document.createElement("div");
            badge.className = "album-badge";
            badge.innerText = `+${album.images.length - 1} photos`;
            imageContainer.appendChild(badge);
        }

        img.onclick = function () {
            if (album.images.length > 1) {
                const albumUrls = album.images.map(f => getPhotoUrl(f));
                openImageSlider(albumUrls, 0);
            } else {
                openImageSlider(allGalleryCovers, index);
            }
        };

        img.onerror = function () {
            console.error("Failed to load photo:", this.src);
        };

        imageContainer.appendChild(img);
        card.appendChild(imageContainer);
        gallery.appendChild(card);
    });

    if (loading) loading.style.display = "none";
}

/* =====================================================
   STORIES SECTION
===================================================== */

const storyData = {
    "2026": [
        "story1.jpg",
        "story2.jpg",
        "story3.jpg",
        "story4.jpg",
        "story5.jpg",
        "story6.jpg",
        "story7.jpg",
        "story8.jpg",
        "story9.jpg",
        "story10.jpg"
    ],
    "2025": []
};

let currentYear = "2026";
let currentPhotoIndex = 0;
let autoSlideTimer = null;

function selectStory(year) {
    currentYear = year;
    currentPhotoIndex = 0;

    document.querySelectorAll(".story-highlight").forEach((item) => {
        item.classList.remove("active");
    });

    const selected = document.querySelector(`.story-highlight[onclick="selectStory('${year}')"]`);
    if (selected) {
        selected.classList.add("active");
    }

    document.getElementById("selectedTitle").textContent = year;

    renderStory();
    resetAutoSlide();
}

function renderStory() {
    const grid = document.getElementById("memoryGrid");
    const images = storyData[currentYear] || [];

    grid.innerHTML = "";

    document.getElementById("memoryCount").textContent =
        `${images.length} ${images.length === 1 ? "memory" : "memories"}`;

    if (images.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:60px; color:var(--text-secondary);">
                No memories available for ${currentYear}.
            </div>
        `;
        return;
    }

    const first = currentPhotoIndex % images.length;
    const second = (currentPhotoIndex + 1) % images.length;
    const indexes = images.length === 1 ? [first] : [first, second];

    indexes.forEach((index) => {
        const fileName = images[index];

        const card = document.createElement("div");
        card.className = "memory-card";

        const img = document.createElement("img");
        img.src = getStoryUrl(fileName);
        img.alt = `${currentYear} memory`;
        img.loading = "lazy";

        img.onclick = function () {
            const storyUrls = images.map(f => getStoryUrl(f));
            openImageSlider(storyUrls, index);
        };

        img.onerror = function () {
            this.style.display = "none";
        };

        card.appendChild(img);
        grid.appendChild(card);
    });
}

function nextPhoto() {
    const images = storyData[currentYear] || [];
    if (images.length <= 1) return;

    currentPhotoIndex = (currentPhotoIndex + 1) % images.length;
    renderStory();
    resetAutoSlide();
}

function prevPhoto() {
    const images = storyData[currentYear] || [];
    if (images.length <= 1) return;

    currentPhotoIndex = (currentPhotoIndex - 1 + images.length) % images.length;
    renderStory();
    resetAutoSlide();
}

function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
        const images = storyData[currentYear] || [];
        if (images.length > 1) {
            currentPhotoIndex = (currentPhotoIndex + 1) % images.length;
            renderStory();
        }
    }, 5000); // 5 Seconds
}

function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
}

/* =====================================================
   VIEW ALL STORIES GALLERY MODAL
===================================================== */

function openStoryGallery() {
    const modal = document.getElementById("storyGalleryModal");
    const grid = document.getElementById("storyGalleryGrid");
    const title = document.getElementById("galleryModalTitle");
    const images = storyData[currentYear] || [];

    title.textContent = `${currentYear} - All Memories`;
    grid.innerHTML = "";

    if (images.length === 0) {
        grid.innerHTML = `<p style="color:var(--text-secondary); text-align:center; grid-column:1/-1;">No memories found.</p>`;
    } else {
        images.forEach((fileName, index) => {
            const thumb = document.createElement("div");
            thumb.className = "gallery-thumb";

            const img = document.createElement("img");
            img.src = getStoryUrl(fileName);
            img.alt = `${currentYear} memory ${index + 1}`;

            thumb.onclick = function () {
                const storyUrls = images.map(f => getStoryUrl(f));
                openImageSlider(storyUrls, index);
            };

            thumb.appendChild(img);
            grid.appendChild(thumb);
        });
    }

    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeStoryGallery() {
    const modal = document.getElementById("storyGalleryModal");
    modal.classList.remove("show");
    document.body.style.overflow = "";
}

/* =====================================================
   LIGHTBOX IMAGE SLIDER
===================================================== */

let currentSliderList = [];
let currentSliderIndex = 0;

function openImageSlider(imageList, startIndex) {
    currentSliderList = imageList;
    currentSliderIndex = startIndex;

    const modal = document.getElementById("imageModal");
    updateModalImage();
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function updateModalImage() {
    const fullImage = document.getElementById("fullImage");
    fullImage.style.display = "block";
    fullImage.src = currentSliderList[currentSliderIndex];

    fullImage.onerror = function() {
        console.warn("Image load error for: " + this.src);
    };
}

function nextModalImage() {
    if (currentSliderList.length === 0) return;
    currentSliderIndex = (currentSliderIndex + 1) % currentSliderList.length;
    updateModalImage();
}

function prevModalImage() {
    if (currentSliderList.length === 0) return;
    currentSliderIndex = (currentSliderIndex - 1 + currentSliderList.length) % currentSliderList.length;
    updateModalImage();
}

function closeImage() {
    const modal = document.getElementById("imageModal");
    modal.classList.remove("show");
    if (!document.getElementById("storyGalleryModal").classList.contains("show")) {
        document.body.style.overflow = "";
    }
}

document.getElementById("imageModal").addEventListener("click", function(event) {
    if (event.target === this) {
        closeImage();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeImage();
        closeStoryGallery();
    } else if (event.key === "ArrowRight") {
        nextModalImage();
    } else if (event.key === "ArrowLeft") {
        prevModalImage();
    }
});

/* =====================================================
   OTHER HANDLERS & INITIALIZATION
===================================================== */

function handleContactSubmit(event) {
    event.preventDefault();
    alert("Thank you for your message! I will get back to you soon.");
    event.target.reset();
}

function showNewStoryMessage() {
    alert("You can add a new year and its photos to the Stories section.");
}

function imageError(image) {
    image.style.display = "none";
}

const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

if (navToggle && mainNav) {
    navToggle.addEventListener("click", function() {
        mainNav.classList.toggle("show");
    });

    document.querySelectorAll("#mainNav a").forEach((link) => {
        link.addEventListener("click", function() {
            mainNav.classList.remove("show");
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    loadPhotos();
    renderStory();
    startAutoSlide();
});
