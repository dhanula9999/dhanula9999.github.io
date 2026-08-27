// ================= IMAGE VIEWER =================

function openImage(imageSource) {

    const modal = document.getElementById("imageModal");
    const fullImage = document.getElementById("fullImage");

    fullImage.src = imageSource;

    modal.style.display = "flex";
}


// CLOSE IMAGE

function closeImage() {

    const modal = document.getElementById("imageModal");

    modal.style.display = "none";
}


// CLOSE WHEN CLICKING OUTSIDE IMAGE

document.getElementById("imageModal").addEventListener("click", function(event) {

    if (event.target === this) {

        closeImage();

    }

});


// CLOSE WITH ESC KEY

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeImage();

    }

});