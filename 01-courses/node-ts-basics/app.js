"use strict";
const num1Elem = document.getElementById("num1");
const num2Elem = document.getElementById("num2");
const btnElement = document.querySelector("button"); // ! => won't be null
const textResults = []; //generic is inferred here
const numResults = []; // Using Generics
function add(num1, num2) {
    if (typeof num1 === "number" && typeof num2 === "number") {
        return num1 + num2;
    }
    else if (typeof num1 === "string" && typeof num2 === "string") {
        return num1 + " " + num2;
    }
    else {
        return "Mismatch";
    }
}
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("It worked");
    }, 1000);
});
function printResult(resultObj) {
    // could use Interface ResultObj
    console.log(resultObj.val);
    console.log(resultObj.timestamp.toISOString());
}
btnElement.addEventListener("click", () => {
    const num1 = num1Elem.value;
    const num2 = num2Elem.value;
    const result = add(+num1, +num2); // cast to number
    numResults.push(result);
    const resultString = add(num1, num2); // keep string type
    textResults.push(resultString);
    console.log(result);
    printResult({ val: result, timestamp: new Date() });
    console.log(resultString);
    console.log(numResults, textResults);
});
myPromise.then((result) => {
    console.log(result);
});
// console.log(add("1", "6"));
