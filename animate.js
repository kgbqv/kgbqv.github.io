const texts = ["khgb", "khg_b", "kgbqv"];
let index = 0;

function changeText() {
  const textElement = document.getElementById("animated-text");
  let newText = "welcome to " + texts[index] + "'s website";
  console.log(newText);
  textElement.textContent = newText;
  index = (index + 1) % texts.length;
}

setInterval(changeText, 3000);