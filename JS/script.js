const infoIcon = document.querySelector(".info.icon");
const popupModal = document.querySelector(".popup");
const popupOverlay = document.querySelector(".pop-overlay");
const game = document.querySelector(".game");
const playButton = document.querySelector(".play");
const cardWrapper = document.querySelector(".game .cardContainer");
const scoreWrapper = document.querySelector(".game .scoreWrapper");
const score = document.querySelector(".game .scoreItem .score");
const body = document.querySelector(".body");
const cardItems = document.querySelectorAll(".cards-wrapper .cards .card-item");
const storyPage = document.querySelector(".body-content .story-page");
const board = document.querySelector(".story-page .board");
const boardItems = document.querySelectorAll(".board-item .card-number");
const successModal = document.querySelector(".success-wrapper");
const closeButton = document.querySelector(".closeModal");
const overlay = document.querySelector(".overlay");
const arrows = document.querySelectorAll(".game .body .arrow");
const pauseButton = document.querySelector(".game .pause.icon");
const iconsArr = [...arrows, pauseButton];
let counter = 0;
let cardsAnimation = 0;
const animateInfo = () => {
  infoIcon.classList.add("show");
  infoIcon.addEventListener("animationend", () => {
    setTimeout(() => {
      infoIcon.classList.remove("show");
      infoIcon.classList.add("hide");
    }, 1000);
  });
};
infoIcon.addEventListener("click", () => {
  infoIcon.classList.remove("hide");
  animateInfo();
});
playButton.addEventListener("click", () => {
  document.querySelector("#start-audio").play();
  cardWrapper.classList.add("hide");
  cardWrapper.addEventListener("animationend", () => {
    cardWrapper.classList.remove("hide");
    cardWrapper.style.visibility = "hidden";
    body.classList.add("show");
    scoreWrapper.style.visibility = "visible";
    score.textContent = `0/${cardItems.length}`;
    storyPage.classList.add("show");
    cardItems.forEach((card) => {
      card.classList.add("animate");
      card.addEventListener("animationend", () => {
        card.classList.remove("animate");
        card.style.transform = "scale(1)";
        cardsAnimation++;
        if (cardsAnimation === cardItems.length) {
          board.style.visibility = "visible";
          board.classList.add("show");
          board.addEventListener("animationend", () => {
            board.classList.remove("show");
          });
        }
      });
    });
  });
});
pauseButton.addEventListener("click", () => {
  const hiddenIcon = pauseButton.querySelector("i.hide");
  const shownIcon = pauseButton.querySelector("i:not(.hide)");
  hiddenIcon.classList.remove("hide");
  shownIcon.classList.add("hide");
});
cardItems.forEach((cardItem) => {
  cardItem.addEventListener("dragstart", (event) => {
    event.stopPropagation();
    cardItem.style.opacity = "0";
    event.dataTransfer.setData("id", cardItem.dataset.index);
    document.querySelector(`audio[id="${cardItem.dataset.index}"]`).play();
  });
  cardItem.addEventListener("dragend", (event) => {
    cardItem.style.opacity = "1";
  });
});
boardItems.forEach((boardItem) => {
  boardItem.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  boardItem.addEventListener("drop", (event) => {
    event.preventDefault();
    const index = boardItem.dataset.index;
    const imgId = event.dataTransfer.getData("id");
    const img = document.querySelector(
      `.cards-wrapper .cards .card-item[data-index="${imgId}"] img`
    );
    if (index === imgId) {
      document.querySelector("#correct-audio").play();
      const imgSrc = img.src;
      counter += 1;
      score.textContent = `${counter}/${boardItems.length}`;
      boardItem.textContent = "";
      boardItem.style.backgroundImage = `url(${imgSrc})`;
      boardItem.classList.add("animate");
      boardItem.addEventListener("animationend", () => {
        boardItem.classList.remove("animate");
      });
      img.parentElement.style.visibility = "hidden";
      document
        .querySelector(":root")
        .style.setProperty(
          "--width",
          `${(100 / boardItems.length) * counter}%`
        );
      const numberItem = document.querySelector(
        `.board-item .number[data-index="${index}"]`
      );
      numberItem.style.visibility = "visible";
      numberItem.classList.add("show");
      numberItem.addEventListener("animationend", () => {
        numberItem.classList.remove("show");
      });
      if (counter === boardItems.length) {
        const text = document.querySelector(".text-card .score-text");
        text.textContent = `${counter}/${boardItems.length}`;
        text.setAttribute("text", `${counter}/${boardItems.length}`);
        successModal.style.visibility = "visible";
        overlay.classList.add("show");
        successModal.classList.add("show");
        setTimeout(() => {
          document.querySelector(`audio[id="success"]`).play();
        }, 500);
      }
    } else {
      document.querySelector("#wrong-audio").play();
      img.parentElement.classList.add("vibrate");
      img.parentElement.addEventListener("animationend", () => {
        img.parentElement.classList.remove("vibrate");
      });
    }
  });
});
const addCloseAnimation = () => {
  closeButton.classList.add("animate");
  closeButton.addEventListener("animationend", () => {
    closeButton.classList.remove("animate");
  });
  successModal.classList.add("hide");
  successModal.style.visibility = "hidden";
  overlay.classList.remove("show");
};
document.addEventListener("click", function (event) {
  const isVisible =
    window.getComputedStyle(successModal).visibility === "visible";
  var isClickInside =
    successModal.contains(event.target) || event.target === closeButton;
  if (!isClickInside && isVisible) {
    addCloseAnimation();
  }
});
closeButton.addEventListener("click", () => {
  addCloseAnimation();
});
const hideItems = () => {
  iconsArr.forEach((item) => {
    item.style.opacity = 0;
  });
};
let timer;
const resetTimer = () => {
  clearTimeout(timer);
  iconsArr.forEach((item) => {
    item.style.opacity = 1;
  });
  timer = setTimeout(hideItems, 3000);
};
document.addEventListener("mousemove", resetTimer);
document.addEventListener("touchstart", resetTimer);
const checkScreen = () => {
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const isMobile = window.innerWidth < 768 && isPortrait;
  return isMobile;
};
window.addEventListener("load", () => {
  const is_mobile = checkScreen();
  if (is_mobile) {
    popupModal.style.visibility = "visible";
    popupOverlay.style.visibility = "visible";
  } else {
    game.style.visibility = "visible";
  }
  animateInfo();
});
document.addEventListener("contextmenu", function (event) {
  var target = event.target;
  if (target.tagName === "IMG") {
    event.preventDefault();
  }
  return false;
});
window.addEventListener("orientationchange", function () {
  const is_mobile = checkScreen();
  if (window.orientation === 90 || window.orientation === -90) {
    if (is_mobile) {
      game.style.visibility = "visible";
      popupModal.style.visibility = "hidden";
      popupOverlay.style.visibility = "hidden";
    } else {
      popupModal.style.visibility = "visible";
      popupOverlay.style.visibility = "visible";
    }
  } else {
    popupModal.style.visibility = "visible";
    popupOverlay.style.visibility = "visible";
  }
});
