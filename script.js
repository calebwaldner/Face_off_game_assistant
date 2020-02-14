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

let precentOfSpecial = .5;
updateText(precentSpan, precentOfSpecial);
let intervalID;

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
  const specialQuestion = () => {
  let num = randomNum();
  if (precentOfSpecial>num) {
    return true;
  } else {
    return false;
  }
}

//on true - green, false - red
const questionColorScreen = flag => {
  if (flag) {
    colorScreen('chartreuse');
  } else {
    colorScreen('orangered');
  }
  console.log("spin");
}

const numP = document.getElementById("num");

document.addEventListener('keydown', pickRandom);
document.addEventListener('keyup', endPickRandom);

function endPickRandom() {
  numP.textContent = "False";
  spin(false);
}

function pickRandom(e) {
  if (e.code === "Space") {
    numP.textContent = "True";
    spin(true);
  } else {
    endPickRandom(); //needs to be a seperate function to help with accuracy
  }
}

function intCallback() {
 questionColorScreen(specialQuestion());
 console.log(intervalID);
}

function spin(flag) {
  if (flag) {
    intervalID = setInterval(intCallback, 50);
  } else {
    clearInterval(intervalID);
  }
}

// BUG: the setInterval methods are stacking. So by the time the clearInterval method runs with the current interval reference there are several intervals running at once. 




//just for counting a bunch of the specialQuestion results
const counterApp = (countTo, precent) => {
  let results = {true: 0, false: 0};
  for (i=0;i<countTo; i++) {
    let tf = specialQuestion(precent);
    if (tf === true) {
      results.true += 1;
    } else {
      results.false += 1;
    }
  }
  console.log(`${(results.true/countTo*100).toFixed(2)}% true, ${(results.false/countTo*100).toFixed(2)}% false`);
}
