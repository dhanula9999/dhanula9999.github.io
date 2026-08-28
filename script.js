/* =====================================================
   SUPABASE CONFIGURATION
===================================================== */

const SUPABASE_URL =
    "https://widtubgygnamjikaovrk.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_QY_pFOydY7OqkBFMU5IHDg_DhODs7l3";


/* Create Supabase client */

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* Bucket name */

const BUCKET_NAME = "photos";


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let allPhotos = [];

let selectedYear = "2026";

let currentPhotoIndex = 0;

let currentMemoryPhotos = [];

let modalPhotos = [];

let modalIndex = 0;


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupNavigation();

        setupKeyboardControls();

        loadPhotos();

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
        () => {

            const isOpen =
                mainNav.classList.toggle("open");

            navToggle.setAttribute(
                "aria-expanded",
                isOpen
            );

        }
    );


    document
        .querySelectorAll("#mainNav .nav-link")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    mainNav.classList.remove("open");

                    navToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });

}


/* =====================================================
   LOAD PHOTOS FROM SUPABASE
===================================================== */

async function loadPhotos() {

    const gallery =
        document.getElementById("gallery");

    const errorBox =
        document.getElementById("photoError");

    const errorText =
        document.getElementById("photoErrorText");


    if (gallery) {

        gallery.innerHTML = `
            <div class="loading-gallery">
                <div class="loader"></div>
                <p>Loading photos...</p>
            </div>
        `;

    }

    if (errorBox) {
        errorBox.style.display = "none";
    }


    try {

        console.log(
            "Connecting to Supabase..."
        );


        /*
         * Get file list from photos bucket
         */

        const { data, error } =
            await supabaseClient
                .storage
                .from(BUCKET_NAME)
                .list("", {
                    limit: 100,
                    offset: 0,
                    sortBy: {
                        column: "name",
                        order: "asc"
                    }
                });


        if (error) {

            console.error(
                "Supabase Storage error:",
                error
            );

            throw error;

        }


        console.log(
            "Supabase files:",
            data
        );


        if (!data || data.length === 0) {

            allPhotos = [];

            renderEmptyGallery();

            return;

        }


        /*
         * Only image files
         */

        const imageFiles =
            data.filter(file => {

                const name =
                    file.name.toLowerCase();

                return (
                    name.endsWith(".jpg") ||
                    name.endsWith(".jpeg") ||
                    name.endsWith(".png") ||
                    name.endsWith(".webp") ||
                    name.endsWith(".gif")
                );

            });


        /*
         * Convert files into public URLs
         */

        allPhotos =
            imageFiles.map(
                file => {

                    const { data: publicData } =
                        supabaseClient
                            .storage
                            .from(BUCKET_NAME)
                            .getPublicUrl(
                                file.name
                            );


                    return {

                        name: file.name,

                        url:
                            publicData.publicUrl

                    };

                }
            );


        console.log(
            "Loaded images:",
            allPhotos
        );


        renderGallery();

        setupStoryImages();

        updateStory();

    }

    catch (error) {

        console.error(
            "Failed to load photos:",
            error
        );


        if (gallery) {
            gallery.innerHTML = "";
        }


        if (errorBox) {

            errorBox.style.display =
                "block";

        }


        if (errorText) {

            errorText.textContent =
                error.message ||
                "Failed to fetch photos.";

        }

    }

}


/* =====================================================
   RENDER GALLERY
===================================================== */

function renderGallery() {

    const gallery =
        document.getElementById("gallery");

    if (!gallery) {
        return;
    }


    if (allPhotos.length === 0) {

        renderEmptyGallery();

        return;

    }


    gallery.innerHTML = "";


    allPhotos.forEach(
        (photo, index) => {

            const card =
                document.createElement("div");

            card.className =
                "photo-card";


            card.innerHTML = `

                <div class="photo-image">

                    <img
                        src="${escapeAttribute(photo.url)}"
                        alt="${escapeAttribute(photo.name)}"
                        loading="lazy"
                    >

                </div>

            `;


            const image =
                card.querySelector("img");


            image.addEventListener(
                "click",
                () => {

                    openImage(
                        photo.url,
                        index
                    );

                }
            );


            image.addEventListener(
                "error",
                () => {

                    image.style.opacity =
                        "0.3";

                }
            );


            gallery.appendChild(card);

        }
    );

}


/* =====================================================
   EMPTY GALLERY
===================================================== */

function renderEmptyGallery() {

    const gallery =
        document.getElementById("gallery");

    if (!gallery) {
        return;
    }

    gallery.innerHTML = `

        <div class="loading-gallery">

            <h3>
                No photos yet
            </h3>

            <p>
                Upload photos to the
                Supabase photos bucket.
            </p>

        </div>

    `;

}


/* =====================================================
   STORY IMAGES
===================================================== */

function setupStoryImages() {

    if (allPhotos.length === 0) {
        return;
    }


    const image2026 =
        document.getElementById(
            "storyImage2026"
        );

    const image2025 =
        document.getElementById(
            "storyImage2025"
        );


    /*
     * First photo = 2026
     */

    if (image2026) {

        image2026.src =
            allPhotos[0].url;

    }


    /*
     * Second photo = 2025
     */

    if (image2025) {

        image2025.src =
            (
                allPhotos[1] ||
                allPhotos[0]
            ).url;

    }

}


/* =====================================================
   SELECT STORY
===================================================== */

function selectStory(year) {

    selectedYear = year;

    currentPhotoIndex = 0;


    document
        .querySelectorAll(
            ".story-highlight"
        )
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });


    const selected =
        document.querySelector(
            `.story-highlight[data-story="${year}"]`
        );


    if (selected) {

        selected.classList.add(
            "active"
        );

    }


    updateStory();

}


/* =====================================================
   UPDATE STORY
===================================================== */

function updateStory() {

    const title =
        document.getElementById(
            "selectedTitle"
        );

    const count =
        document.getElementById(
            "memoryCount"
        );


    if (title) {
        title.textContent =
            selectedYear;
    }


    /*
     * Since Supabase bucket currently
     * contains normal photo files,
     * we divide photos between years.
     *
     * 2026 = first half
     * 2025 = second half
     */

    if (allPhotos.length === 0) {

        currentMemoryPhotos = [];

    }
    else {

        if (selectedYear === "2026") {

            currentMemoryPhotos =
                allPhotos.slice(
                    0,
                    Math.max(
                        1,
                        Math.ceil(
                            allPhotos.length / 2
                        )
                    )
                );

        }
        else {

            currentMemoryPhotos =
                allPhotos.slice(
                    Math.ceil(
                        allPhotos.length / 2
                    )
                );

        }


        /*
         * If there are no photos
         * in 2025, use second photo
         * or first photo.
         */

        if (
            currentMemoryPhotos.length === 0
        ) {

            currentMemoryPhotos =
                allPhotos.slice(0, 1);

        }

    }


    if (count) {

        count.textContent =
            `${currentMemoryPhotos.length} ${
                currentMemoryPhotos.length === 1
                    ? "memory"
                    : "memories"
            }`;

    }


    renderMemorySlider();

}


/* =====================================================
   MEMORY SLIDER
===================================================== */

function renderMemorySlider() {

    const grid =
        document.getElementById(
            "memoryGrid"
        );


    if (!grid) {
        return;
    }


    if (
        currentMemoryPhotos.length === 0
    ) {

        grid.innerHTML = `

            <div class="loading-box">

                <p>
                    No memories available.
                </p>

            </div>

        `;

        return;

    }


    /*
     * Show maximum 2 photos
     */

    const visiblePhotos = [];


    for (
        let i = 0;
        i < Math.min(
            2,
            currentMemoryPhotos.length
        );
        i++
    ) {

        const index =
            (
                currentPhotoIndex + i
            ) %
            currentMemoryPhotos.length;


        visiblePhotos.push(
            currentMemoryPhotos[index]
        );

    }


    grid.innerHTML = "";


    visiblePhotos.forEach(
        photo => {

            const card =
                document.createElement("div");

            card.className =
                "memory-card";


            card.innerHTML = `

                <img
                    src="${escapeAttribute(photo.url)}"
                    alt="${escapeAttribute(photo.name)}"
                    loading="lazy"
                >

            `;


            card.addEventListener(
                "click",
                () => {

                    const index =
                        allPhotos.findIndex(
                            p =>
                                p.url === photo.url
                        );


                    openImage(
                        photo.url,
                        index >= 0
                            ? index
                            : 0
                    );

                }
            );


            grid.appendChild(card);

        }
    );

}


/* =====================================================
   NEXT PHOTO
===================================================== */

function nextPhoto() {

    if (
        currentMemoryPhotos.length === 0
    ) {
        return;
    }


    currentPhotoIndex =
        (
            currentPhotoIndex + 1
        ) %
        currentMemoryPhotos.length;


    renderMemorySlider();

}


/* =====================================================
   PREVIOUS PHOTO
===================================================== */

function prevPhoto() {

    if (
        currentMemoryPhotos.length === 0
    ) {
        return;
    }


    currentPhotoIndex =
        (
            currentPhotoIndex -
            1 +
            currentMemoryPhotos.length
        ) %
        currentMemoryPhotos.length;


    renderMemorySlider();

}


/* =====================================================
   IMAGE MODAL
===================================================== */

function openImage(
    url,
    index = 0
) {

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


    modalPhotos = allPhotos;

    modalIndex =
        index >= 0
            ? index
            : 0;


    fullImage.src = url;


    modal.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";

}


function closeImage() {

    const modal =
        document.getElementById(
            "imageModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";

}


/* =====================================================
   MODAL PREVIOUS
===================================================== */

function modalPrevious() {

    if (
        modalPhotos.length === 0
    ) {
        return;
    }


    modalIndex =
        (
            modalIndex -
            1 +
            modalPhotos.length
        ) %
        modalPhotos.length;


    showModalPhoto();

}


/* =====================================================
   MODAL NEXT
===================================================== */

function modalNext() {

    if (
        modalPhotos.length === 0
    ) {
        return;
    }


    modalIndex =
        (
            modalIndex + 1
        ) %
        modalPhotos.length;


    showModalPhoto();

}


/* =====================================================
   SHOW MODAL PHOTO
===================================================== */

function showModalPhoto() {

    const fullImage =
        document.getElementById(
            "fullImage"
        );


    if (
        !fullImage ||
        !modalPhotos[modalIndex]
    ) {
        return;
    }


    fullImage.src =
        modalPhotos[modalIndex].url;

}


/* =====================================================
   KEYBOARD CONTROLS
===================================================== */

function setupKeyboardControls() {

    document.addEventListener(
        "keydown",
        event => {

            const modal =
                document.getElementById(
                    "imageModal"
                );


            if (
                !modal ||
                !modal.classList.contains("show")
            ) {
                return;
            }


            if (
                event.key === "Escape"
            ) {

                closeImage();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                modalPrevious();

            }


            if (
                event.key === "ArrowRight"
            ) {

                modalNext();

            }

        }
    );


    /*
     * Close modal when clicking
     * outside image
     */

    const modal =
        document.getElementById(
            "imageModal"
        );


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeImage();

                }

            }
        );

    }

}


/* =====================================================
   NEW STORY
===================================================== */

function showNewStoryMessage() {

    alert(
        "You can add a new story by uploading more photos to your Supabase photos bucket."
    );

}


/* =====================================================
   SECURITY / HTML ATTRIBUTE ESCAPE
===================================================== */

function escapeAttribute(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");

}
