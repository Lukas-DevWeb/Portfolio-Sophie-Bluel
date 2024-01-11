// Modale
const aLink = document.querySelector("#portfolio a");
const modal1 = document.querySelector("#modal_1");
const closeModal1 = document.querySelector("#modal_close");
const addPhotoButton = document.querySelector(".submit_button");
const modal2 = document.querySelector("#modal_2");
const closeModal2 = document.querySelector("#modal_close2");
const arrowModal = document.querySelector("#modal_arrow");

// Fonction pour ouvrir une modale
function openModal(modal) {
    modal.style.display = "flex";
}

// Fonction pour fermer une modale
function closeModal(modal) {
    modal.style.display = "none";
}

// Ouverture de la première modale
aLink.addEventListener('click', function () {
    openModal(modal1);
});

// Fermeture de la première modale
closeModal1.addEventListener('click', function () {
    closeModal(modal1);
});

// Fermeture de la première modale en cliquant en dehors de la fenêtre
window.addEventListener("click", (event) => {
    if (event.target === modal1) {
        closeModal(modal1);
    }
});

// Fermeture de la deuxième modale en cliquant en dehors de la fenêtre
window.addEventListener("click", (event) => {
    if (event.target === modal2) {
        closeModal(modal2);
    }
});

// Ouverture de la deuxième modale
addPhotoButton.addEventListener('click', function () {
    closeModal(modal1);
    openModal(modal2);
});

// Fermeture de la deuxième modale
closeModal2.addEventListener('click', function () {
    closeModal(modal2);
});

// Retour à la première modale
arrowModal.addEventListener('click', function () {
    openModal(modal1);
    closeModal(modal2);
});

// Modale Galerie - Supression travaux 

// URL de l'API qui fournit les projets
const urlWorks = "http://localhost:5678/api/works";
const token = sessionStorage.getItem("token");

const deleteProject = async (projectId) => {
    try {

        // Envoi une requête DELETE pour supprimer le projet
        const response = await fetch(`${urlWorks}/${projectId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error("Unexpected Error");
        }

        // Supprime l'élément HTML correspondant au projet supprimé 
        const deletedProjectElement = document.querySelector(`.modal_figure[data-project-id="${projectId}"]`);
        if (deletedProjectElement) {
            deletedProjectElement.remove();
        }

        // Actualise la modale 
        await displayProjects();

        // Actualise la galerie 
        await displayGallery();

    } catch (error) {
        console.error(error);
    }
}

// Projets Modale
const displayProjects = async () => {
    try {
        const response = await fetch(urlWorks);
        if (!response.ok) {
            if (response.status === 500) {
                throw new Error("Unexpected Error");
            } else if (response.status === 401) {
                throw new Error("Unauthorized");
            }
        }

        const works = await response.json();
        const figuresContainer = document.querySelector("#modal_figures");
        figuresContainer.innerHTML = ""; // vider le conteneur avant d'afficher les projets

        if (works.length === 0) {
            document.querySelector("#empty-gallery-msg").style.display = "block"; // afficher le message "galerie vide"
            return;
        } else {
            document.querySelector("#empty-gallery-msg").style.display = "none";
        }

        // Boucler sur tous les projets
        for (const project of works) {
            const figureModal = document.createElement("figure");
            figureModal.classList.add("modal_figure");

            // Image
            const imageModal = document.createElement("img");
            imageModal.classList.add("modal_works");
            imageModal.src = project.imageUrl;
            imageModal.alt = project.title;

            // Bouton de suppression
            const deleteBtn = document.createElement("div");
            deleteBtn.classList.add("delete-btn");
            deleteBtn.dataset.projectId = project.id;
            const iconDeleteModal = document.createElement("i");
            iconDeleteModal.classList.add("fa-solid", "fa-trash-can");

            // Ajoute un événement de clic sur l'icône de suppression pour chaque projet
            deleteBtn.addEventListener("click", async () => {
                if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
                    await deleteProject(project.id);
                }
            });

            // Bouton de déplacement
            const moveBtn = document.createElement("div");
            moveBtn.classList.add("move-btn");
            const iconMoveModal = document.createElement("i");
            iconMoveModal.classList.add("fa-solid", "fa-arrows-up-down-left-right");

            // Lien d'édition
            const captionModal = document.createElement("figcaption");
            const linkCaptionModal = document.createElement("a");
            linkCaptionModal.href = "#";
            linkCaptionModal.textContent = "éditer";

            // Ajouter tous les éléments au DOM
            figureModal.appendChild(imageModal);
            figureModal.appendChild(deleteBtn);
            deleteBtn.appendChild(iconDeleteModal);
            figureModal.appendChild(moveBtn);
            moveBtn.appendChild(iconMoveModal);
            captionModal.appendChild(linkCaptionModal);
            figureModal.appendChild(captionModal);
            figuresContainer.appendChild(figureModal);
        }
    } catch (error) {
        console.error(error);
    }
};


// Supprime toute la gallerie
async function deleteAllProjects() {
    try {
        const works = await fetch(urlWorks).then(response => response.json());
        while (works.length > 0) {
            const projectId = works[0].id;
            const response = await fetch(`${urlWorks}/${projectId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                works.shift(); // supprime le premier élément de l'array
                //console.log(`Projet ${projectId} supprimé avec succès.`);
            } else {
                //console.log(`La suppression du projet ${projectId} a échoué.`);
            }
        }
        alert("Tous les projets ont été supprimés avec succès.");
    } catch (error) {
        console.error(error);
    }
}

const deleteGalleryBtn = document.querySelector("#delete_gallery");
deleteGalleryBtn.addEventListener("click", deleteAllProjects);


// Modale Ajout - Ajout travaux
const imagePreview = document.getElementById("imagePreview");
imagePreview.style.display = "none";

function previewImage(event) {
    const file = event.target.files[0]; // Vérifie si un fichier a été sélectionné
    if (file) {
        if (file.type.match("image.*")) {
            if (file.size <= 4194304) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    imagePreview.src = event.target.result;
                    document.getElementById("imagePreview").style.display = "block";
                    document.getElementsByClassName("image_container")[0].style.display = "none";
                    document.getElementById("input_image_container").style.display = "none";
                    imagePreview.style.display = "block";
                };
                reader.readAsDataURL(file);
            } else {
                alert("Le fichier dépasse la taille maximale autorisée de 4 Mo.");
                imagePreview.style.display = "none";
            }
        } else {
            alert("Le fichier sélectionné n'est pas une image.");
            imagePreview.innerHTML = "";
            imagePreview.style.display = "none";
        }
    } else {
        imagePreview.style.display = "none";
    }
}

// Ajout photos
const btnAddProjet = document.querySelector(".submit_button2");
btnAddProjet.addEventListener("click", addWork);

const title = document.querySelector("#input-title");
const category = document.querySelector("#category");
const image = document.querySelector("#file");
const submitButton = document.querySelector(".submit_button2");

title.addEventListener("change", checkForm);
category.addEventListener("change", checkForm);
image.addEventListener("change", checkForm);

// Met à jour la couleur du bouton Valider
function checkForm() {
    if (title.value !== "" && category.value !== "" && image.files[0] !== undefined) {
        submitButton.style.backgroundColor = "#1D6154";
    } else {
        submitButton.style.backgroundColor = "#A7A7A7";
    }
}

const workElement = document.createElement("figure");
workElement.classList.add("figureworks");

async function addWork(event) {
    event.preventDefault();

    // Vérifie les champs pour être sûr qu'ils sont tous remplis
    if (title.value === "" || category.value === "" || image.files[0] === undefined) {
        alert("Veuillez remplir tous les champs pour continuer.");
        return;
    }

    try {
        const formData = new FormData();
        formData.append("title", title.value);
        formData.append("category", category.value);
        formData.append("image", image.files[0]);

        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        // Vérifie la réponse du serveur
        if (response.status === 201) {

            // Ferme la modale et rénitialise le formulaire
            modal2.style.display = "none";
            modal1.style.display = "flex";

            // Ajoute le projet dans la galerie
            await displayGallery();

            // Ajoute le projet dans la modale 
            await displayProjects();

            // Réinitialise le formulaire après publication
            resetForm();

        } else {
            alert("Une erreur s'est produite. Veuillez réessayer plus tard.");
        }
    } catch (error) {
        console.error(error);
        alert("Une erreur s'est produite. Veuillez réessayer plus tard.");
    }
}

// Projets Galerie
async function displayGallery() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        const gallery = document.querySelector(".gallery");

        // Supprime tous les enfants de la galerie
        gallery.innerHTML = "";

        // Ajoute chaque projet dans la galerie
        works.forEach((work) => {
            const workElement = document.createElement("figure");
            workElement.classList.add("figureworks");
            const imageSrc = `${work.imageUrl}`;
            workElement.innerHTML = `
                <img src="${imageSrc}" alt="${work.title}" />
                <figcaption>${work.title}</figcaption>
                `;
            gallery.appendChild(workElement);
        });
    } catch (error) {
        console.error(error);
        alert("Une erreur s'est produite lors de l'affichage de la galerie.");
    }
}

// Réinitialise le formulaire
function resetForm() {
    imagePreview.style.display = "none";
    document.getElementsByClassName("image_container")[0].style.display = "flex";
    document.getElementById("input_image_container").style.display = "block";
    document.getElementById("formAddImage").reset();
}


checkForm();
displayProjects()