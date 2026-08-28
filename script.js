/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

/*
   IMPORTANT:

   Replace these two values with your Supabase project
   information.

   Supabase Dashboard
   → Project Settings
   → API
*/

const SUPABASE_URL =
    "YOUR_SUPABASE_PROJECT_URL";

const SUPABASE_ANON_KEY =
    "YOUR_SUPABASE_ANON_KEY";


/* =========================================================
   STORAGE CONFIGURATION
========================================================= */

const BUCKET_NAME = "photos";


/*
   Public URL generator
*/

function getPublicUrl(path) {

    return (
        SUPABASE_URL +
        "/storage/v1/object/public/" +
        BUCKET_NAME +
        "/" +
        path
    );

}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const navToggle =
    document.getElementById("navToggle");

const mainNav =
    document.getElementById("mainNav");


if (navToggle) {

    navToggle.addEventListener("click", () => {

        const isOpen =
            mainNav.classList.toggle("open");

        navToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

    });

}


/* Close mobile menu after clicking */

document.querySelectorAll(".nav-link")
    .forEach(link => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("open");

            navToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });


/* =========================================================
   IMAGE ERROR
========================================================= */

function handleImageError(image) {

    image.style.display = "none";

}


/* =========================================================
   GALLERY
========================================================= */

/*
   Add your Supabase photo filenames here.

   Example:

   photos/
      photo1.jpg
      photo2.jpg
      photo3.jpg
      photo4.jpg
      photo5.jpg
      photo6.jpg
*/

const galleryPhotos = [

    "images/photo1.jpg",
    "images/photo2.jpg",
    "images/photo3.jpg",
    "images/photo4.jpg",
    "images/photo5.jpg",
    "images/photo6.jpg"

];


function loadGallery() {

    const gallery =
        document.getElementById("gallery");

    gallery.innerHTML = "";


    galleryPhotos.forEach((path, index) => {

        const url =
            getPublicUrl(path);


        const card =
            document.createElement("div");

        card.className =
            "photo-card";


        card.innerHTML = `

            <div class="photo-image">

                <img
                    src="${url}"
                    alt="Dhanula photo ${index + 1}"
                    loading="lazy"
                    onclick="openImage('${url}')"
                    onerror="this.closest('.photo-card').style.display='none'"
                >

            </div>

        `;


        gallery.appendChild(card);

    });


    if (gallery.children.length === 0) {

        gallery.innerHTML = `
            <div class="loading">
                No photos available.
            </div>
        `;

    }

}


/* =========================================================
   STORIES DATA
========================================================= */


/*
   Supabase Storage structure:

   photos/
   │
   ├── images/
   │   ├── photo1.jpg
   │   ├── photo2.jpg
   │   ├── photo3.jpg
   │   ├── photo4.jpg
   │   ├── photo5.jpg
   │   └── photo6.jpg
   │
   └── stories/
       ├── story1.jpg
       └── story2.jpg


   For 2026 memories:

   stories/2026/

   For 2025 memories:

   stories/2025/
*/


const stories = {

    "2026": [

        "stories/2026/photo1.jpg",
        "stories/2026/photo2.jpg"

    ],

    "2025": [

        "stories/2025/photo1.jpg",
        "stories/2025/photo2.jpg"

    ]

};


/* =========================================================
   STORY COVER IMAGES
========================================================= */

const storyCovers = {

    "2026":
        "stories/story1.jpg",

    "2025":
        "stories/story2.jpg"

};


function loadStoryCovers() {

    const cover2026 =
        document.getElementById(
            "storyImage2026"
        );

    const cover2025 =
        document.getElementById(
            "storyImage2025"
        );


    if (cover2026) {

        cover2026.src =
            getPublicUrl(
                storyCovers["2026"]
            );

    }


    if (cover2025) {

        cover2025.src =
            getPublicUrl(
                storyCovers["2025"]
            );

    }

}


/* =========================================================
   STORY SLIDER
========================================================= */

let selectedYear = "2026";

let currentPhotoIndex = 0;


function selectStory(year) {

    if (!stories[year]) {

        return;

    }


    selectedYear = year;

    currentPhotoIndex = 0;


    document.querySelectorAll(
        ".story-highlight"
    ).forEach(item => {

        item.classList.remove("active");

    });


    const selected =
        document.querySelector(
            `[data-story="${year}"]`
        );


    if (selected) {

        selected.classList.add("active");

    }


    document.getElementById(
        "selectedTitle"
    ).textContent = year;


    renderStoryPhotos();

}


/* =========================================================
   RENDER STORY PHOTOS
========================================================= */

function renderStoryPhotos() {

    const grid =
        document.getElementById(
            "memoryGrid"
        );

    const count =
        document.getElementById(
            "memoryCount"
        );


    const photos =
        stories[selectedYear] || [];


    if (photos.length === 0) {

        grid.innerHTML = `
            <div class="loading">
                No memories available for ${selectedYear}.
            </div>
        `;

        count.textContent =
            "0 memories";

        return;

    }


    count.textContent =
        photos.length === 1
            ? "1 memory"
            : `${photos.length} memories`;


    /*
       Show current photo and next photo
       on desktop.
    */

    const visiblePhotos = [];


    for (
        let i = 0;
        i < Math.min(2, photos.length);
        i++
    ) {

        const index =
            (currentPhotoIndex + i)
            % photos.length;

        visiblePhotos.push(
            photos[index]
        );

    }


    grid.innerHTML = "";


    visiblePhotos.forEach(
        (path, index) => {

            const url =
                getPublicUrl(path);


            const card =
                document.createElement("div");

            card.className =
                "memory-card";


            card.innerHTML = `

                <img
                    src="${url}"
                    alt="${selectedYear} memory ${index + 1}"
                    loading="lazy"
                    onclick="openImage('${url}')"
                    onerror="this.parentElement.style.display='none'"
                >

            `;


            grid.appendChild(card);

        }
    );

}


/* =========================================================
   NEXT PHOTO
========================================================= */

function nextPhoto() {

    const photos =
        stories[selectedYear] || [];


    if (photos.length <= 1) {

        return;

    }


    currentPhotoIndex =
        (currentPhotoIndex + 1)
        % photos.length;


    renderStoryPhotos();

}


/* =========================================================
   PREVIOUS PHOTO
========================================================= */

function prevPhoto() {

    const photos =
        stories[selectedYear] || [];


    if (photos.length <= 1) {

        return;

    }


    currentPhotoIndex =
        (
            currentPhotoIndex -
            1 +
            photos.length
        )
        % photos.length;


    renderStoryPhotos();

}


/* =========================================================
   NEW STORY
========================================================= */

function showNewStoryMessage() {

    alert(
        "New stories will be added soon ❤️"
    );

}


/* =========================================================
   IMAGE MODAL
========================================================= */

function openImage(src) {

    const modal =
        document.getElementById(
            "imageModal"
        );

    const image =
        document.getElementById(
            "fullImage"
        );


    image.src = src;

    modal.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE IMAGE
========================================================= */

function closeImage() {

    const modal =
        document.getElementById(
            "imageModal"
        );

    const image =
        document.getElementById(
            "fullImage"
        );


    modal.classList.remove("show");

    image.src = "";

    document.body.style.overflow =
        "";

}


/* Click outside image */

document
    .getElementById("imageModal")
    .addEventListener("click", function (event) {

        if (
            event.target === this
        ) {

            closeImage();

        }

    });


/* ESC key */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeImage();

        }

    }
);


/* =========================================================
   INITIALIZE WEBSITE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadGallery();

        loadStoryCovers();

        selectStory("2026");

    }
);
