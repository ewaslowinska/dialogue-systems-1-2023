import { MachineConfig, send, Action, assign } from "xstate";

function say(text: string): Action<SDSContext, SDSEvent> {
  return send((_context: SDSContext) => ({ type: "SPEAK", value: text }));
}

const getEntity = (context: SDSContext, entity: string) => {
  console.log('nluResult:');
  console.log(context.nluResult)															
    const topScoringIntent = context.nluResult.prediction.intents[0];
    console.log('Top scoring intent:', topScoringIntent);
    return topScoringIntent.category;
};

const getEntity1 = (context: SDSContext, entity: string) => {
  console.log('nluResult:');
  console.log(context.nluResult)															
    const topScoringEntity = context.nluResult.prediction.entities[0];
    console.log('Top scoring entity:', topScoringEntity);
    return topScoringEntity.text;
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
            cond: (context) => getEntity(context) === "create a meeting",
},
          {
			  target: "WhoIsX",
			  cond: (context) => getEntity(context) === "who is X",
			  actions: assign({person:  
              (context) => getEntity1(context)
		  })	  
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
    WhoIsX: {
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
            value: `Sorry, couldn't find anything about them. Try again`
          })),
          on: {ENDSPEECH: "WhoIsX"}
        },
        prompt: {
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
    celebrityQuestion: {
		id: "celebrityQuestion",
    initial: "prompt",
      on: {
        RECOGNISED: [
          {
            target: "confirmYes",
            cond: (context) => getEntity(context) === "confirmation"
          },
           {
            target: "denyNo",
            cond: (context) => getEntity(context) === "denial"
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
            cond: (context) => getEntity(context) === "create a type",
            actions: assign({
				type: (context) => getEntity1(context, "type"),
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
            cond: (context) => getEntity(context) === "day",
            actions: assign({
				dayInfo: (context) => getEntity1(context, "dayInfo"),
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
            cond: (context) => getEntity(context) === "confirmation",
          },
          {
			  target: "nwday",
			  cond: (context) => getEntity(context) === "denial",
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
            cond: (context) => getEntity(context) === "information about time",
            actions: assign({
				timeInfo: (context) => getEntity1(context, "dayInfo"),
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
            cond: (context) => getEntity(context) === "confirmation",
          },
           {
            target: "deny",
            cond: (context) => getEntity(context) === "denial",
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
