/* =====================================================
   STORY DATA
===================================================== */

const stories = [

    "stories/story1.jpg",

    "stories/story2.jpg"

];


let currentStory = 0;



/* =====================================================
   STORY VIEWER
===================================================== */

function openStory(index) {

    currentStory = index;

    const viewer =
        document.getElementById("storyViewer");

    viewer.classList.add("active");

    document.body.style.overflow = "hidden";

    showStory(currentStory);

}



/* =====================================================
   SHOW STORY
===================================================== */

function showStory(index) {

    const image =
        document.getElementById(
            "storyViewerImage"
        );


    image.src = stories[index];


    updateStoryProgress();

}



/* =====================================================
   NEXT STORY
===================================================== */

function nextStory() {

    currentStory++;

    if (currentStory >= stories.length) {

        currentStory = 0;

    }

    showStory(currentStory);

}



/* =====================================================
   PREVIOUS STORY
===================================================== */

function previousStory() {

    currentStory--;

    if (currentStory < 0) {

        currentStory =
            stories.length - 1;

    }

    showStory(currentStory);

}



/* =====================================================
   STORY PROGRESS
===================================================== */

function updateStoryProgress() {

    const progress =
        document.getElementById(
            "storyProgress"
        );


    progress.innerHTML = "";


    stories.forEach(
        function(story, index) {

            const bar =
                document.createElement("span");


            if (index === currentStory) {

                bar.classList.add("active");

            }


            progress.appendChild(bar);

        }
    );

}



/* =====================================================
   CLOSE STORY
===================================================== */

function closeStory() {

    const viewer =
        document.getElementById(
            "storyViewer"
        );


    viewer.classList.remove("active");


    document.body.style.overflow = "";

}



/* =====================================================
   PHOTO VIEWER
===================================================== */

function openImage(imageSource) {

    const modal =
        document.getElementById(
            "imageModal"
        );


    const fullImage =
        document.getElementById(
            "fullImage"
        );


    fullImage.src = imageSource;


    modal.classList.add("active");


    document.body.style.overflow =
        "hidden";

}



/* =====================================================
   CLOSE PHOTO
===================================================== */

function closeImage() {

    const modal =
        document.getElementById(
            "imageModal"
        );


    modal.classList.remove("active");


    document.body.style.overflow = "";

}



/* =====================================================
   CLICK OUTSIDE PHOTO
===================================================== */

document
    .getElementById("imageModal")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                closeImage();

            }

        }
    );



/* =====================================================
   CLICK OUTSIDE STORY
===================================================== */

document
    .getElementById("storyViewer")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                closeStory();

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

            closeStory();

            closeImage();

        }



        /* STORY NEXT */

        if (
            event.key === "ArrowRight"
        ) {

            const viewer =
                document.getElementById(
                    "storyViewer"
                );


            if (
                viewer.classList.contains(
                    "active"
                )
            ) {

                nextStory();

            }

        }



        /* STORY PREVIOUS */

        if (
            event.key === "ArrowLeft"
        ) {

            const viewer =
                document.getElementById(
                    "storyViewer"
                );


            if (
                viewer.classList.contains(
                    "active"
                )
            ) {

                previousStory();

            }

        }

    }
);



/* =====================================================
   TOUCH / SWIPE SUPPORT
===================================================== */

let touchStartX = 0;

let touchEndX = 0;



document
    .getElementById("storyViewer")
    .addEventListener(
        "touchstart",
        function(event) {

            touchStartX =
                event.changedTouches[0].screenX;

        }
    );



document
    .getElementById("storyViewer")
    .addEventListener(
        "touchend",
        function(event) {

            touchEndX =
                event.changedTouches[0].screenX;


            handleSwipe();

        }
    );



function handleSwipe() {

    const difference =
        touchStartX - touchEndX;


    /* SWIPE LEFT */

    if (
        difference > 50
    ) {

        nextStory();

    }


    /* SWIPE RIGHT */

    if (
        difference < -50
    ) {

        previousStory();

    }

}
