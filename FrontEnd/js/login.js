const loginForm = document.getElementById('login');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const url = 'http://localhost:5678/api/users/login';


loginForm.addEventListener('submit', async (event) => {
    // Empêche le formulaire de se soumettre
    event.preventDefault();

    // Vérifie que les champs sont remplis
    if (emailInput.value === '' || passwordInput.value === '') {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    // Vérifie si l'utilisateur est déjà connecté
    if (window.sessionStorage.getItem('token') !== null) {
        alert('Vous êtes déjà connecté');
        return;
    }

    try {
        // Envoi une requête de connexion
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value,
            })
        });

        // Vérifie si la connexion a réussi
        if (response.status !== 200) {
            const error = await response.json();
            throw new Error(`Error: ${error.message}`);
        }

        // Enregistre le jeton de connexion dans la session
        const result = await response.json();
        const token = result.token;
        window.sessionStorage.setItem('token', token);

        // Redirige l'utilisateur vers la page d'accueil
        window.location = 'index.html';

        // Affiche un message de confirmation
        alert('Connexion réussie !');

    } catch (error) {
        // Affiche un message d'erreur
        errorMessage();
    }
});

// Message d'erreur
function errorMessage() {
    const error = document.createElement('p');
    error.textContent = 'Erreur dans l’identifiant ou le mot de passe';
    error.setAttribute('id', 'errorMessage');
    loginForm.appendChild(error);
  }