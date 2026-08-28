/* =====================================================
   DHANULA PERSONAL WEBSITE
   SUPABASE STORAGE
===================================================== */


/* ================= SUPABASE ================= */

const SUPABASE_URL =
    "https://widutbgygnamjIkaovrk.supabase.co";

const STORAGE_BUCKET =
    "photos";


/* Public image URL */

function storageUrl(fileName) {

    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${fileName}`;

}


/* =====================================================
   PHOTOS
===================================================== */

/*
    IMPORTANT:

    These filenames must exactly match the files
    inside your Supabase "photos" bucket.
*/

const photos = [

    "photo1.jpg",
    "photo2.jpg",
    "photo3.jpg",
    "photo4.jpg",
    "photo5.jpg",
    "photo6.jpg"

];


/* ================= LOAD PHOTOS ================= */

function loadPhotos() {

    const gallery =
        document.getElementById("gallery");

    const loading =
        document.getElementById("photoLoading");

    const errorBox =
        document.getElementById("photoError");


    gallery.innerHTML = "";

    loading.style.display = "block";
    errorBox.style.display = "none";


    let loadedCount = 0;


    photos.forEach((fileName) => {

        const card =
            document.createElement("div");

        card.className =
            "photo-card";


        const imageContainer =
            document.createElement("div");

        imageContainer.className =
            "photo-image";


        const img =
            document.createElement("img");


        img.src =
            storageUrl(fileName);

        img.alt =
            "Dhanula photo";

        img.loading =
            "lazy";


        img.onclick = function () {

            openImage(this.src);

        };


        img.onload = function () {

            loadedCount++;

        };


        img.onerror = function () {

            card.style.display = "none";

        };


        imageContainer.appendChild(img);

        card.appendChild(imageContainer);

        gallery.appendChild(card);

    });


    setTimeout(() => {

        loading.style.display = "none";

        const visibleImages =
            gallery.querySelectorAll(
                ".photo-card:not([style*='display: none'])"
            );


        if (visibleImages.length === 0) {

            errorBox.style.display =
                "block";

        }

    }, 1500);

}


/* =====================================================
   STORIES
===================================================== */


/*
   Story images.

   Change these names if you upload different files.
*/

const storyData = {

    "2026": [

        "photo1.jpg",
        "photo2.jpg"

    ],

    "2025": [

        "photo3.jpg",
        "photo4.jpg"

    ]

};


let currentYear = "2026";

let currentPhotoIndex = 0;


/* ================= SELECT STORY ================= */

function selectStory(year) {

    currentYear =
        year;

    currentPhotoIndex =
        0;


    document
        .querySelectorAll(".story-highlight")
        .forEach((item) => {

            item.classList.remove("active");

        });


    const selected =
        document.querySelector(
            `.story-highlight[onclick="selectStory('${year}')"]`
        );


    if (selected) {

        selected.classList.add("active");

    }


    document.getElementById(
        "selectedTitle"
    ).textContent = year;


    renderStory();

}


/* ================= RENDER STORY ================= */

function renderStory() {

    const grid =
        document.getElementById("memoryGrid");


    const images =
        storyData[currentYear] || [];


    grid.innerHTML = "";


    document.getElementById(
        "memoryCount"
    ).textContent =
        `${images.length} ${images.length === 1 ? "memory" : "memories"}`;


    if (images.length === 0) {

        grid.innerHTML = `
            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:60px;
                color:#777;
            ">
                No memories available for ${currentYear}.
            </div>
        `;

        return;

    }


    /*
       Show maximum 2 photos at a time.
    */

    const first =
        currentPhotoIndex % images.length;

    const second =
        (currentPhotoIndex + 1) % images.length;


    const indexes =
        images.length === 1
            ? [first]
            : [first, second];


    indexes.forEach((index) => {

        const fileName =
            images[index];


        const card =
            document.createElement("div");

        card.className =
            "memory-card";


        const img =
            document.createElement("img");


        img.src =
            storageUrl(fileName);

        img.alt =
            `${currentYear} memory`;

        img.loading =
            "lazy";


        img.onclick = function () {

            openImage(this.src);

        };


        img.onerror =
            function () {

                this.style.display =
                    "none";

            };


        card.appendChild(img);

        grid.appendChild(card);

    });

}


/* ================= NEXT ================= */

function nextPhoto() {

    const images =
        storyData[currentYear] || [];


    if (images.length <= 1) {

        return;

    }


    currentPhotoIndex =
        (currentPhotoIndex + 1) % images.length;


    renderStory();

}


/* ================= PREVIOUS ================= */

function prevPhoto() {

    const images =
        storyData[currentYear] || [];


    if (images.length <= 1) {

        return;

    }


    currentPhotoIndex =
        (currentPhotoIndex - 1 + images.length)
        % images.length;


    renderStory();

}


/* =====================================================
   NEW STORY
===================================================== */

function showNewStoryMessage() {

    alert(
        "You can add a new year and its photos to the Stories section."
    );

}


/* =====================================================
   IMAGE ERROR
===================================================== */

function imageError(image) {

    image.style.display =
        "none";

}


/* =====================================================
   IMAGE MODAL
===================================================== */

function openImage(src) {

    const modal =
        document.getElementById("imageModal");

    const fullImage =
        document.getElementById("fullImage");


    fullImage.src =
        src;


    modal.classList.add("show");


    document.body.style.overflow =
        "hidden";

}


/* ================= CLOSE ================= */

function closeImage() {

    const modal =
        document.getElementById("imageModal");


    modal.classList.remove("show");


    document.body.style.overflow =
        "";

}


/* Close by clicking background */

document
    .getElementById("imageModal")
    .addEventListener("click", function(event) {

        if (
            event.target === this
        ) {

            closeImage();

        }

    });


/* Close with ESC */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeImage();

        }

    }
);


/* =====================================================
   MOBILE NAVIGATION
===================================================== */

const navToggle =
    document.getElementById("navToggle");

const mainNav =
    document.getElementById("mainNav");


navToggle.addEventListener(
    "click",
    function() {

        mainNav.classList.toggle("show");

    }
);


/* Close menu after clicking */

document
    .querySelectorAll("#mainNav a")
    .forEach((link) => {

        link.addEventListener(
            "click",
            function() {

                mainNav.classList.remove(
                    "show"
                );

            }
        );

    });


/* =====================================================
   START WEBSITE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadPhotos();

        renderStory();

    }
);
