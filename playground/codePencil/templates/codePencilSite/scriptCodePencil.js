const words = ["Sketch", "Edit", "Create", "Practice"];
let currentWordIndex = 0;
let currentLetterIndex = 0;
const dynamicWordElement = document.querySelector(".dynamic-word");

function typeWord() {
  if (currentLetterIndex < words[currentWordIndex].length) {
    dynamicWordElement.textContent +=
      words[currentWordIndex].charAt(currentLetterIndex);
    currentLetterIndex++;
    setTimeout(typeWord, 150);
  } else {
    setTimeout(eraseWord, 2000); // Keep word displayed for 750ms
  }
}

function eraseWord() {
  if (currentLetterIndex > 0) {
    dynamicWordElement.textContent = dynamicWordElement.textContent.slice(
      0,
      -1
    );
    currentLetterIndex--;
    setTimeout(eraseWord, 200);
  } else {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    setTimeout(typeWord, 200);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  typeWord();
  // Set the current year in the footer
  document.getElementById("year").textContent = new Date().getFullYear();
});
