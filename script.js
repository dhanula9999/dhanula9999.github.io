/* =====================================================
   STORY DATA
===================================================== */

const stories = {

    story1: {

        title: "Memories",

        images: [
            "stories/story1.jpg"
        ]

    },


    story2: {

        title: "Nature",

        images: [
            "stories/story2.jpg"
        ]

    }

};



/* =====================================================
   SHOW STORY SECTION
===================================================== */

function showStory(storyId, selectedElement) {

    const story = stories[storyId];

    if (!story) {
        return;
    }


    /* Change active circle */

    const allHighlights =
        document.querySelectorAll(".story-highlight");

    allHighlights.forEach(function(item) {

        item.classList.remove("active");

    });


    if (selectedElement) {

        selectedElement.classList.add("active");

    }



    /* Change title */

    const title =
        document.getElementById("storyTitle");

    title.textContent =
        story.title;



    /* Change count */

    const count =
        document.getElementById("storyCount");

    const number =
        story.images.length;

    count.textContent =
        number === 1
            ? "1 memory"
            : number + " memories";



    /* Get story content */

    const content =
        document.getElementById("storyContent");


    content.innerHTML = "";



    /* Add images */

    story.images.forEach(function(image) {

        const item =
            document.createElement("div");

        item.className =
            "story-item";


        const img =
            document.createElement("img");

        img.src =
            image;

        img.alt =
            story.title;


        img.onclick =
            function() {

                openImage(this.src);

            };


        item.appendChild(img);

        content.appendChild(item);

    });

}



/* =====================================================
   IMAGE VIEWER
===================================================== */

let currentImages = [];

let currentIndex = 0;



function openImage(imageSource) {

    const modal =
        document.getElementById("imageModal");

    const fullImage =
        document.getElementById("fullImage");


    /*
       Collect all images from
       gallery + current story
    */

    currentImages =
        Array.from(
            document.querySelectorAll(
                ".gallery img, .story-content img"
            )
        )
        .map(function(img) {

            return img.src;

        });


    currentIndex =
        currentImages.indexOf(imageSource);


    if (currentIndex === -1) {

        currentIndex = 0;

        currentImages = [
            imageSource
        ];

    }


    fullImage.src =
        imageSource;


    modal.style.display =
        "flex";


    document.body.style.overflow =
        "hidden";

}



/* =====================================================
   CLOSE IMAGE
===================================================== */

function closeImage() {

    const modal =
        document.getElementById("imageModal");


    modal.style.display =
        "none";


    document.body.style.overflow =
        "auto";

}



/* =====================================================
   NEXT IMAGE
===================================================== */

function nextImage() {

    if (currentImages.length === 0) {
        return;
    }


    currentIndex++;


    if (currentIndex >= currentImages.length) {

        currentIndex = 0;

    }


    document.getElementById("fullImage").src =
        currentImages[currentIndex];

}



/* =====================================================
   PREVIOUS IMAGE
===================================================== */

function previousImage() {

    if (currentImages.length === 0) {
        return;
    }


    currentIndex--;


    if (currentIndex < 0) {

        currentIndex =
            currentImages.length - 1;

    }


    document.getElementById("fullImage").src =
        currentImages[currentIndex];

}



/* =====================================================
   CLOSE WHEN CLICKING OUTSIDE
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
   KEYBOARD CONTROLS
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {


        if (event.key === "Escape") {

            closeImage();

        }


        if (event.key === "ArrowRight") {

            nextImage();

        }


        if (event.key === "ArrowLeft") {

            previousImage();

        }

    }
);



/* =====================================================
   INITIAL STORY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const firstStory =
            document.querySelector(
                ".story-highlight"
            );


        if (firstStory) {

            showStory(
                "story1",
                firstStory
            );

        }

    }
);
