    const apiKey = "840304608d90b96564a264a491917970";
    const apiUrl = "https://api.themoviedb.org/3";
    const moviesContainer = document.getElementById("moviesContainer");
    const loader = document.getElementById("loader");
    const errorMessage = document.getElementById("errorMessage");
    const searchInput = document.getElementById("searchInput");
    
    let movies = [];
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

    function displayMovies(moviesToDisplay) {

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

                <strong>${movie.vote_average.toFixed(1)}</strong>
            `;

            moviesContainer.appendChild(movieCard);
        });
    }

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