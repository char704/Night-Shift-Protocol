const choiceKeyMap = {
  "1": 0,
  "2": 1,
  "3": 2,
  "4": 3,
  a: 0,
  b: 1,
  c: 2,
  d: 3
};

const dom = {};

let currentSceneId = "start";
let visibleChoices = [];
let typeTimer = null;
let resolveTimer = null;
let isTyping = false;
let activeTypeComplete = null;
let fullNarrativeText = "";
let audioContext = null;
let soundEnabled = loadSoundPreference();

document.addEventListener("DOMContentLoaded", initGame);

function initGame() {
  cacheDom();
  bindEvents();
  updateSoundButton();
  renderScene("start", { skipSave: true });
  updateLoadButton();
}

function cacheDom() {
  dom.app = document.querySelector("#app");
  dom.mediaFrame = document.querySelector("#mediaFrame");
  dom.sceneImage = document.querySelector("#sceneImage");
  dom.mediaFallback = document.querySelector("#mediaFallback");
  dom.sceneTitle = document.querySelector("#sceneTitle");
  dom.sceneTime = document.querySelector("#sceneTime");
  dom.sanityValue = document.querySelector("#sanityValue");
  dom.attentionValue = document.querySelector("#attentionValue");
  dom.evidenceValue = document.querySelector("#evidenceValue");
  dom.rulesValue = document.querySelector("#rulesValue");
  dom.narrative = document.querySelector("#narrative");
  dom.choiceList = document.querySelector("#choiceList");
  dom.restartButton = document.querySelector("#restartButton");
  dom.soundButton = document.querySelector("#soundButton");
  dom.loadButton = document.querySelector("#loadButton");
  dom.inventory = document.querySelector("#inventory");
}

function bindEvents() {
  dom.restartButton.addEventListener("click", restartGame);
  dom.soundButton.addEventListener("click", toggleSound);
  dom.loadButton.addEventListener("click", loadGameFromStorage);
  dom.narrative.addEventListener("click", skipTypewriter);
  dom.mediaFrame.addEventListener("click", skipTypewriter);

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (isTyping) {
      skipTypewriter();
      return;
    }

    if (key === "r" && event.ctrlKey) {
      event.preventDefault();
      restartGame();
      return;
    }

    if (Object.prototype.hasOwnProperty.call(choiceKeyMap, key)) {
      const choice = visibleChoices[choiceKeyMap[key]];
      if (choice) {
        handleChoice(choice);
      }
    }
  });
}

function renderScene(sceneId, options = {}) {
  const scene = SCENES[sceneId];
  if (!scene) {
    console.error(`Missing scene: ${sceneId}`);
    renderScene("start");
    return;
  }

  clearTimers();
  currentSceneId = sceneId;
  setCurrentTime(scene.time);
  updateStateDisplay();
  renderMedia(scene.media);
  dom.sceneTitle.textContent = scene.title;
  dom.sceneTime.textContent = scene.time;
  dom.choiceList.innerHTML = "";
  visibleChoices = [];

  const lines = getSceneLines(scene);
  const text = lines.join("\n\n");
  const onComplete = () => {
    if (scene.resolve) {
      resolveTimer = window.setTimeout(() => {
        const endingId = scene.resolve(gameState);
        renderScene(endingId);
      }, 700);
      return;
    }

    renderChoices(scene);
  };

  startTypewriter(text, onComplete);

  if (!options.skipSave) {
    saveGame(sceneId);
    updateLoadButton();
  }

  playSceneTone(scene);
}

function getSceneLines(scene) {
  const rawText = typeof scene.text === "function" ? scene.text(gameState) : scene.text;
  const lines = Array.isArray(rawText) ? rawText : [String(rawText || "")];

  if (scene.isEnding) {
    return lines;
  }

  if (gameState.sanity <= 19) {
    return [...lines, "The text on the protocol crawls into a different order when you blink."];
  }

  if (gameState.sanity <= 39) {
    return [...lines, "For a moment, one of the choices is already selected."];
  }

  if (gameState.sanity <= 69) {
    return [...lines, "The fluorescent lights buzz in the shape of a word you almost know."];
  }

  return lines;
}

function startTypewriter(text, onComplete) {
  stopTypewriter();
  fullNarrativeText = text;
  activeTypeComplete = onComplete;
  isTyping = true;
  dom.narrative.textContent = "";
  dom.narrative.classList.add("typing");

  let index = 0;
  const speed = gameState.sanity < 40 ? 12 : 18;

  typeTimer = window.setInterval(() => {
    index += 1;
    dom.narrative.textContent = text.slice(0, index);

    if (index >= text.length) {
      finishTypewriter();
    }
  }, speed);
}

function finishTypewriter() {
  stopTypewriter();
  dom.narrative.textContent = fullNarrativeText;
  dom.narrative.classList.remove("typing");

  const complete = activeTypeComplete;
  activeTypeComplete = null;

  if (complete) {
    complete();
  }
}

function skipTypewriter() {
  if (!isTyping) {
    return;
  }

  finishTypewriter();
}

function stopTypewriter() {
  if (typeTimer) {
    window.clearInterval(typeTimer);
    typeTimer = null;
  }
  isTyping = false;
}

function clearTimers() {
  stopTypewriter();
  if (resolveTimer) {
    window.clearTimeout(resolveTimer);
    resolveTimer = null;
  }
}

function renderChoices(scene) {
  visibleChoices = (scene.choices || []).filter((choice) => {
    if (!choice.condition) {
      return true;
    }

    try {
      return choice.condition(gameState);
    } catch (error) {
      console.warn(`Choice condition failed in scene ${scene.id}.`, error);
      return false;
    }
  });

  dom.choiceList.innerHTML = "";

  visibleChoices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.innerHTML = `<span class="choice-key">${index + 1}</span><span>${choice.text}</span>`;
    button.addEventListener("click", () => handleChoice(choice));
    dom.choiceList.appendChild(button);
  });
}

function handleChoice(choice) {
  if (!choice) {
    return;
  }

  if (choice.action === "restart") {
    restartGame();
    return;
  }

  applyEffects(choice.effects);
  playTone("choice");
  renderScene(choice.next);
}

function renderMedia(media) {
  const fallbackText = media?.fallback || "NO SIGNAL";
  dom.mediaFrame.dataset.time = gameState.currentTime;
  dom.mediaFallback.textContent = fallbackText;
  dom.mediaFallback.hidden = false;
  dom.sceneImage.hidden = true;
  dom.sceneImage.removeAttribute("src");
  dom.sceneImage.alt = media?.alt || fallbackText;

  if (!media?.src) {
    return;
  }

  dom.sceneImage.onload = () => {
    dom.sceneImage.hidden = false;
    dom.mediaFallback.hidden = true;
  };
  dom.sceneImage.onerror = () => {
    dom.sceneImage.hidden = true;
    dom.mediaFallback.hidden = false;
  };
  dom.sceneImage.src = media.src;
}

function updateStateDisplay() {
  dom.sceneTime.textContent = gameState.currentTime;
  dom.sanityValue.textContent = String(gameState.sanity);
  dom.attentionValue.textContent = String(gameState.attention);
  dom.evidenceValue.textContent = String(gameState.evidence);
  dom.rulesValue.textContent = String(gameState.rulesBroken);
  dom.inventory.textContent = gameState.inventory.length
    ? gameState.inventory.join(" / ")
    : "No items logged";

  document.body.classList.toggle("sanity-stable", gameState.sanity >= 70);
  document.body.classList.toggle("sanity-uneasy", gameState.sanity < 70 && gameState.sanity >= 40);
  document.body.classList.toggle("sanity-critical", gameState.sanity < 40 && gameState.sanity >= 20);
  document.body.classList.toggle("sanity-broken", gameState.sanity < 20);
  document.body.classList.toggle("attention-high", gameState.attention >= 8);
}

function restartGame() {
  clearTimers();
  resetGameState();
  clearSavedGame();
  renderScene("start", { skipSave: true });
  updateLoadButton();
  playTone("restart");
}

function loadGameFromStorage() {
  const loadedSceneId = loadSavedGame();
  if (!loadedSceneId || !SCENES[loadedSceneId]) {
    updateLoadButton();
    return;
  }

  renderScene(loadedSceneId, { skipSave: true });
  updateLoadButton();
  playTone("load");
}

function updateLoadButton() {
  try {
    dom.loadButton.disabled = !localStorage.getItem("nightShiftProtocolSave");
  } catch (error) {
    dom.loadButton.disabled = true;
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  saveSoundPreference();
  updateSoundButton();
  playTone("toggle");
}

function updateSoundButton() {
  dom.soundButton.textContent = soundEnabled ? "Sound On" : "Sound Off";
  dom.soundButton.setAttribute("aria-pressed", String(soundEnabled));
}

function loadSoundPreference() {
  try {
    return localStorage.getItem("nightShiftSound") === "on";
  } catch (error) {
    return false;
  }
}

function saveSoundPreference() {
  try {
    localStorage.setItem("nightShiftSound", soundEnabled ? "on" : "off");
  } catch (error) {
    console.warn("Could not save sound preference.", error);
  }
}

function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return null;
    }
    audioContext = new AudioContextClass();
  }

  return audioContext;
}

function playSceneTone(scene) {
  if (scene.isEnding) {
    playTone("ending");
    return;
  }

  if (gameState.attention >= 8) {
    playTone("danger");
  }
}

function playTone(kind) {
  if (!soundEnabled) {
    return;
  }

  const context = getAudioContext();
  if (!context) {
    return;
  }

  const settings = {
    choice: { frequency: 220, duration: 0.05, gain: 0.03 },
    restart: { frequency: 110, duration: 0.14, gain: 0.04 },
    load: { frequency: 330, duration: 0.08, gain: 0.035 },
    toggle: { frequency: 440, duration: 0.06, gain: 0.025 },
    danger: { frequency: 64, duration: 0.28, gain: 0.04 },
    ending: { frequency: 98, duration: 0.4, gain: 0.05 }
  }[kind] || { frequency: 180, duration: 0.08, gain: 0.03 };

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = kind === "danger" ? "sawtooth" : "triangle";
  oscillator.frequency.value = settings.frequency;
  gain.gain.value = settings.gain;

  oscillator.connect(gain);
  gain.connect(context.destination);

  const now = context.currentTime;
  gain.gain.setValueAtTime(settings.gain, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + settings.duration);
  oscillator.start(now);
  oscillator.stop(now + settings.duration);
}
