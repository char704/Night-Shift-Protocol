const SAVE_KEY = "nightShiftProtocolSave";
const SAVE_VERSION = 1;

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
    exactBasementLine: false,
    receivedShutdownOrder: false
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

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
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

    const delta = Number(amount);
    if (!Number.isFinite(delta)) {
      console.warn(`Invalid stat change for ${key}:`, amount);
      continue;
    }

    const [min, max] = limits[key];
    gameState[key] = clamp(gameState[key] + delta, min, max);
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
        version: SAVE_VERSION,
        sceneId,
        state: deepClone(gameState)
      })
    );
  } catch (error) {
    console.warn("Save failed.", error);
  }
}

function loadSavedGame(validSceneIds) {
  try {
    const rawSave = localStorage.getItem(SAVE_KEY);
    if (!rawSave) {
      return null;
    }

    const parsedSave = JSON.parse(rawSave);
    if (
      !parsedSave ||
      parsedSave.version !== SAVE_VERSION ||
      typeof parsedSave.sceneId !== "string" ||
      !isValidSavedScene(parsedSave.sceneId, validSceneIds)
    ) {
      clearSavedGame();
      return null;
    }

    const normalizedState = normalizeLoadedState(parsedSave.state);
    if (!normalizedState) {
      clearSavedGame();
      return null;
    }

    resetGameState();
    Object.assign(gameState, normalizedState);

    return parsedSave.sceneId;
  } catch (error) {
    console.warn("Load failed.", error);
    clearSavedGame();
    return null;
  }
}

function isValidSavedScene(sceneId, validSceneIds) {
  if (!validSceneIds) {
    return true;
  }

  if (validSceneIds instanceof Set) {
    return validSceneIds.has(sceneId);
  }

  return Array.isArray(validSceneIds) && validSceneIds.includes(sceneId);
}

function normalizeLoadedState(savedState) {
  if (!isPlainObject(savedState)) {
    return null;
  }

  const normalizedState = createInitialGameState();
  const statLimits = {
    sanity: [0, 100],
    attention: [0, 12],
    evidence: [0, 99],
    rulesBroken: [0, 99]
  };

  for (const [key, [min, max]] of Object.entries(statLimits)) {
    if (!Number.isFinite(savedState[key])) {
      return null;
    }
    normalizedState[key] = clamp(savedState[key], min, max);
  }

  if (typeof savedState.currentTime === "string" && savedState.currentTime.length > 0) {
    normalizedState.currentTime = savedState.currentTime;
  }

  if (Array.isArray(savedState.inventory)) {
    normalizedState.inventory = [...new Set(savedState.inventory.filter((item) => {
      return typeof item === "string" && item.trim().length > 0;
    }))];
  }

  if (isPlainObject(savedState.flags)) {
    for (const key of Object.keys(initialGameState.flags)) {
      if (typeof savedState.flags[key] === "boolean") {
        normalizedState.flags[key] = savedState.flags[key];
      }
    }
  }

  return normalizedState;
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
window.SAVE_VERSION = SAVE_VERSION;
window.resetGameState = resetGameState;
window.setCurrentTime = setCurrentTime;
window.applyEffects = applyEffects;
window.saveGame = saveGame;
window.loadSavedGame = loadSavedGame;
window.clearSavedGame = clearSavedGame;
