/* =====================================================
   STORY DATA
===================================================== */

/*
    Add your story images here.

    Example:

    China:
        stories/story1.jpg

    Nature:
        stories/story2.jpg

    If you want more photos inside a category,
    simply add more image paths.
*/


const stories = {

    china: {

        title: "China",

        images: [

            "stories/story1.jpg"

        ]

    },


    nature: {

        title: "Nature",

        images: [

            "stories/story2.jpg"

        ]

    },


    travel: {

        title: "Travel",

        images: [

            "stories/story3.jpg"

        ]

    },


    friends: {

        title: "Friends",

        images: [

            "stories/story4.jpg"

        ]

    },


    new: {

        title: "New",

        images: []

    }

};



/* =====================================================
   SHOW STORY
===================================================== */

function showStory(storyName, clickedButton) {


    const story = stories[storyName];


    if (!story) {

        return;

    }


    /* TITLE */

    const title =
        document.getElementById("storyTitle");


    const count =
        document.getElementById("storyCount");


    const gallery =
        document.getElementById("storyGallery");


    title.textContent =
        story.title;



    /* REMOVE ACTIVE */

    document
        .querySelectorAll(".story-highlight")
        .forEach(button => {

            button.classList.remove("active");

        });


    /* ADD ACTIVE */

    clickedButton.classList.add("active");



    /* CLEAR GALLERY */

    gallery.innerHTML = "";



    /* EMPTY STORY */

    if (story.images.length === 0) {


        count.textContent =
            "No memories";


        gallery.innerHTML = `

            <div class="no-stories">

                <p>
                    No memories added yet.
                </p>

            </div>

        `;


        return;

    }



    /* COUNT */

    count.textContent =
        story.images.length +
        (
            story.images.length === 1
                ? " memory"
                : " memories"
        );



    /* ADD IMAGES */

    story.images.forEach(image => {


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


        img.loading =
            "lazy";


        /* OPEN FULL IMAGE */

        img.onclick = function () {

            openImage(image);

        };


        item.appendChild(img);


        gallery.appendChild(item);

    });

}



/* =====================================================
   IMAGE VIEWER
===================================================== */

function openImage(imageSource) {


    const modal =
        document.getElementById("imageModal");


    const fullImage =
        document.getElementById("fullImage");


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
        "";

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
   ESC KEY
===================================================== */

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
   LOAD FIRST STORY
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
                "china",
                firstStory
            );

        }

    }
);
