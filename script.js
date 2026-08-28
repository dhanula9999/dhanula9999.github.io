/* =====================================================
   SUPABASE CONFIGURATION
===================================================== */

/*
    IMPORTANT:

    Replace these two values with your Supabase project
    URL and anon/public key.
*/

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";

const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";


/* =====================================================
   SUPABASE CLIENT
===================================================== */

let supabaseClient = null;

try {

    if (
        typeof window.supabase !== "undefined" &&
        SUPABASE_URL !== "YOUR_SUPABASE_PROJECT_URL" &&
        SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY"
    ) {

        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

    }

} catch (error) {

    console.error(
        "Supabase initialization error:",
        error
    );

}


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

const PHOTO_BUCKET = "photos";

let allPhotos = [];

let currentStory = "2026";

let currentPhotoIndex = 0;


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupNavigation();

        setupModalEvents();

        loadPhotos();

        selectStory("2026");

    }
);


/* =====================================================
   MOBILE NAVIGATION
===================================================== */

function setupNavigation() {

    const navToggle =
        document.getElementById("navToggle");

    const mainNav =
        document.getElementById("mainNav");

    if (!navToggle || !mainNav) {
        return;
    }

    navToggle.addEventListener(
        "click",
        function () {

            const isOpen =
                mainNav.classList.toggle("open");

            navToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        }
    );


    const links =
        mainNav.querySelectorAll(".nav-link");

    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    mainNav.classList.remove("open");

                    navToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );

}


/* =====================================================
   LOAD PHOTOS FROM SUPABASE
===================================================== */

async function loadPhotos() {

    const loading =
        document.getElementById("galleryLoading");

    const gallery =
        document.getElementById("gallery");

    const empty =
        document.getElementById("galleryEmpty");

    const errorBox =
        document.getElementById("galleryError");

    const errorText =
        document.getElementById("galleryErrorText");


    if (loading) {
        loading.style.display = "flex";
    }

    if (gallery) {
        gallery.innerHTML = "";
    }

    if (empty) {
        empty.style.display = "none";
    }

    if (errorBox) {
        errorBox.style.display = "none";
    }


    /* Check configuration */

    if (!supabaseClient) {

        if (loading) {
            loading.style.display = "none";
        }

        if (errorBox) {

            errorBox.style.display = "block";

            if (errorText) {

                errorText.textContent =
                    "Supabase is not configured. Add your Supabase URL and anon key to script.js.";

            }

        }

        console.error(
            "Supabase is not configured."
        );

        return;
    }


    try {

        /*
            Get files from the root of the
            "photos" bucket.
        */

        const {
            data,
            error
        } = await supabaseClient
            .storage
            .from(PHOTO_BUCKET)
            .list(
                "",
                {
                    limit: 1000,

                    offset: 0,

                    sortBy: {
                        column: "created_at",

                        order: "desc"
                    }
                }
            );


        if (error) {
            throw error;
        }


        /*
            Only display image files.
        */

        allPhotos =
            (data || []).filter(
                function (file) {

                    if (!file.name) {
                        return false;
                    }

                    /*
                        Ignore folders.
                    */

                    if (
                        file.id === null &&
                        file.metadata === null
                    ) {
                        return false;
                    }

                    const extension =
                        file.name
                            .split(".")
                            .pop()
                            .toLowerCase();

                    return [
                        "jpg",
                        "jpeg",
                        "png",
                        "webp",
                        "gif",
                        "avif"
                    ].includes(extension);

                }
            );


        if (loading) {
            loading.style.display = "none";
        }


        /* No photos */

        if (allPhotos.length === 0) {

            if (empty) {
                empty.style.display = "block";
            }

            return;
        }


        /*
            Display photos
        */

        displayGallery(allPhotos);


    } catch (error) {

        console.error(
            "Error loading Supabase photos:",
            error
        );


        if (loading) {
            loading.style.display = "none";
        }

        if (errorBox) {

            errorBox.style.display = "block";

            if (errorText) {

                errorText.textContent =
                    "Could not load photos. Please check your Supabase bucket and policies.";

            }

        }

    }

}


/* =====================================================
   DISPLAY GALLERY
===================================================== */

function displayGallery(files) {

    const gallery =
        document.getElementById("gallery");

    if (!gallery) {
        return;
    }

    gallery.innerHTML = "";


    files.forEach(
        function (file) {

            const publicUrl =
                getPublicImageUrl(file.name);

            const card =
                document.createElement("div");

            card.className =
                "photo-card";


            const imageContainer =
                document.createElement("div");

            imageContainer.className =
                "photo-image";


            const image =
                document.createElement("img");

            image.src =
                publicUrl;

            image.alt =
                cleanFileName(file.name);

            image.loading =
                "lazy";


            image.onerror =
                function () {

                    handleImageError(image);

                };


            image.onclick =
                function () {

                    openImage(publicUrl);

                };


            imageContainer.appendChild(
                image
            );


            card.appendChild(
                imageContainer
            );


            gallery.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   GET PUBLIC IMAGE URL
===================================================== */

function getPublicImageUrl(fileName) {

    const {
        data
    } = supabaseClient
        .storage
        .from(PHOTO_BUCKET)
        .getPublicUrl(fileName);

    return data.publicUrl;

}


/* =====================================================
   CLEAN FILE NAME
===================================================== */

function cleanFileName(fileName) {

    return fileName
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, function (letter) {
            return letter.toUpperCase();
        });

}


/* =====================================================
   STORIES
===================================================== */

function selectStory(year) {

    currentStory = year;

    currentPhotoIndex = 0;


    /* Update active story */

    const storyItems =
        document.querySelectorAll(
            ".story-highlight[data-story]"
        );

    storyItems.forEach(
        function (item) {

            item.classList.remove("active");

            if (
                item.dataset.story === year
            ) {

                item.classList.add("active");

            }

        }
    );


    const title =
        document.getElementById(
            "selectedTitle"
        );

    if (title) {
        title.textContent = year;
    }


    /*
        Currently the stories use the local
        story images from the stories folder.

        You can later move these into Supabase.
    */

    const storyPhotos = getStoryPhotos(year);

    displayStoryPhotos(storyPhotos);

}


/* =====================================================
   STORY PHOTO DATA
===================================================== */

function getStoryPhotos(year) {

    const stories = {

        "2026": [
            "stories/story1.jpg",
            "stories/story1.jpg"
        ],

        "2025": [
            "stories/story2.jpg",
            "stories/story2.jpg"
        ]

    };

    return stories[year] || [];

}


/* =====================================================
   DISPLAY STORY PHOTOS
===================================================== */

function displayStoryPhotos(photos) {

    const grid =
        document.getElementById(
            "memoryGrid"
        );

    const count =
        document.getElementById(
            "memoryCount"
        );


    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    if (count) {

        count.textContent =
            photos.length +
            (
                photos.length === 1
                    ? " memory"
                    : " memories"
            );

    }


    photos.forEach(
        function (photo) {

            const card =
                document.createElement("div");

            card.className =
                "memory-card";


            const image =
                document.createElement("img");

            image.src =
                photo;

            image.alt =
                currentStory +
                " memory";

            image.loading =
                "lazy";


            image.onerror =
                function () {

                    handleImageError(image);

                };


            image.onclick =
                function () {

                    openImage(photo);

                };


            card.appendChild(
                image
            );


            grid.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   PREVIOUS PHOTO
===================================================== */

function prevPhoto() {

    const photos =
        getStoryPhotos(currentStory);

    if (photos.length === 0) {
        return;
    }

    currentPhotoIndex--;

    if (currentPhotoIndex < 0) {

        currentPhotoIndex =
            photos.length - 1;

    }

    showCurrentStoryPhoto(
        photos
    );

}


/* =====================================================
   NEXT PHOTO
===================================================== */

function nextPhoto() {

    const photos =
        getStoryPhotos(currentStory);

    if (photos.length === 0) {
        return;
    }

    currentPhotoIndex++;

    if (
        currentPhotoIndex >=
        photos.length
    ) {

        currentPhotoIndex = 0;

    }

    showCurrentStoryPhoto(
        photos
    );

}


/* =====================================================
   SHOW CURRENT STORY PHOTO
===================================================== */

function showCurrentStoryPhoto(photos) {

    const photo =
        photos[currentPhotoIndex];

    if (photo) {

        openImage(photo);

    }

}


/* =====================================================
   NEW STORY MESSAGE
===================================================== */

function showNewStoryMessage() {

    alert(
        "You can add a new story year here later."
    );

}


/* =====================================================
   IMAGE MODAL
===================================================== */

function openImage(src) {

    const modal =
        document.getElementById(
            "imageModal"
        );

    const fullImage =
        document.getElementById(
            "fullImage"
        );


    if (!modal || !fullImage) {
        return;
    }


    fullImage.src =
        src;


    modal.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   CLOSE IMAGE
===================================================== */

function closeImage() {

    const modal =
        document.getElementById(
            "imageModal"
        );

    const fullImage =
        document.getElementById(
            "fullImage"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";


    if (fullImage) {
        fullImage.src = "";
    }

}


/* =====================================================
   MODAL EVENTS
===================================================== */

function setupModalEvents() {

    const modal =
        document.getElementById(
            "imageModal"
        );


    if (!modal) {
        return;
    }


    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeImage();

            }

        }
    );


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

}


/* =====================================================
   IMAGE ERROR
===================================================== */

function handleImageError(image) {

    if (!image) {
        return;
    }

    image.style.display =
        "none";

}


/* =====================================================
   REFRESH PHOTOS
===================================================== */

function refreshPhotos() {

    loadPhotos();

}


/* =====================================================
   CONSOLE MESSAGE
===================================================== */

console.log(
    "Dhanula website loaded successfully."
);
