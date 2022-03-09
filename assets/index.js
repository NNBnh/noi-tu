const currentWord = document.getElementById("currentWord");
const joinWord = document.getElementById("joinWord");

joinWord.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();

    if (words.includes(currentWord.value + " " + joinWord.value)) {
      currentWord.value = joinWord.value;
      joinWord.value = null;
    }
  }
});