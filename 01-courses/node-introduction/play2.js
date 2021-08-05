const fetchData = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve('This is the data'), 1500);
    });
    return promise;
};

setTimeout(() => {
    console.log('Fetching data...');
    fetchData()
    .then(text => {
        console.log(text);
        return fetchData();
    })
    .then(text2 => {
        console.log(text2);
    });
    console.log('Data returned');
}, 2000);

console.log('After the Timer in the Code');