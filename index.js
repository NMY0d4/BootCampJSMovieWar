const fetchData = async (searchTerm) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "be1446fd",
            s: searchTerm,
        },
    });
    if (response.data.Error) return [];
    return response.data.Search;
};

const root = document.querySelector(".autocomplete");
root.innerHTML = `
<label><b>Search For a Movie</b></label>
<input class="input" />
<div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
    </div>
</div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = debounce(async (e) => {
    const movies = await fetchData(e.target.value);

    if (!movies.length) {
        dropdown.classList.remove("is-active");
        return;
    }

    resultsWrapper.innerHTML = "";
    dropdown.classList.add("is-active");
    movies.forEach((movie) => {
        const option = document.createElement("a");
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

        option.classList.add("dropdown-item");
        option.innerHTML = `
        <img src="${imgSrc}" alt="poster de ${movie.Title}"/>
        ${movie.Title}
        `;
        resultsWrapper.appendChild(option);
    });
}, 1.5);

input.addEventListener("input", onInput);

document.addEventListener("click", (e) => {
    !root.contains(e.target) && dropdown.classList.remove("is-active");
});
