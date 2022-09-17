const fetchData = async (searchTerm) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "be1446fd",
            s: searchTerm,
        },
    });
    console.log(response.data);
};

const input = document.querySelector("input");

const debounce = (func, delayInSeconds = 1) => {
    let timeoutId;
    return (...args) => {
        timeoutId && clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delayInSeconds * 1000);
    };
};

const onInput = debounce((e) => {
    fetchData(e.target.value);
}, 1.5);

input.addEventListener("input", onInput);
