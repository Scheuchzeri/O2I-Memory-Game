// Game state
let gameState = {
  currentPlayer: 1,
  scores: { 1: 0, 2: 0 },
  flippedCards: [],
  matchedPairs: 0,
  canFlip: true,
  gameStarted: false,
};

// Card pairs data - 12 pairs = 24 cards
const cardPairs = [
  "O²",
  "Mobile Network Provider",
  "O2I",
  "Order-To-Invoice",
  "ESM",
  "Enterprise Service Management",
  "DACH",
  "Deutschland-Austria-Confœderatio Helvetica",
  "Dach, das; n.",
  "The German word for 'roof'",
  "AMER",
  "The Americas",
  "Amer/-ère, Adj.",
  "French adjective meaning 'bitter'",
  "APJ",
  "Asia-Pacific-Japan",
  "ILP",
  "The grand mystery to our work…what does ‘ILP’ actually stand for?",
  "02I Training KPIs",
  "Right-the-first-time-Invoicing (99%), Initial-Response-Time (.80 Days), Dispute-Cycle-Time (16 days)",
  "MEE / EMEA",
  "Middle & Eastern Europe / Europe, Middle East & Africa",
  "Me, Myself and I",
  "Song by Beyoncé",
];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createGameBoard() {
  const gameBoard = document.getElementById("gameBoard");
  const shuffledCards = shuffleArray(cardPairs);

  gameBoard.innerHTML = "";

  shuffledCards.forEach((cardText, index) => {
    const card = document.createElement("div");
    card.className = "card covered";
    card.setAttribute("data-card-text", cardText);
    card.setAttribute("data-card-index", index);
    card.textContent = cardText;
    card.onclick = () => flipCard(card, index);
    gameBoard.appendChild(card);
  });
}

function startGame() {
  // Hide start button and show scoreboard
  document.querySelector(".start-section").style.display = "none";
  document.getElementById("scoreboard").style.display = "flex";

  // Reset game state
  gameState = {
    currentPlayer: 1,
    scores: { 1: 0, 2: 0 },
    flippedCards: [],
    matchedPairs: 0,
    canFlip: true,
    gameStarted: true,
  };

  // Update display
  updateScoreboard();
  createGameBoard();
}

function flipCard(card, index) {
  if (
    !gameState.canFlip ||
    card.classList.contains("matched") ||
    card.classList.contains("flipped") ||
    gameState.flippedCards.length >= 2
  ) {
    return;
  }

  // Flip the card
  card.classList.remove("covered");
  card.classList.add("flipped", "selected");
  gameState.flippedCards.push({
    element: card,
    index,
    text: card.getAttribute("data-card-text"),
  });

  // Check for match if two cards are flipped
  if (gameState.flippedCards.length === 2) {
    gameState.canFlip = false;
    setTimeout(checkForMatch, 1000);
  }
}

function checkForMatch() {
  const [card1, card2] = gameState.flippedCards;

  // Check if cards are a matching pair
  const isMatch = areCardsMatching(card1.text, card2.text);

  if (isMatch) {
    // Match found
    card1.element.classList.add("matched");
    card2.element.classList.add("matched");
    card1.element.classList.remove("selected");
    card2.element.classList.remove("selected");

    gameState.scores[gameState.currentPlayer]++;
    gameState.matchedPairs++;

    updateScoreboard();

    // Check if game is complete
    if (gameState.matchedPairs === 12) {
      endGame();
      return;
    }

    // Same player continues
  } else {
    // No match - flip cards back
    card1.element.classList.remove("flipped", "selected");
    card1.element.classList.add("covered");
    card2.element.classList.remove("flipped", "selected");
    card2.element.classList.add("covered");

    // Switch players
    gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
    updateScoreboard();
  }

  gameState.flippedCards = [];
  gameState.canFlip = true;
}

function areCardsMatching(text1, text2) {
  const pairs = [
    ["O²", "Mobile Network Provider"],
    ["O2I", "Order-To-Invoice"],
    ["ESM", "Enterprise Service Management"],
    ["DACH", "Deutschland-Austria-Confœderatio Helvetica"],
    ["Dach, das; n.", "The German word for 'roof'"],
    ["AMER", "The Americas"],
    ["Amer/-ère, Adj.", "French adjective meaning 'bitter'"],
    ["APJ", "Asia-Pacific-Japan"],
    [
      "ILP",
      "The grand mystery to our work…what does ‘ILP’ actually stand for?",
    ],
    [
      "02I Training KPIs",
      "Right-the-first-time-Invoicing (99%), Initial-Response-Time (.80 Days), Dispute-Cycle-Time (16 days)",
    ],
    ["MEE / EMEA", "Middle & Eastern Europe / Europe, Middle East & Africa"],
    ["Me, Myself and I", "Song by Beyoncé"],
  ];

  return pairs.some(
    (pair) =>
      (pair[0] === text1 && pair[1] === text2) ||
      (pair[0] === text2 && pair[1] === text1)
  );
}

function updateScoreboard() {
  document.getElementById("score1").textContent = gameState.scores[1];
  document.getElementById("score2").textContent = gameState.scores[2];

  // Update active player visual
  document
    .getElementById("player1")
    .classList.toggle("active", gameState.currentPlayer === 1);
  document
    .getElementById("player2")
    .classList.toggle("active", gameState.currentPlayer === 2);
}

function endGame() {
  const winner =
    gameState.scores[1] > gameState.scores[2]
      ? 1
      : gameState.scores[2] > gameState.scores[1]
      ? 2
      : "tie";

  const messageEl = document.getElementById("gameMessage");
  messageEl.style.display = "block";

  if (winner === "tie") {
    messageEl.textContent = "It's a Tie!";
  } else {
    messageEl.textContent = `Player ${winner} Wins!`;
  }
}

// Initialize the covered cards on page load
window.onload = function () {
  createGameBoard();
};
