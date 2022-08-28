// score counter
var score = 0;
var topic = 'people/';
var answerArray = [];
const url = 'https://swapi.dev/api/' + topic;
var checksArray = [];
let pages = 0;
var correctChoice;
var questionCount = 0;

window.onload = startEventListeners;

function startEventListeners () {
  document.getElementById("start").addEventListener("click", startQuiz);
};

function startQuiz () {
  document.getElementById("startDiv").innerHTML = '';
  document.getElementById("question").innerText = "loading questions...";
  document.getElementById("ansbuttons").innerHTML = '<button  id="a1"> loading ... </button> <button  id="a2"> loading ... </button>';

  getAPI(randomPages);
}

function checkChoice() {
  questionCount += 1;
  if (this.innerText == correctChoice) {
    this.className = "correct";
    score += 1;
  } else {
    this.className = "wrong";
  }
  document.getElementById("a1").removeEventListener("click", checkChoice);
  document.getElementById("a2").removeEventListener("click", checkChoice);
  if (questionCount < 5) {
    document.getElementById("nextDiv").innerHTML = '<button id = "next">Next question -></button>';
    document.getElementById("next").addEventListener("click", nextQuestion);
  } else {
    document.getElementById("nextDiv").innerHTML = '<p> Amazing! You guessed ' + score + '/5 answers correctly. <p>';
  }
};

function nextQuestion () { 
  answerArray = [];
  document.getElementById("nextDiv").innerHTML = '';
  document.getElementById("question").innerText = "loading";
  document.getElementById("a1").className = "nuetral";
  document.getElementById("a2").className = "nuetral";
  document.getElementById("a1").innerText = "...";
  document.getElementById("a2").innerText = "...";
  document.getElementById("a1").addEventListener("click", checkChoice);
  document.getElementById("a2").addEventListener("click", checkChoice);
  randomPages(pages);
}

//returns a random number between minimum and maximum (both included)
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min +1)) + min;
};


function shuffleArray(arr) {
  arr.sort(() => Math.random() - 0.5);
}

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
      return ('Which character is from the planet ' + name +"?");
    };
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
    return (' Which character operated a ' + name + "?");
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
    return ("Which character has piloted a " + name + "?");
  },
  gender: function(person) {
    if (person.gender !== 'n/a'){
      return ("Which character is a non-android " + person.gender + "?"); 
  } else {
    return false;
  };
  },
  birth: function(person) {
    if (person.birth_year !== 'none' && person.birth_year !== 'unknown'){
      return ('Which character was born in the year ' + person.birth_year + "?");
    } else {
      return false;
    };
  },
  height: function(person) {
    return ('Which character is ' + person.height + 'cm tall?');
  },
  filmsNum: function (person) {
    return ('Which character was featured in ' + ((person.films.length <2) ? 'only  ' : '') + person.films.length + ' film' + ((person.films.length != 1) ? 's? ' : '?'));
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
		try {
	      response = await fetch(url + randomNumber(1, pagecount));
      } catch (error) {
        console.log(error)
    }
	} while (!response.ok || response.status >200);
	correctAnswerData = await response.json();
  answerArray.push(correctAnswerData.name);
  correctChoice = correctAnswerData.name;
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
  document.getElementById("question").innerHTML = correctAnswerAttribute;
  nextFunc(correctAnswerAttribute, attribute);

}


//chose a random wront answer that does share the chosen attribute with the correct answer
async function randomWrong(correctAttribute, attributeKey) {
  do {
    key = attributeKey;
    attribFunc = pplAttributes[key];
    do {
      try {
          response = await fetch(url + randomNumber(1, pages));
        } catch (error) {
          console.log(error)
      }
    } while (!response.ok || response.status >200);
    wrongAnswerData = await response.json();
    wrongAttribute = await attribFunc(wrongAnswerData);
    console.log(wrongAttribute);
  } while ( wrongAttribute == correctAttribute);
  console.log(wrongAttribute);
  console.log(wrongAnswerData);
  answerArray.push(wrongAnswerData.name);
  console.log (answerArray);
  shuffleArray(answerArray);
  document.getElementById("a1").innerText = answerArray[0];
  document.getElementById("a2").innerText = answerArray[1];
  document.getElementById("a1").addEventListener("click", checkChoice);
  document.getElementById("a2").addEventListener("click", checkChoice);
}




function randomAttributeKey (obj) {
  const keys = Object.keys(obj);
  return keys[randomNumber(0,keys.length-1)];
};


// move from question to question by stepping through i++ i=5


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



// for (var i in answerButtons) {
//   answerButtons[i].addEventListener("click", function () {
//     if (this.innerHTML == correctChoice){
//       this.innerHTML = "correct";
//     } else {
//       this.innerHTML = "wrong";
//     };
//   })
// };



