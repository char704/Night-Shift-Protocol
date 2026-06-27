const SAVE_KEY = "nightShiftProtocolSave";

const initialGameState = {
  sanity: 100,
  attention: 0,
  evidence: 0,
  rulesBroken: 0,
  currentTime: "00:00",
  inventory: [],
  flags: {
    servedBoy: false,
    answeredOwnCall: false,
    openedStorage: false,
    sawDuplicate: false,
    foundBasementMap: false,
    trustedManager: false,
    checkedWindow: false,
    foundBadge: false,
    earlyKnocking: false,
    destroyedCamera: false,
    enteredBasement: false,
    disabledCCTV: false,
    usedEvidence: false,
    leftBeforeSunrise: false,
    waitedForSunrise: false,
    waitedForHale: false,
    followedDuplicate: false,
    exactBasementLine: false
  }
};

const gameState = createInitialGameState();

function createInitialGameState() {
  return deepClone(initialGameState);
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function resetGameState() {
  const freshState = createInitialGameState();
  for (const key of Object.keys(gameState)) {
    delete gameState[key];
  }
  Object.assign(gameState, freshState);
  return gameState;
}

function setCurrentTime(time) {
  if (typeof time === "string" && time.length > 0) {
    gameState.currentTime = time;
  }
}

function applyEffects(effects) {
  if (!effects) {
    return gameState;
  }

  if (Array.isArray(effects)) {
    effects.forEach(applyEffects);
    return gameState;
  }

  const effectBlock = typeof effects === "function" ? effects(gameState) : effects;
  if (!effectBlock) {
    return gameState;
  }

  applyStatChanges(effectBlock.stats);
  applyFlagChanges(effectBlock.flags);
  addInventoryItems(effectBlock.inventoryAdd);
  removeInventoryItems(effectBlock.inventoryRemove);

  if (effectBlock.currentTime) {
    setCurrentTime(effectBlock.currentTime);
  }

  return gameState;
}

function applyStatChanges(stats) {
  if (!stats) {
    return;
  }

  const limits = {
    sanity: [0, 100],
    attention: [0, 12],
    evidence: [0, 99],
    rulesBroken: [0, 99]
  };

  for (const [key, amount] of Object.entries(stats)) {
    if (!Object.prototype.hasOwnProperty.call(limits, key)) {
      continue;
    }

    const [min, max] = limits[key];
    gameState[key] = clamp(gameState[key] + amount, min, max);
  }
}

function applyFlagChanges(flags) {
  if (!flags) {
    return;
  }

  gameState.flags = {
    ...gameState.flags,
    ...flags
  };
}

function addInventoryItems(items) {
  if (!items) {
    return;
  }

  const list = Array.isArray(items) ? items : [items];
  for (const item of list) {
    if (item && !gameState.inventory.includes(item)) {
      gameState.inventory.push(item);
    }
  }
}

function removeInventoryItems(items) {
  if (!items) {
    return;
  }

  const list = Array.isArray(items) ? items : [items];
  gameState.inventory = gameState.inventory.filter((item) => !list.includes(item));
}

function saveGame(sceneId) {
  try {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        sceneId,
        state: gameState
      })
    );
  } catch (error) {
    console.warn("Save failed.", error);
  }
}

function loadSavedGame() {
  try {
    const rawSave = localStorage.getItem(SAVE_KEY);
    if (!rawSave) {
      return null;
    }

    const parsedSave = JSON.parse(rawSave);
    if (!parsedSave || !parsedSave.state || !parsedSave.sceneId) {
      return null;
    }

    resetGameState();
    Object.assign(gameState, parsedSave.state);
    gameState.flags = {
      ...initialGameState.flags,
      ...parsedSave.state.flags
    };
    gameState.inventory = Array.isArray(parsedSave.state.inventory)
      ? [...parsedSave.state.inventory]
      : [];

    return parsedSave.sceneId;
  } catch (error) {
    console.warn("Load failed.", error);
    return null;
  }
}

function clearSavedGame() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (error) {
    console.warn("Could not clear save.", error);
  }
}

window.gameState = gameState;
window.initialGameState = initialGameState;
window.resetGameState = resetGameState;
window.setCurrentTime = setCurrentTime;
window.applyEffects = applyEffects;
window.saveGame = saveGame;
window.loadSavedGame = loadSavedGame;
window.clearSavedGame = clearSavedGame;
