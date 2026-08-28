/* =====================================================
   STORY DATA
===================================================== */

/*
    Oya aluth story section ekak add karanna one nam
    me list ekata aluth object ekak add karanna.

    Example:

    {
        name: "China",
        cover: "stories/china1.jpg",
        stories: [
            "stories/china1.jpg",
            "stories/china2.jpg",
            "stories/china3.jpg"
        ]
    }
*/

const storySections = [

    {
        name: "China",
        cover: "stories/story1.jpg",

        stories: [
            "stories/story1.jpg"
        ]
    },


    {
        name: "Nature",
        cover: "stories/story2.jpg",

        stories: [
            "stories/story2.jpg"
        ]
    },


    /*
        MEHEMA THAWA SECTIONS ADD KARANNA PULUWAN.

        Example:

        {
            name: "Travel",
            cover: "stories/story3.jpg",

            stories: [
                "stories/story3.jpg",
                "stories/story4.jpg",
                "stories/story5.jpg"
            ]
        },

    */

];


/* =====================================================
   VARIABLES
===================================================== */

const storyHighlights =
    document.getElementById("storyHighlights");

const storyGrid =
    document.getElementById("storyGrid");

const selectedStory =
    document.getElementById("selectedStory");

const selectedStoryTitle =
    document.getElementById("selectedStoryTitle");

const storyCount =
    document.getElementById("storyCount");

const storyViewer =
    document.getElementById("storyViewer");

const viewerImage =
    document.getElementById("viewerImage");

const viewerTitle =
    document.getElementById("viewerTitle");

const viewerCounter =
    document.getElementById("viewerCounter");

const storyProgress =
    document.getElementById("storyProgress");


let currentSection = 0;

let currentStory = 0;


/* =====================================================
   CREATE STORY HIGHLIGHTS
===================================================== */

function createStoryHighlights() {

    storyHighlights.innerHTML = "";


    storySections.forEach((section, index) => {

        const highlight =
            document.createElement("div");

        highlight.className =
            "story-highlight";


        highlight.innerHTML = `

            <div class="story-circle">

                <img
                    src="${section.cover}"
                    alt="${section.name}"
                >

            </div>

            <div class="story-name">
                ${section.name}
            </div>

        `;


        highlight.addEventListener(
            "click",
            function () {

                selectStorySection(index);

            }
        );


        storyHighlights.appendChild(highlight);

    });


    /*
        NEW BUTTON
    */

    const newStory =
        document.createElement("div");

    newStory.className =
        "story-highlight new-story";


    newStory.innerHTML = `

        <div class="story-circle">

            <div class="new-plus">
                +
            </div>

        </div>

        <div class="story-name">
            New
        </div>

    `;


    newStory.addEventListener(
        "click",
        function () {

            alert(
                "To add a new Story section, add it inside the storySections list in script.js."
            );

        }
    );


    storyHighlights.appendChild(newStory);

}


/* =====================================================
   SELECT STORY SECTION
===================================================== */

function selectStorySection(index) {

    currentSection = index;

    currentStory = 0;


    const section =
        storySections[index];


    selectedStoryTitle.textContent =
        section.name;


    storyCount.textContent =
        `${section.stories.length} ${
            section.stories.length === 1
                ? "memory"
                : "memories"
        }`;


    storyGrid.innerHTML = "";


    section.stories.forEach(
        (image, storyIndex) => {

            const storyItem =
                document.createElement("div");

            storyItem.className =
                "story-item";


            storyItem.innerHTML = `

                <img
                    src="${image}"
                    alt="${section.name} story"
                >

            `;


            storyItem.addEventListener(
                "click",
                function () {

                    openStoryViewer(
                        index,
                        storyIndex
                    );

                }
            );


            storyGrid.appendChild(storyItem);

        }
    );


    /*
        ACTIVE CIRCLE
    */

    const highlights =
        document.querySelectorAll(
            ".story-highlight:not(.new-story)"
        );


    highlights.forEach(
        (item, itemIndex) => {

            item.classList.toggle(
                "active",
                itemIndex === index
            );

        }
    );


    /*
        Smooth scroll to selected stories
    */

    setTimeout(
        function () {

            selectedStory.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        },
        100
    );

}


/* =====================================================
   OPEN STORY VIEWER
===================================================== */

function openStoryViewer(
    sectionIndex,
    storyIndex
) {

    currentSection =
        sectionIndex;

    currentStory =
        storyIndex;


    storyViewer.classList.add("show");

    document.body.style.overflow = "hidden";


    updateStoryViewer();

}


/* =====================================================
   UPDATE STORY VIEWER
===================================================== */

function updateStoryViewer() {

    const section =
        storySections[currentSection];


    const stories =
        section.stories;


    const image =
        stories[currentStory];


    viewerImage.src =
        image;


    viewerTitle.textContent =
        section.name;


    viewerCounter.textContent =
        `${currentStory + 1} / ${stories.length}`;


    createProgressBars(
        stories.length
    );

}


/* =====================================================
   PROGRESS BARS
===================================================== */

function createProgressBars(total) {

    storyProgress.innerHTML = "";


    for (
        let i = 0;
        i < total;
        i++
    ) {

        const bar =
            document.createElement("div");

        bar.className =
            "progress-bar";


        if (
            i === currentStory
        ) {

            bar.classList.add("active");

        }


        storyProgress.appendChild(bar);

    }

}


/* =====================================================
   NEXT STORY
===================================================== */

function nextStory() {

    const section =
        storySections[currentSection];


    if (
        currentStory <
        section.stories.length - 1
    ) {

        currentStory++;

        updateStoryViewer();

    }

    else {

        /*
            Last story eka.
            Next section ekata yanna.
        */

        if (
            currentSection <
            storySections.length - 1
        ) {

            currentSection++;

            currentStory = 0;

            updateStoryViewer();

        }

        else {

            closeStoryViewer();

        }

    }

}


/* =====================================================
   PREVIOUS STORY
===================================================== */

function previousStory() {

    if (currentStory > 0) {

        currentStory--;

        updateStoryViewer();

    }

    else if (currentSection > 0) {

        currentSection--;

        const previousSection =
            storySections[currentSection];

        currentStory =
            previousSection.stories.length - 1;

        updateStoryViewer();

    }

}


/* =====================================================
   CLOSE STORY VIEWER
===================================================== */

function closeStoryViewer() {

    storyViewer.classList.remove("show");

    document.body.style.overflow = "";

}


/* =====================================================
   KEYBOARD CONTROLS
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            !storyViewer.classList.contains("show")
        ) {

            return;

        }


        if (event.key === "ArrowRight") {

            nextStory();

        }


        if (event.key === "ArrowLeft") {

            previousStory();

        }


        if (event.key === "Escape") {

            closeStoryViewer();

        }

    }
);


/* =====================================================
   SWIPE SUPPORT FOR MOBILE
===================================================== */

let touchStartX = 0;

let touchEndX = 0;


storyViewer.addEventListener(
    "touchstart",
    function (event) {

        touchStartX =
            event.changedTouches[0].screenX;

    }
);


storyViewer.addEventListener(
    "touchend",
    function (event) {

        touchEndX =
            event.changedTouches[0].screenX;


        handleSwipe();

    }
);


function handleSwipe() {

    const difference =
        touchStartX - touchEndX;


    if (
        Math.abs(difference) < 50
    ) {

        return;

    }


    if (difference > 0) {

        nextStory();

    }

    else {

        previousStory();

    }

}


/* =====================================================
   NORMAL IMAGE VIEWER
===================================================== */

function openImage(imageSource) {

    const modal =
        document.getElementById("imageModal");

    const fullImage =
        document.getElementById("fullImage");


    fullImage.src =
        imageSource;


    modal.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   CLOSE NORMAL IMAGE VIEWER
===================================================== */

function closeImage() {

    const modal =
        document.getElementById("imageModal");


    modal.classList.remove("show");

    document.body.style.overflow =
        "";

}


/* =====================================================
   CLOSE NORMAL IMAGE WHEN OUTSIDE CLICK
===================================================== */

function closeImageOutside(event) {

    if (
        event.target.id ===
        "imageModal"
    ) {

        closeImage();

    }

}


/* =====================================================
   ESCAPE FOR NORMAL IMAGE
===================================================== */

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


/* =====================================================
   INITIALIZE WEBSITE
===================================================== */

createStoryHighlights();


/*
    First story section automatically selected
*/

if (
    storySections.length > 0
) {

    selectStorySection(0);

}
