const MEDIA_FALLBACK = "NO SIGNAL - camera feed unavailable";

const SCENES = {
  start: {
    id: "start",
    time: "00:00",
    title: "Start of Shift",
    media: {
      type: "image",
      src: "assets/images/storefront-0000.webp",
      alt: "The convenience store under dead fluorescent light.",
      fallback: MEDIA_FALLBACK
    },
    text: [
      "Mr. Hale waits beside register two with both hands folded over a clipboard.",
      "Outside, the abandoned highway is black except for the store sign ticking red light into the glass.",
      "He gives you a laminated page. It is still warm.",
      "\"Follow the protocol. The protocol is the only reason you are still here.\""
    ],
    choices: [
      { text: "Read the protocol", next: "protocol" },
      { text: "Check CCTV", next: "start_cctv" },
      { text: "Inspect the storage door", next: "start_storage" },
      {
        text: "Call Mr. Hale back",
        next: "start_call",
        effects: { flags: { trustedManager: true } }
      }
    ]
  },

  protocol: {
    id: "protocol",
    time: "00:00",
    title: "The Night Shift Protocol",
    media: {
      type: "image",
      src: "assets/images/protocol-sheet.webp",
      alt: "A laminated rules sheet with old fingerprints under the plastic.",
      fallback: "The protocol sheet is readable in the register light."
    },
    text: [
      "1. After 01:00, do not serve customers who do not have a shadow.",
      "2. If refrigerator #4 opens by itself, turn off the lights and close your eyes for 10 seconds.",
      "3. Do not answer the phone if the caller ID shows your own phone number.",
      "4. If a customer asks for the basement, say only: \"This store does not have a basement.\" Do not say anything else.",
      "5. If camera #3 shows someone who looks like you, do not watch the screen for more than 5 seconds.",
      "6. Do not open the storage room between 03:00 and 04:00, even if someone inside asks for help.",
      "7. The shift ends at 06:00. If the clock shows 06:00 but the sun has not risen, do not leave the store."
    ],
    choices: [
      { text: "Check CCTV", next: "start_cctv" },
      { text: "Inspect the storage door", next: "start_storage" },
      { text: "Look outside", next: "start_window", effects: { flags: { checkedWindow: true } } },
      { text: "Start the shift", next: "fridge_event" }
    ]
  },

  start_cctv: {
    id: "start_cctv",
    time: "00:00",
    title: "Camera Bank",
    media: {
      type: "image",
      src: "assets/images/cctv-bank.webp",
      alt: "Four CCTV feeds stacked on a small monitor.",
      fallback: "The CCTV screen rolls with gray static."
    },
    text: [
      "Camera #1 shows the pumps. Camera #2 shows the aisle with the cheap umbrellas.",
      "Camera #3 is labeled STORAGE, but the room is empty and lit from below.",
      "Camera #4 shows the register from behind you. For one second, the stool is occupied."
    ],
    choices: [
      { text: "Read the protocol", next: "protocol" },
      { text: "Inspect the storage door", next: "start_storage" },
      { text: "Look outside", next: "start_window", effects: { flags: { checkedWindow: true } } },
      { text: "Start the shift", next: "fridge_event" }
    ]
  },

  start_storage: {
    id: "start_storage",
    time: "00:00",
    title: "Storage Door",
    media: {
      type: "image",
      src: "assets/images/storage-door.webp",
      alt: "A gray storage door with a scratched keypad.",
      fallback: "The storage door sits shut beneath a keypad with no numbers."
    },
    text: [
      "The storage door has three locks and one keyhole, but Mr. Hale gave you no key.",
      "A smell like wet concrete leaks through the frame.",
      "Someone has scratched a line into the paint: LAST SHIFT."
    ],
    choices: [
      { text: "Read the protocol", next: "protocol" },
      { text: "Check CCTV", next: "start_cctv" },
      {
        text: "Call Mr. Hale",
        next: "start_call",
        effects: { flags: { trustedManager: true } }
      },
      { text: "Start the shift", next: "fridge_event" }
    ]
  },

  start_window: {
    id: "start_window",
    time: "00:00",
    title: "Highway Window",
    media: {
      type: "image",
      src: "assets/images/bus-stop.webp",
      alt: "The bus stop across the highway.",
      fallback: "Across the highway, the bus stop is a darker shape inside the dark."
    },
    text: [
      "There is no scheduled bus until morning.",
      "A woman stands at the stop anyway, facing the store.",
      "The door chime rings once behind you. No one has entered."
    ],
    choices: [
      { text: "Read the protocol", next: "protocol" },
      { text: "Check CCTV", next: "start_cctv" },
      { text: "Call Mr. Hale", next: "start_call", effects: { flags: { trustedManager: true } } },
      { text: "Start the shift", next: "fridge_event" }
    ]
  },

  start_call: {
    id: "start_call",
    time: "00:00",
    title: "Manager Line",
    media: {
      type: "image",
      src: "assets/images/manager-phone.webp",
      alt: "A corded phone beside the register.",
      fallback: "The manager line clicks alive before the first ring finishes."
    },
    text: [
      "Mr. Hale answers before the phone rings.",
      "\"Read every rule. Do not improve them. Do not improvise.\"",
      "His voice pauses, then repeats the first sentence exactly."
    ],
    choices: [
      { text: "Read the protocol", next: "protocol" },
      { text: "Check CCTV", next: "start_cctv" },
      { text: "Inspect the storage door", next: "start_storage" },
      { text: "Start the shift", next: "fridge_event" }
    ]
  },

  fridge_event: {
    id: "fridge_event",
    time: "00:30",
    title: "Refrigerator #4",
    media: {
      type: "image",
      src: "assets/images/fridge-four.webp",
      alt: "Refrigerator #4 standing open by itself.",
      fallback: "Refrigerator #4 opens with a sigh and fills the aisle with white light."
    },
    text: [
      "The hum of the drink coolers stops all at once.",
      "Refrigerator #4 opens by itself. Milk cartons tremble on the shelf.",
      "The protocol page slides an inch closer to the edge of the counter."
    ],
    choices: [
      {
        text: "Follow Rule 2",
        next: "fridge_followed",
        effects: {
          stats: { sanity: -4, attention: -1, evidence: 1 },
          flags: { foundBadge: true },
          inventoryAdd: ["badge with your name"]
        }
      },
      {
        text: "Close it manually",
        next: "fridge_manual",
        effects: { stats: { sanity: -8, attention: 1, rulesBroken: 1 } }
      },
      {
        text: "Inspect inside",
        next: "fridge_inside",
        effects: {
          stats: { sanity: -12, attention: 1, evidence: 1, rulesBroken: 1 },
          inventoryAdd: ["decades-old receipt"]
        }
      },
      {
        text: "Ignore it",
        next: "fridge_ignore",
        effects: { stats: { sanity: -10, attention: 2, rulesBroken: 1 } }
      }
    ]
  },

  fridge_followed: {
    id: "fridge_followed",
    time: "00:30",
    title: "Ten Seconds",
    media: {
      type: "image",
      src: "assets/images/fridge-dark.webp",
      alt: "The aisle in complete darkness.",
      fallback: "The lights go out. The store breathes around you."
    },
    text: [
      "You kill the lights and close your eyes.",
      "On seven, something walks past close enough to stir your sleeve.",
      "On ten, the fridge is closed. A metal badge lies on the floor. It has your name on it."
    ],
    choices: [{ text: "Return to the register", next: "boy_event" }]
  },

  fridge_manual: {
    id: "fridge_manual",
    time: "00:30",
    title: "Manual Override",
    media: {
      type: "image",
      src: "assets/images/fridge-handprint.webp",
      alt: "A handprint fogged on a cooler door.",
      fallback: "A handprint blooms inside the cooler glass where your hand touched outside."
    },
    text: [
      "The handle is warm.",
      "When you push the door shut, something pushes back once, gently, like a test.",
      "The cooler hum resumes one pitch too low."
    ],
    choices: [{ text: "Return to the register", next: "boy_event" }]
  },

  fridge_inside: {
    id: "fridge_inside",
    time: "00:30",
    title: "Inside the Cooler",
    media: {
      type: "image",
      src: "assets/images/fridge-receipt.webp",
      alt: "A receipt stuck to frost inside the fridge.",
      fallback: "A receipt is frozen to the back wall, dated tomorrow."
    },
    text: [
      "There is no back wall inside refrigerator #4.",
      "There is a narrow hall, tiled in the same old yellow as the store floor.",
      "A receipt peels free from the frost. It is dated tomorrow."
    ],
    choices: [{ text: "Step back", next: "boy_event" }]
  },

  fridge_ignore: {
    id: "fridge_ignore",
    time: "00:30",
    title: "Left Open",
    media: {
      type: "image",
      src: "assets/images/fridge-open.webp",
      alt: "Cold vapor spilling across the floor.",
      fallback: "Cold vapor crawls from aisle four to the register."
    },
    text: [
      "You keep your hands on the counter.",
      "The open fridge makes no sound now. Neither do the other coolers.",
      "When you look again, every carton faces you with its expiration date blacked out."
    ],
    choices: [{ text: "Wait at the register", next: "boy_event" }]
  },

  boy_event: {
    id: "boy_event",
    time: "01:17",
    title: "The Midnight Customer",
    media: {
      type: "image",
      src: "assets/images/shadowless-boy.webp",
      alt: "A wet child holding one carton of milk.",
      fallback: "A wet child stands at the counter with one carton of milk."
    },
    text: [
      "The door chime rings, late and soft.",
      "A boy places one carton of milk on the counter. His hair drips onto the tile.",
      "There is no rain tonight. There is no shadow under him.",
      "\"You did not serve me last time.\""
    ],
    choices: [
      {
        text: "Refuse service",
        next: "boy_refuse",
        effects: { stats: { sanity: -5 } }
      },
      {
        text: "Sell him the milk",
        next: "boy_sell",
        effects: {
          stats: { sanity: -6, attention: 1, evidence: 1, rulesBroken: 1 },
          flags: { servedBoy: true },
          inventoryAdd: ["old coin"]
        }
      },
      {
        text: "Ask about his parents",
        next: "boy_parents",
        effects: { stats: { sanity: -8, attention: 1 } }
      },
      {
        text: "Check CCTV",
        next: "boy_cctv",
        effects: {
          stats: { sanity: -10, attention: 1, evidence: 1 },
          inventoryAdd: ["blank CCTV still"]
        }
      }
    ]
  },

  boy_refuse: {
    id: "boy_refuse",
    time: "01:17",
    title: "No Sale",
    media: {
      type: "image",
      src: "assets/images/counter-milk.webp",
      alt: "A milk carton left on the counter.",
      fallback: "The Customer leaves the milk. The carton is heavier than it should be."
    },
    text: [
      "You tell him the store is closed for that item.",
      "He nods as if you have said the expected line.",
      "At the door, he turns. \"Then you will need the other key again.\""
    ],
    choices: [{ text: "Let the chime fade", next: "phone_event" }]
  },

  boy_sell: {
    id: "boy_sell",
    time: "01:17",
    title: "Old Coin",
    media: {
      type: "image",
      src: "assets/images/old-coin.webp",
      alt: "A dark coin on the counter.",
      fallback: "He pays with a coin too old for the register."
    },
    text: [
      "The register opens before you press total.",
      "The Customer leaves a coin dark with age and milk water.",
      "His reflection remains in the glass door after he is gone."
    ],
    choices: [{ text: "Pocket the coin", next: "phone_event" }]
  },

  boy_parents: {
    id: "boy_parents",
    time: "01:17",
    title: "Pointing",
    media: {
      type: "image",
      src: "assets/images/boy-points.webp",
      alt: "A child pointing toward the storage room.",
      fallback: "The Customer points toward the storage door without looking at it."
    },
    text: [
      "\"They are where you left them,\" he says.",
      "He points at the storage room.",
      "Behind that door, something knocks twice from very far below."
    ],
    choices: [{ text: "Stay at the counter", next: "phone_event" }]
  },

  boy_cctv: {
    id: "boy_cctv",
    time: "01:17",
    title: "Empty Feed",
    media: {
      type: "image",
      src: "assets/images/empty-cctv.webp",
      alt: "A CCTV feed showing an empty counter.",
      fallback: "The CCTV feed shows the counter empty. It does not show The Customer. It does not show you."
    },
    text: [
      "Camera #4 shows the counter empty.",
      "No boy. No milk. No cashier.",
      "The live timestamp skips from 01:17 to 01:19 and back again."
    ],
    choices: [{ text: "Return to the counter", next: "phone_event" }]
  },

  phone_event: {
    id: "phone_event",
    time: "02:03",
    title: "The Phone Call",
    media: {
      type: "image",
      src: "assets/images/own-number.webp",
      alt: "The phone display showing your own number.",
      fallback: "The phone rings. Caller ID shows your own number."
    },
    text: [
      "At 02:03, the manager line rings.",
      "The caller ID shows your own phone number.",
      "The cord twitches against the counter like it has a pulse."
    ],
    choices: [
      { text: "Ignore it", next: "phone_ignore" },
      {
        text: "Answer",
        next: "phone_answer",
        effects: {
          stats: { sanity: -12, attention: 2, rulesBroken: 1 },
          flags: { answeredOwnCall: true }
        }
      },
      {
        text: "Disconnect the phone",
        next: "phone_disconnect",
        effects: { stats: { sanity: -6, attention: 1 } }
      },
      {
        text: "Record the message",
        next: "phone_record",
        effects: {
          stats: { sanity: -5, attention: 1, evidence: 1 },
          inventoryAdd: ["former employee recording"]
        }
      }
    ]
  },

  phone_ignore: {
    id: "phone_ignore",
    time: "02:03",
    title: "Let It Ring",
    media: {
      type: "image",
      src: "assets/images/ringing-phone.webp",
      alt: "A ringing phone under fluorescent light.",
      fallback: "The phone rings for forty-six seconds, then stops mid-tone."
    },
    text: [
      "You do not touch the receiver.",
      "The ringing stops mid-tone.",
      "For a moment, you hear your own breathing from inside the handset."
    ],
    choices: [{ text: "Wait for the next customer", next: "basement_question" }]
  },

  phone_answer: {
    id: "phone_answer",
    time: "02:03",
    title: "Your Voice",
    media: {
      type: "image",
      src: "assets/images/phone-static.webp",
      alt: "The phone receiver pressed to a dark ear.",
      fallback: "Static opens into your own voice."
    },
    text: [
      "You lift the receiver.",
      "Your voice whispers from the other end: \"Do not trust Rule 6. It was written to keep me downstairs.\"",
      "Then Mr. Hale's voice, far behind it: \"Procedural deviation recorded.\""
    ],
    choices: [{ text: "Hang up", next: "basement_question" }]
  },

  phone_disconnect: {
    id: "phone_disconnect",
    time: "02:03",
    title: "No Dial Tone",
    media: {
      type: "image",
      src: "assets/images/cut-cord.webp",
      alt: "A phone cord lying loose.",
      fallback: "The cord comes free. The phone keeps ringing."
    },
    text: [
      "You pull the cord from the wall.",
      "The phone keeps ringing.",
      "The caller ID still shows your number, but one digit is reversed."
    ],
    choices: [{ text: "Leave it unplugged", next: "basement_question" }]
  },

  phone_record: {
    id: "phone_record",
    time: "02:03",
    title: "Captured Message",
    media: {
      type: "image",
      src: "assets/images/tape-recorder.webp",
      alt: "A small tape recorder beside the phone.",
      fallback: "The recorder catches a voice under the ringing."
    },
    text: [
      "You do not answer. You hold the recorder close.",
      "Under the ring, a voice says, \"The stairs are not behind the door until you choose them.\"",
      "The tape clicks off by itself."
    ],
    choices: [{ text: "Keep the recording", next: "basement_question" }]
  },

  basement_question: {
    id: "basement_question",
    time: "02:41",
    title: "The Basement Question",
    media: {
      type: "image",
      src: "assets/images/raincoat-man.webp",
      alt: "A man in a raincoat at the counter.",
      fallback: "A man in a raincoat enters. The floor under him stays dry."
    },
    text: [
      "The man in the raincoat smells like cold asphalt.",
      "He places no item on the counter.",
      "\"Where is the basement?\""
    ],
    choices: [
      {
        text: "\"This store does not have a basement.\"",
        next: "basement_exact",
        effects: { flags: { exactBasementLine: true } }
      },
      {
        text: "Say you do not know",
        next: "basement_dontknow",
        effects: { stats: { sanity: -8, attention: 1, rulesBroken: 1 } }
      },
      {
        text: "Point to storage",
        next: "basement_point",
        effects: {
          stats: { sanity: -10, attention: 2, rulesBroken: 1 },
          flags: { earlyKnocking: true }
        }
      },
      {
        text: "Ask why he wants it",
        next: "basement_ask",
        effects: {
          stats: { sanity: -9, attention: 2, evidence: 1, rulesBroken: 1 },
          inventoryAdd: ["raincoat testimony"]
        }
      }
    ]
  },

  basement_exact: {
    id: "basement_exact",
    time: "02:41",
    title: "Exact Words",
    media: {
      type: "image",
      src: "assets/images/raincoat-exit.webp",
      alt: "The man in the raincoat leaving.",
      fallback: "The man leaves as if pulled backward by a hook."
    },
    text: [
      "You say the exact line.",
      "The man smiles without showing teeth.",
      "\"Good. He still has you reading.\""
    ],
    choices: [{ text: "Watch him leave", next: "storage_voice" }]
  },

  basement_dontknow: {
    id: "basement_dontknow",
    time: "02:41",
    title: "Wrong Answer",
    media: {
      type: "image",
      src: "assets/images/raincoat-close.webp",
      alt: "The raincoat man leaning close.",
      fallback: "He leans close enough for you to hear water moving in his sleeves."
    },
    text: [
      "\"You knew last time,\" he says.",
      "The clock skips one minute, then apologizes with a second hand twitch.",
      "He leaves without opening the door."
    ],
    choices: [{ text: "Check the clock", next: "storage_voice" }]
  },

  basement_point: {
    id: "basement_point",
    time: "02:41",
    title: "Toward Storage",
    media: {
      type: "image",
      src: "assets/images/storage-shadow.webp",
      alt: "A long shadow under the storage door.",
      fallback: "You point to storage. Something inside knocks once in answer."
    },
    text: [
      "You point at the storage door.",
      "The man bows to you, slow and formal.",
      "The first knock comes before he reaches the exit."
    ],
    choices: [{ text: "Keep the counter between you and the door", next: "storage_voice" }]
  },

  basement_ask: {
    id: "basement_ask",
    time: "02:41",
    title: "Why",
    media: {
      type: "image",
      src: "assets/images/raincoat-mouth.webp",
      alt: "The raincoat man's mouth hidden by shadow.",
      fallback: "He answers with his eyes on the CCTV monitor."
    },
    text: [
      "\"Because the first employee is still counting inventory,\" he says.",
      "\"Because Hale locked the morning under the building.\"",
      "He writes a number on the receipt pad: 1987."
    ],
    choices: [{ text: "Take the receipt slip", next: "storage_voice" }]
  },

  storage_voice: {
    id: "storage_voice",
    time: "03:12",
    title: "Voice in Storage",
    media: {
      type: "image",
      src: "assets/images/storage-0312.webp",
      alt: "The storage door vibrating in its frame.",
      fallback: "At 03:12, the storage door begins to knock."
    },
    text: (state) => [
      state.flags.earlyKnocking
        ? "The knocking has been waiting for you."
        : "The first knock arrives at 03:12 exactly.",
      "The voice inside sounds like you after a long illness.",
      "\"Open the door. I worked this shift before you.\""
    ],
    choices: [
      {
        text: "Keep it closed",
        next: "storage_keep",
        effects: { stats: { attention: -1 } }
      },
      {
        text: "Open the door",
        next: "storage_open",
        effects: {
          stats: { sanity: -10, attention: 2, evidence: 2, rulesBroken: 1 },
          flags: { openedStorage: true, foundBasementMap: true },
          inventoryAdd: ["shift journal", "basement map"]
        }
      },
      {
        text: "Call Mr. Hale",
        next: "storage_call_hale",
        effects: {
          stats: { sanity: -5, attention: 1 },
          flags: { trustedManager: true }
        }
      },
      {
        text: "Speak through the door",
        next: "storage_speak",
        effects: {
          stats: { sanity: -8, attention: 1, evidence: 1 },
          inventoryAdd: ["door confession"]
        }
      }
    ]
  },

  storage_keep: {
    id: "storage_keep",
    time: "03:12",
    title: "Closed Door",
    media: {
      type: "image",
      src: "assets/images/closed-storage.webp",
      alt: "The storage door still closed.",
      fallback: "You keep the door closed. The voice thanks you in Mr. Hale's tone."
    },
    text: [
      "You keep the door closed.",
      "The voice stops pleading and begins reciting the protocol from the end to the beginning.",
      "By Rule 2, it is whispering."
    ],
    choices: [{ text: "Return to CCTV", next: "other_you" }]
  },

  storage_open: {
    id: "storage_open",
    time: "03:12",
    title: "Behind Storage",
    media: {
      type: "image",
      src: "assets/images/storage-open.webp",
      alt: "An old uniform and stairs beyond the storage room.",
      fallback: "Inside: an old uniform, a shift journal, and stairs where shelves should be."
    },
    text: [
      "The lock turns before you touch it.",
      "Inside, an old uniform hangs from a pipe. The name badge has been scraped blank.",
      "A journal lies open beside a hand-drawn basement map. The stairs descend past the floor."
    ],
    choices: [{ text: "Take the journal and map", next: "other_you" }]
  },

  storage_call_hale: {
    id: "storage_call_hale",
    time: "03:12",
    title: "Hale Reacts",
    media: {
      type: "image",
      src: "assets/images/hale-call.webp",
      alt: "The phone receiver shaking on the counter.",
      fallback: "Mr. Hale answers with a breath sharp enough to cut the line."
    },
    text: [
      "\"Do not open it,\" Hale says.",
      "For the first time, he sounds afraid.",
      "Then he corrects himself: \"Follow the protocol. The protocol is the only reason you are still here.\""
    ],
    choices: [{ text: "Hang up slowly", next: "other_you" }]
  },

  storage_speak: {
    id: "storage_speak",
    time: "03:12",
    title: "Through the Door",
    media: {
      type: "image",
      src: "assets/images/door-whisper.webp",
      alt: "A mouth-shaped fog mark on the storage door.",
      fallback: "Your breath fogs the door from the wrong side."
    },
    text: [
      "You ask who is inside.",
      "\"You are,\" the voice says.",
      "\"When the camera shows me, do not look. Write.\""
    ],
    choices: [{ text: "Step away from the door", next: "other_you" }]
  },

  other_you: {
    id: "other_you",
    time: "04:26",
    title: "The Other You",
    media: {
      type: "image",
      src: "assets/images/camera-three.webp",
      alt: "Camera #3 showing a duplicate cashier in storage.",
      fallback: "Camera #3 shows someone who looks like you standing inside storage."
    },
    text: [
      "The CCTV monitor clicks to Camera #3 by itself.",
      "Someone wearing your posture stands inside storage.",
      "They raise one hand. On the screen, your hand raises half a second late."
    ],
    choices: [
      {
        text: "Turn off the monitor",
        next: "duplicate_off",
        effects: {
          stats: { sanity: -4, attention: -1 },
          flags: { sawDuplicate: true }
        }
      },
      {
        text: "Watch for more than 5 seconds",
        next: "duplicate_watch",
        effects: {
          stats: { sanity: -35, attention: 3, rulesBroken: 1 },
          flags: { sawDuplicate: true }
        }
      },
      {
        text: "Communicate with written notes",
        next: "duplicate_note",
        effects: {
          stats: { sanity: -8, attention: 1, evidence: 1 },
          flags: { sawDuplicate: true },
          inventoryAdd: ["CCTV photo"]
        }
      },
      {
        text: "Destroy the camera",
        next: "duplicate_destroy",
        effects: {
          stats: { sanity: -6, attention: -2 },
          flags: { sawDuplicate: true, destroyedCamera: true }
        }
      }
    ]
  },

  duplicate_off: {
    id: "duplicate_off",
    time: "04:26",
    title: "Black Screen",
    media: {
      type: "image",
      src: "assets/images/monitor-off.webp",
      alt: "A black CCTV monitor reflecting the register.",
      fallback: "The monitor goes black. The reflection stays a second too long."
    },
    text: [
      "You turn the monitor off.",
      "In the dark glass, your reflection mouths three words.",
      "You cannot tell if they are HELP ME or HELP HIM."
    ],
    choices: [{ text: "Wait for the manager call", next: "manager_call" }]
  },

  duplicate_watch: {
    id: "duplicate_watch",
    time: "04:26",
    title: "More Than Five",
    media: {
      type: "image",
      src: "assets/images/duplicate-close.webp",
      alt: "A duplicate face close to the CCTV camera.",
      fallback: "The duplicate crosses the screen in four frames and stands behind you in the fifth."
    },
    text: [
      "At six seconds, the duplicate looks directly into the camera.",
      "At seven, the screen shows the back of your head.",
      "At eight, something behind you whispers the protocol in your ear."
    ],
    choices: [{ text: "Do not turn around", next: "manager_call" }]
  },

  duplicate_note: {
    id: "duplicate_note",
    time: "04:26",
    title: "Written Notes",
    media: {
      type: "image",
      src: "assets/images/duplicate-note.webp",
      alt: "A note held to a CCTV camera.",
      fallback: "You write DO YOU KNOW THE WAY OUT. The duplicate holds up: BREAK ONE RULE. ONLY ONE THAT MATTERS."
    },
    text: [
      "You write questions on receipt paper and hold them to the camera.",
      "The duplicate answers with the same receipt pad inside storage.",
      "Their last note reads: SHUT DOWN CAMERA THREE LAST."
    ],
    choices: [{ text: "Keep the photo", next: "manager_call" }]
  },

  duplicate_destroy: {
    id: "duplicate_destroy",
    time: "04:26",
    title: "No Camera Three",
    media: {
      type: "image",
      src: "assets/images/camera-broken.webp",
      alt: "A cracked CCTV monitor.",
      fallback: "You smash Camera #3. The room sound lowers, as if the store has lost an eye."
    },
    text: [
      "The monitor cracks inward.",
      "The duplicate disappears with the feed.",
      "From the storage door, your own voice says, \"Now he can lie without witness.\""
    ],
    choices: [{ text: "Watch the blank feed", next: "manager_call" }]
  },

  manager_call: {
    id: "manager_call",
    time: "05:00",
    title: "Manager Call",
    media: {
      type: "image",
      src: "assets/images/manager-call-0500.webp",
      alt: "The phone ringing at 05:00.",
      fallback: "At 05:00, Mr. Hale calls. The ring sounds rehearsed."
    },
    text: (state) => [
      "Mr. Hale asks whether the protocol has been followed.",
      state.flags.answeredOwnCall
        ? "Under his voice, you hear your own caller breathing on the line."
        : "The line is clean except for the tiny scrape of a pen.",
      state.evidence >= 4
        ? "He says this before hello, as if your evidence has made him late."
        : "His voice is calm and formal, the same sentence polished by repetition.",
      "\"Answer clearly. The morning depends on accurate reporting.\""
    ],
    choices: [
      {
        text: "Tell the truth",
        next: "manager_truth",
        effects: { flags: { trustedManager: true } }
      },
      {
        text: "Lie",
        next: "manager_lie",
        effects: { stats: { sanity: -4, attention: 1 } }
      },
      {
        text: "Ask about previous employees",
        next: "manager_ask",
        effects: {
          stats: { sanity: -5, attention: 1, evidence: 1 },
          inventoryAdd: ["employee roster"]
        }
      },
      {
        text: "Accuse him of maintaining the loop",
        next: "manager_accuse",
        effects: {
          stats: { sanity: -7, attention: 2, evidence: 1 },
          inventoryAdd: ["Hale contradiction"]
        }
      }
    ]
  },

  manager_truth: {
    id: "manager_truth",
    time: "05:00",
    title: "Accurate Report",
    media: {
      type: "image",
      src: "assets/images/hale-listens.webp",
      alt: "The phone line open beside the protocol sheet.",
      fallback: "Mr. Hale listens without breathing."
    },
    text: (state) => [
      "You tell him what you did.",
      state.rulesBroken === 0
        ? "\"Excellent,\" he says. \"A clean report keeps the store stable.\""
        : "\"Noted,\" he says, and something behind the phone writes faster than a hand can move.",
      "\"Wait for me at 06:00.\""
    ],
    choices: [{ text: "End the report", next: "final_event" }]
  },

  manager_lie: {
    id: "manager_lie",
    time: "05:00",
    title: "False Report",
    media: {
      type: "image",
      src: "assets/images/register-slip.webp",
      alt: "A receipt printing by itself.",
      fallback: "The register prints your lie before you finish saying it."
    },
    text: [
      "You say the protocol has been followed.",
      "The receipt printer wakes and prints NO in a row until the paper curls onto the floor.",
      "Hale says, \"Thank you for confirming.\""
    ],
    choices: [{ text: "Tear off the receipt", next: "final_event" }]
  },

  manager_ask: {
    id: "manager_ask",
    time: "05:00",
    title: "Previous Employees",
    media: {
      type: "image",
      src: "assets/images/old-roster.webp",
      alt: "An employee roster printed on old thermal paper.",
      fallback: "The fax machine prints a roster with your name written once per decade."
    },
    text: [
      "You ask how many people worked this shift before you.",
      "\"One,\" Hale says.",
      "The fax machine behind the counter prints a roster six pages long."
    ],
    choices: [{ text: "Fold the roster", next: "final_event" }]
  },

  manager_accuse: {
    id: "manager_accuse",
    time: "05:00",
    title: "The Accusation",
    media: {
      type: "image",
      src: "assets/images/hale-static.webp",
      alt: "Static forming the outline of a man's face.",
      fallback: "The line fills with static. Mr. Hale speaks from every speaker in the store."
    },
    text: (state) => [
      "You accuse him of keeping the shift in a loop.",
      state.evidence >= 4
        ? "\"A loop is a mercy,\" Hale says. \"You should have stayed uncurious.\""
        : "\"Curiosity is not evidence,\" Hale says.",
      "Every cooler door opens one inch."
    ],
    choices: [{ text: "Let the line die", next: "final_event" }]
  },

  final_event: {
    id: "final_event",
    time: "05:45",
    title: "Final Event",
    media: {
      type: "image",
      src: "assets/images/final-blackout.webp",
      alt: "The store during the 05:45 blackout.",
      fallback: "At 05:45, the lights fail and the front door unlocks."
    },
    text: (state) => [
      "The lights fail.",
      "The front door unlocks with a clean metallic click.",
      "The clock races toward 06:00, then slows when you look directly at it.",
      state.flags.openedStorage
        ? "Beyond storage, the stairs breathe colder air into the aisle."
        : "The storage door stays shut, but the space under it glows like a screen."
    ],
    choices: [
      {
        text: "Leave as soon as the clock shows 06:00",
        next: "ending_check",
        effects: {
          stats: { sanity: -8, rulesBroken: 1 },
          flags: { leftBeforeSunrise: true }
        }
      },
      {
        text: "Wait for sunrise behind the counter",
        next: "ending_check",
        effects: {
          flags: { waitedForSunrise: true, waitedForHale: true, trustedManager: true }
        }
      },
      {
        text: "Enter the basement",
        next: "final_basement",
        condition: (state) => state.flags.openedStorage,
        effects: {
          stats: { sanity: -10, attention: 1, evidence: 1 },
          flags: { enteredBasement: true, foundBasementMap: true },
          inventoryAdd: ["monitor room photo"]
        }
      },
      {
        text: "Use evidence to shut down CCTV",
        next: "final_shutdown",
        condition: (state) => state.evidence >= 4,
        effects: {
          stats: { sanity: -5, attention: 1 },
          flags: { usedEvidence: true }
        }
      }
    ]
  },

  final_basement: {
    id: "final_basement",
    time: "05:45",
    title: "Below the Store",
    media: {
      type: "image",
      src: "assets/images/basement-stairs.webp",
      alt: "Concrete stairs below the storage room.",
      fallback: "The stairs under storage descend into monitor light."
    },
    text: [
      "The basement is not under the store. It is under every version of it.",
      "Monitors line the wall, each showing a different 05:45.",
      "On every screen, Mr. Hale stands behind a different cashier."
    ],
    choices: [
      {
        text: "Step into the monitor room",
        next: "ending_check",
        effects: { flags: { waitedForSunrise: true } }
      }
    ]
  },

  final_shutdown: {
    id: "final_shutdown",
    time: "05:45",
    title: "Camera Shutdown",
    media: {
      type: "image",
      src: "assets/images/cctv-breakers.webp",
      alt: "A breaker panel labeled with camera numbers.",
      fallback: "Behind the CCTV rack, four breakers wait in a row."
    },
    text: (state) => [
      "You spread the evidence beneath the CCTV rack: coin, badge, journal, recording, photo.",
      state.flags.sawDuplicate
        ? "The duplicate's last note tells you the order."
        : "Without the duplicate's note, the order is guesswork.",
      "Camera #3 hums like a throat trying not to speak."
    ],
    choices: [
      {
        text: "Pull the camera breakers in order",
        next: "ending_check",
        effects: {
          flags: {
            disabledCCTV: true,
            followedDuplicate: true,
            waitedForSunrise: true
          }
        }
      },
      {
        text: "Confront Hale with the evidence",
        next: "ending_check",
        effects: {
          stats: { attention: 1 },
          flags: { waitedForSunrise: true, usedEvidence: true }
        }
      }
    ]
  },

  ending_check: {
    id: "ending_check",
    time: "06:00",
    title: "06:00",
    media: {
      type: "image",
      src: "assets/images/six-am.webp",
      alt: "The store clock at 06:00.",
      fallback: "The clock reaches 06:00. The sky outside remains black."
    },
    text: [
      "The minute hand lands on 06:00.",
      "For one second, every fluorescent tube shows a sunrise caught inside the glass."
    ],
    resolve: resolveEnding
  },

  ending_perfect: {
    id: "ending_perfect",
    time: "06:00",
    title: "Ending 1: The Perfect Employee",
    isEnding: true,
    media: {
      type: "image",
      src: "assets/images/ending-perfect.webp",
      alt: "Mr. Hale at the front door.",
      fallback: "Mr. Hale arrives exactly when the clock stops pretending."
    },
    text: [
      "Mr. Hale arrives without headlights.",
      "\"Perfect work,\" he says, taking the protocol from your hands.",
      "The screen fades. The clock resets to 00:00.",
      "\"Your next shift begins now.\""
    ],
    choices: [{ text: "Restart shift", next: "start", action: "restart" }]
  },

  ending_replacement: {
    id: "ending_replacement",
    time: "06:00",
    title: "Ending 2: Replacement",
    isEnding: true,
    media: {
      type: "image",
      src: "assets/images/ending-replacement.webp",
      alt: "The bus stop outside the store.",
      fallback: "A new employee enters. You are outside at the bus stop."
    },
    text: [
      "The front door opens for someone wearing a clean uniform.",
      "You try to warn them, but your mouth fills with rainwater.",
      "When you blink, you are at the bus stop across the highway.",
      "The store lights look warm from here."
    ],
    choices: [{ text: "Restart shift", next: "start", action: "restart" }]
  },

  ending_false_escape: {
    id: "ending_false_escape",
    time: "06:00",
    title: "Ending 3: False Escape",
    isEnding: true,
    media: {
      type: "image",
      src: "assets/images/ending-road.webp",
      alt: "The highway leading back to the store.",
      fallback: "The road stretches away, then bends back toward the store."
    },
    text: [
      "You leave when the clock gives you permission.",
      "The air outside is colder than the freezer aisle.",
      "A receipt sticks to your shoe. It shows the same date as before the shift.",
      "Ahead, the highway curves back to the store sign."
    ],
    choices: [{ text: "Restart shift", next: "start", action: "restart" }]
  },

  ending_beneath: {
    id: "ending_beneath",
    time: "06:00",
    title: "Ending 4: Beneath the Store",
    isEnding: true,
    media: {
      type: "image",
      src: "assets/images/ending-basement.webp",
      alt: "A basement monitor room.",
      fallback: "The basement monitors show past versions of your shift."
    },
    text: [
      "The basement monitor room keeps running after 06:00.",
      "You see past shifts, future shifts, Mr. Hale on every screen.",
      "You understand the store now.",
      "Understanding does not open the door."
    ],
    choices: [{ text: "Restart shift", next: "start", action: "restart" }]
  },

  ending_break_protocol: {
    id: "ending_break_protocol",
    time: "06:00",
    title: "Ending 5: Break the Protocol",
    isEnding: true,
    media: {
      type: "image",
      src: "assets/images/ending-sunrise.webp",
      alt: "The store disappearing at sunrise.",
      fallback: "At sunrise, the store becomes a reflection with no glass."
    },
    text: [
      "The last CCTV feed dies.",
      "Every duplicate in every monitor looks up, then vanishes.",
      "Sunrise reaches the tile. The store thins until only the highway remains.",
      "In another town, a job ad appears: NIGHT SHIFT EMPLOYEE WANTED. No experience required."
    ],
    choices: [{ text: "Restart shift", next: "start", action: "restart" }]
  }
};

function resolveEnding(state) {
  const hasOldCoin = state.inventory.includes("old coin");
  const enoughEvidence = state.evidence >= 5;
  const controlledViolations = state.rulesBroken <= 3;

  if (
    state.flags.servedBoy &&
    hasOldCoin &&
    enoughEvidence &&
    state.flags.openedStorage &&
    state.flags.disabledCCTV &&
    !state.flags.leftBeforeSunrise &&
    controlledViolations &&
    state.sanity >= 35
  ) {
    return "ending_break_protocol";
  }

  if (state.attention >= 9 && state.sanity <= 35 && state.rulesBroken >= 3) {
    return "ending_replacement";
  }

  if (state.flags.leftBeforeSunrise) {
    return "ending_false_escape";
  }

  if (
    state.flags.openedStorage &&
    (state.flags.enteredBasement || state.flags.foundBasementMap) &&
    state.evidence >= 3
  ) {
    return "ending_beneath";
  }

  if (
    state.rulesBroken <= 1 &&
    state.evidence <= 1 &&
    !state.flags.openedStorage &&
    state.flags.trustedManager &&
    (state.flags.waitedForHale || state.flags.waitedForSunrise)
  ) {
    return "ending_perfect";
  }

  if (state.evidence >= 3 || state.flags.openedStorage) {
    return "ending_beneath";
  }

  return "ending_perfect";
}

window.SCENES = SCENES;
window.resolveEnding = resolveEnding;
