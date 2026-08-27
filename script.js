/* =========================================================
   DHANULA | MY PERSONAL WEBSITE
   COMPLETE SCRIPT.JS
========================================================= */


/* ================= IMAGE VIEWER ================= */

function openImage(imageSource) {

    const modal = document.getElementById("imageModal");
    const fullImage = document.getElementById("fullImage");

    // Check if elements exist
    if (!modal || !fullImage) {
        console.error("Image viewer elements not found.");
        return;
    }

    // Set image
    fullImage.src = imageSource;

    // Show modal
    modal.style.display = "flex";

    // Prevent background scrolling
    document.body.style.overflow = "hidden";
}


/* ================= CLOSE IMAGE ================= */

function closeImage() {

    const modal = document.getElementById("imageModal");
    const fullImage = document.getElementById("fullImage");

    if (!modal) {
        return;
    }

    // Hide modal
    modal.style.display = "none";

    // Restore scrolling
    document.body.style.overflow = "";

    // Clear image after closing
    if (fullImage) {
        fullImage.src = "";
    }
}


/* ================= CLICK OUTSIDE IMAGE ================= */

document.addEventListener("DOMContentLoaded", function () {

    const modal = document.getElementById("imageModal");

    if (!modal) {
        return;
    }

    modal.addEventListener("click", function (event) {

        // Only close when clicking the dark background
        if (event.target === modal) {

            closeImage();

        }

    });

});


/* ================= ESC KEY ================= */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        const modal = document.getElementById("imageModal");

        if (modal && modal.style.display === "flex") {

            closeImage();

        }

    }

});


/* ================= IMAGE ERROR HANDLING ================= */

document.addEventListener("DOMContentLoaded", function () {

    const images = document.querySelectorAll("img");

    images.forEach(function (image) {

        image.addEventListener("error", function () {

            console.warn(
                "Image could not be loaded:",
                image.src
            );

            // Only apply fallback to gallery images
            if (image.closest(".photo-image")) {

                image.style.display = "none";

                image.parentElement.style.background =
                    "#dddddd";

            }

        });

    });

});


/* ================= PREVENT BROKEN IMAGE DRAG ================= */

document.addEventListener("DOMContentLoaded", function () {

    const galleryImages =
        document.querySelectorAll(".photo-image img");

    galleryImages.forEach(function (image) {

        image.addEventListener("dragstart", function (event) {

            event.preventDefault();

        });

    });

});


/* ================= MOBILE TOUCH SUPPORT ================= */

document.addEventListener("DOMContentLoaded", function () {

    const modal = document.getElementById("imageModal");

    if (!modal) {
        return;
    }

    let touchStartY = 0;
    let touchEndY = 0;


    modal.addEventListener("touchstart", function (event) {

        touchStartY = event.changedTouches[0].screenY;

    });


    modal.addEventListener("touchend", function (event) {

        touchEndY = event.changedTouches[0].screenY;

        handleSwipe();

    });


    function handleSwipe() {

        const swipeDistance =
            touchEndY - touchStartY;


        // Swipe down to close
        if (swipeDistance > 100) {

            closeImage();

        }

    }

});


/* ================= PAGE LOAD ================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log(
        "Dhanula Personal Website loaded successfully."
    );

});
