// score counter
var score = 0;
var topic = 'people/';
var qArray = [];
var answerArray = [];
let url = 'https://swapi.dev/api/' + topic;
var checksArray = [];
let pages = 0;
var correctChoice;

//returns a random number between minimum and maximum (both included)
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min +1)) + min;
};

//object holding funtions to return info about a character 
var pplAttributes = {
  homeworld: async function (person) {
    try {response = await fetch(person.homeworld);
    } catch (e) {
      return false;
    };
    if (!response.ok) {
      return false;
    };
    const data = await response.json();
    const name = await data.name;
    if (name == "unknown") {
      return false;
    } else {
      qArray.push('is from the planet ' + name);
    };
      return name;
  },
  vehicle: async function(person) {
    try {
      response = await fetch(person.vehicles[0]);
    } catch (e) {
      return false;
    };
    if (!response.ok) {
      return false;
    };
    const data = await response.json();
    const name = await data.name;
    qArray.push('operated a ' + name);;
    return name;
  },
  starship: async function(person) {
    try {
      response = await fetch(person.starships[0]);
    } catch (e) {
      return false;
    };
    if (!response.ok) {
      return false;
    };
    const data = await response.json();
    const name = await data.name;
    qArray.push('piloted a ' + name);
    return name;
  },
  gender: function(person) {
    if (person.gender !== 'n/a'){
      qArray.push('is ' + person.gender)
      return person.gender 
  } else {
    return false;
  };
  },
  birth: function(person) {
    if (person.birth_year !== 'none' && person.birth_year !== 'unknown'){
      qArray.push('was born in ' + person.birth_year);
      return person.birth_year;
    } else {
      return false;
    };
  },
  height: function(person) {
    qArray.push('is ' + person.height + 'cm tall ');
    return person.height;
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
  pages = count;
  callback(count);
};


//choose a random page
async function randomPages(pagecount) {
  do {
	response = await fetch(url + randomNumber(1, pagecount));
} while (!response.ok);
  const correctAnswerData = await response.json();
  answerArray.push(correctAnswerData.name);
  
  console.log(correctAnswerData);
  getValidAttribute(correctAnswerData, randomWrong);

}


//get the data off an attribute for the answer only if it exists and is valid
async function getValidAttribute(answerJSON, nextFunc){
  do {
    attribute = randomAttributeKey(pplAttributes);
    attribFunc = pplAttributes[attribute];
    correctAnswerAttribute = await attribFunc(answerJSON);
    console.log(correctAnswerAttribute);
  } while ( correctAnswerAttribute === false);
  
  console.log(correctAnswerAttribute);

  nextFunc(correctAnswerAttribute, attribute);

}


//chose a random wront answer that does share the chosen attribute with the correct answer
async function randomWrong(correctAttribute, attributeKey) {
  do {
    key = attributeKey;
    attribFunc = pplAttributes[key];
    wrongAnswer = await fetch (url + randomNumber(1, pages));
    wrongAnswerData = await wrongAnswer.json();
    wrongAttribute = await attribFunc(wrongAnswerData);
    console.log(wrongAttribute);
  } while ( wrongAttribute == correctAttribute);
  console.log(wrongAttribute);
  console.log(wrongAnswerData);
  answerArray.push(wrongAnswerData.name);
}


getAPI(randomPages);

function randomAttributeKey (obj) {
  const keys = Object.keys(obj);
  return keys[randomNumber(0,keys.length-1)];
};

// let attribute = randomAttributeKey(pplAttributes);


// console.log(attribute);







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




