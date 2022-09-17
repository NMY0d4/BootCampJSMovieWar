const autocompleteConfig = {
    // affiche les options après la recherche
    renderOption(movie) {
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
        return `
                <img src="${imgSrc}" />
                ${movie.Title} (${movie.Year})
            `;
    },

    // le titre qui doit s'affiche dans l'input après le choix
    inputValue(movie) {
        return movie.Title;
    },

    // fonction asynchrone qui récupère les données dans l'API
    async fetchData(searchTerm) {
        const response = await axios.get("http://www.omdbapi.com/", {
            params: {
                apikey: "be1446fd",
                s: searchTerm,
            },
        });

        if (response.data.Error) return [];
        return response.data.Search;
    },
};

createAutoComplete({
    ...autocompleteConfig,
    // racine pour afficher le contenu
    root: document.querySelector("#left-autocomplete"),

    // quand on select un film
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#left-summary"), "left");
    },
});

createAutoComplete({
    ...autocompleteConfig,
    // racine pour afficher le contenu
    root: document.querySelector("#right-autocomplete"),

    // quand on select un film
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#right-summary"), "right");
    },
});

const runComparaison = () => {
    const leftSideStats = document.querySelectorAll(
        "#left-summary .notification"
    );
    const rightSideStats = document.querySelectorAll(
        "#right-summary .notification"
    );

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = +leftStat.dataset.value;
        const rightSideValue = +rightStat.dataset.value;

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove("is-primary");
            leftStat.classList.add("is-warning");
        } else {
            rightStat.classList.remove("is-primary");
            rightStat.classList.add("is-warning");
        }
    });
};

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, displayElement, side) => {
    const res = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "be1446fd",
            i: movie.imdbID,
        },
    });

    displayElement.innerHTML = movieTemplate(res.data);

    side === "left" ? (leftMovie = res.data) : (rightMovie = res.data);

    leftMovie && rightMovie && runComparaison();
};

const movieTemplate = (movieDetail) => {
    const dollars = +movieDetail.BoxOffice.replaceAll("$", "").replaceAll(
        ",",
        ""
    );
    const metascore = +movieDetail.Metascore;
    const imdbRating = +movieDetail.imdbRating;
    const imdbVotes = +movieDetail.imdbVotes.replaceAll(",", "");
    const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
        const value = +word;
        isFinite(value) && (prev += value);
        return prev;
    }, 0);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>

        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>

        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>

        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>

        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};
