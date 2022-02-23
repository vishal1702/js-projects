const section = document.querySelector("section");
const playerLivesCount = document.querySelector("span");
let playerLives = 6;

playerLivesCount.textContent = playerLives;

// generate data for cards
const getData = () => [
  { imgSrc: "./images/black_panther.jpg", name: "black panther" },
  { imgSrc: "./images/galactus.jpg", name: "galactus" },
  { imgSrc: "./images/odin.jpg", name: "odin" },
  { imgSrc: "./images/sasuke.jpg", name: "sasuke" },
  { imgSrc: "./images/silver_surfer.jpg", name: "silver surfer" },
  { imgSrc: "./images/thanos.jpg", name: "thanos" },
  { imgSrc: "./images/ironman.jpg", name: "ironman" },
  { imgSrc: "./images/hulk.jpg", name: "hulk" },
  { imgSrc: "./images/black_panther.jpg", name: "black panther" },
  { imgSrc: "./images/galactus.jpg", name: "galactus" },
  { imgSrc: "./images/odin.jpg", name: "odin" },
  { imgSrc: "./images/sasuke.jpg", name: "sasuke" },
  { imgSrc: "./images/silver_surfer.jpg", name: "silver surfer" },
  { imgSrc: "./images/thanos.jpg", name: "thanos" },
  { imgSrc: "./images/ironman.jpg", name: "ironman" },
  { imgSrc: "./images/hulk.jpg", name: "hulk" },
];

// randomize cards
const randomize = () => {
  const cardData = getData();
  cardData.sort(() => Math.random() - 0.5);
  // console.log(cardData);
  return cardData;
};

// card generator function
const cardGenerator = () => {
  const cardData = randomize();

  // generate html
  cardData.forEach((item) => {
    const card = document.createElement("div");
    const face = document.createElement("img");
    const back = document.createElement("div");
    card.classList = "card";
    face.classList = "face";
    back.classList = "back";

    // attach info to cards
    face.src = item.imgSrc;
    card.setAttribute("name", item.name);
    // attach card to section
    section.appendChild(card);
    card.appendChild(face);
    card.appendChild(back);

    card.addEventListener("click", (e) => {
      card.classList.toggle("toggleCard");
      checkCards(e);
    });
  });
};

// check cards
const checkCards = (e) => {
  const clickedCard = e.target;
  // console.log(clickedCard);
  clickedCard.classList.add("flipped");
  const flippedCards = document.querySelectorAll(".flipped");
  const toggleCard = document.querySelectorAll(".toggleCard");

  if (flippedCards.length === 2) {
    if (
      flippedCards[0].getAttribute("name") ===
      flippedCards[1].getAttribute("name")
    ) {
      flippedCards.forEach((card) => {
        card.classList.remove("flipped");
        card.style.pointerEvents = "none";
      });
    } else {
      console.log("wrong");
      flippedCards.forEach((card) => {
        card.classList.remove("flipped");
        setTimeout(() => {
          card.classList.remove("toggleCard");
        }, 1000);
      });
      playerLives--;
      playerLivesCount.textContent = playerLives;
      if (playerLives === 0) {
        restart("try again!!!");
      }
    }
  }
  // run check to see if we won game
  if (toggleCard.length === 16) {
    restart("you won!!!");
  }
};

// restart
const restart = (text) => {
  let cardData = randomize();
  let faces = document.querySelectorAll(".face");
  let cards = document.querySelectorAll(".card");
  section.style.pointerEvents = "none";
  cardData.forEach((item, index) => {
    cards[index].classList.remove("toggleCard");
    setTimeout(() => {
      cards[index].style.pointerEvents = "all";
      faces[index].src = items.imgSrc;
      cards[index].setAttribute("name", item.name);
      section.style.pointerEvents = "all";
    }, 1000);
  });
  playerLives = 6;
  playerLivesCount.textContent = playerLives;
  setTimeout(() => {
    window.alert(text);
  }, 1000);
};

cardGenerator();
