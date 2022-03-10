const currentWord = document.getElementById("currentWord");
const joinWord    = document.getElementById("joinWord");
const timer       = document.getElementById("timer");

let history = [];
let [milliseconds, seconds, minutes] = [0, 0, 0];
let time = null;


function displayTimer() {
  milliseconds += 1;

  if(milliseconds >= 100) {
    milliseconds = 0;
    seconds++;
    if(seconds >= 60) {
      seconds = 0;
      minutes++;
    }
  }

  let m  = minutes      < 10 ? "0" + minutes      : minutes;
  let s  = seconds      < 10 ? "0" + seconds      : seconds;
  let ms = milliseconds < 10 ? "0" + milliseconds : milliseconds;

  timer.innerHTML = `${m}:${s}:${ms}`;
}


// TODO {
  clearInterval(time);
  [milliseconds,seconds,minutes] = [0, 0, 0];

  currentWord.value = words[Math.floor(Math.random() * words.length)].split(" ")[0];

  time = setInterval(displayTimer, 10);
// }


joinWord.addEventListener("keyup", function(event) {
  if (event.keyCode !== 13) return

  event.preventDefault();

  let joinWordFormated = joinWord.value.toLowerCase().trim();
  let fullWord = currentWord.value + " " + joinWordFormated;

  if (! words.includes(fullWord)) {
    // TODO
    return
  }

  if (history.includes(fullWord)) {
    // TODO
    return
  }

  history.push(fullWord);
  document.getElementById("wordCount").innerHTML = history.length;

  currentWord.value = joinWordFormated;
  joinWord.value = null;
});


// timer.innerHTML = null;
