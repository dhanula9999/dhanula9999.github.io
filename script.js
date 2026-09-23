/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://widutbgygnamjlkaovrk.supabase.co";


function getPhotoUrl(fileName) {
    return `${SUPABASE_URL}/storage/v1/object/public/photos/${fileName}`;
}


function getStoryUrl(fileName) {
    return `${SUPABASE_URL}/storage/v1/object/public/stories/${fileName}`;
}


function getVideoUrl(fileName) {
    return `${SUPABASE_URL}/storage/v1/object/public/videos/${fileName}`;
}


/* =========================================================
   THEME
========================================================= */

const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {

    document.documentElement.setAttribute(
        "data-theme",
        savedTheme
    );

} else {

    const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    document.documentElement.setAttribute(
        "data-theme",
        prefersDark ? "dark" : "light"
    );
}


if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        const currentTheme =
            document.documentElement.getAttribute("data-theme");

        const newTheme =
            currentTheme === "dark" ? "light" : "dark";

        document.documentElement.setAttribute(
            "data-theme",
            newTheme
        );

        localStorage.setItem(
            "theme",
            newTheme
        );

    });

}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");


if (navToggle && mainNav) {

    navToggle.addEventListener("click", () => {

        mainNav.classList.toggle("show");

    });


    mainNav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("show");

        });

    });

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function updateActiveNav() {

    const sections = document.querySelectorAll(
        "section[id]"
    );

    const navLinks = document.querySelectorAll(
        ".main-nav a"
    );

    let currentSection = "";

    const scrollPosition =
        window.scrollY + 180;


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop;

        const sectionHeight =
            section.offsetHeight;

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        const href =
            link.getAttribute("href");

        if (
            href === `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveNav
);


/* =========================================================
   STORIES DATA
========================================================= */

const stories = {

    "2026": [
       "story38.jpg",
       "story39.jpg",
       "story36.jpg",
       "story35.jpg",
       "story34.jpg",
       "story33.jpg",
        "story32.jpg",
        "story31.jpg",
        "story30.jpg",
        "story29.jpg",
        "story28.jpg",
        "story27.jpg",
        "story26.jpg",
        "story25.jpg",
        "story24.jpg",
        "story23.jpg",
        "story22.jpg",
        "story21.jpg",
        "story20.jpg",
        "story19.jpg",
        "story18.jpg",
        "story17.jpg",
        "story16.jpg",
        "story15.jpg",
        "story14.jpg",
        "story13.jpg",
        "story12.jpg",
        "story11.jpg",
        "story10.jpg",
        "story9.jpg",
        "story8.jpg",
        "story7.jpg",
        "story6.jpg",
        "story5.jpg",
        "story4.jpg",
        "story3.jpg",
        "story2.jpg",
        "story1.jpg"
    ],

    "2025": [
        "photo4.jpg",
        "photo3.jpg",
        "photo2.jpg"
    ]

};


/* =========================================================
   STORY STATE
========================================================= */

let currentYear = "2026";

let currentStoryIndex = 0;

let storyAutoplayInterval = null;


/* =========================================================
   STORY COVER
========================================================= */

function updateStoryCoverImages() {

    Object.keys(stories).forEach(year => {

        updateSingleStoryCover(year);

    });

}


function updateSingleStoryCover(year) {

    const storyHighlight =
        document.querySelector(
            `.story-highlight[onclick*="'${year}'"]`
        );

    if (!storyHighlight) {
        return;
    }


    const image =
        storyHighlight.querySelector("img");

    if (!image) {
        return;
    }


    const yearStories =
        stories[year];

    if (
        !yearStories ||
        yearStories.length === 0
    ) {
        return;
    }


    /*
       Always show the newest story as
       the year-circle cover.
    */

    image.src =
        year === "2026"
            ? getStoryUrl(yearStories[0])
            : getPhotoUrl(yearStories[0]);

}


/* =========================================================
   ADD NEW STORY
========================================================= */

function addNewStory(year, fileName) {

    if (!stories[year]) {

        stories[year] = [];

    }


    /*
       New story becomes the latest story.
    */

    stories[year].unshift(fileName);


    updateSingleStoryCover(year);


    if (currentYear === year) {

        currentStoryIndex = 0;

        renderStories();

    }

}


/* =========================================================
   RENDER STORIES
========================================================= */

function renderStories() {

    const memoryGrid =
        document.getElementById("memoryGrid");

    const selectedTitle =
        document.getElementById("selectedTitle");

    const memoryCount =
        document.getElementById("memoryCount");


    if (!memoryGrid) {
        return;
    }


    const currentStories =
        stories[currentYear] || [];


    if (selectedTitle) {

        selectedTitle.textContent =
            currentYear;

    }


    if (memoryCount) {

        memoryCount.textContent =
            `${currentStories.length} ${
                currentStories.length === 1
                    ? "memory"
                    : "memories"
            }`;

    }


    memoryGrid.innerHTML = "";


    if (currentStories.length === 0) {

        memoryGrid.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                padding: 40px;
                text-align: center;
                color: var(--text-secondary);
            ">
                No memories available.
            </div>
        `;

        return;

    }


    /*
       Display up to 2 memories in the
       selected memory area.
    */

    const total =
        currentStories.length;

    const firstIndex =
        currentStoryIndex % total;

    const indexes = [
        firstIndex
    ];


    if (total > 1) {

        indexes.push(
            (firstIndex + 1) % total
        );

    }


    indexes.forEach(index => {

        const fileName =
            currentStories[index];

        const imageUrl =
            currentYear === "2026"
                ? getStoryUrl(fileName)
                : getPhotoUrl(fileName);


        const card =
            document.createElement("div");

        card.className =
            "memory-card fade-in visible";


        const img =
            document.createElement("img");

        img.src =
            imageUrl;

        img.alt =
            `${currentYear} Memory`;

        img.loading =
            "lazy";

        img.onerror =
            function () {
                imageError(this);
            };


        card.appendChild(img);


        card.addEventListener(
            "click",
            () => {

                openImageModal(
                    currentStories.map(file =>

                        currentYear === "2026"
                            ? getStoryUrl(file)
                            : getPhotoUrl(file)

                    ),
                    index,
                    `${currentYear} Memory`
                );

            }
        );


        memoryGrid.appendChild(card);

    });

}


/* =========================================================
   SELECT STORY
========================================================= */

function selectStory(year, event) {

    if (event) {

        event.stopPropagation();

    }


    if (!stories[year]) {
        return;
    }


    currentYear =
        year;

    currentStoryIndex =
        0;


    document
        .querySelectorAll(".story-highlight")
        .forEach(item => {

            item.classList.remove("active");

        });


    if (event && event.currentTarget) {

        event.currentTarget.classList.add("active");

    } else {

        const selected =
            document.querySelector(
                `.story-highlight[onclick*="'${year}'"]`
            );

        if (selected) {

            selected.classList.add("active");

        }

    }


    updateSingleStoryCover(year);

    renderStories();

    restartStoryAutoplay();

}


/* =========================================================
   STORY SLIDER
========================================================= */

function nextPhoto() {

    const currentStories =
        stories[currentYear] || [];


    if (currentStories.length <= 1) {
        return;
    }


    currentStoryIndex =
        (currentStoryIndex + 1) %
        currentStories.length;


    renderStories();

}


function prevPhoto() {

    const currentStories =
        stories[currentYear] || [];


    if (currentStories.length <= 1) {
        return;
    }


    currentStoryIndex =
        (
            currentStoryIndex -
            1 +
            currentStories.length
        ) %
        currentStories.length;


    renderStories();

}


/* =========================================================
   STORY AUTOPLAY
========================================================= */

function startStoryAutoplay() {

    clearInterval(
        storyAutoplayInterval
    );


    storyAutoplayInterval =
        setInterval(() => {

            nextPhoto();

        }, 4000);

}


function restartStoryAutoplay() {

    clearInterval(
        storyAutoplayInterval
    );

    startStoryAutoplay();

}


/* =========================================================
   ADD YEAR MESSAGE
========================================================= */

function showNewStoryMessage() {

    alert(
        "Add Year feature coming soon!"
    );

}


/* =========================================================
   STORY GALLERY MODAL
========================================================= */

function openStoryGallery() {

    const modal =
        document.getElementById(
            "storyGalleryModal"
        );

    const grid =
        document.getElementById(
            "storyGalleryGrid"
        );

    const title =
        document.getElementById(
            "galleryModalTitle"
        );


    if (!modal || !grid) {
        return;
    }


    const currentStories =
        stories[currentYear] || [];


    if (title) {

        title.textContent =
            `${currentYear} Memories`;

    }


    grid.innerHTML = "";


    currentStories.forEach(
        (fileName, index) => {

            const imageUrl =
                currentYear === "2026"
                    ? getStoryUrl(fileName)
                    : getPhotoUrl(fileName);


            const img =
                document.createElement("img");

            img.src =
                imageUrl;

            img.alt =
                `${currentYear} Memory ${index + 1}`;

            img.loading =
                "lazy";


            img.onerror =
                function () {
                    imageError(this);
                };


            img.addEventListener(
                "click",
                () => {

                    closeStoryGallery();

                    openImageModal(
                        currentStories.map(file =>

                            currentYear === "2026"
                                ? getStoryUrl(file)
                                : getPhotoUrl(file)

                        ),
                        index,
                        `${currentYear} Memory`
                    );

                }
            );


            grid.appendChild(img);

        }
    );


    modal.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


function closeStoryGallery() {

    const modal =
        document.getElementById(
            "storyGalleryModal"
        );


    if (modal) {

        modal.classList.remove("show");

    }


    if (
        !document
            .getElementById("imageModal")
            ?.classList.contains("show")
    ) {

        document.body.style.overflow =
            "";

    }

}


/* =========================================================
   PHOTO ALBUM DATA
========================================================= */

const photoAlbums = [

          {
        title: "Nine Classmates Party",
        photos: [
            "photo68.jpg",
            "photo69.jpg",
            "photo70.jpg",
            "photo71.jpg",
            "photo72.jpg",
            "photo73.jpg"
        ]
    },
   
       {
        title: "Jinjie in city",
        photos: [
            "photo66.jpg",
            "photo67.jpg"
        ]
    },

    {
        title: "Album 60–65",
        photos: [
            "photo60.jpg",
            "photo61.jpg",
            "photo62.jpg",
            "photo63.jpg",
            "photo64.jpg",
            "photo65.jpg"
        ]
    },

    {
        title: "Photo 58",
        photos: [
            "photo58.jpg"
        ]
    },

       {
        title: "74-77",
        photos: [
            "photo74.jpg",
            "photo75.jpg",
            "photo76.jpg",
            "photo77.jpg"
        ]
    },

    {
        title: "Album 52–57",
        photos: [
            "photo52.jpg",
            "photo53.jpg",
            "photo54.jpg",
            "photo55.jpg",
            "photo56.jpg",
            "photo57.jpg"
        ]
    },

    {
        title: "Album 35–51",
        photos: Array.from(
            { length: 17 },
            (_, i) => `photo${35 + i}.jpg`
        )
    },

    {
        title: "Album 33–34",
        photos: [
            "photo33.jpg",
            "photo34.jpg"
        ]
    },

    ...Array.from(
        { length: 12 },
        (_, i) => {

            const number =
                32 - i;

            return {
                title: `Photo ${number}`,
                photos: [
                    `photo${number}.jpg`
                ]
            };

        }
    ),

    {
        title: "Special Album",
        photos: Array.from(
            { length: 14 },
            (_, i) => `photo${7 + i}.jpg`
        )
    },

    {
        title: "Photo 59",
        photos: [
            "photo59.jpg"
        ]
    },

    ...Array.from(
        { length: 6 },
        (_, i) => {

            const number =
                6 - i;

            return {
                title: `Photo ${number}`,
                photos: [
                    `photo${number}.jpg`
                ]
            };

        }
    )

];


/* =========================================================
   PHOTO GALLERY STATE
========================================================= */

let displayCount = 6;

let showingAllPhotos = false;


/* =========================================================
   LOAD PHOTOS
========================================================= */

function loadPhotos() {

    const gallery =
        document.getElementById("gallery");

    const loading =
        document.getElementById("photoLoading");

    const error =
        document.getElementById("photoError");


    if (!gallery) {
        return;
    }


    if (loading) {

        loading.style.display =
            "block";

    }


    if (error) {

        error.style.display =
            "none";

    }


    gallery.innerHTML = "";


    try {

        const albumsToShow =
            showingAllPhotos
                ? photoAlbums
                : photoAlbums.slice(
                    0,
                    displayCount
                );


        albumsToShow.forEach(
            (album, albumIndex) => {

                const card =
                    document.createElement("div");

                card.className =
                    "album-card fade-in visible";


                const cover =
                    album.photos[0];


                const imageUrl =
                    getPhotoUrl(cover);


                const coverContainer =
                    document.createElement("div");

                coverContainer.className =
                    "album-cover";


                const img =
                    document.createElement("img");

                img.src =
                    imageUrl;

                img.alt =
                    album.title;

                img.loading =
                    "lazy";

                img.onerror =
                    function () {
                        imageError(this);
                    };


                coverContainer.appendChild(img);


                if (album.photos.length > 1) {

                    const badge =
                        document.createElement("span");

                    badge.className =
                        "album-badge";

                    badge.textContent =
                        `+${album.photos.length - 1}`;

                    coverContainer.appendChild(
                        badge
                    );

                }


                const info =
                    document.createElement("div");

                info.className =
                    "album-info";


                const title =
                    document.createElement("h3");

                title.textContent =
                    album.title;


                const description =
                    document.createElement("p");

                description.textContent =
                    `${album.photos.length} ${
                        album.photos.length === 1
                            ? "photo"
                            : "photos"
                    }`;


                info.appendChild(title);

                info.appendChild(
                    description
                );


                card.appendChild(
                    coverContainer
                );

                card.appendChild(info);


                card.addEventListener(
                    "click",
                    () => {

                        const images =
                            album.photos.map(
                                file =>
                                    getPhotoUrl(file)
                            );


                        openImageModal(
                            images,
                            0,
                            album.title
                        );

                    }
                );


                gallery.appendChild(card);

            }
        );


        const viewMoreBtn =
            document.getElementById(
                "viewMoreBtn"
            );


        if (viewMoreBtn) {

            if (
                photoAlbums.length <=
                displayCount
            ) {

                viewMoreBtn.style.display =
                    "none";

            } else {

                viewMoreBtn.style.display =
                    "inline-flex";

                viewMoreBtn.textContent =
                    showingAllPhotos
                        ? "View Less"
                        : "View More";

            }

        }


    } catch (errorObject) {

        console.error(
            "Photo loading error:",
            errorObject
        );


        if (error) {

            error.style.display =
                "block";

        }

    } finally {

        if (loading) {

            loading.style.display =
                "none";

        }

    }

}


/* =========================================================
   VIEW MORE PHOTOS
========================================================= */

function toggleViewAllPhotos() {

    showingAllPhotos =
        !showingAllPhotos;


    loadPhotos();

}


/* =========================================================
   VIDEOS
========================================================= */

/*
    Videos are loaded from:

    Supabase Storage
    videos/

    Example:

    videos/video1.mp4
    videos/video2.mp4
    videos/video3.mp4

    Add your video file names below.
*/

const videos = [

    {
        title: "Three friends, one ride.",
        file: "video1.mp4",
        description: "17/09/2026"
    },

    {
        title: "Video 2",
        file: "video2.mp4",
        description: "Memories captured in motion."
    },

    {
        title: "Video 3",
        file: "video3.mp4",
        description: "Another special memory."
    },

    {
        title: "Video 4",
        file: "video4.mp4",
        description: "Moments worth remembering."
    },

    {
        title: "Video 5",
        file: "video5.mp4",
        description: "A collection of special moments."
    },

    {
        title: "Video 6",
        file: "video6.mp4",
        description: "Life captured through video."
    }

];


let displayVideoCount = 6;

let showingAllVideos = false;


/* =========================================================
   LOAD VIDEOS
========================================================= */

function loadVideos() {

    const gallery =
        document.getElementById(
            "videoGallery"
        );

    const loading =
        document.getElementById(
            "videoLoading"
        );

    const error =
        document.getElementById(
            "videoError"
        );


    if (!gallery) {
        return;
    }


    if (loading) {

        loading.style.display =
            "block";

    }


    if (error) {

        error.style.display =
            "none";

    }


    gallery.innerHTML = "";


    try {

        const videosToShow =
            showingAllVideos
                ? videos
                : videos.slice(
                    0,
                    displayVideoCount
                );


        if (videosToShow.length === 0) {

            gallery.innerHTML = `
                <div style="
                    grid-column: 1 / -1;
                    padding: 50px 20px;
                    text-align: center;
                    color: var(--text-secondary);
                ">
                    No videos available yet.
                </div>
            `;

        }


        videosToShow.forEach(
            (video, index) => {

                const card =
                    document.createElement("div");

                card.className =
                    "video-card fade-in visible";


                const wrapper =
                    document.createElement("div");

                wrapper.className =
                    "video-wrapper";


                const videoElement =
                    document.createElement("video");

                videoElement.src =
                    getVideoUrl(video.file);

                videoElement.controls =
                    true;

                videoElement.preload =
                    "metadata";

                videoElement.playsInline =
                    true;

                videoElement.setAttribute(
                    "playsinline",
                    ""
                );

                videoElement.setAttribute(
                    "webkit-playsinline",
                    ""
                );


                videoElement.addEventListener(
                    "error",
                    () => {

                        console.warn(
                            `Could not load video: ${video.file}`
                        );

                    }
                );


                wrapper.appendChild(
                    videoElement
                );


                const playOverlay =
                    document.createElement("div");

                playOverlay.className =
                    "video-play-overlay";


                const playIcon =
                    document.createElement("span");

                playIcon.className =
                    "video-play-icon";

                playIcon.innerHTML =
                    "▶";


                playOverlay.appendChild(
                    playIcon
                );


                /*
                   Hide the decorative play icon
                   after the user starts playing.
                */

                videoElement.addEventListener(
                    "play",
                    () => {

                        playOverlay.style.opacity =
                            "0";

                    }
                );


                videoElement.addEventListener(
                    "pause",
                    () => {

                        playOverlay.style.opacity =
                            "1";

                    }
                );


                wrapper.appendChild(
                    playOverlay
                );


                const info =
                    document.createElement("div");

                info.className =
                    "video-info";


                const title =
                    document.createElement("h3");

                title.textContent =
                    video.title;


                const description =
                    document.createElement("p");

                description.textContent =
                    video.description;


                info.appendChild(title);

                info.appendChild(
                    description
                );


                card.appendChild(
                    wrapper
                );

                card.appendChild(
                    info
                );


                gallery.appendChild(
                    card
                );

            }
        );


        const viewMoreBtn =
            document.getElementById(
                "viewMoreVideosBtn"
            );


        if (viewMoreBtn) {

            if (
                videos.length <=
                displayVideoCount
            ) {

                viewMoreBtn.style.display =
                    "none";

            } else {

                viewMoreBtn.style.display =
                    "inline-flex";

                viewMoreBtn.textContent =
                    showingAllVideos
                        ? "View Less"
                        : "View More";

            }

        }


    } catch (errorObject) {

        console.error(
            "Video loading error:",
            errorObject
        );


        if (error) {

            error.style.display =
                "block";

        }

    } finally {

        if (loading) {

            loading.style.display =
                "none";

        }

    }

}


/* =========================================================
   VIEW MORE VIDEOS
========================================================= */

function toggleViewAllVideos() {

    showingAllVideos =
        !showingAllVideos;


    loadVideos();

}


/* =========================================================
   IMAGE ERROR
========================================================= */

function imageError(image) {

    if (!image) {
        return;
    }


    image.onerror =
        null;


    image.src =
        "https://via.placeholder.com/600x400?text=Image+Not+Found";

}


/* =========================================================
   IMAGE MODAL STATE
========================================================= */

let currentModalImages = [];

let currentModalIndex = 0;

let modalAutoplayInterval = null;


/* =========================================================
   OPEN IMAGE MODAL
========================================================= */

function openImageModal(
    images,
    index = 0,
    caption = ""
) {

    const modal =
        document.getElementById(
            "imageModal"
        );

    const fullImage =
        document.getElementById(
            "fullImage"
        );

    const storyCaption =
        document.getElementById(
            "storyCaption"
        );


    if (
        !modal ||
        !fullImage
    ) {
        return;
    }


    currentModalImages =
        Array.isArray(images)
            ? images
            : [];


    currentModalIndex =
        index;


    if (
        currentModalImages.length === 0
    ) {
        return;
    }


    fullImage.src =
        currentModalImages[
            currentModalIndex
        ];


    if (storyCaption) {

        storyCaption.textContent =
            caption;

    }


    updateLikeButton();


    modal.classList.add("show");

    document.body.style.overflow =
        "hidden";


    startModalAutoplay();

}


/* =========================================================
   CLOSE IMAGE
========================================================= */

function closeImage() {

    const modal =
        document.getElementById(
            "imageModal"
        );


    if (modal) {

        modal.classList.remove("show");

    }


    stopModalAutoplay();


    if (
        !document
            .getElementById(
                "storyGalleryModal"
            )
            ?.classList.contains("show")
    ) {

        document.body.style.overflow =
            "";

    }

}


/* =========================================================
   SHOW MODAL IMAGE
========================================================= */

function showModalImage() {

    const fullImage =
        document.getElementById(
            "fullImage"
        );


    if (
        !fullImage ||
        currentModalImages.length === 0
    ) {
        return;
    }


    fullImage.src =
        currentModalImages[
            currentModalIndex
        ];


    updateLikeButton();


    /*
       Preload next image.
    */

    if (
        currentModalImages.length > 1
    ) {

        const nextIndex =
            (
                currentModalIndex + 1
            ) %
            currentModalImages.length;


        const preload =
            new Image();

        preload.src =
            currentModalImages[
                nextIndex
            ];

    }

}


/* =========================================================
   NEXT / PREVIOUS MODAL IMAGE
========================================================= */

function nextModalImage() {

    if (
        currentModalImages.length <= 1
    ) {
        return;
    }


    currentModalIndex =
        (
            currentModalIndex + 1
        ) %
        currentModalImages.length;


    showModalImage();

}


function prevModalImage() {

    if (
        currentModalImages.length <= 1
    ) {
        return;
    }


    currentModalIndex =
        (
            currentModalIndex -
            1 +
            currentModalImages.length
        ) %
        currentModalImages.length;


    showModalImage();

}


/* =========================================================
   MODAL AUTOPLAY
========================================================= */

function startModalAutoplay() {

    stopModalAutoplay();


    if (
        currentModalImages.length <= 1
    ) {
        return;
    }


    modalAutoplayInterval =
        setInterval(() => {

            nextModalImage();

        }, 3500);

}


function stopModalAutoplay() {

    clearInterval(
        modalAutoplayInterval
    );

    modalAutoplayInterval =
        null;

}


/* =========================================================
   LIKE SYSTEM
========================================================= */

function getLikedPhotos() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "likedPhotos"
            ) || "{}"
        );

    } catch {

        return {};

    }

}


function saveLikedPhotos(data) {

    localStorage.setItem(
        "likedPhotos",
        JSON.stringify(data)
    );

}


function getCurrentLikeKey() {

    if (
        currentModalImages.length === 0
    ) {
        return null;
    }


    return currentModalImages[
        currentModalIndex
    ];

}


function updateLikeButton() {

    const likeHeart =
        document.getElementById(
            "likeHeart"
        );

    const likeCount =
        document.getElementById(
            "likeCount"
        );


    const key =
        getCurrentLikeKey();


    if (!key) {
        return;
    }


    const likedPhotos =
        getLikedPhotos();


    const liked =
        !!likedPhotos[key];


    if (likeHeart) {

        likeHeart.textContent =
            liked
                ? "❤️"
                : "♡";

    }


    if (likeCount) {

        likeCount.textContent =
            liked
                ? "1"
                : "0";

    }

}


function toggleLikeCurrentPhoto() {

    const key =
        getCurrentLikeKey();


    if (!key) {
        return;
    }


    const likedPhotos =
        getLikedPhotos();


    likedPhotos[key] =
        !likedPhotos[key];


    saveLikedPhotos(
        likedPhotos
    );


    updateLikeButton();

}


/* =========================================================
   WECHAT
========================================================= */

function openWeChat() {

    const wechatNumber =
        "+8616611614319";


    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(wechatNumber)
            .catch(() => {});

    }


    try {

        window.location.href =
            "weixin://";

    } catch {

        // Fallback below

    }


    setTimeout(() => {

        alert(
            `WeChat number: ${wechatNumber}\n\nThe number has been copied.`
        );

    }, 700);

}


/* =========================================================
   CONTACT FORM
========================================================= */

function handleContactSubmit(event) {

    event.preventDefault();


    alert(
        "Thank you! Your message has been sent successfully."
    );


    event.target.reset();

}


/* =========================================================
   SCROLL ANIMATION
========================================================= */

function initializeScrollObserver() {

    const elements =
        document.querySelectorAll(
            ".fade-in"
        );


    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(element => {

            element.classList.add(
                "visible"
            );

        });

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(element => {

        observer.observe(element);

    });

}


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const imageModal =
            document.getElementById(
                "imageModal"
            );

        const storyModal =
            document.getElementById(
                "storyGalleryModal"
            );


        if (
            imageModal &&
            imageModal.classList.contains("show")
        ) {

            if (
                event.key === "Escape"
            ) {

                closeImage();

            }


            if (
                event.key === "ArrowRight"
            ) {

                nextModalImage();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                prevModalImage();

            }

        }


        if (
            storyModal &&
            storyModal.classList.contains("show") &&
            event.key === "Escape"
        ) {

            closeStoryGallery();

        }

    }
);


/* =========================================================
   BACKGROUND CLICK MODALS
========================================================= */

document.addEventListener(
    "click",
    event => {

        const imageModal =
            document.getElementById(
                "imageModal"
            );

        const storyModal =
            document.getElementById(
                "storyGalleryModal"
            );


        if (
            imageModal &&
            event.target === imageModal
        ) {

            closeImage();

        }


        if (
            storyModal &&
            event.target === storyModal
        ) {

            closeStoryGallery();

        }

    }
);


/* =========================================================
   TOUCH SWIPE
========================================================= */

let touchStartX = 0;

let touchEndX = 0;


function handleTouchStart(event) {

    if (
        event.changedTouches &&
        event.changedTouches.length
    ) {

        touchStartX =
            event.changedTouches[0].screenX;

    }

}


function handleTouchEnd(event) {

    if (
        !event.changedTouches ||
        !event.changedTouches.length
    ) {
        return;
    }


    touchEndX =
        event.changedTouches[0].screenX;


    const difference =
        touchStartX - touchEndX;


    if (
        Math.abs(difference) < 50
    ) {
        return;
    }


    const imageModal =
        document.getElementById(
            "imageModal"
        );


    if (
        !imageModal ||
        !imageModal.classList.contains("show")
    ) {
        return;
    }


    if (difference > 0) {

        nextModalImage();

    } else {

        prevModalImage();

    }

}


/* =========================================================
   DOM CONTENT LOADED
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
           Stories
        */

        updateStoryCoverImages();

        renderStories();

        startStoryAutoplay();


        /*
           Photos
        */

        loadPhotos();


        /*
           Videos
        */

        loadVideos();


        /*
           Scroll animations
        */

        initializeScrollObserver();


        /*
           Active navigation
        */

        updateActiveNav();


        /*
           Image modal touch gestures
        */

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

    }
);
