/* =====================================================
   SUPABASE CONFIGURATION
===================================================== */

const SUPABASE_URL =
    "https://widutbgygnamjlkovrk.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_QY_pFOydY7OqkBFMU5IHDg_DhODs7l3";


/* =====================================================
   SUPABASE CLIENT
===================================================== */

let supabaseClient = null;

try {

    if (
        typeof window.supabase !== "undefined"
    ) {

        supabaseClient =
            window.supabase.createClient(
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
   SETTINGS
===================================================== */

const PHOTO_BUCKET = "photos";

let allPhotos = [];

let storyYears = [];

let currentStory = null;

let currentStoryPhotos = [];

let currentPhotoIndex = 0;

let currentGalleryIndex = 0;


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupNavigation();

        setupModalEvents();

        setupStoryButtons();

        loadPhotos();

        loadStories();

    }
);


/* =====================================================
   MOBILE NAVIGATION
===================================================== */

function setupNavigation() {

    const navToggle =
        document.getElementById(
            "navToggle"
        );

    const mainNav =
        document.getElementById(
            "mainNav"
        );

    if (!navToggle || !mainNav) {
        return;
    }


    navToggle.addEventListener(
        "click",
        function () {

            const isOpen =
                mainNav.classList.toggle(
                    "open"
                );

            navToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        }
    );


    const links =
        mainNav.querySelectorAll(
            ".nav-link"
        );

    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    mainNav.classList.remove(
                        "open"
                    );

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
   LOAD GALLERY PHOTOS
===================================================== */

async function loadPhotos() {

    const loading =
        document.getElementById(
            "galleryLoading"
        );

    const gallery =
        document.getElementById(
            "gallery"
        );

    const empty =
        document.getElementById(
            "galleryEmpty"
        );

    const errorBox =
        document.getElementById(
            "galleryError"
        );


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


    if (!supabaseClient) {

        showGalleryError(
            "Supabase could not be initialized."
        );

        return;
    }


    try {

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
            Only root-level image files.

            Folders such as "stories"
            are ignored here.
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


                    return isImageFile(
                        file.name
                    );

                }
            );


        if (loading) {
            loading.style.display = "none";
        }


        if (
            allPhotos.length === 0
        ) {

            if (empty) {
                empty.style.display = "block";
            }

            return;
        }


        displayGallery(
            allPhotos
        );

    }

    catch (error) {

        console.error(
            "Supabase photo error:",
            error
        );

        showGalleryError(
            error.message ||
            "Could not load photos."
        );

    }

}


/* =====================================================
   CHECK IMAGE
===================================================== */

function isImageFile(
    fileName
) {

    const extension =
        fileName
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


/* =====================================================
   DISPLAY GALLERY
===================================================== */

function displayGallery(
    files
) {

    const gallery =
        document.getElementById(
            "gallery"
        );

    if (!gallery) {
        return;
    }


    gallery.innerHTML = "";


    files.forEach(
        function (file, index) {

            const url =
                getPublicImageUrl(
                    file.name
                );


            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "photo-card";


            const container =
                document.createElement(
                    "div"
                );

            container.className =
                "photo-image";


            const image =
                document.createElement(
                    "img"
                );

            image.src = url;

            image.alt =
                cleanFileName(
                    file.name
                );

            image.loading = "lazy";


            image.onerror =
                function () {

                    image.style.display =
                        "none";

                };


            image.addEventListener(
                "click",
                function () {

                    currentGalleryIndex =
                        index;

                    openGalleryImage(
                        index
                    );

                }
            );


            container.appendChild(
                image
            );

            card.appendChild(
                container
            );

            gallery.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   PUBLIC IMAGE URL
===================================================== */

function getPublicImageUrl(
    filePath
) {

    const {
        data
    } = supabaseClient
        .storage
        .from(PHOTO_BUCKET)
        .getPublicUrl(
            filePath
        );

    return data.publicUrl;

}


/* =====================================================
   CLEAN FILE NAME
===================================================== */

function cleanFileName(
    fileName
) {

    return fileName
        .replace(
            /\.[^/.]+$/,
            ""
        )
        .replace(
            /[-_]/g,
            " "
        )
        .replace(
            /\b\w/g,
            function (letter) {
                return letter.toUpperCase();
            }
        );

}


/* =====================================================
   LOAD STORIES
===================================================== */

async function loadStories() {

    const container =
        document.getElementById(
            "storyHighlights"
        );

    if (!container) {
        return;
    }


    try {

        /*
            First find the "stories" folder.
        */

        const {
            data,
            error
        } = await supabaseClient
            .storage
            .from(PHOTO_BUCKET)
            .list(
                "stories",
                {
                    limit: 100
                }
            );


        if (error) {
            throw error;
        }


        /*
            Find folders such as:

            2026
            2025
            2024
        */

        storyYears =
            (data || [])
                .filter(
                    function (item) {

                        return (
                            item.id === null &&
                            item.metadata === null &&
                            /^\d{4}$/.test(
                                item.name
                            )
                        );

                    }
                )
                .map(
                    function (item) {
                        return item.name;
                    }
                )
                .sort(
                    function (a, b) {
                        return b - a;
                    }
                );


        container.innerHTML = "";


        /*
            No stories.
        */

        if (
            storyYears.length === 0
        ) {

            container.innerHTML = `
                <div class="story-loading">
                    No stories available yet.
                </div>
            `;

            return;
        }


        /*
            Create year buttons.
        */

        for (
            const year of storyYears
        ) {

            const yearData =
                await getStoryYearPreview(
                    year
                );

            createStoryButton(
                year,
                yearData
            );

        }


        /*
            New button.
        */

        const newStory =
            document.createElement(
                "div"
            );

        newStory.className =
            "story-highlight new-story";


        newStory.innerHTML = `
            <div class="story-circle new-circle">
                <span class="plus">+</span>
            </div>
            <span>New</span>
        `;


        newStory.addEventListener(
            "click",
            function () {

                alert(
                    "Create a new year folder inside Supabase: photos/stories/YEAR"
                );

            }
        );


        container.appendChild(
            newStory
        );


        /*
            Automatically select
            latest year.
        */

        selectStory(
            storyYears[0]
        );

    }

    catch (error) {

        console.error(
            "Stories error:",
            error
        );

        container.innerHTML = `
            <div class="story-loading">
                Stories could not be loaded.
            </div>
        `;

    }

}


/* =====================================================
   STORY PREVIEW
===================================================== */

async function getStoryYearPreview(
    year
) {

    try {

        const {
            data,
            error
        } = await supabaseClient
            .storage
            .from(PHOTO_BUCKET)
            .list(
                `stories/${year}`,
                {
                    limit: 100,

                    sortBy: {
                        column: "created_at",
                        order: "asc"
                    }
                }
            );


        if (error) {
            throw error;
        }


        const images =
            (data || []).filter(
                function (file) {

                    return (
                        file.name &&
                        isImageFile(
                            file.name
                        )
                    );

                }
            );


        return images;

    }

    catch (error) {

        console.error(
            `Story ${year} error:`,
            error
        );

        return [];

    }

}


/* =====================================================
   CREATE STORY BUTTON
===================================================== */

function createStoryButton(
    year,
    images
) {

    const container =
        document.getElementById(
            "storyHighlights"
        );

    if (!container) {
        return;
    }


    const item =
        document.createElement(
            "div"
        );

    item.className =
        "story-highlight";

    item.dataset.story =
        year;


    let previewUrl = "";


    if (
        images &&
        images.length > 0
    ) {

        previewUrl =
            getPublicImageUrl(
                `stories/${year}/${images[0].name}`
            );

    }


    item.innerHTML = `

        <div class="story-circle">

            ${
                previewUrl
                ?
                `<img
                    src="${previewUrl}"
                    alt="${year}"
                    loading="lazy"
                >`
                :
                `<div
                    class="new-circle"
                    style="
                        width:100%;
                        height:100%;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:22px;
                    "
                >
                    ${year}
                </div>`
            }

        </div>

        <span>
            ${year}
        </span>

    `;


    item.addEventListener(
        "click",
        function () {

            selectStory(
                year
            );

        }
    );


    container.appendChild(
        item
    );

}


/* =====================================================
   SELECT STORY
===================================================== */

async function selectStory(
    year
) {

    currentStory =
        year;

    currentPhotoIndex =
        0;


    /*
        Active year.
    */

    const items =
        document.querySelectorAll(
            ".story-highlight[data-story]"
        );


    items.forEach(
        function (item) {

            item.classList.toggle(
                "active",
                item.dataset.story ===
                year
            );

        }
    );


    const title =
        document.getElementById(
            "selectedTitle"
        );


    if (title) {
        title.textContent =
            year;
    }


    /*
        Load story photos.
    */

    try {

        const {
            data,
            error
        } = await supabaseClient
            .storage
            .from(PHOTO_BUCKET)
            .list(
                `stories/${year}`,
                {
                    limit: 1000,

                    sortBy: {
                        column: "created_at",
                        order: "asc"
                    }
                }
            );


        if (error) {
            throw error;
        }


        currentStoryPhotos =
            (data || [])
                .filter(
                    function (file) {

                        return (
                            file.name &&
                            isImageFile(
                                file.name
                            )
                        );

                    }
                )
                .map(
                    function (file) {

                        return getPublicImageUrl(
                            `stories/${year}/${file.name}`
                        );

                    }
                );


        displayStoryPhotos();

    }

    catch (error) {

        console.error(
            "Story loading error:",
            error
        );

        currentStoryPhotos = [];

        displayStoryPhotos();

    }

}


/* =====================================================
   DISPLAY STORY PHOTOS
===================================================== */

function displayStoryPhotos() {

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
            currentStoryPhotos.length +
            (
                currentStoryPhotos.length === 1
                ? " memory"
                : " memories"
            );

    }


    if (
        currentStoryPhotos.length === 0
    ) {

        grid.innerHTML = `
            <div class="story-empty">
                No photos added for ${currentStory}.
            </div>
        `;

        return;
    }


    /*
        Show maximum 2 preview images.
    */

    const visiblePhotos =
        currentStoryPhotos.slice(
            0,
            2
        );


    visiblePhotos.forEach(
        function (url, index) {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "memory-card";


            const image =
                document.createElement(
                    "img"
                );

            image.src =
                url;

            image.alt =
                `${currentStory} memory ${index + 1}`;

            image.loading =
                "lazy";


            image.addEventListener(
                "click",
                function () {

                    currentPhotoIndex =
                        index;

                    openStoryImage(
                        index
                    );

                }
            );


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
   STORY PREVIOUS
===================================================== */

function prevPhoto() {

    if (
        currentStoryPhotos.length === 0
    ) {
        return;
    }


    currentPhotoIndex--;

    if (
        currentPhotoIndex < 0
    ) {

        currentPhotoIndex =
            currentStoryPhotos.length - 1;

    }


    openStoryImage(
        currentPhotoIndex
    );

}


/* =====================================================
   STORY NEXT
===================================================== */

function nextPhoto() {

    if (
        currentStoryPhotos.length === 0
    ) {
        return;
    }


    currentPhotoIndex++;

    if (
        currentPhotoIndex >=
        currentStoryPhotos.length
    ) {

        currentPhotoIndex = 0;

    }


    openStoryImage(
        currentPhotoIndex
    );

}


/* =====================================================
   STORY IMAGE
===================================================== */

function openStoryImage(
    index
) {

    if (
        !currentStoryPhotos[index]
    ) {
        return;
    }


    currentPhotoIndex =
        index;


    openImage(
        currentStoryPhotos[index]
    );

}


/* =====================================================
   GALLERY IMAGE
===================================================== */

function openGalleryImage(
    index
) {

    if (
        !allPhotos[index]
    ) {
        return;
    }


    currentGalleryIndex =
        index;


    const url =
        getPublicImageUrl(
            allPhotos[index].name
        );


    openImage(url);

}


/* =====================================================
   OPEN IMAGE
===================================================== */

function openImage(
    src
) {

    const modal =
        document.getElementById(
            "imageModal"
        );

    const image =
        document.getElementById(
            "fullImage"
        );


    if (!modal || !image) {
        return;
    }


    image.src =
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

    const image =
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


    if (image) {
        image.src = "";
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

    const closeButton =
        document.getElementById(
            "closeButton"
        );

    const modalPrev =
        document.getElementById(
            "modalPrev"
        );

    const modalNext =
        document.getElementById(
            "modalNext"
        );


    if (!modal) {
        return;
    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeImage
        );

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


    if (modalPrev) {

        modalPrev.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                previousGalleryImage();

            }
        );

    }


    if (modalNext) {

        modalNext.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                nextGalleryImage();

            }
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeImage();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                previousGalleryImage();

            }


            if (
                event.key === "ArrowRight"
            ) {

                nextGalleryImage();

            }

        }
    );

}


/* =====================================================
   GALLERY NEXT
===================================================== */

function nextGalleryImage() {

    if (
        allPhotos.length === 0
    ) {
        return;
    }


    currentGalleryIndex++;

    if (
        currentGalleryIndex >=
        allPhotos.length
    ) {

        currentGalleryIndex = 0;

    }


    openGalleryImage(
        currentGalleryIndex
    );

}


/* =====================================================
   GALLERY PREVIOUS
===================================================== */

function previousGalleryImage() {

    if (
        allPhotos.length === 0
    ) {
        return;
    }


    currentGalleryIndex--;

    if (
        currentGalleryIndex < 0
    ) {

        currentGalleryIndex =
            allPhotos.length - 1;

    }


    openGalleryImage(
        currentGalleryIndex
    );

}


/* =====================================================
   STORY BUTTONS
===================================================== */

function setupStoryButtons() {

    const prev =
        document.getElementById(
            "prevBtn"
        );

    const next =
        document.getElementById(
            "nextBtn"
        );


    if (prev) {

        prev.addEventListener(
            "click",
            prevPhoto
        );

    }


    if (next) {

        next.addEventListener(
            "click",
            nextPhoto
        );

    }

}


/* =====================================================
   ERROR
===================================================== */

function showGalleryError(
    message
) {

    const loading =
        document.getElementById(
            "galleryLoading"
        );

    const errorBox =
        document.getElementById(
            "galleryError"
        );

    const errorText =
        document.getElementById(
            "galleryErrorText"
        );


    if (loading) {
        loading.style.display =
            "none";
    }


    if (errorBox) {
        errorBox.style.display =
            "block";
    }


    if (errorText) {
        errorText.textContent =
            message;
    }

}


/* =====================================================
   CONSOLE
===================================================== */

console.log(
    "Dhanula website loaded successfully."
);
