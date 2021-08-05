// const name = 'Martin';
// let age = 47;
// const hasHobbies = true;

// const summarizeUser = (userName, userAge, userhashobbies) => {
//     return userName + ', ' + userAge + ', ' + userhashobbies;
// };

// const add = (a,b) => a + b;
// const addOne = a => ++a ;

// age = addOne(age);

// console.log(summarizeUser(name, age, hasHobbies))

const person = {
    name: 'Martin',
    age: 46,
    great() {
        console.log('Hello! I am ' + this.name);
    }
}

const printName = objPerson => {
    console.log(objPerson.name);
}

const printName2 =({name, age}) => {
    console.log(name +', '+ age);
}

printName(person);
printName2(person);

const {name, age} = person;
console.log(name +', '+ age);


// person.great();

const hobbies = ['Sports', 'Cooking', 'Video Gaming'];
const [hobby1, hobby2] = hobbies;
console.log(hobby1)
console.log(hobby2)

// for (const hobby of hobbies) {
//     console.log(hobby);
// }

// console.log(hobbies.map(hobby => {
//     return hobby.toUpperCase();
// }));
// console.log(hobbies);

// hobbies.push('RPGs');

// console.log(hobbies);

// // Spread operator
// const copiedHobbies = [...hobbies];
// hobbies.push('Javascript');
// console.log(hobbies);

// console.log(copiedHobbies);

// // rest operator

// const dspArgsArray = (...args) => {
//     console.log(args.map(arg => arg));
// };

// dspArgsArray(1,2,3,4,5,6,7);