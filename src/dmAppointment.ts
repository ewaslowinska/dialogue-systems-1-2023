import { MachineConfig, send, Action, assign } from "xstate";

function say(text: string): Action<SDSContext, SDSEvent> {
  return send((_context: SDSContext) => ({ type: "SPEAK", value: text }));
}

interface Grammar {
  [index: string]: {
    intent: string;
    entities: {
      [index: string]: string;
    };
  };
}

const grammar: Grammar = {
  "create a meeting": {
    intent: "None",
    entities: { occassion: "meeting" },
  },
  "ask about someone": {
    intent: "None",
    entities: { answer: "ask about someone" },
  },
  lecture: {
    intent: "None",
    entities: { type: "Dialogue systems lecture" },
  },
  lunch: {
    intent: "None",
    entities: { type: "Lunch at the canteen" },
  },
  tutoring: {
    intent: "None",
    entities: { type: "Tutoring" },
  },
  workshop: {
    intent: "None",
    entities: { type: "Workshop" },
  },
  birthday: {
    intent: "None",
    entities: { type: "Birthday" },
  },
  party: {
    intent: "None",
    entities: { type: "Party" },
  },
  exhibition: {
    intent: "None",
    entities: { type: "Exhibition at the museum" },
  },
  match: {
    intent: "None",
    entities: { type: "A football match" },
  },
  festival: {
    intent: "None",
    entities: { type: "Festival" },
  },
  "on monday": {
    intent: "None",
    entities: { dayInfo: "Monday" },
  },
  "on tuesday": {
    intent: "None",
    entities: { dayInfo: "Tuesday" },
  },
  "on wednesday": {
    intent: "None",
    entities: { dayInfo: "Wednesday" },
  },
  "on thursday": {
    intent: "None",
    entities: { dayInfo: "Thursday" },
  },
  "on friday": {
    intent: "None",
    entities: { dayInfo: "Friday" },
  },
  "on saturday": {
    intent: "None",
    entities: { dayInfo: "Saturday" },
  },
  "on sunday": {
    intent: "None",
    entities: { dayInfo: "Sunday" },
  },
  "yes": {
	  intent: "None",
	  entities: { confirmation: "yes" },
  },
  "no": {
	  intent: "None",
	  entities: { denial: "no" },
  },
  "1": {
    intent: "None",
    entities: { timeInfo: "1" },
  },
  "2": {
    intent: "None",
    entities: { timeInfo: "2" },
  },
  "3": {
    intent: "None",
    entities: { timeInfo: "3" },
  },
  "4": {
    intent: "None",
    entities: { timeInfo: "4" },
  },
  "5": {
    intent: "None",
    entities: { timeInfo: "5" },
  },
  "6": {
    intent: "None",
    entities: { timeInfo: "6" },
  },
  "7": {
    intent: "None",
    entities: { timeInfo: "7" },
  },
  "8": {
    intent: "None",
    entities: { timeInfo: "8" },
  },
  "9": {
    intent: "None",
    entities: { timeInfo: "9" },
  },
  "10": {
    intent: "None",
    entities: { timeInfo: "10" },
  },
  "11": {
    intent: "None",
    entities: { timeInfo: "11" },
  },
  "12": {
    intent: "None",
    entities: { timeInfo: "12" },
  },
};

const getEntity = (context: SDSContext, entity: string) => {
  // lowercase the utterance and remove tailing "."
  let u = context.recResult[0].utterance.toLowerCase().replace(/.$/g, "");
  if (u in grammar) {
    if (entity in grammar[u].entities) {
      return grammar[u].entities[entity];
    }
  }
  return false;
};

export const dmMachine: MachineConfig<SDSContext, any, SDSEvent> = {
  initial: "idle",
  states: {
    idle: {
      on: {
        CLICK: "init",
      },
    },
    init: {
      on: {
        TTS_READY: "greeting",
        CLICK: "greeting",
      },
    },
   greeting: {
      initial: "prompt",
      on: {
        RECOGNISED: [
          {
            target: "meet",
            cond: (context) => !!getEntity(context, "occassion"),
            actions: assign({
              occassion: (context) => getEntity(context, "occassion"),
            }),
          },
          {
			  target: "asking",
			  cond: (context) => !!getEntity(context, "answer"),
            actions: assign({
              answer: (context) => getEntity(context, "answer"),
            }),
          },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".prompt",
      },
      states: {
        prompt: {
          entry: say("Hi! What would you like to do? Would you like to create a meeting or ask about someone?"),
          on: { ENDSPEECH: "ask" },
        },
        ask: {
          entry: send("LISTEN"),
        },
        nomatch: {
          entry: say(
            "Sorry, I don't know what it is. Tell me something I know."
          ),
          on: { ENDSPEECH: "ask" },
        },
      },
    },
    meet: {
      entry: say("Okay"),
      on: { ENDSPEECH: "welcome" },
      },
    asking: {
      entry: send((context) => ({
        type: "SPEAK",
        value: `OK`,
      })),
      on: { ENDSPEECH: "WhoIsX" },
      },
    WhoIsX: {
      initial: "prompt",
      on: {
        RECOGNISED: [
          { target: ".info",
            actions: assign({person:  
              context => {return context.recResult[0].utterance}
            })
              
            },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".prompt",
      },
      states: {
        info: {
          invoke: {
            id: 'getInfo',
            src: (context, event) => kbRequest(context.person),
            onDone: [{
              target: 'success',
              cond: (context, event) => event.data.Abstract !== "",
              actions: assign({ info: (context, event) => event.data })
            },
            {
              target: 'failure',
            },
          ],
            onError: {
              target: 'failure',
            }
          }
        },
        success: {
          entry: send((context) => ({
            type: "SPEAK",
            value: `Here is what I found. ${context.info.Abstract}`
          })),
          on: {ENDSPEECH: "#celebrityQuestion"}
        },
        failure: {
          entry: send((context) => ({
            type: "SPEAK",
            value: `Sorry, couln't find anything about them. Try again`
          })),
          on: {ENDSPEECH: "prompt"}
        },
        prompt: {
          entry: say("Who would you like to know about?"),
          on: { ENDSPEECH: "ask" },
        },
        ask: {
          entry: send("LISTEN"),
        },
        nomatch: {
          entry: say(
            "Sorry, could you repeat?"
          ),
          on: { ENDSPEECH: "ask" },
        },
      },
    },
    celebrityQuestion: {
		id: "celebrityQuestion",
    initial: "prompt",
      on: {
        RECOGNISED: [
          {
            target: "confirmYes",
            cond: (context) => !!getEntity(context, "confirmation"),
            actions: assign({
              confirmation: (context) => getEntity(context, "confirmation"),
            }),
          },
           {
            target: "denyNo",
            cond: (context) => !!getEntity(context, "denial"),
            actions: assign({
              denial: (context) => getEntity(context, "denial"),
            }),
          },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".prompt",
      },
      states: {
        prompt: {
          entry: say("Would you like to meet them?"),
          on: { ENDSPEECH: "ask" },
        },
        ask: {
          entry: send("LISTEN"),
        },
        nomatch: {
          entry: say(
            "Sorry, I don't know what it is. Tell me something I know."
          ),
          on: { ENDSPEECH: "ask" },
        },
      },
    },
    confirmYes: {
      entry: send((context) => ({
        type: "SPEAK",
        value: `Ok`,
      })),
      on: { ENDSPEECH: "whatday" },
  },
  denyNo: {
  entry: send((context) => ({
        type: "SPEAK",
        value: `OK`,
      })),
      on: { ENDSPEECH: "greeting" },
  },
 welcome: {
      initial: "prompt",
      on: {
        RECOGNISED: [
          {
            target: "info",
            cond: (context) => !!getEntity(context, "type"),
            actions: assign({
              type: (context) => getEntity(context, "type"),
            }),
          },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".prompt",
      },
      states: {
        prompt: {
          entry: say("Let's create a meeting. What is it about?"),
          on: { ENDSPEECH: "ask" },
        },
        ask: {
          entry: send("LISTEN"),
        },
        nomatch: {
          entry: say(
            "Sorry, I don't know what it is. Tell me something I know."
          ),
          on: { ENDSPEECH: "ask" },
        },
      },
    },
    info: {
      entry: send((context) => ({
        type: "SPEAK",
        value: `OK, ${context.type}`,
      })),
      on: { ENDSPEECH: "whatday" },
    },
    whatday: {
      initial: "prompt",
      on: {
        RECOGNISED: [
          {
            target: "day",
            cond: (context) => !!getEntity(context, "dayInfo"),
            actions: assign({
				dayInfo: (context) => getEntity(context, "dayInfo"),
            }),
          },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".prompt",
      },
      states: {
        prompt: {
          entry: say("On which day is it?"),
          on: { ENDSPEECH: "ask" },
        },
        ask: {
          entry: send("LISTEN"),
        },
        nomatch: {
          entry: say(
            "Sorry, I don't know what it is. Tell me something I know."
          ),
          on: { ENDSPEECH: "ask" },
        },
      },
    },
    day: {
      entry: send((context) => ({
        type: "SPEAK",
        value: `OK, ${context.dayInfo}`,
      })),
      on: { ENDSPEECH: "wholeday" },
    },
wholeday: {
      initial: "prompt",
      on: {
        RECOGNISED: [
          {
            target: "wday",
            cond: (context) => !!getEntity(context, "confirmation"),
            actions: assign({
              confirmation: (context) => getEntity(context, "confirmation"),
            }),
          },
          {
			  target: "nwday",
			  cond: (context) => !!getEntity(context, "denial"),
            actions: assign({
              denial: (context) => getEntity(context, "denial"),
            }),
          },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".prompt",
      },
      states: {
        prompt: {
          entry: say("Will it take the whole day?"),
          on: { ENDSPEECH: "ask" },
        },
        ask: {
          entry: send("LISTEN"),
        },
        nomatch: {
          entry: say(
            "Sorry, I don't know what it is. Tell me something I know."
          ),
          on: { ENDSPEECH: "ask" },
        },
      },
    },
    nwday: {
      entry: send((context) => ({
        type: "SPEAK",
        value: `Okay`,
      })),
      on: { ENDSPEECH: "whattime" },
  },
  wday: {
	  entry: send((context) => ({
        type: "SPEAK",
        value: `Okay.`,
      })),
      on: { ENDSPEECH: "wsum" },
  },	  
  whattime: {
      initial: "prompt",
      on: {
        RECOGNISED: [
          {
            target: "time",
            cond: (context) => !!getEntity(context, "timeInfo"),
            actions: assign({
              timeInfo: (context) => getEntity(context, "timeInfo"),
            }),
          },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".prompt",
      },
      states: {
        prompt: {
			entry: say("What time is your meeting?"),
          on: { ENDSPEECH: "ask" },
        },
        ask: {
          entry: send("LISTEN"),
        },
        nomatch: {
          entry: say(
            "Sorry, I don't know what it is. Tell me something I know."
          ),
          on: { ENDSPEECH: "ask" },
        },
      },
    },
    time: {
      entry: send((context) => ({
        type: "SPEAK",
        value: `OK`,
      })),
      on: { ENDSPEECH: "nwsum" },
  },
  nwsum: {
      initial: "prompt",
      on: {
        RECOGNISED: [
          {
            target: "confirm",
            cond: (context) => !!getEntity(context, "confirmation"),
            actions: assign({
              confirmation: (context) => getEntity(context, "confirmation"),
            }),
          },
           {
            target: "deny",
            cond: (context) => !!getEntity(context, "denial"),
            actions: assign({
              denial: (context) => getEntity(context, "denial"),
            }),
          },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".prompt",
      },
      states: {
        prompt: {
			entry: send((context) => ({
            type: "SPEAK",
            value: `Do you want me to create a meeting on ${context.dayInfo} at ${context.timeInfo}?`,
          })),
          on: { ENDSPEECH: "ask" },
        },
        ask: {
          entry: send("LISTEN"),
        },
        nomatch: {
          entry: say(
            "Sorry, I don't know what it is. Tell me something I know."
          ),
          on: { ENDSPEECH: "ask" },
        },
      },
    },
    confirm: {
      entry: send((context) => ({
        type: "SPEAK",
        value: `OK, Your meeting has been created!`,
      })),
  },
  deny: {
  entry: send((context) => ({
        type: "SPEAK",
        value: `OK`,
      })),
      on: { ENDSPEECH: "welcome" },
  },
    wsum: {
      initial: "prompt",
      on: {
        RECOGNISED: [
          {
            target: "confirm",
            cond: (context) => !!getEntity(context, "confirmation"),
            actions: assign({
              confirmation: (context) => getEntity(context, "confirmation"),
            }),
          },
          {
			  target: "deny",
			  cond: (context) => !!getEntity(context, "denial"),
            actions: assign({
              denial: (context) => getEntity(context, "denial"),
            }),
          },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".prompt",
      },
      states: {
        prompt: {
			entry: send((context) => ({
            type: "SPEAK",
            value: `Do you want me to create a meeting on ${context.dayInfo} for the whole day?`,
          })),
          on: { ENDSPEECH: "ask" },
        },
        ask: {
          entry: send("LISTEN"),
        },
        nomatch: {
          entry: say(
            "Sorry, I don't know what it is. Tell me something I know."
          ),
          on: { ENDSPEECH: "ask"},
	  },
	  },
	  },
  confirm: {
      entry: send((context) => ({
        type: "SPEAK",
        value: `OK, Your meeting has been created!`,
      })),
  },
  deny: {
  entry: send((context) => ({
        type: "SPEAK",
        value: `OK`,
      })),
      on: { ENDSPEECH: "welcome" },
  },
},
};

const kbRequest = (text: string) =>
  fetch(
    new Request(
      `https://cors.eu.org/https://api.duckduckgo.com/?q=${text}&format=json&skip_disambig=1`
    )
  ).then((data) => data.json());
