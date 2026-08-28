/* =====================================================
   STORY DATA BY YEAR
===================================================== */

const stories = {
    "2026": {
        title: "2026",
        photos: [
            { image: "stories/story1.jpg" },
            { image: "stories/story2.jpg" }
        ]
    },
    "2025": {
        title: "2025",
        photos: [] // 2025 සඳහා පසුව පින්තූර එකතු කළ හැක
    }
};


/* =====================================================
   SMOOTH SCROLL - NO NEW TAB
===================================================== */

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            const targetId = this.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const mainNav = document.getElementById('mainNav');
                const navToggle = document.getElementById('navToggle');
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
                }

                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}


/* =====================================================
   IMAGE ERROR HANDLER
===================================================== */

function handleImageError(img) {
    img.onerror = null;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTBlMGUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
    img.style.objectFit = 'contain';
}


/* =====================================================
   SELECT STORY BY YEAR (Show all images for that year)
===================================================== */

function selectStory(year) {
    const story = stories[year];
    if (!story) return;

    // Highlights වල Active state එක මාරු කිරීම
    const highlights = document.querySelectorAll(".story-highlight");
    highlights.forEach(function(item) {
        item.classList.remove("active");
    });

    const selected = document.querySelector(`.story-highlight[data-story="${year}"]`);
    if (selected) {
        selected.classList.add("active");
    }

    // Header එක Update කිරීම
    const selectedTitle = document.getElementById("selectedTitle");
    selectedTitle.textContent = story.title;

    const memoryCount = document.getElementById("memoryCount");
    const total = story.photos.length;
    memoryCount.textContent = total + (total === 1 ? " memory" : " memories");

    // එම Year එකට අදාළ සියලුම Photos එකවර Grid එකේ පෙන්වීම
    const memoryGrid = document.getElementById("memoryGrid");
    memoryGrid.innerHTML = "";

    if (total === 0) {
        memoryGrid.innerHTML = `<p style="grid-column: 1/-1; color: #777;">No memories added for ${year} yet.</p>`;
        return;
    }

    story.photos.forEach(function(photo) {
        const card = document.createElement("div");
        card.className = "memory-card";
        card.innerHTML = `
            <img src="${photo.image}" alt="${story.title}" loading="lazy" onerror="handleImageError(this)" onclick="openImage('${photo.image}')">
        `;
        memoryGrid.appendChild(card);
    });
}


/* =====================================================
   NEW STORY BUTTON
===================================================== */

function showNewStoryMessage() {
    console.log("New Story feature coming soon!");
}


/* =====================================================
   IMAGE VIEWER (FULLSCREEN)
===================================================== */

function openImage(imageSource) {
    const modal = document.getElementById("imageModal");
    const fullImage = document.getElementById("fullImage");
    fullImage.src = imageSource;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}


/* =====================================================
   CLOSE IMAGE VIEWER
===================================================== */

function closeImage() {
    const modal = document.getElementById("imageModal");
    const fullImage = document.getElementById("fullImage");
    modal.style.display = "none";
    fullImage.src = "";
    document.body.style.overflow = "";
}


/* =====================================================
   CLOSE WHEN CLICKING OUTSIDE IMAGE
===================================================== */

document.getElementById("imageModal").addEventListener("click", function(event) {
    if (event.target === this) {
        closeImage();
    }
});


/* =====================================================
   ESC KEY TO CLOSE
===================================================== */

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeImage();
    }
});


/* =====================================================
   HAMBURGER MENU TOGGLE
===================================================== */

function initMobileNav() {
    const navToggle = document.getElementById("navToggle");
    const mainNav = document.getElementById("mainNav");

    if (!navToggle || !mainNav) return;

    navToggle.addEventListener("click", function() {
        const isOpen = mainNav.classList.toggle("active");
        navToggle.setAttribute("aria-expanded", isOpen);
    });
}


/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener("DOMContentLoaded", function() {
    selectStory("2026"); // මුලින්ම 2026 Stories පෙන්වයි
    initMobileNav();
    initSmoothScroll();
});
