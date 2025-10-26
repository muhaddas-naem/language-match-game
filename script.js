// =============================
// 🧠 Language Match Game Script
// =============================

// -------- WORD DATA --------
const wordPairs = [
  { word: "Apple", meaning: "আপেল", emoji: "🍎" },
  { word: "Sun", meaning: "সূর্য", emoji: "☀️" },
  { word: "Book", meaning: "বই", emoji: "📖" },
  { word: "Fish", meaning: "মাছ", emoji: "🐟" },
  { word: "Tree", meaning: "গাছ", emoji: "🌳" },
  { word: "Heart", meaning: "হৃদয়", emoji: "❤️" },
  { word: "Fire", meaning: "আগুন", emoji: "🔥" },
  { word: "Star", meaning: "তারা", emoji: "⭐" },
  { word: "Moon", meaning: "চাঁদ", emoji: "🌙" },
  { word: "Car", meaning: "গাড়ি", emoji: "🚗" },
  { word: "Flower", meaning: "ফুল", emoji: "🌸" },
  { word: "Bird", meaning: "পাখি", emoji: "🐦" },
  { word: "Water", meaning: "পানি", emoji: "💧" },
  { word: "Smile", meaning: "হাসি", emoji: "😊" },
  { word: "Clock", meaning: "ঘড়ি", emoji: "⏰" }
];

// -------- SELECTORS --------
const board = document.getElementById("board");
const scoreEl = document.getElementById("score");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const playAgainBtn = document.getElementById("playAgain");
const startBtn = document.getElementById("startBtn");
const modeSelect = document.getElementById("modeSelect");
const sizeSelect = document.getElementById("sizeSelect");

// -------- GAME STATE --------
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;
let moves = 0;
let timer = null;
let seconds = 0;

// -------- TIMER FUNCTION --------
function startTimer() {
  if (timer) clearInterval(timer);
  seconds = 0;
  timer = setInterval(() => {
    seconds++;
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    timeEl.textContent = `${min}:${sec}`;
  }, 1000);
}

// -------- SHUFFLE --------
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// -------- CREATE BOARD --------
function createBoard() {
  const mode = modeSelect.value; // "word-meaning" or "word-image"
  const pairCount = parseInt(sizeSelect.value);
  const selectedPairs = wordPairs.slice(0, pairCount);

  // Build cards (2 per pair)
  let cards = [];
  selectedPairs.forEach((pair) => {
    if (mode === "word-meaning") {
      cards.push({ id: pair.word, text: pair.word });
      cards.push({ id: pair.word, text: pair.meaning });
    } else {
      cards.push({ id: pair.word, text: pair.word });
      cards.push({ id: pair.word, text: pair.emoji });
    }
  });

  shuffle(cards);

  board.innerHTML = "";
  cards.forEach((cardObj) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = cardObj.id;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front">❓</div>
        <div class="card-face card-back">${cardObj.text}</div>
      </div>
    `;

    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });
}

// -------- RESET GAME --------
function resetGame() {
  score = 0;
  moves = 0;
  scoreEl.textContent = score;
  movesEl.textContent = moves;
  timeEl.textContent = "00:00";
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  modal.classList.add("hidden");
  createBoard();
  startTimer();
}

// -------- FLIP LOGIC --------
function flipCard(card) {
  if (lockBoard) return;
  if (card.classList.contains("flipped")) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  movesEl.textContent = moves;

  checkMatch();
}

// -------- MATCH CHECK --------
function checkMatch() {
  const isMatch = firstCard.dataset.id === secondCard.dataset.id;

  if (isMatch) {
    disableCards();
    score++;
    scoreEl.textContent = score;
    checkWin();
  } else {
    unflipCards();
  }
}

// -------- DISABLE MATCHED CARDS --------
function disableCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  firstCard.removeEventListener("click", () => flipCard);
  secondCard.removeEventListener("click", () => flipCard);

  resetFlip();
}

// -------- UNFLIP CARDS --------
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetFlip();
  }, 800);
}

// -------- RESET FLIP VARIABLES --------
function resetFlip() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// -------- WIN CHECK --------
function checkWin() {
  const totalPairs = parseInt(sizeSelect.value);
  if (score === totalPairs) {
    clearInterval(timer);
    modal.classList.remove("hidden");
    modalTitle.textContent = "🎉 অভিনন্দন!";
    modalText.textContent = `তুমি ${moves} মুভে সব মিল করেছো, সময় লেগেছে ${timeEl.textContent}।`;
  }
}

// -------- EVENT LISTENERS --------
startBtn.addEventListener("click", resetGame);
playAgainBtn.addEventListener("click", resetGame);

// Auto start game on load
window.addEventListener("load", () => {
  startBtn.click();
});
