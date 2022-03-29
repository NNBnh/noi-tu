const scoreDisplay = document.getElementById("score");
const pieces = document.getElementById("pieces");

let gameMode = 0;
let currentWord = "";
let history = [];
let score = 0;
let timer = null;
let timeBonus = 1000;
let joinWord = null;

function warning() {
  pieces.innerHTML = `
    <div class="piece">
      <input disabled value="chơi" />
      <p class="counter">0</p>
    </div>
    <div class="piece">
      <input placeholder="Nhấn đây!" list="gameModes" onkeyup="checkMode(event)" />
      <p class="counter" style="opacity: 50%">1</p>
    </div>
  `;
}

function menu() {
  document.title = "Nối Từ 100";
  scoreDisplay.innerHTML = null;

  pieces.innerHTML = `
    <div class="piece">
      <input disabled value="chơi" />
      <p class="counter">0</p>
    </div>
    <div class="piece">
      <input placeholder="Nhấn đây!" list="gameModes" onkeyup="checkMode(event)" />
      <p class="counter" style="opacity: 50%">1</p>
    </div>
  `;

  joinWord = document.querySelector(".piece:last-child input");
  joinWord.focus();
}

function checkMode(event) {
  if (event.keyCode !== 13) return;

  event.preventDefault();

  switch(joinWord.value.toLowerCase().trim()) {
    case "đơn":
    case "1":
      startGameSingle();
      break;
    case "đấu":
    case "100":
      startGameMulti();
      break;
    default:
      warning('Hãy nhập chế dộ chơi "đơn" hoặc "đấu"');
  }
}


function startGameSingle() {
  gameMode = 1;

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

  if (gameMode === 1) {
    switch(joinWordFormated) {
      case ",":
        startGameSingle();
        break;
      case ".":
        endGame();
        break;
    }
  }

  const fullWord = `${currentWord} ${joinWordFormated}`;

  if (! words.includes(fullWord)) { warning("Từ này không có trong từ điển"); return }
  if (history.includes(fullWord)) { warning("Từ này đã được sử dụng"); return }

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


function endGame() {
  document.title = "Nối Từ 100";

  let usedWordList = "";

  for (let i = 0; i < history.length; i++) {
    usedWordList += (i + 1).toString() + ".&#9;" + history[i] + "\n";
  }

  pieces.innerHTML = `
    <div id="usedWordList">
      <pre>${usedWordList}</pre>
      <div id="endGameNav">
        <button onclick="menu()">
          <img id="backButton" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yMCAuNzU1bC0xNC4zNzQgMTEuMjQ1IDE0LjM3NCAxMS4yMTktLjYxOS43ODEtMTUuMzgxLTEyIDE1LjM5MS0xMiAuNjA5Ljc1NXoiLz48L3N2Zz4=" />
        </button>
        <input id="playerName" placeholder="Nhập tên" autocomplete="off" onkeyup="submitScore(event)" />
        <button onclick="startGameSingle()">
          <img id="replayButton" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik03IDloLTd2LTdoMXY1LjJjMS44NTMtNC4yMzcgNi4wODMtNy4yIDExLTcuMiA2LjYyMyAwIDEyIDUuMzc3IDEyIDEycy01LjM3NyAxMi0xMiAxMmMtNi4yODYgMC0xMS40NS00Ljg0NC0xMS45NTktMTFoMS4wMDRjLjUwNiA1LjYwMyA1LjIyMSAxMCAxMC45NTUgMTAgNi4wNzEgMCAxMS00LjkyOSAxMS0xMXMtNC45MjktMTEtMTEtMTFjLTQuNjYgMC04LjY0NyAyLjkwNC0xMC4yNDkgN2g1LjI0OXYxeiIvPjwvc3ZnPg==" />
        </button>
      </div>
    </div>
  `;
}

function submitScore(event) {
  if (event.keyCode !== 13) return;

  event.preventDefault();

  const playerName = document.getElementById("playerName").value.trim();
  const counter = history.length;
  const usedWordList = history.join(", ");

  let xhr = new XMLHttpRequest();
  xhr.open("post", `https://docs.google.com/forms/d/e/1FAIpQLSem_C7O7GzgXNs8sWDSjn6s9J8br_objp5IUor7--j80XZiIQ/formResponse?usp=pp_url&entry.1011382549=${playerName}&entry.356858322=${counter}&entry.834877191=${score}&entry.595300868=${usedWordList}&submit=Submit`, true);
  xhr.send();
  window.open("https://docs.google.com/spreadsheets/d/16WMbIcs7HJ9fBC7qKPmj6wyNjImy51PZH0CzreuBQmk/edit?usp=sharing", "_blank").focus();

  document.getElementById("playerName").disabled = true;
}


menu();
