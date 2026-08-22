const photoInput = document.getElementById("photoInput");
const galleryContainer = document.getElementById("galleryContainer");

photoInput.addEventListener("change", function () {

    const files = this.files;

    for (let file of files) {

        if (!file.type.startsWith("image/")) {
            continue;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            const photoCard = document.createElement("div");

            photoCard.className = "photo-card";

            photoCard.innerHTML = `
                <img src="${event.target.result}" alt="My Photo">

                <button class="delete-btn">
                    Delete
                </button>
            `;

            photoCard
                .querySelector(".delete-btn")
                .addEventListener("click", function () {

                    photoCard.remove();

                });

            galleryContainer.appendChild(photoCard);
        };

        reader.readAsDataURL(file);
    }

    photoInput.value = "";
});
