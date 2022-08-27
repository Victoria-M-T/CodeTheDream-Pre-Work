// score counter
var score = 0;
var topic = 'people/';
var qArray = [];

let url = 'https://swapi.dev/api/' + topic;



//returns a random number between minimum and maximum (both included)
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min +1)) + min;
};

//create a list of attributes that can be inserted into the trivia question
// async function createQArray(person){
//   qArray = [];
//   await fetch(person.homeworld)
//     .then((response) => response.json())
//     .then((data) => qArray.push('is from the planet ' + data.name));
//   await fetch(person.vehicles[0])
//     .then((response) => response.json())
//     .then((data) => qArray.push('operated a ' + data.name))
//     .catch(error => console.log('has not operated a vehicle'));
//   await fetch(person.starships[0])
//     .then((response) => response.json())
//     .then((data) => qArray.push('piloted a ' + data.name))
//     .catch(error => console.log('has not piloted a starship'));
//   if (person.gender !== 'n/a'){
//     qArray.push('is ' + person.gender)
//   };
//   if (person.birth_year !== 'none' && person.birth_year !== 'unknown'){
//     qArray.push('was born in ' + person.birth_year)
//   };
//   qArray.push('is ' + person.height + 'cm tall ');
//   qArray.push('was featured in ' + person.films.length + ' film' + ((person.films.length != 1) ? 's ' : ' '));
  
//   console.log(qArray);
// };


// var pplAttributes = {
//   homeworld: function (person) {
//     fetch(person.homeworld)
//     .then((response) => response.json())
//     .then((data) => qArray.push('is from the planet ' + data.name))
//     return data.name;
//   },
//   vehicle: function(person) {
//     fetch(person.vehicles[0])
//     .then((response) => response.json())
//     .then((data) => qArray.push('operated a ' + data.name))
//     .catch(error => console.log('has not operated a vehicle'))
//     return data.name;
//   },
//   starship: function(person) {
//     fetch(person.starships[0])
//     .then((response) => response.json())
//     .then((data) => qArray.push('piloted a ' + data.name))
//     .catch(error => console.log('has not piloted a starship'))
//     return data.name;
//   },
//   gender: function(person) {
//     if (person.gender !== 'n/a'){
//       qArray.push('is ' + person.gender)
//       return person.gender 
//   };
//   },
//   birth: function(person) {
//     if (person.birth_year !== 'none' && person.birth_year !== 'unknown'){
//       qArray.push('was born in ' + person.birth_year)
//       return person.birth_year
//     };
//   },
//   height: function(person) {
//     qArray.push('is ' + person.height + 'cm tall ');
//     return person.heght;
//   },
//   filmsNum: function (person) {
//     qArray.push('was featured in ' + person.films.length + ' film' + ((person.films.length != 1) ? 's ' : ' '));
//     return person.films.length;
//   },
// };


var pplAttributes = {
  homeworld: async function (person) {
    response = await fetch(person.homeworld);
    const data = await response.json();
    const name = await data.name
    qArray.push('is from the planet ' + name)
    return name;
  },
  vehicle: function(person) {
    fetch(person.vehicles[0])
    .then((response) => response.json())
    .then((data) => qArray.push('operated a ' + data.name))
    .catch(error => console.log('has not operated a vehicle'))
    return data.name;
  },
  starship: function(person) {
    fetch(person.starships[0])
    .then((response) => response.json())
    .then((data) => qArray.push('piloted a ' + data.name))
    .catch(error => console.log('has not piloted a starship'))
    return data.name;
  },
  gender: function(person) {
    if (person.gender !== 'n/a'){
      qArray.push('is ' + person.gender)
      return person.gender 
  };
  },
  birth: function(person) {
    if (person.birth_year !== 'none' && person.birth_year !== 'unknown'){
      qArray.push('was born in ' + person.birth_year)
      return person.birth_year
    };
  },
  height: function(person) {
    qArray.push('is ' + person.height + 'cm tall ');
    return person.heght;
  },
  filmsNum: function (person) {
    qArray.push('was featured in ' + person.films.length + ' film' + ((person.films.length != 1) ? 's ' : ' '));
    return person.films.length;
  },
};



//*get data from Api and find out how many items/pages are in the topic
async function getAPI(callback) {
  const response = await fetch(url);
  const data = await response.json();
  const count = await data.count;
  console.log(count);
  callback(count)
};



//choose a random page
async function randomPages(pagecount) {
  const correctAnswer = await fetch(url + randomNumber(1, pagecount));
  const correctAnswerData = await correctAnswer.json();


  const correctAnswerAttribute = attribFunc(correctAnswerData);
  let wrongAnswer = await fetch (url + randomNumber(1, pagecount));
  let wrongAnswerData = await wrongAnswer.json();
  let wrongAnswerAttribute =  attribFunc(wrongAnswerData);
  
  
  console.log(correctAnswerData);
  console.log(wrongAnswerData);
  console.log(correctAnswerAttribute);
  console.log(wrongAnswerAttribute);

}

getAPI(randomPages);

function randomAttributeKey (obj) {
  const keys = Object.keys(obj);
  return keys[randomNumber(0,keys.length-1)];
};

let attribute = randomAttributeKey(pplAttributes);


console.log(attribute);



const attribFunc = pplAttributes[attribute];

console.log(attribFunc);



//let attributeData = correctAnswer.attribute;


// function nonMatch(){
//   let wrongAnswer= getRandom();
//   // while (wrongAnswer.attribute === attributeData) {
//   //   wrongAnswer = getAPI();
//   // }
//   return(wrongAnswer);
// };

// console.log(nonMatch());


// move from question to question by stepping through i++ i=5
// *choose random character and assign to a variable

// display
// "Which character q1 +and q2 +and q3" access array 1 2 3

/////////for (let i = 0; i < 3; i++) {}

// *randomize questions from list of choices 
// skip the question if response is "unknown" -birth year "none" -hair color empty [] -vehicles and starships  "n/a"
// add the question to a variable which stores an array 
// add only the atttributes title to an array which can be used to compare to other false answers



//     list

//     operates a --vehicle:name (if (n/a) skip this)
//     flies a ---starship:name (if n/a, skip )

//     was featured in --- list films: name 
 
//////var peopleQuestions = ['is ' + correctAnswer.gender, 'operates a ' +]



// *provide a list of answer choices
//   variable for chosen character name add to array
//   i++, i = 3 )
//   randomly choose character and , (random between 1 and however many pages there are of characters) 
//     check that their attributes do not match the chosen characters attributes
//       if this character atribute === that character attribute and and
//        next (i--)
//       if not
//         access and save their name to an array

//   display 
//   names from array in a randomized order 
//    *on click 
//       if character === chosen character 
//        add a Point 
//        show some positive animation 
//        show next button 
//      otherwise
//       show negative animation 
//       show next button 

// next button
//  keep the score counter but 




