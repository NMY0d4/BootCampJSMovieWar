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

let timeoutId;

const onInput = (e) => {
    timeoutId && clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
        fetchData(e.target.value);
    }, 1500);
};

input.addEventListener("input", onInput);
