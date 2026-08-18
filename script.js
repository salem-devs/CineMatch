const apiKey = "840304608d90b96564a264a491917970";
const apiUrl = "https://api.themoviedb.org/3";
const moviesContainer = document.getElementById("moviesContainer");
const loader = document.getElementById("loader");
const errorMessage = document.getElementById("errorMessage");
const searchInput = document.getElementById("searchInput");
const movieModal = document.getElementById("movieModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalContent = document.getElementById("modalContent");
const favoritesBtn = document.getElementById("favoritesBtn");

let movies = [];
let currentMovies = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


// Récupérer les films populaires
async function getPopularMovies() {

    try {

        loader.style.display = "block";
        errorMessage.textContent = "";

        const response = await fetch(
            `${apiUrl}/movie/popular?api_key=${apiKey}&language=fr-FR`
        );

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des films");
        }

        const data = await response.json();

        movies = data.results;

        displayMovies(movies);

    } catch (error) {

        console.error(error);

        errorMessage.textContent =
            "Impossible de charger les films.";

    } finally {

        loader.style.display = "none";

    }
}

getPopularMovies();


// Afficher les films
function displayMovies(moviesToDisplay) {

    currentMovies = moviesToDisplay;

    moviesContainer.innerHTML = "";

    moviesToDisplay.forEach(movie => {

        const movieCard = document.createElement("article");

        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `
            <img 
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
                alt="${movie.title}"
            >

            <h2>${movie.title}</h2>

            <p>${movie.release_date}</p>

            <strong class="${getRatingClass(movie.vote_average)}">
                ${movie.vote_average.toFixed(1)}
            </strong>

            <button class="favorite-btn" data-id="${movie.id}">
                ${favorites.some(favorite => favorite.id === movie.id) ? "♥" : "♡"}
            </button>
        `;

        moviesContainer.appendChild(movieCard);

        movieCard.addEventListener("click", event => {

            if (event.target.classList.contains("favorite-btn")) {
                return;
            }

            displayMovieDetails(movie);

        });

    });
}


// Couleur de la note
function getRatingClass(rating) {

    if (rating > 7) {
        return "rating-good";
    }

    if (rating >= 5) {
        return "rating-average";
    }

    return "rating-bad";
}


// Afficher les détails d'un film
function displayMovieDetails(movie) {

    modalContent.innerHTML = `
        <img 
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
            alt="${movie.title}"
        >

        <h2>${movie.title}</h2>

        <p>
            <strong>Date de sortie :</strong>
            ${movie.release_date}
        </p>

        <p>
            <strong>Note :</strong>
            ${movie.vote_average.toFixed(1)}
        </p>

        <p>
            ${movie.overview || "Aucun synopsis disponible."}
        </p>
    `;

    movieModal.style.display = "flex";
}


// Fermer la modale
closeModalBtn.addEventListener("click", () => {

    movieModal.style.display = "none";

});


movieModal.addEventListener("click", event => {

    if (event.target === movieModal) {
        movieModal.style.display = "none";
    }

});


// Recherche de films
searchInput.addEventListener("input", () => {

    const searchText = searchInput.value.trim();

    if (searchText === "") {
        displayMovies(movies);
        return;
    }

    searchMovies(searchText);

});


async function searchMovies(query) {

    try {

        loader.style.display = "block";
        errorMessage.textContent = "";

        const response = await fetch(
            `${apiUrl}/search/movie?api_key=${apiKey}&language=fr-FR&query=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error("Erreur lors de la recherche");
        }

        const data = await response.json();

        displayMovies(data.results);

    } catch (error) {

        console.error(error);

        errorMessage.textContent =
            "Impossible de rechercher les films.";

    } finally {

        loader.style.display = "none";

    }
}


// Ajouter ou retirer un favori
function toggleFavorite(movieId) {

    const favoriteIndex = favorites.findIndex(movie => {
        return movie.id === movieId;
    });

    if (favoriteIndex === -1) {

        const movie = currentMovies.find(movie => {
            return movie.id === movieId;
        });

        if (movie) {
            favorites.push(movie);
        }

    } else {

        favorites.splice(favoriteIndex, 1);

    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    displayMovies(currentMovies);
}


// Gestion du bouton favori
moviesContainer.addEventListener("click", event => {

    if (event.target.classList.contains("favorite-btn")) {

        const movieId = Number(event.target.dataset.id);

        toggleFavorite(movieId);

    }

});


// Afficher les favoris
function displayFavorites() {

    if (favorites.length === 0) {

        moviesContainer.innerHTML =
            "<p>Aucun film dans vos favoris.</p>";

        return;
    }

    displayMovies(favorites);

}


favoritesBtn.addEventListener("click", () => {

    displayFavorites();

});