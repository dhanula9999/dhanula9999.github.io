/* =====================================================
   STORY DATA
===================================================== */

const stories = {

    china: {

        title: "China",

        photos: [

            {
                image: "images/china1.jpg",
                title: "China",
                description: "A beautiful night in China."
            },

            {
                image: "images/china2.jpg",
                title: "China Memory",
                description: "Another special moment."
            }

        ]

    },


    nature: {

        title: "Nature",

        photos: [

            {
                image: "images/nature1.jpg",
                title: "Nature",
                description: "A peaceful moment surrounded by nature."
            },

            {
                image: "images/nature2.jpg",
                title: "Beautiful Nature",
                description: "A beautiful place to remember."
            }

        ]

    },


    travel: {

        title: "Travel",

        photos: [

            {
                image: "images/travel1.jpg",
                title: "Travel",
                description: "Exploring a new place."
            },

            {
                image: "images/travel2.jpg",
                title: "Travel Memory",
                description: "A special moment from my journey."
            }

        ]

    },


    friends: {

        title: "Friends",

        photos: [

            {
                image: "images/friends1.jpg",
                title: "Friends",
                description: "Good times with friends."
            },

            {
                image: "images/friends2.jpg",
                title: "Good Times",
                description: "A memory worth keeping."
            }

        ]

    }

};


/* =====================================================
   SELECT STORY
===================================================== */

function selectStory(storyName) {

    const story = stories[storyName];

    if (!story) {
        return;
    }


    /* ------------------------------
       Change active highlight
    ------------------------------ */

    const highlights =
        document.querySelectorAll(".story-highlight");


    highlights.forEach(function(item) {

        item.classList.remove("active");

    });


    const selected =
        document.querySelector(
            `.story-highlight[data-story="${storyName}"]`
        );


    if (selected) {

        selected.classList.add("active");

    }


    /* ------------------------------
       Change title
    ------------------------------ */

    const selectedTitle =
        document.getElementById("selectedTitle");


    selectedTitle.textContent =
        story.title;


    /* ------------------------------
       Change memory count
    ------------------------------ */

    const memoryCount =
        document.getElementById("memoryCount");


    const total =
        story.photos.length;


    memoryCount.textContent =
        total +
        (total === 1 ? " memory" : " memories");


    /* ------------------------------
       Get grid
    ------------------------------ */

    const memoryGrid =
        document.getElementById("memoryGrid");


    memoryGrid.innerHTML = "";


    /* ------------------------------
       Create cards
    ------------------------------ */

    story.photos.forEach(function(photo) {

        const card =
            document.createElement("div");


        card.className =
            "memory-card";


        card.innerHTML = `

            <img
                src="${photo.image}"
                alt="${photo.title}"
                onclick="openImage('${photo.image}')"
            >

            <div class="memory-info">

                <h4>
                    ${photo.title}
                </h4>

                <p>
                    ${photo.description}
                </p>

            </div>

        `;


        memoryGrid.appendChild(card);

    });

}


/* =====================================================
   NEW STORY BUTTON
===================================================== */

function showNewStoryMessage() {

    alert(
        "You can create a new Story Highlight here later."
    );

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


    const fullImage =
        document.getElementById("fullImage");


    modal.style.display =
        "none";


    fullImage.src =
        "";


    document.body.style.overflow =
        "";

}


/* =====================================================
   CLOSE WHEN CLICKING OUTSIDE IMAGE
===================================================== */

document
    .getElementById("imageModal")
    .addEventListener("click", function(event) {

        if (
            event.target === this
        ) {

            closeImage();

        }

    });


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

        selectStory("china");

    }
);
