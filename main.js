const scoreDisplay = document.getElementById("score");
const pieces = document.getElementById("pieces");

let currentWord = "";
let history = [];
let score = 0;
let timer = null;
let timeBonus = 1000;
let joinWord = null;

function startGame() {
  history = [];

  score = 0;
  scoreDisplay.innerHTML = 0;

  currentWord = words[Math.floor(Math.random() * words.length)].split(" ")[0];
  pieces.innerHTML = `
    <div class="piece">
      <input disabled value="${currentWord}" />
      <p class="counter">0</p>
    </div>
  `;

  addPiece();
  startTimer();
}

function startTimer() {
  clearInterval(timer);
  timeBonus = 5000;

  timer = setInterval(function () {
    timeBonus -= 1;

    if (timeBonus <= 1000) clearInterval(timer);
  }, 1);
}

function addPiece() {
  const counter = history.length + 1;

  document.title = currentWord.charAt(0).toUpperCase() + currentWord.slice(1) + " ____";

  pieces.innerHTML += `
    <div class="piece">
      <input placeholder="Nhấn đây!" autocomplete="off" onkeyup="checkWord(event)" />
      <p class="counter" style="opacity: 50%">${counter}</p>
    </div>
  `;

  joinWord = document.querySelector(".piece:last-child input");
  joinWord.focus();
}

function checkWord(event) {
  if (event.keyCode !== 13) {
    // TODO
    return;
  }

  event.preventDefault();

  const joinWordFormated = joinWord.value.toLowerCase().trim();
  const fullWord = `${currentWord} ${joinWordFormated}`;

  if (! words.includes(fullWord)) { /* TODO */ return }
  if (history.includes(fullWord)) { /* TODO */ return }

  history.push(fullWord);
  currentWord = joinWordFormated;

  document.querySelector(".piece"         ).setAttribute("style", "animation: disappear 250ms");
  document.querySelector(".piece input"   ).setAttribute("style", "animation: disappear 200ms");
  document.querySelector(".piece .counter").outerHTML = null;
  setTimeout(function() {
    document.querySelector(".piece").outerHTML = null;
  }, 250);

  joinWord.setAttribute("value", joinWordFormated);
  joinWord.disabled = true;
  joinWord.setAttribute("style", "animation: none");
  document.querySelector(".piece:last-child .counter").removeAttribute("style");
  addPiece();

  score += timeBonus;
  scoreDisplay.innerHTML = score;
  startTimer();
}


startGame();
