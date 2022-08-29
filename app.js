// score counter
var score = 0;
var qNumber = 0;
var answerArray = [];
var checksArray = [];
let pages = 0;
var correctChoice;
var questionCount = 0;
var topicQuestions;
var topic;
var url = "";
var a1;
var a2;


window.onload = startEventListeners;

//returns a random number between minimum and maximum (both included)
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min +1)) + min;
};

//shuffles an array
function shuffleArray(arr) {
  arr.sort(() => Math.random() - 0.5);
}

//returns a random key
function randomAttributeKey (obj) {
  const keys = Object.keys(obj);
  return keys[randomNumber(0,keys.length-1)];
};


//event listener for topic selection
function startEventListeners () {
  document.getElementById("chars").addEventListener("click", startQuiz);
  document.getElementById("planets").addEventListener("click", startQuiz);
};

//diplay the question number
function displayqNumber () {
  document.getElementById("startDiv").innerHTML = '<p> question ' + qNumber + '/5</p';
}

function displayStart () {
  document.getElementById("startDiv").innerHTML = '<p>Please choose a topic.</p><button id ="chars" name="people">characters</button><button id = "planets" name="planets">planets</button>';
}

//create url based on topic selection
function startQuiz () {
  qNumber += 1;
  if (this.name == "people") {
  topicQuestions = people;
  topic = "people/";
  } else {
    topicQuestions = planets;
    topic = "planets/";
  }
  url = "https://swapi.dev/api/" + topic;
  fetchTopic();
}

//display "loading" while fetching API
function fetchTopic () {
  document.getElementById("question").innerText = "loading questions...";
  document.getElementById("ansbuttons").innerHTML = '<button  id="a1"> loading ... </button> <button  id="a2"> loading ... </button>';
  a1 = document.getElementById("a1");
  a2 = document.getElementById("a2");
  displayqNumber();
  getAPI(randomPages);
}

//check if answer is correct
function checkChoice() {
  questionCount += 1;
  if (this.innerText == correctChoice) {
    this.className = "correct";
    score += 1;
  } else {
    this.className = "wrong";
  }
  a1.removeEventListener("click", checkChoice);
  a2.removeEventListener("click", checkChoice);
  //make next question available or end quiz
  if (questionCount < 5) {
    document.getElementById("nextDiv").innerHTML = '<button id = "next">Next question -></button>';
    document.getElementById("next").addEventListener("click", nextQuestion);
  } else {
    document.getElementById("nextDiv").innerHTML = '<p> Wow! You guessed ' + score + '/5 answers correctly.';

  }
};


//hide next button, remove button colors, fetch next answer
function nextQuestion () { 
  answerArray = [];
  qNumber += 1;
  displayqNumber ()
  document.getElementById("nextDiv").innerHTML = '';
  document.getElementById("question").innerText = "loading";
  a1.className = "nuetral";
  a2.className = "nuetral";
  a1.innerText = "...";
  a2.innerText = "...";
  a1.addEventListener("click", checkChoice);
  a2.addEventListener("click", checkChoice);
  randomPages(pages);
}

//methods for retreiving, validating info about planets and returning a question
var planets = {
  residents: async function(planet) {
    try {
      response = await fetch(planet.residents[0]);
    } catch (e) {
      return false;
    };
    if (!response.ok) {
      return false;
    };
    const data = await response.json();
    const name = await data.name;
    return (' Which is the home planet of the character ' + name + "?");
  },
  climate: function(planet) {
    if (planet.climate != 'unknown'){
      return ('Which planet has a climate that is ' + planet.climate + "?");
    } else {
      return false;
    };
  },
  population: function(planet) {
    if (planet.population !='unknown'){
      return ('Which planet has an average population of ' + planet.population + "?");
    } else {
      return false;
    };
  }
}

////methods for retreiving, validating info about characters and returning a question
var people = {
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
    if (name == 'unknown') {
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
  pages = count;
  callback(count);
};


//choose a random page
async function randomPages(pagecount) {
	do {
	do {
		try {
	      response = await fetch(url + randomNumber(1, pagecount));
      } catch (error) {
        console.log(error)
    }
	} while (!response.ok || response.status == "404");
	correctAnswerData = await response.json();
} while (correctAnswerData.name == 'unknown');
  answerArray.push(correctAnswerData.name);
  correctChoice = correctAnswerData.name;
  console.log(correctAnswerData);
  getValidAttribute(correctAnswerData, randomWrong);

}


//get the data off an attribute for the answer only if it exists and is valid
async function getValidAttribute(answerJSON, nextFunc){
  do {
    attribute = randomAttributeKey(topicQuestions);
    attribFunc = topicQuestions[attribute];
    correctAnswerAttribute = await attribFunc(answerJSON);
  } while ( correctAnswerAttribute === false);
  document.getElementById("question").innerHTML = correctAnswerAttribute;
  nextFunc(correctAnswerAttribute, attribute);

}


//chose a random wrong answer that does share the chosen attribute with the correct answer
async function randomWrong(correctAttribute, attributeKey) {
  do {
    key = attributeKey;
    attribFunc = topicQuestions[key];
    do {
      try {
          response = await fetch(url + randomNumber(1, pages));
        } catch (error) {
          console.log(error)
      }
    } while (!response.ok || response.status == "404");
    wrongAnswerData = await response.json();
    wrongAttribute = await attribFunc(wrongAnswerData);
  } while ( wrongAnswerData.name == 'unknown' || wrongAttribute == correctAttribute);
  console.log(wrongAnswerData);
  answerArray.push(wrongAnswerData.name);
  shuffleArray(answerArray);
  a1.innerText = answerArray[0];
  a2.innerText = answerArray[1];
  a1.addEventListener("click", checkChoice);
  a2.addEventListener("click", checkChoice);
}


