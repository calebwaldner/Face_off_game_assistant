let precentOfSpecial = 0;
const catagoryList = [
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
];

const optionsButton = document.getElementById("options-button");
const optionsForm = document.getElementById("options-form");
const precentInput = document.getElementById("precent-random-question")
const precentButton = document.getElementById("submit-button");
const viewScreen = document.getElementById("container");
const precentSpan = document.getElementById('precent-span');

updateText(precentSpan, precentOfSpecial); // BUG: if I edit the starting precent in the code it shows up wrong in the text
let intervalID;
let results = {book: 0, special: 0, spins: 0, bookLog: 0, specialLog: 0};

// hide form with options button
optionsButton.addEventListener("click", () => {
  if (optionsForm.style.display === "none") {
    optionsForm.style.display = "block";
  } else {
    optionsForm.style.display = "none";
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

//determins text content
function getTextContent(flag, textElement) {
  if (flag) { //if special question
    let catagory;
    let randomCatNum = randomInt(catagoryList.length);
    for (i=0;i<catagoryList.length;i++) {
      if (i+1 === randomCatNum) {catagory = catagoryList[i]}
    }
    textElement.textContent = catagory;
  } else {
    textElement.textContent = "Book";
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
