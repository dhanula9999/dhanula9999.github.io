const photoInput = document.getElementById("photoInput");
const gallery = document.getElementById("gallery");


// Load saved photos when website opens
window.addEventListener("load", loadPhotos);


// Upload photos
photoInput.addEventListener("change", function () {

    const files = Array.from(photoInput.files);

    files.forEach(file => {

        if (!file.type.startsWith("image/")) {
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            const photoData = event.target.result;

            savePhoto(photoData);

            displayPhoto(photoData);
        };

        reader.readAsDataURL(file);
    });

    photoInput.value = "";
});


// Save photo in browser storage
function savePhoto(photoData) {

    let photos = JSON.parse(localStorage.getItem("myPhotos")) || [];

    photos.push(photoData);

    localStorage.setItem("myPhotos", JSON.stringify(photos));
}


// Load photos
function loadPhotos() {

    let photos = JSON.parse(localStorage.getItem("myPhotos")) || [];

    photos.forEach(photo => {
        displayPhoto(photo);
    });
}


// Display photo
function displayPhoto(photoData) {

    const card = document.createElement("div");

    card.className = "photo-card";

    const image = document.createElement("img");

    image.src = photoData;

    image.alt = "My Photo";


    // Delete button
    const deleteButton = document.createElement("button");

    deleteButton.className = "delete-button";

    deleteButton.innerHTML = "×";

    deleteButton.title = "Delete photo";


    deleteButton.addEventListener("click", function(event) {

        event.stopPropagation();

        deletePhoto(photoData);

        card.remove();
    });


    card.appendChild(image);

    card.appendChild(deleteButton);

    gallery.appendChild(card);
}


// Delete photo
function deletePhoto(photoData) {

    let photos = JSON.parse(localStorage.getItem("myPhotos")) || [];

    photos = photos.filter(photo => photo !== photoData);

    localStorage.setItem("myPhotos", JSON.stringify(photos));
}
