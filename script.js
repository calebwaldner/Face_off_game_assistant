console.log(`
Copy and paste this in console:
window.open("file:///Users/Waldner/Dropbox/On_Macbook_Air/WebDev/Mini_Projects/Face_off_game_assistant/index.html", 'window','toolbar=no, menubar=no, resizable=yes');
`)


/************************************************************************************
Global Variables
************************************************************************************/

let precentOfSpecial = 0;
let intervalID;
let results = {book: 0, special: 0, spins: 0, bookLog: 0, specialLog: 0};

/************************************************************************************
Options Window
************************************************************************************/
const questionCatagories = {
  primaryQuestionsArr: [
    "Book"
  ],
  secondarQuestionsArr: [
    'Sports',
    'Technology',
    'Science',
    'Auto',
    'Food & Drink',
    'Health',
    'Geography',
    'Music',
    'Movies & TV',
    'Animals'
  ]
};

const optionsButton = document.getElementById("options-button");
const optionsForm = document.getElementById("options-form");
const optionsContainer = document.getElementById("options-box");
const optionsWindow = document.getElementById("options-window");
const precentInput = document.getElementById("precent-random-question");
const precentButton = document.getElementById("submit-button");
const precentSpan = document.getElementById('precent-span');
const primaryCatagorySpan = document.getElementById("primary-catagories-span");
const secondaryCatagorySpan = document.getElementById("secondary-catagories-span");
const primaryCatagoryButton = document.getElementById("primary-catagories-button");
const secondaryCatagoryButton = document.getElementById("secondary-catagories-button");

function changeButtonText(text) {
  optionsButton.innerText = text;
}

updateText(precentSpan, precentOfSpecial); // BUG: if I edit the starting precent in the code it shows up wrong in the text

// hide form with options button
optionsButton.addEventListener("click", () => {
  if (optionsWindow.style.display === "none" || optionsWindow.style.display === "") {
    optionsWindow.style.display = "block";
    changeButtonText("hide");
  } else {
    optionsWindow.style.display = "none";
    changeButtonText("+");
  }
});

function setPrecent() {
  precentOfSpecial = precentInput.value / 100;
}

function updateText(span, value) {
  span.textContent = `${value}%`;
}

//get precent on button click and input enter
precentButton.addEventListener("click", () => {
  setPrecent();
  updateText(precentSpan, precentInput.value);
});
// TODO: Add "return" key functionality (currently disabled)

/**
 * write catagories in span element
 * @param catagoryArr 
 */
function writeCatagorySpan(catagoryArr, span) {
  const list = catagoryArr.join(", ");
  span.innerText = list;
}

function createTextInput() {
  const input = document.createElement("INPUT");
  input.classList = "catagory-input";
  return input;
}

/**
 * replace array strings AKA catagories with text inputs
 */
function editCatagories(arr, div) {
  const inputDiv = document.createElement("DIV");
  questionCatagories[arr].forEach(catagory => {
    const input = createTextInput();
    input.value = catagory;
    inputDiv.appendChild(input);
  });
  div.appendChild(inputDiv);
  div.querySelector("span").innerText = "";
  appendEditButtons(div);
}

/**
 * Creates and adds the two edit buttons to the element parameter
 * @param {element} div 
 */
function appendEditButtons(div) {
  const buttonsDiv = document.createElement("DIV");
  buttonsDiv.style.display = "block";

  const addButton = document.createElement("INPUT");
  addButton.type = "button";
  addButton.value = "Add";
  addButton.classList = "edit-buttons";

  const deleteButton = document.createElement("INPUT");
  deleteButton.type = "button";
  deleteButton.value = "Delete";
  deleteButton.classList = "edit-buttons";

  buttonsDiv.appendChild(deleteButton);
  buttonsDiv.appendChild(addButton);
  div.appendChild(buttonsDiv);
}

/**
 * Gives the Add and Delete buttons functionality; stores functions in an object literal and dynamically calls functions
 * @param {event} e 
 */
function addAndDeleteButtons(e) {
  const button = e.target.value;
  const actionButton = {
    Delete: (div) => {
      let lastChild = div.children[div.children.length-1];
      lastChild && div.removeChild(lastChild); //if last child is truthy (prevents error for undefined last child caused when there are no more children);
    }, 
    Add: (div) => {
      const input = createTextInput();
      div.appendChild(input);
    }
  }
  //if button is one of the properties of actionButton object, then do that property
  if (actionButton[button]) {
    const targetDiv = e.target.parentElement.previousElementSibling;
    actionButton[button](targetDiv);
  };
}


/**
 * save and replace text inputs with array strings AKA catagories
 */
function saveCatagories(arr, div) {
  const editButtonsDiv = div.lastElementChild;
  const inputDiv = editButtonsDiv.previousElementSibling;
  const inputs = inputDiv.querySelectorAll("input.catagory-input");
  questionCatagories[arr] = [];
  inputs.forEach((input, i) => {
    questionCatagories[arr][i] = input.value;
  });
  div.removeChild(inputDiv);
  div.removeChild(editButtonsDiv);
  writeCatagorySpan(questionCatagories[arr], div.querySelector("span"));
}

/**
 * Runs save and edit functionality
 */
function catagoryButtonClick(e) {
  const parent = e.target.parentElement;
  const arr = e.target.dataset.array;
  if (e.target.innerText === "Edit") {
    e.target.innerText = "Save";
    editCatagories(arr, parent)
  } else if (e.target.innerText === "Save") {
    e.target.innerText = "Edit";
    saveCatagories(arr, parent);
  }
}

primaryCatagoryButton.addEventListener("click", catagoryButtonClick);
secondaryCatagoryButton.addEventListener("click", catagoryButtonClick);

optionsForm.addEventListener("click", addAndDeleteButtons);

writeCatagorySpan(questionCatagories.primaryQuestionsArr, primaryCatagorySpan);
writeCatagorySpan(questionCatagories.secondarQuestionsArr, secondaryCatagorySpan);

/************************************************************************************
Game Screen
************************************************************************************/

const viewScreen = document.getElementById("container");

const colorScreen = color => {
  viewScreen.style.backgroundColor = color;
}

const randomNum = () => Math.random();
const randomInt = upper => Math.floor(Math.random()*upper)+1;

//gets random number and compares to precent, returns boolean
  const specialQuestion = precent => {
  let num = randomNum();
  if (precent>num) {
    return true;
  } else {
    return false;
  }
}

//on true - green, false - red
const questionColorScreen = flag => {
  if (flag) {
    colorScreen('chartreuse');
    getTextContent(true, numP);
    results.special += 1;
    results.bookSelected = false;
  } else {
    colorScreen('deepskyblue');
    getTextContent(false, numP);
    results.book += 1;
    results.bookSelected = true;
  }
  console.log("spin");
  spinAnimation(true); //placed here to visually show if spin actually happened. If animation showed, spin happened for sure.
}

const numP = document.getElementById("num");

document.addEventListener('keydown', pickRandom);
document.addEventListener('keyup', endPickRandom);
// TODO: add touch functionality: "touchstart", "touchend", "touchcancel"

//callback for keyup eventListener
function endPickRandom(e) {
  if (e.code === "Space") {
    spinAnimation(false);
    spin(false);
    console.log(`${(results.book/results.spins*100).toFixed(2)}% book, ${(results.special/results.spins*100).toFixed(2)}% special`);
    if (results.spins>0) {
      if (results.bookSelected) { //updates log count to console
        results.bookLog += 1;
      } else {
        results.specialLog += 1;
      }
      console.log(`So far ${results.bookLog + results.specialLog} total, ${results.bookLog} books, ${results.specialLog} special`);
    } else {
      numP.textContent = "Press longer!";
      colorScreen('gray');
    }
  }
}

//callback for keydown eventListener
function pickRandom(e) {
  if (e.code === "Space") {
    if (e.repeat) {return}
    results.book = 0;
    results.special = 0;
    results.spins = 0;
    spin(true);
  }
}

//used as call back to repeat with spin() function
function intCallback() {
 questionColorScreen(specialQuestion(precentOfSpecial)); //function that determins question
 results.spins += 1;
}

//turns interval off and on, if flag is true it intervals intCallback function, clears interval if false
function spin(flag) {
  if (flag) {
    intervalID = setInterval(intCallback, 100);
  } else {
    clearInterval(intervalID);
  }
}

//turns spin animation on/off
function spinAnimation(flag) {
  if (flag) {
    viewScreen.style.border = "solid 50px red";
  } else {
    viewScreen.style.border = "solid 50px black";
  }
}



/************************************************************************************
NOT SORTED IN RIGHT SPOT, THIS WAS ADDED IN PLACE OF CODE BELOW TO ADD MORE OPTIONS TO THE BOOK CATAGORY
************************************************************************************/

// //determins text content
// function getTextContent(flag, textElement) {
//   if (flag) { //if special question
//     let catagory;
//     let randomCatNum = randomInt(questionCatagories.secondarQuestionsArr.length);
//     for (i=0;i<questionCatagories.secondarQuestionsArr.length;i++) {
//       if (i+1 === randomCatNum) {catagory = questionCatagories.secondarQuestionsArr[i]}
//     }
//     textElement.textContent = catagory;
//   } else {
//     textElement.textContent = "Book";
//   }
// }



function typeOfQuestion(questionArr) {
  let question;
  let randomDifNum = randomInt(questionArr.length);
  for (i=0;i<questionArr.length;i++) {
    if (i+1 === randomDifNum) {question = questionArr[i]}
  }
  return question;
}


//determins text content
function getTextContent(flag, textElement) {
  if (flag) { 
    textElement.textContent = typeOfQuestion(questionCatagories.secondarQuestionsArr);
  } else {
    // textElement.textContent = "Book";
    textElement.textContent = typeOfQuestion(questionCatagories.primaryQuestionsArr);
  }
}



// TODO: add the type of question to the special question function
// TODO: rather than true/false on screen during game, have a visual feature that the button is being pressed or not pressed some other way. The true/false can come through visually another way.




//just for counting a bunch of the specialQuestion results
// in console: counterApp(100, precentOfSpecial)
const counterApp = (countTo) => {
  let results = {true: 0, false: 0};
  for (i=0;i<countTo; i++) {
    let tf = specialQuestion();
    if (tf === true) {
      results.true += 1;
    } else {
      results.false += 1;
    }
  }
  return `${(results.true/countTo*100).toFixed(2)}% true, ${(results.false/countTo*100).toFixed(2)}% false`;
}
