/* =====================================================
   STORY DATA
===================================================== */

/*
    IMPORTANT:

    Your images must be inside:

    images/
    
    Example:

    images/china1.jpg
    images/china2.jpg
    images/nature1.jpg
    images/nature2.jpg
    images/travel1.jpg
    images/friends1.jpg
*/


const stories = [

    {
        name: "China",

        cover: "images/china1.jpg",

        images: [
            "images/china1.jpg",
            "images/china2.jpg"
        ]
    },


    {
        name: "Nature",

        cover: "images/nature1.jpg",

        images: [
            "images/nature1.jpg",
            "images/nature2.jpg"
        ]
    },


    {
        name: "Travel",

        cover: "images/travel1.jpg",

        images: [
            "images/travel1.jpg",
            "images/travel2.jpg"
        ]
    },


    {
        name: "Friends",

        cover: "images/friends1.jpg",

        images: [
            "images/friends1.jpg",
            "images/friends2.jpg"
        ]
    }

];


/* =====================================================
   VARIABLES
===================================================== */

let selectedStory = 0;

let currentImages = [];

let currentImageIndex = 0;


/* =====================================================
   DOM ELEMENTS
===================================================== */

const storyHighlights =
    document.getElementById("storyHighlights");

const storyGallery =
    document.getElementById("storyGallery");

const selectedStoryTitle =
    document.getElementById("selectedStoryTitle");

const storyCount =
    document.getElementById("storyCount");


/* =====================================================
   CREATE STORY HIGHLIGHTS
===================================================== */

function createStoryHighlights() {

    storyHighlights.innerHTML = "";


    stories.forEach(function(story, index) {

        const storyItem =
            document.createElement("div");

        storyItem.className =
            "story-highlight";


        if (index === selectedStory) {

            storyItem.classList.add("active");

        }


        storyItem.innerHTML = `

            <div class="story-circle">

                <img
                    src="${story.cover}"
                    alt="${story.name}"
                >

            </div>

            <span class="story-name">
                ${story.name}
            </span>

        `;


        storyItem.addEventListener(
            "click",
            function() {

                selectStory(index);

            }
        );


        storyHighlights.appendChild(storyItem);

    });


    /* ================= NEW BUTTON ================= */

    const newStory =
        document.createElement("div");

    newStory.className =
        "story-highlight new-story";


    newStory.innerHTML = `

        <div class="story-circle">
            +
        </div>

        <span class="story-name">
            New
        </span>

    `;


    newStory.addEventListener(
        "click",
        function() {

            alert(
                "To add a new Story section, add it inside the 'stories' array in script.js."
            );

        }
    );


    storyHighlights.appendChild(newStory);

}


/* =====================================================
   SELECT STORY
===================================================== */

function selectStory(index) {

    selectedStory = index;


    createStoryHighlights();


    displaySelectedStory();

}


/* =====================================================
   DISPLAY SELECTED STORY
===================================================== */

function displaySelectedStory() {

    const story =
        stories[selectedStory];


    if (!story) {

        return;

    }


    selectedStoryTitle.textContent =
        story.name;


    const total =
        story.images.length;


    storyCount.textContent =
        total === 1
            ? "1 memory"
            : `${total} memories`;


    storyGallery.innerHTML = "";


    currentImages =
        story.images;


    story.images.forEach(
        function(image, index) {

            const imageBox =
                document.createElement("div");


            imageBox.className =
                "story-image";


            imageBox.innerHTML = `

                <img
                    src="${image}"
                    alt="${story.name} memory"
                    loading="lazy"
                >

            `;


            imageBox.addEventListener(
                "click",
                function() {

                    openStoryImage(index);

                }
            );


            storyGallery.appendChild(
                imageBox
            );

        }
    );

}


/* =====================================================
   IMAGE MODAL
===================================================== */

const imageModal =
    document.getElementById("imageModal");

const fullImage =
    document.getElementById("fullImage");


/* =====================================================
   OPEN NORMAL IMAGE
===================================================== */

function openImage(imageSource) {

    currentImages = [
        imageSource
    ];

    currentImageIndex = 0;

    fullImage.src =
        imageSource;

    imageModal.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   OPEN STORY IMAGE
===================================================== */

function openStoryImage(index) {

    currentImageIndex =
        index;


    fullImage.src =
        currentImages[currentImageIndex];


    imageModal.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   CLOSE IMAGE
===================================================== */

function closeImage() {

    imageModal.classList.remove("show");

    fullImage.src = "";

    document.body.style.overflow =
        "";

}


/* =====================================================
   NEXT IMAGE
===================================================== */

function nextImage() {

    if (
        currentImages.length <= 1
    ) {

        return;

    }


    currentImageIndex++;

    
    if (
        currentImageIndex >=
        currentImages.length
    ) {

        currentImageIndex = 0;

    }


    fullImage.src =
        currentImages[currentImageIndex];

}


/* =====================================================
   PREVIOUS IMAGE
===================================================== */

function previousImage() {

    if (
        currentImages.length <= 1
    ) {

        return;

    }


    currentImageIndex--;


    if (
        currentImageIndex < 0
    ) {

        currentImageIndex =
            currentImages.length - 1;

    }


    fullImage.src =
        currentImages[currentImageIndex];

}


/* =====================================================
   CLICK OUTSIDE IMAGE
===================================================== */

imageModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === imageModal
        ) {

            closeImage();

        }

    }
);


/* =====================================================
   KEYBOARD CONTROLS
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        /* ESC */

        if (
            event.key === "Escape"
        ) {

            closeImage();

        }


        /* RIGHT ARROW */

        if (
            event.key === "ArrowRight"
        ) {

            nextImage();

        }


        /* LEFT ARROW */

        if (
            event.key === "ArrowLeft"
        ) {

            previousImage();

        }

    }
);


/* =====================================================
   TOUCH / SWIPE SUPPORT
===================================================== */

let touchStartX = 0;

let touchEndX = 0;


imageModal.addEventListener(
    "touchstart",
    function(event) {

        touchStartX =
            event.changedTouches[0].screenX;

    }
);


imageModal.addEventListener(
    "touchend",
    function(event) {

        touchEndX =
            event.changedTouches[0].screenX;


        handleSwipe();

    }
);


function handleSwipe() {

    const distance =
        touchEndX - touchStartX;


    if (
        Math.abs(distance) < 50
    ) {

        return;

    }


    if (distance < 0) {

        nextImage();

    }
    else {

        previousImage();

    }

}


/* =====================================================
   INITIALIZE WEBSITE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        createStoryHighlights();

        displaySelectedStory();

    }
);
