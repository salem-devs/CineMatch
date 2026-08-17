const apiKey = "840304608d90b96564a264a491917970";
const apiUrl = "https://api.themoviedb.org/3";
async function getPopularMovies() {

    try {

        const response = await fetch(
            `${apiUrl}/movie/popular?api_key=${apiKey}&language=fr-FR`
        );

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des films");
        }

        const data = await response.json();

        console.log(data);

    } catch (error) {

        console.error(error);

    }
}

getPopularMovies();