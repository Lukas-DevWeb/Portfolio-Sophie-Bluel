// Url de l'API 
const urlApi = "http://localhost:5678/api/";

// Liste des travaux qui est initié à zéro
let works = [];

async function allWorks() {
    try {
        const response = await fetch(urlApi + 'works', {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Unexpected Error');
        }

        const data = await response.json();

        works = data;
        window.localStorage.setItem('works', JSON.stringify(works));

        generateGallery(works);

        return works;

    } catch (error) {

        alert(error.message);
        throw error;
    }

}

// Quand un utilisateur se connecte
async function adminLogin() {
    if (window.sessionStorage.getItem('token') === null) {
        categoriesButtons();
    } else {
        logout();
        topBlackMenu();
        modifyProjets();
        modifyButton();
    }
}

// Catégories
async function categoriesButtons() {

    const response = await fetch(urlApi + 'categories',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

    // H2 : Mes projets
    const portfolio = document.querySelector('#portfolio');
    const myProject = document.createElement('h2');
    myProject.textContent = 'Mes Projets';
    const categories = await response.json();

    // Filtres Catégories
    const filtersButtons = document.createElement('div');
    filtersButtons.classList.add('categories');
    const categoriesButtons = document.createElement('button');
    categoriesButtons.textContent = 'Tous';
    categoriesButtons.classList.add('btn', 'all');
    filtersButtons.appendChild(categoriesButtons);
    portfolio.prepend(filtersButtons);
    portfolio.prepend(myProject);

    for (let categorie of categories) {
        //console.log(categorie);
        const button = document.createElement('button');
        button.setAttribute('class', 'btn');
        button.setAttribute('data-category-id', `${categorie.id}`);
        button.textContent = `${categorie.name}`;
        //console.log(button.dataset.categoryId);
        filtersButtons.appendChild(button);
    }

    let buttons = document.querySelectorAll('.btn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', showCategories);
    }

}

// Filtre à travers les catégories
function showCategories(event) {
    const works = JSON.parse(localStorage.getItem('works')); // recupère tableau works
    if (event.target.nodeName === 'BUTTON' && event.target.className === 'btn all') {
        allWorks();
    } else if (event.target.nodeName === 'BUTTON' && event.target.dataset.categoryId) {
        const workCategory = works.filter(i => i.categoryId == `${event.target.dataset.categoryId}`);
        generateGallery(workCategory);
    }
}

// Génère les projets
function generateGallery(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';
    for (let projet of works) {
        gallery.innerHTML += `<figure class="figureworks">
		 				<img src="${projet.imageUrl}" alt="${projet.title}">
		 				<figcaption>${projet.title}</figcaption>`;
    }
}

// Id Login - Logout
function logout() {
    const logoutElement = document.getElementById("logout");
    logoutElement.textContent = "logout";
    logoutElement.addEventListener('click', () => {
        window.sessionStorage.removeItem('token');
        alert('Vous avez été déconnecté.');
    });
}

// Générateur d'éléments DOM
function elementGenerator(type, text, attributes = []) {
    let element = document.createElement(type);
    if (text) {
        element.textContent = text;
    }
    attributes.forEach(attribute => {
        const [name, value] = attribute.split('=');
        element.setAttribute(name, value);
    });
    return element;
}

// Nav Edition
function topBlackMenu() {
    const div = elementGenerator('div', undefined, ['class=publish']);
    const modifyLink = elementGenerator('a', undefined, ['href=#']);
    const span = elementGenerator('span', 'Mode édition', []);
    const icon = elementGenerator('i', undefined, ['class=fa-regular fa-pen-to-square']);
    div.appendChild(modifyLink);
    document.querySelector('body').prepend(div);
    modifyLink.appendChild(icon);
    modifyLink.appendChild(span);
    div.appendChild(button);
}

// 'Mes projets' avec Lien Modifier 
function modifyProjets() {
    const portfolio = document.querySelector('#portfolio');
    const myProject = document.createElement('h2');
    myProject.textContent = 'Mes Projets';
    const aLink = elementGenerator('a', undefined, ['href=#modal1']);
    const iElement = elementGenerator('i', undefined, ['class=fa-regular fa-pen-to-square']);
    const spanElement = elementGenerator('span', 'modifier', []);
    aLink.appendChild(iElement);
    aLink.appendChild(spanElement);
    portfolio.prepend(myProject);
    myProject.appendChild(aLink);
}

allWorks();
adminLogin();