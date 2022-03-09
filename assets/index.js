const joinWord = document.getElementById("joinWord");

joinWord.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("currentWord").value = joinWord.value;
    joinWord.value = null;
  }
});