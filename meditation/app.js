const app = () => {
  const song = document.querySelector(".song");
  const play = document.querySelector(".play");
  const outline = document.querySelector(".moving-outline circle");
  const video = document.querySelector(".vid-container video");

  // sounds
  const sounds = document.querySelectorAll(".sound-picker button");
  // time display
  const timeDisplay = document.querySelector(".time-display");

  const timeSelect = document.querySelectorAll(".time-select button");
  // get length of outline
  const outlineLength = outline.getTotalLength();
  // console.log(outlineLength);
  // duration
  let duration = 600;

  outline.style.strokeDasharray = outlineLength;
  outline.style.strokeDashoffset = outlineLength;

  // pick different sounds
  sounds.forEach((sound) => {
    sound.addEventListener("click", function () {
      song.src = this.getAttribute("data-sound");
      video.src = this.getAttribute("data-video");
      checkPlaying(song);
    });
  });

  // play audio
  play.addEventListener("click", () => {
    checkPlaying(song);
  });

  // select sound
  timeSelect.forEach((option) => {
    option.addEventListener("click", function () {
      duration = this.getAttribute("data-time");
      timeDisplay.textContent = `${Math.floor(duration / 60)}:${Math.floor(
        duration % 60
      )}`;
    });
  });

  // function to stop and play audio
  const checkPlaying = (song) => {
    if (song.paused) {
      song.play();
      video.play();
      play.src = "./svg/pause.svg";
    } else {
      song.pause();
      video.pause();
      play.src = "./svg/play.svg";
    }
  };

  // animate the circle
  song.ontimeupdate = () => {
    let currentTime = song.currentTime;
    let elapsed = duration - currentTime;
    let seconds = Math.floor(elapsed % 60);
    let minutes = Math.floor(elapsed / 60);

    let progress = outlineLength - (currentTime / 60) * outlineLength;
    outline.style.strokeDashoffset = progress;

    // animate the text
    timeDisplay.textContent = `${minutes}:${seconds}`;

    if (currentTime >= duration) {
      song.pause();
      song.currentTime = 0;
      play.src = "./svg/play.svg";
      video.pause();
    }
  };
};

app();
