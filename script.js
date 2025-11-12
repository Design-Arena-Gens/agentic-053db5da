const narration = "A is for Apple, red and sweet, Crunchy and juicy — a tasty treat!";
const playButton = document.getElementById("play-verse");
const apple = document.getElementById("apple");

let cachedVoice = null;

function selectVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    return null;
  }

  const preferredOrder = [
    /child/i,
    /kid/i,
    /girl/i,
    /female/i,
    /english/i,
  ];

  for (const pattern of preferredOrder) {
    const match = voices.find((voice) => pattern.test(voice.name));
    if (match) {
      return match;
    }
  }

  return voices[0];
}

function speakNarration() {
  if (!("speechSynthesis" in window)) {
    playButton.disabled = true;
    playButton.textContent = "Narration unavailable";
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(narration);
  utterance.pitch = 1.4;
  utterance.rate = 0.95;
  utterance.volume = 1;

  cachedVoice = cachedVoice || selectVoice();
  if (cachedVoice) {
    utterance.voice = cachedVoice;
  }

  utterance.onstart = () => {
    apple.classList.add("is-speaking");
  };

  utterance.onend = () => {
    apple.classList.remove("is-speaking");
  };

  window.speechSynthesis.speak(utterance);
}

playButton.addEventListener("click", speakNarration);

if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = selectVoice();
  };
} else {
  playButton.disabled = true;
  playButton.textContent = "Narration unavailable";
}
