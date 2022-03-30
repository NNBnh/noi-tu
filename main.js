const scoreDisplay = document.getElementById("score");
const pieces = document.getElementById("pieces");
const warningBar = document.getElementById("warningBar");

const buttonEnd = document.getElementById("buttonEnd");
const buttonInfo = document.getElementById("buttonInfo");
const buttonStartIcon = document.getElementById("buttonStartIcon");
const buttonEndIcon = document.getElementById("buttonEndIcon");

let currentWord = "";
let history = [];
let score = 0;
let timer = null;
let timeBonus = 1000;
let joinWord = null;

function warning(text) {
  if (! text) {
    warningBar.classList.add("hide");
  } else {
    warningBar.innerHTML = `
      <i class="las la-exclamation-triangle"></i>
      ${text}
      <i class="las la-exclamation-triangle"></i>
    `;

    warningBar.classList.remove("hide");
  }
}

function startGame() {
  history = [];

  buttonEnd.onclick = function() { endGame() };
  buttonEnd.classList.remove("disabled");
  buttonInfo.classList.add("disabled");
  buttonStartIcon.classList.add("la-redo-alt");
  buttonEndIcon.classList.add("la-skull-crossbones");

  score = 0;
  scoreDisplay.innerHTML = 0;

  currentWord = words_start[Math.floor(Math.random() * 100)];
  pieces.innerHTML = `
    <div class="piece">
      <input class="shadow" disabled value="${currentWord}" />
      <p class="counter">0</p>
    </div>
  `;

  warning();
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

  pieces.innerHTML += `
    <div class="piece">
      <input class="shadow" placeholder="Nhấn đây!" autocomplete="off" onkeyup="checkWord(event)" />
      <p class="counter" style="opacity: 50%">${counter}</p>
    </div>
  `;

  joinWord = document.querySelector(".piece:last-child input");
  joinWord.focus();
}

function checkWord(event) {
  if (event.keyCode !== 13) return;

  event.preventDefault();

  warning();

  const joinWordFormated = joinWord.value.toLowerCase().trim();

  switch(joinWordFormated) {
    case ",":
      startGame();
      return;
      break;
    case ".":
      endGame();
      return;
      break;
  }

  const fullWord = `${currentWord} ${joinWordFormated}`;

  if (! words[currentWord].includes(joinWordFormated)) { warning("Từ này không có trong từ điển"); return }
  if (history.includes(fullWord)                     ) { warning("Từ này đã được sử dụng");        return }

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
  let usedWordList = "";

  for (let i = 0; i < history.length; i++) {
    usedWordList += (i + 1).toString() + ".&#9;" + history[i] + "\n";
  }

  pieces.innerHTML = `
    <div class="board shadow">
      <pre>${usedWordList}</pre>
      <div id="endGameNav">
        <input id="playerName" placeholder="Nhập tên" autocomplete="off" onkeyup="checkName(event)" />
        <button onclick="submitScore()">
          <i id="submitButton" class="las la-angle-right"></i>
        </button>
      </div>
    </div>
  `;

  warning();

  buttonEnd.onclick = function() { scoreBoard() };
  buttonInfo.classList.remove("disabled");
  buttonEndIcon.classList.remove("la-skull-crossbones");
}

function checkName(event) {
  if (event.keyCode !== 13) return;

  event.preventDefault();

  submitScore();
}

function submitScore() {
  const playerName = document.getElementById("playerName").value.trim();
  const counter = history.length;
  const usedWordList = history.join(", ");

  let xhr = new XMLHttpRequest();
  xhr.open("post", `https://docs.google.com/forms/d/e/1FAIpQLSem_C7O7GzgXNs8sWDSjn6s9J8br_objp5IUor7--j80XZiIQ/formResponse?usp=pp_url&entry.1011382549=${playerName}&entry.356858322=${counter}&entry.834877191=${score}&entry.595300868=${usedWordList}&submit=Submit`, true);
  xhr.send();

  scoreBoard();
}

function scoreBoard() {
  scoreDisplay.innerHTML = null;

  pieces.innerHTML = `
    <iframe class="shadow" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTgPJqsipjuAGyCwu-OpUJdbnlvqgPFHiXxBKESWwp50RbO0KaLBaJBhYwtLzHIIsUp2ll4-yZh2WGI/pubhtml?gid=1462957762&amp;single=true&amp;widget=true&amp;headers=false"></iframe>
  `;

  warning();

  buttonEnd.classList.add("disabled");
  buttonInfo.classList.remove("disabled");
  buttonStartIcon.classList.remove("la-redo-alt");
  buttonEndIcon.classList.remove("la-skull-crossbones");
}

function about() {
  scoreDisplay.innerHTML = null;

  pieces.innerHTML = `
    <div id="info" class="board shadow">
      <h1>Nối Từ</h1>
      <p>
        Nối từ là trò chơi trí tuệ. Người chơi sẽ lần lượt đưa ra một từ có hai
        âm tiết bắt đầu bằng chữ cuối cùng trong từ lúc trước đưa ra. Người chơi
        không được phép sử dụng từ đã từng được dùng trong ván chơi, trò chơi
        kết thúc khi người chơi không nối được từ tiếp theo.
      </p>

      <ul>
        <li><i class="las la-play">            </i> Bắt đầu.</li>
        <li><i class="las la-redo-alt">        </i> Chơi lại.</li>
        <li><i class="las la-skull-crossbones"></i> Kết thúc.</li>
        <li><i class="las la-medal">           </i> Bảng điểm.</li>
        <li><i class="las la-info">            </i> Thông tin.</li>
      </ul>

      <p id="love">
        <a href="https://github.com/NNBnh/noi-tu">Mã nguồn</a>
        -
        Made with <i id="heart" class="las la-heart"></i> by <a href="http://nnbnh.github.io">NNB</a>
      </p>
    </div>
  `;

  buttonEnd.classList.remove("disabled");
  buttonInfo.classList.add("disabled");
  buttonStartIcon.classList.remove("la-redo-alt");
  buttonEndIcon.classList.remove("la-skull-crossbones");
}


about();
