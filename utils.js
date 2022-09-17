const debounce = (func, delayInSeconds = 1) => {
    let timeoutId;
    return (...args) => {
        timeoutId && clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delayInSeconds * 1000);
    };
};
