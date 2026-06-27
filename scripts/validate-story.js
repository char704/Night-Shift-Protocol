const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
global.window = global;

require(path.join(root, "js", "state.js"));
require(path.join(root, "js", "story.js"));

const scenes = global.SCENES;
const errors = [];
const warnings = [];

const expectedEndings = [
  "ending_perfect",
  "ending_replacement",
  "ending_false_escape",
  "ending_beneath",
  "ending_break_protocol"
];

const approvedAssets = [
  "assets/images/fridge-four.webp",
  "assets/images/manager-phone.webp",
  "assets/images/customer-milk.webp",
  "assets/images/raincoat-man.webp",
  "assets/images/storage-door.webp",
  "assets/images/duplicate-cctv.webp",
  "assets/images/basement-stairs.webp",
  "assets/images/ending-basement.webp",
  "assets/images/ending-sunrise.webp"
];

const requiredSceneAssets = {
  fridge_event: "assets/images/fridge-four.webp",
  start_call: "assets/images/manager-phone.webp",
  phone_event: "assets/images/manager-phone.webp",
  boy_event: "assets/images/customer-milk.webp",
  basement_question: "assets/images/raincoat-man.webp",
  start_storage: "assets/images/storage-door.webp",
  storage_voice: "assets/images/storage-door.webp",
  other_you: "assets/images/duplicate-cctv.webp",
  storage_open: "assets/images/basement-stairs.webp",
  final_basement: "assets/images/basement-stairs.webp",
  ending_beneath: "assets/images/ending-basement.webp",
  ending_break_protocol: "assets/images/ending-sunrise.webp"
};

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function sceneChoices(scene) {
  return Array.isArray(scene.choices) ? scene.choices : [];
}

function assertGraph() {
  for (const [sceneId, scene] of Object.entries(scenes)) {
    if (scene.id !== sceneId) {
      fail(`Scene key/id mismatch: key "${sceneId}" has id "${scene.id}"`);
    }

    for (const choice of sceneChoices(scene)) {
      if (!scenes[choice.next]) {
        fail(`Missing choice target: ${sceneId} -> ${choice.next}`);
      }
    }
  }

  for (const endingId of expectedEndings) {
    if (!scenes[endingId]) {
      fail(`Missing expected ending scene: ${endingId}`);
    }
  }
}

function assertMedia() {
  const referencedAssets = new Set();

  for (const [sceneId, scene] of Object.entries(scenes)) {
    if (!scene.media || !scene.media.src) {
      continue;
    }

    const mediaPath = scene.media.src;
    referencedAssets.add(mediaPath);

    if (mediaPath.includes(".webp.png")) {
      fail(`Stale double-extension media path for ${sceneId}: ${mediaPath}`);
    }

    if (!fs.existsSync(path.join(root, mediaPath))) {
      fail(`Missing media file for ${sceneId}: ${mediaPath}`);
    }
  }

  for (const assetPath of approvedAssets) {
    const exists = fs.existsSync(path.join(root, assetPath));
    if (!exists) {
      fail(`Approved asset not present in checkout: ${assetPath}`);
      continue;
    }

    if (!referencedAssets.has(assetPath)) {
      fail(`Approved asset exists but is not referenced by any scene: ${assetPath}`);
    }
  }
}

function assertRequiredSceneAssets() {
  for (const [sceneId, expectedAsset] of Object.entries(requiredSceneAssets)) {
    const scene = scenes[sceneId];

    if (!scene) {
      fail(`Missing required scene for asset mapping: ${sceneId}`);
      continue;
    }

    const actualAsset = scene.media?.src;

    if (actualAsset !== expectedAsset) {
      fail(
        `Incorrect asset mapping for ${sceneId}: ` +
        `expected ${expectedAsset}, got ${actualAsset || "none"}`
      );
    }
  }
}

function choose(sceneId, textIncludes) {
  const scene = scenes[sceneId];
  const needle = textIncludes.toLowerCase();
  const choice = sceneChoices(scene).find((candidate) => {
    if (!candidate.text.toLowerCase().includes(needle)) {
      return false;
    }

    return !candidate.condition || candidate.condition(global.gameState);
  });

  if (!choice) {
    throw new Error(`No available choice in ${sceneId} containing "${textIncludes}"`);
  }

  global.applyEffects(choice.effects);
  return choice.next;
}

function runPath(name, labels, expectedEnding) {
  global.resetGameState();
  let sceneId = "start";

  for (const label of labels) {
    global.setCurrentTime(scenes[sceneId].time);
    sceneId = choose(sceneId, label);
  }

  const actualEnding = scenes.ending_check.resolve(global.gameState);
  if (actualEnding !== expectedEnding) {
    fail(`${name} expected ${expectedEnding}, got ${actualEnding}`);
  }
}

function assertEndingReachability() {
  try {
    runPath("perfect", [
      "Read the protocol",
      "Start the shift",
      "Follow Rule 2",
      "Return to the register",
      "Refuse service",
      "Let the chime fade",
      "Ignore it",
      "Wait for the next customer",
      "This store does not have a basement",
      "Watch him leave",
      "Keep it closed",
      "Return to CCTV",
      "Turn off the monitor",
      "Wait for the manager call",
      "Tell the truth",
      "End the report",
      "Wait for sunrise"
    ], "ending_perfect");

    runPath("replacement", [
      "Read the protocol",
      "Start the shift",
      "Inspect inside",
      "Step back",
      "Sell him the milk",
      "Pocket the coin",
      "Answer",
      "Hang up",
      "Say you do not know",
      "Check the clock",
      "Open the door",
      "Take the journal and map",
      "Watch for more than 5 seconds",
      "Do not turn around",
      "Accuse him",
      "Let the line die",
      "Leave as soon"
    ], "ending_replacement");

    runPath("false escape", [
      "Read the protocol",
      "Start the shift",
      "Close it manually",
      "Return to the register",
      "Refuse service",
      "Let the chime fade",
      "Ignore it",
      "Wait for the next customer",
      "This store does not have a basement",
      "Watch him leave",
      "Keep it closed",
      "Return to CCTV",
      "Turn off the monitor",
      "Wait for the manager call",
      "Tell the truth",
      "End the report",
      "Leave as soon"
    ], "ending_false_escape");

    runPath("beneath", [
      "Read the protocol",
      "Start the shift",
      "Inspect inside",
      "Step back",
      "Check CCTV",
      "Return to the counter",
      "Record the message",
      "Keep the recording",
      "This store does not have a basement",
      "Watch him leave",
      "Open the door",
      "Take the journal and map",
      "Turn off the monitor",
      "Wait for the manager call",
      "Tell the truth",
      "End the report",
      "Enter the basement",
      "Step into the monitor room"
    ], "ending_beneath");

    runPath("break protocol", [
      "Read the protocol",
      "Start the shift",
      "Follow Rule 2",
      "Return to the register",
      "Sell him the milk",
      "Pocket the coin",
      "Record the message",
      "Keep the recording",
      "This store does not have a basement",
      "Watch him leave",
      "Open the door",
      "Take the journal and map",
      "Communicate with written notes",
      "Keep the photo",
      "Ask about previous employees",
      "Fold the roster",
      "Use evidence",
      "Pull the camera breakers"
    ], "ending_break_protocol");
  } catch (error) {
    fail(error.message);
  }
}

assertGraph();
assertMedia();
assertRequiredSceneAssets();
assertEndingReachability();

for (const message of warnings) {
  console.warn(`warning: ${message}`);
}

if (errors.length > 0) {
  for (const message of errors) {
    console.error(`error: ${message}`);
  }
  process.exit(1);
}

console.log("Story validation passed.");
console.log(`Validated ${Object.keys(scenes).length} scenes and ${expectedEndings.length} endings.`);
