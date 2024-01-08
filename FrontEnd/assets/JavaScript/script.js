/*** DÉCLARATION DES VARIABLES ->  FILTRES & LOGIN ***/

let workData = []; // array pour stocker la data des works
let categoryData = []; // array pour stocker les data des categories
let workToDisplay = []; // array pour stocker les works à afficher à l'issu de la fonction showfilterwork()
let selectedCategory = 0; // variable pour initialiser l'id de la catagorie du Work
let userLoggedIn = localStorage.getItem("token"); // Varible pour stocker l'existence du token dans la session storage

const sectionGallery = document.querySelector(".gallery");
const buttonFiltre = document.querySelectorAll(".btn-filtre");
const sectionFiltres = document.querySelector(".filtres");
const modeEditionHeader = document.getElementById("modeEditionHeader");
const buttonChangePicture = document.getElementById("buttonChangePicture");
const buttonModifyProject = document.getElementById("buttonModifyProject");
const buttonLogIn = document.getElementById("buttonLogIn");
const buttonLogOut = document.getElementById("buttonLogOut");


/*** DÉCLARATION DES FONCTIONS -> FILTRES & LOGIN ***/

// Fonction pour récuperer les tout les works.
const getWorks = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => (workData = data));
};

// Fonction pour récuperer les catégories des works
const getCategory = async () => {
  await fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((data) => (categoryData = data));
};

// fonction pour créer dynamiquement les filtres des catégories
const createFilter = async () => {
  await getCategory();
  sectionFiltres.innerHTML =
    `<button class="btn-filtre" id="0">Tous</button>` +
    categoryData
      .map(
        (category) =>
          `
    <button class="btn-filtre" id="${category.id}">${category.name}</button>
    `
      )
      .join("");
};

// fonciton pour faire afficher les works de manière dynamique sur le DOM
const showWorks = async () => {
  await getWorks();
  sectionGallery.innerHTML = workData
    .map(
      (work) => ` 
    <figure>
    <img src= ${work.imageUrl} alt="${work.title}">
    <figcaption>${work.title}</figcaption>
    </figure>
  `
    )
    .join("");
};

// fonction pour créer les eventlistner sur les filtres générés sur le Dom
const createFilterEventlistner = async () => {
  await createFilter();
  const buttonFiltre = document.querySelectorAll(".btn-filtre");
  buttonFiltre.forEach((button) => {
    button.addEventListener("click", function () {
      showFilterWorks(parseInt(button.getAttribute("id")));
    });
  });
};

// fonction qui gère l'affichage des works sur le dom en fonction du filtre clické
const showFilterWorks = async (selectedCategory) => {
  await createFilterEventlistner();
  if (selectedCategory === 0) {
    workToDisplay = workData;
  } else {
    workToDisplay = workData.filter(function (workData) {
      return workData.categoryId === selectedCategory;
    });
  }
  sectionGallery.innerHTML = workToDisplay
    .map(
      (workToDisplay) => ` 
    <figure>
    <img src= ${workToDisplay.imageUrl} alt="${workToDisplay.title}">
    <figcaption>${workToDisplay.title}</figcaption>
    </figure>
  `
    )
    .join("");
};

// fonction pour determiner ce qu'on affiche ou ce qu'on retire de la page d'acceuil quand le token n'existe pas dans le LocalStorage donc utilisateur non connecté
const visitorPageConfiguration = () => {
  modeEditionHeader.style.display = "none";
  buttonLogOut.remove();
  buttonChangePicture.remove();
  buttonModifyProject.remove();
};

// fonction pour determiner ce qu'on affiche ou ce qu'on retire de la page d'acceuil quand le token existe dans le sessionStorage donc utilisateur est administrateur
const administratorPageConfiguration = () => {
  sectionFiltres.remove();
  buttonLogIn.remove();
};

// fonction pour gerer le changement de configuration en fonction de si l'utilisateur des connecté ou pas.
const changeConfiguration = () => {
  if (userLoggedIn) {
    administratorPageConfiguration();
  } else {
    visitorPageConfiguration();
  }
};

// fonction pour permettre a l'administrateur de logout. On clear le session storage ou est stocké le token. Puis on force un reload de la page en question. La page se reloadera en configuration visiteur puisque le token n'existe plus dans la session storage.
const endAdminSession = () => {
  buttonLogOut.addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.reload();
  });
};

/*** FOONCTION -> FILTRES & LOGIN ***/

showWorks(); // un premier appel de la fonction showWorks pour afficher tout les travaux a l'ecran lors du chargement
createFilterEventlistner(); // creation des eventListner sur les filtres pour afficher dynamiquement les travaux demandé
changeConfiguration(); // chargement des config de disposition de la page
endAdminSession(); // possibilité de se deconnecter
