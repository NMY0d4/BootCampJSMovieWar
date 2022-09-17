const createAutoComplete = ({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData,
}) => {
    root.innerHTML = `
        <label>
            <b>Search</b>
        </label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;

    const input = root.querySelector("input");
    const dropdown = root.querySelector(".dropdown");
    const resultsWrapper = root.querySelector(".results");

    const onInput = debounce(async (e) => {
        const items = await fetchData(e.target.value);

        if (!items.length) {
            dropdown.classList.remove("is-active");
            return;
        }

        resultsWrapper.innerHTML = "";
        dropdown.classList.add("is-active");

        // Boucle pour afficher les films
        items.forEach((item) => {
            const option = document.createElement("a");

            option.classList.add("dropdown-item");
            option.innerHTML = renderOption(item);

            option.addEventListener("click", () => {
                dropdown.classList.remove("is-active");
                input.value = inputValue(item);
                onOptionSelect(item);
            });
            resultsWrapper.appendChild(option);
        });
    }, 1.5);

    input.addEventListener("input", onInput);

    document.addEventListener("click", (e) => {
        !root.contains(e.target) && dropdown.classList.remove("is-active");
    });
};
