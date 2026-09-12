/* =====================================================
DHANULA PERSONAL WEBSITE
OPTIMIZED SCRIPT
===================================================== */

const SUPABASE_URL = "https://widutbgygnamjlkaovrk.supabase.co";

const getPhotoUrl = (fileName) =>
`${SUPABASE_URL}/storage/v1/object/public/photos/${fileName}`;

const getStoryUrl = (fileName) =>
`${SUPABASE_URL}/storage/v1/object/public/stories/${fileName}`;

/* =====================================================
DARK / LIGHT MODE
===================================================== */

const themeToggleBtn =
document.getElementById("themeToggle");

const savedTheme =
localStorage.getItem("theme") ||
(
window.matchMedia(
"(prefers-color-scheme: dark)"
).matches
? "dark"
: "light"
);

document.documentElement.setAttribute(
"data-theme",
savedTheme
);

if (themeToggleBtn) {

```
themeToggleBtn.addEventListener(
    "click",
    () => {

        const currentTheme =
            document.documentElement.getAttribute(
                "data-theme"
            );


        const newTheme =
            currentTheme === "dark"
                ? "light"
                : "dark";


        document.documentElement.setAttribute(
            "data-theme",
            newTheme
        );


        localStorage.setItem(
            "theme",
            newTheme
        );

    }
);
```

}

/* =====================================================
MOBILE NAVIGATION
===================================================== */

const navToggle =
document.getElementById("navToggle");

const mainNav =
document.getElementById("mainNav");

if (navToggle && mainNav) {

```
navToggle.addEventListener(
    "click",
    () => {

        mainNav.classList.toggle("show");

    }
);


mainNav
    .querySelectorAll("a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mainNav.classList.remove("show");

            }
        );

    });
```

}

/* =====================================================
ACTIVE NAVIGATION
===================================================== */

function updateActiveNav() {

```
const sections =
    document.querySelectorAll("section");


const navLinks =
    document.querySelectorAll(
        "#mainNav a"
    );


let currentSection = "";


sections.forEach(section => {

    const sectionTop =
        section.offsetTop - 150;


    const sectionHeight =
        section.offsetHeight;


    if (
        window.scrollY >= sectionTop &&
        window.scrollY <
            sectionTop + sectionHeight
    ) {

        currentSection =
            section.getAttribute("id");

    }

});


navLinks.forEach(link => {

    link.classList.remove("active");


    if (
        link.getAttribute("href") ===
        `#${currentSection}`
    ) {

        link.classList.add("active");

    }

});
```

}

window.addEventListener(
"scroll",
updateActiveNav
);

/* =====================================================
STORIES DATA
===================================================== */

const storiesData = {

```
"2026": [

    { url: getStoryUrl("story28.jpg") },
    { url: getStoryUrl("story27.jpg") },
    { url: getStoryUrl("story26.jpg") },
    { url: getStoryUrl("story25.jpg") },
    { url: getStoryUrl("story24.jpg") },
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
```

};

let currentYear = "2026";

let currentStoryIndex = 0;

let storyAutoPlayInterval = null;

/* =====================================================
RENDER STORIES
===================================================== */

function renderStories() {

```
const memoryGrid =
    document.getElementById("memoryGrid");


const selectedTitle =
    document.getElementById("selectedTitle");


const memoryCount =
    document.getElementById("memoryCount");


if (!memoryGrid) return;


const memories =
    storiesData[currentYear] || [];


if (selectedTitle) {

    selectedTitle.textContent =
        currentYear;

}


if (memoryCount) {

    memoryCount.textContent =
        `${memories.length} memories`;

}


memoryGrid.innerHTML = "";


if (memories.length === 0) {

    memoryGrid.innerHTML = `
        <p style="
            grid-column:1/-1;
            text-align:center;
            color:var(--text-secondary);
            padding:40px;
        ">
            No memories added for this year yet.
        </p>
    `;

    return;

}


const itemsToShow =
    memories.slice(
        currentStoryIndex,
        currentStoryIndex + 2
    );


if (
    itemsToShow.length < 2 &&
    memories.length > 1
) {

    itemsToShow.push(memories[0]);

}


itemsToShow.forEach(
    (item, idx) => {

        const card =
            document.createElement("div");


        card.className =
            "memory-card fade-in appear";


        const img =
            document.createElement("img");


        img.src = item.url;


        img.alt =
            `Memory Image ${idx + 1}`;


        img.onerror =
            function () {

                imageError(this);

            };


        card.appendChild(img);


        const targetIndex =
            (
                currentStoryIndex + idx
            ) % memories.length;


        card.addEventListener(
            "click",
            () => {

                const urls =
                    memories.map(
                        m => m.url
                    );


                openImageModal(
                    urls,
                    targetIndex
                );

            }
        );


        memoryGrid.appendChild(card);

    }
);
```

}

/* =====================================================
STORY AUTO PLAY
===================================================== */

function startStoryAutoPlay() {

```
stopStoryAutoPlay();


storyAutoPlayInterval =
    setInterval(
        () => {

            nextPhotoOneByOne();

        },
        4000
    );
```

}

function stopStoryAutoPlay() {

```
if (storyAutoPlayInterval) {

    clearInterval(
        storyAutoPlayInterval
    );


    storyAutoPlayInterval = null;

}
```

}

function nextPhotoOneByOne() {

```
const memories =
    storiesData[currentYear] || [];


if (memories.length <= 1) return;


currentStoryIndex =
    (
        currentStoryIndex + 1
    ) % memories.length;


renderStories();
```

}

/* =====================================================
SELECT STORY YEAR
===================================================== */

function selectStory(year, event) {

```
currentYear = year;

currentStoryIndex = 0;


document
    .querySelectorAll(
        ".story-highlight"
    )
    .forEach(el => {

        el.classList.remove(
            "active"
        );

    });


if (
    event &&
    event.currentTarget
) {

    event.currentTarget.classList.add(
        "active"
    );

}


renderStories();

startStoryAutoPlay();
```

}

/* =====================================================
STORY NAVIGATION
===================================================== */

function nextPhoto() {

```
nextPhotoOneByOne();

startStoryAutoPlay();
```

}

function prevPhoto() {

```
const memories =
    storiesData[currentYear] || [];


if (memories.length === 0) return;


currentStoryIndex =
    (
        currentStoryIndex -
        1 +
        memories.length
    ) % memories.length;


renderStories();

startStoryAutoPlay();
```

}

/* =====================================================
STORY GALLERY
===================================================== */

function openStoryGallery() {

```
const modal =
    document.getElementById(
        "storyGalleryModal"
    );


const title =
    document.getElementById(
        "galleryModalTitle"
    );


const grid =
    document.getElementById(
        "storyGalleryGrid"
    );


const memories =
    storiesData[currentYear] || [];


if (!modal || !grid) return;


if (title) {

    title.textContent =
        `${currentYear} All Memories`;

}


grid.innerHTML = "";


memories.forEach(
    (item, index) => {

        const thumb =
            document.createElement("div");


        thumb.className =
            "gallery-thumb";


        const img =
            document.createElement("img");


        img.src = item.url;


        img.alt =
            "Gallery Thumbnail";


        img.onerror =
            function () {

                imageError(this);

            };


        thumb.appendChild(img);


        thumb.addEventListener(
            "click",
            () => {

                closeStoryGallery();


                const urls =
                    memories.map(
                        m => m.url
                    );


                openImageModal(
                    urls,
                    index
                );

            }
        );


        grid.appendChild(thumb);

    }
);


modal.classList.add("show");
```

}

function closeStoryGallery() {

```
const modal =
    document.getElementById(
        "storyGalleryModal"
    );


if (modal) {

    modal.classList.remove("show");

}
```

}

function showNewStoryMessage() {

```
alert(
    "Add Year feature coming soon! You will be able to archive new years."
);
```

}

/* =====================================================
IMAGE ERROR
===================================================== */

function imageError(img) {

```
img.src =
    "https://via.placeholder.com/400x300?text=Image+Not+Found";
```

}

/* =====================================================
PHOTO ALBUMS
===================================================== */

const photoAlbums = [

```
{
    title: "Album 52-57",
    cover: "photo52.jpg",

    images:
        Array.from(
            { length: 6 },
            (_, i) =>
                `photo${52 + i}.jpg`
        )
},


{
    title: "Album 35-51",
    cover: "photo35.jpg",

    images:
        Array.from(
            { length: 17 },
            (_, i) =>
                `photo${35 + i}.jpg`
        )
},


{
    title: "Album 33-34",

    cover: "photo33.jpg",

    images: [
        "photo33.jpg",
        "photo34.jpg"
    ]
},


...Array.from(
    { length: 12 },

    (_, i) => ({

        title:
            `Photo ${32 - i}`,

        cover:
            `photo${32 - i}.jpg`,

        images: [
            `photo${32 - i}.jpg`
        ]

    })
),


{
    title: "Special Album",

    cover: "photo7.jpg",

    images:
        Array.from(
            { length: 14 },

            (_, i) =>
                `photo${7 + i}.jpg`
        )
},


...Array.from(
    { length: 6 },

    (_, i) => ({

        title:
            `Photo ${6 - i}`,

        cover:
            `photo${6 - i}.jpg`,

        images: [
            `photo${6 - i}.jpg`
        ]

    })
)
```

];

let showingAllPhotos = false;

let currentModalImages = [];

let currentModalIndex = 0;

let slideshowInterval = null;

/* =====================================================
LOAD PHOTOS
===================================================== */

function loadPhotos() {

```
const gallery =
    document.getElementById("gallery");


const viewMoreBtn =
    document.getElementById(
        "viewMoreBtn"
    );


if (!gallery) return;


gallery.innerHTML = "";


const displayCount =
    showingAllPhotos
        ? photoAlbums.length
        : 6;


for (
    let i = 0;
    i < displayCount;
    i++
) {

    const album =
        photoAlbums[i];


    const card =
        document.createElement("div");


    card.className =
        "photo-card fade-in appear";


    const imageContainer =
        document.createElement("div");


    imageContainer.className =
        "photo-image";


    const img =
        document.createElement("img");


    img.src =
        getPhotoUrl(album.cover);


    img.alt =
        album.title;


    img.loading =
        "lazy";


    img.onerror =
        function () {

            imageError(this);

        };


    imageContainer.appendChild(img);


    const badge =
        document.createElement("span");


    badge.className =
        "album-badge";


    badge.style.display =
        album.images.length > 1
            ? "block"
            : "none";


    badge.textContent =
        `+${album.images.length}`;


    imageContainer.appendChild(
        badge
    );


    imageContainer.addEventListener(
        "click",
        () => {

            const fullUrls =
                album.images.map(
                    imgName =>
                        getPhotoUrl(
                            imgName
                        )
                );


            openImageModal(
                fullUrls,
                0
            );

        }
    );


    card.appendChild(
        imageContainer
    );


    gallery.appendChild(card);

}


if (viewMoreBtn) {

    viewMoreBtn.textContent =
        showingAllPhotos
            ? "Show Less"
            : "View More";

}


initScrollObserver();
```

}

function toggleViewAllPhotos() {

```
showingAllPhotos =
    !showingAllPhotos;


loadPhotos();
```

}

/* =====================================================
IMAGE MODAL
===================================================== */

function openImageModal(
images,
index = 0
) {

```
currentModalImages =
    images;


currentModalIndex =
    index;


const modal =
    document.getElementById(
        "imageModal"
    );


const fullImg =
    document.getElementById(
        "fullImage"
    );


const captionElement =
    document.getElementById(
        "storyCaption"
    );


if (captionElement) {

    captionElement.textContent = "";

}


if (modal && fullImg) {

    fullImg.src =
        currentModalImages[
            currentModalIndex
        ];


    modal.classList.add("show");


    startSlideshow();


    preloadNextImage();


    updateLikeDisplay();

}
```

}

function preloadNextImage() {

```
if (
    currentModalImages.length > 1
) {

    const nextIndex =
        (
            currentModalIndex + 1
        ) %
        currentModalImages.length;


    const img = new Image();


    img.src =
        currentModalImages[
            nextIndex
        ];

}
```

}

function startSlideshow() {

```
stopSlideshow();


if (
    currentModalImages.length > 1
) {

    slideshowInterval =
        setInterval(
            () => {

                nextModalImage();

            },
            3500
        );

}
```

}

function stopSlideshow() {

```
if (slideshowInterval) {

    clearInterval(
        slideshowInterval
    );


    slideshowInterval = null;

}
```

}

function closeImage() {

```
const modal =
    document.getElementById(
        "imageModal"
    );


if (modal) {

    modal.classList.remove("show");

}


stopSlideshow();
```

}

function nextModalImage() {

```
if (
    currentModalImages.length <= 1
) return;


currentModalIndex =
    (
        currentModalIndex + 1
    ) %
    currentModalImages.length;


document.getElementById(
    "fullImage"
).src =
    currentModalImages[
        currentModalIndex
    ];


preloadNextImage();

updateLikeDisplay();
```

}

function prevModalImage() {

```
if (
    currentModalImages.length <= 1
) return;


currentModalIndex =
    (
        currentModalIndex -
        1 +
        currentModalImages.length
    ) %
    currentModalImages.length;


document.getElementById(
    "fullImage"
).src =
    currentModalImages[
        currentModalIndex
    ];


updateLikeDisplay();
```

}

/* =====================================================
PHOTO LIKE SYSTEM
===================================================== */

const likedPhotos =
JSON.parse(
localStorage.getItem(
"likedPhotos"
)
) || {};

function getCurrentPhotoKey() {

```
return currentModalImages[
    currentModalIndex
];
```

}

function toggleLikeCurrentPhoto() {

```
const key =
    getCurrentPhotoKey();


if (!key) return;


likedPhotos[key] =
    !likedPhotos[key];


localStorage.setItem(
    "likedPhotos",
    JSON.stringify(likedPhotos)
);


updateLikeDisplay();
```

}

function updateLikeDisplay() {

```
const key =
    getCurrentPhotoKey();


const heart =
    document.getElementById(
        "likeHeart"
    );


const count =
    document.getElementById(
        "likeCount"
    );


if (!key) return;


const liked =
    likedPhotos[key] === true;


if (heart) {

    heart.textContent =
        liked
            ? "❤️"
            : "🤍";

}


if (count) {

    count.textContent =
        liked
            ? "1"
            : "0";

}
```

}

/* =====================================================
TOUCH SWIPE
===================================================== */

let touchStartX = 0;

let touchEndX = 0;

function handleTouchStart(e) {

```
touchStartX =
    e.changedTouches[0].screenX;
```

}

function handleTouchEnd(e) {

```
touchEndX =
    e.changedTouches[0].screenX;


handleSwipe();
```

}

function handleSwipe() {

```
const threshold = 50;


if (
    touchEndX <
    touchStartX - threshold
) {

    nextModalImage();

    startSlideshow();

}


if (
    touchEndX >
    touchStartX + threshold
) {

    prevModalImage();

    startSlideshow();

}
```

}

/* =====================================================
SCROLL OBSERVER
===================================================== */

let scrollObserver;

function initScrollObserver() {

```
if (scrollObserver) {

    scrollObserver.disconnect();

}


const fadeElements =
    document.querySelectorAll(
        ".fade-in"
    );


scrollObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "appear"
                        );

                        scrollObserver.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },

        {
            threshold: 0.1
        }
    );


fadeElements.forEach(
    el => {

        if (
            !el.classList.contains(
                "appear"
            )
        ) {

            scrollObserver.observe(el);

        }

    }
);
```

}

/* =====================================================
CONTACT FORM
===================================================== */

function handleContactSubmit(e) {

```
e.preventDefault();


alert(
    "Thank you! Your message has been sent successfully."
);


e.target.reset();
```

}

/* =====================================================
INITIALIZATION
===================================================== */

document.addEventListener(
"DOMContentLoaded",
() => {

```
    renderStories();

    startStoryAutoPlay();

    loadPhotos();

    initScrollObserver();

    updateActiveNav();


    const imageModal =
        document.getElementById(
            "imageModal"
        );


    if (imageModal) {

        imageModal.addEventListener(
            "touchstart",

            handleTouchStart,

            {
                passive: true
            }
        );


        imageModal.addEventListener(
            "touchend",

            handleTouchEnd,

            {
                passive: true
            }
        );

    }


    document.addEventListener(
        "keydown",
        e => {

            const isModalOpen =
                imageModal &&
                imageModal.classList.contains(
                    "show"
                );


            if (
                e.key === "Escape"
            ) {

                closeImage();

                closeStoryGallery();

            }


            else if (
                e.key === "ArrowRight" &&
                isModalOpen
            ) {

                nextModalImage();

                startSlideshow();

            }


            else if (
                e.key === "ArrowLeft" &&
                isModalOpen
            ) {

                prevModalImage();

                startSlideshow();

            }

        }
    );

}
```

);
