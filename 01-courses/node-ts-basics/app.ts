const num1Elem = document.getElementById("num1") as HTMLInputElement;
const num2Elem = document.getElementById("num2") as HTMLInputElement;
const btnElement = document.querySelector("button")!; // ! => won't be null

const textResults: string[] = []; //generic is inferred here
const numResults: Array<number> = []; // Using Generics

type NumOrString = number | string;
type Result = { val: number; timestamp: Date };

interface ResultObj {
  val: number;
  timestamp: Date;
}

function add(num1: NumOrString, num2: NumOrString) {
  if (typeof num1 === "number" && typeof num2 === "number") {
    return num1 + num2;
  } else if (typeof num1 === "string" && typeof num2 === "string") {
    return num1 + " " + num2;
  } else {
    return "Mismatch";
  }
}

const myPromise = new Promise<string>((resolve, reject) => {
  //<string> sets the return type
  setTimeout(() => {
    resolve("It worked");
  }, 1000);
});

function printResult(resultObj: Result) {
  // could use Interface ResultObj
  console.log(resultObj.val);
  console.log(resultObj.timestamp.toISOString());
}

btnElement.addEventListener("click", () => {
  const num1 = num1Elem.value;
  const num2 = num2Elem.value;
  const result = add(+num1, +num2); // cast to number
  numResults.push(result as number);
  const resultString = add(num1, num2); // keep string type
  textResults.push(resultString as string);
  console.log(result);
  printResult({ val: result as number, timestamp: new Date() });
  console.log(resultString);
  console.log(numResults, textResults);
});

myPromise.then((result) => {
  console.log(result.split("w"));
});
// console.log(add("1", "6"));
