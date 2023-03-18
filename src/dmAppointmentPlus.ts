<<<<<<< HEAD
import { MachineConfig, send, Action, assign, actions } from "xstate";

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
	"help": {
		intent: "None",
		entities: { message: "you need help" },
	},
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
      if (context.recResult[0].confidence > 0.8) {
      return grammar[u].entities[entity];
    }
    return false
  }
}
  return false;
};

const getEntity1 = (context: SDSContext, entity: string) => {
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
  id: "initial",
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
      id: "greeting",
      initial: "prompt",
      on: {
        RECOGNISED: [
          // {
          //   target: "helping",
          //   cond: (context) => !!getEntity1(context, "message"),
          //   actions: assign({
          //     message: (context: SDSContext) => getEntity(context, "message"),
          //   }),
          // },
          {
            target: "helpingonwelcome",
            cond: (context) => !!getEntity1(context, "message"),
            actions: assign({
              message: (context) => getEntity1(context, "message"),
            }),
          },
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
              answer: (context: SDSContext) => getEntity(context, "answer"),
            }),
          },
          {
          target: "unsure",
          cond: (context) => getEntity(context, "message") === false,
          actions: assign({p: (context: { recResult: { utterance: any; }[]; }) => context.recResult[0].utterance}),
          },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".noinput",
      },
      states: {
        noinput: {
        entry: say("I don't quite hear you"),
        on: { ENDSPEECH: "prompt" },
      },
        prompt: {
          initial: "choice",
          states: {
            choice: {
              always: [
                {target: "p2.hist",
                cond: (context) => context.count === 2,
              },
              {target: "p3.hist",
                cond: (context) => context.count === 3,
              },
              {target: "p4.hist",
              cond: (context) => context.count === 4,
            },
            {target: "p5.hist",
              cond: (context) => context.count === 5,
            },
              "p1",
            ],
              },
p1: {
  entry: [assign({ count: 2 })],
initial: "prompt",
states: {
  prompt: {
    entry: send({
      type: "SPEAK",
      value: "Hi! What would you like to do? Would you like to create a meeting or ask about someone?",
    }),
    on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
},
},
p2: {
  entry: [assign({ count: 3 })],
  initial: "prompt",
states: {
  hist: { type: "history" },
  prompt: {
    entry: send({
      type: "SPEAK",
      value: "Please answer me",
    }),
    on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
            },
          },
          p3: {
            entry: [assign({ count: 4 })],
            initial: "prompt",
          states: {
            hist: { type: "history" },
            prompt: {
              entry: send({
                type: "SPEAK",
                value: "Answer",
              }),
              on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
                      },
                    },
                    p4: {
                      entry: [assign({ count: 5 })],
                      initial: "prompt",
                    states: {
                      hist: { type: "history" },
                      prompt: {
                        entry: send({
                          type: "SPEAK",
                          value: "C'mon",
                        }),
                        on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
                      },
                    },
                              p5: {
                                initial: "prompt",
                              states: {
                                hist: { type: "history" },
                                prompt: {
                                  entry: send({
                                    type: "SPEAK",
                                    value: "Returning to the initial state",
                                  }),
                                  on: { ENDSPEECH: "#initial" },
                                },
                                          },
                                        },
        },
      },
        nomatch: {
          entry: say(
            "Sorry, I don't know what it is. Tell me something I know."
          ),
          on: { ENDSPEECH: "prompt" },
        },
      },
    },
    helpingonwelcome: {
    id: "helpingonwelcome",
		entry: say("Returning to the previous question"),
    // entry: [assign({ count: 0 })],
		on: { ENDSPEECH: "#greeting.prompt.p1.prompt" },
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
      unsure: {
        initial: "prompt",
        on: {
          RECOGNISED: [
            {
              target: "#greeting.prompt.p1.prompt",
              cond: (context) => !!getEntity1(context, "denial"),
            },
            {
              target: "meet",
              cond: (context) => context.recResult[0].utterance === "Yes." && context.p === "Create a meeting.",
            },
            {
              target: "asking",
              cond: (context) => context.recResult[0].utterance === "Yes." && context.p === "Ask about someone.",
            },
      {
        target: ".nomatch",
      },
    ],
    TIMEOUT: ".noinput",
  },
  states: {
    noinput: {
    entry: say("Please answer me"),
    on: { ENDSPEECH: "ask" },
  },
    prompt: {
      entry: send((context) => ({
        type: "SPEAK",
        value: `Did you mean ${context.p}?`,
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
    WhoIsX: {
      id: "WhoIsX",
      initial: "prompt",
      on: {
        RECOGNISED: [
         {
            target: "helping1",
            cond: (context) => !!getEntity1(context, "message"),
            actions: assign({
              message: (context: SDSContext) => getEntity(context, "message"),
            }),
          },
          { target: ".info",
          cond: (context) => context.recResult[0].confidence > 0.8,
            actions: assign({p:  
              context => {return context.recResult[0].utterance}
            })
            },
            {
              target: "unsureee",
              cond: (context) => context.recResult[0].confidence <= 0.8,
              actions: assign({p: (context: { recResult: { utterance: any; }[]; }) => context.recResult[0].utterance}),
              },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".noinput",
      },
      states: {
        info: {
          invoke: {
            id: 'getInfo',
            src: (context, event) => kbRequest(context.p),
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
          noinput: {
          entry: say("I don't quite hear you"),
          on: { ENDSPEECH: "prompt" },
        },
          prompt: {
            initial: "choice",
            states: {
              choice: {
                always: [
                  {target: "p2.hist",
                  cond: (context) => context.count1 === 2,
                },
                {target: "p3.hist",
                  cond: (context) => context.count1 === 3,
                },
                {target: "p4.hist",
                cond: (context) => context.count1 === 4,
              },
              {target: "p5.hist",
                cond: (context) => context.count1 === 5,
              },
                "p1",
              ],
                },
  p1: {
    entry: [assign({ count1: 2 })],
  initial: "prompt",
  states: {
    prompt: {
      entry: send({
        type: "SPEAK",
        value: `Who would you like to know about?`,
      }),
      on: { ENDSPEECH: "ask" },
    },
    ask: {
      entry: send("LISTEN"),
    },
  },
  },
  p2: {
    entry: [assign({ count1: 3 })],
    initial: "prompt",
  states: {
    hist: { type: "history" },
    prompt: {
      entry: send({
        type: "SPEAK",
        value: "Please answer me",
      }),
      on: { ENDSPEECH: "ask" },
    },
    ask: {
      entry: send("LISTEN"),
    },
              },
            },
            p3: {
              entry: [assign({ count1: 4 })],
              initial: "prompt",
            states: {
              hist: { type: "history" },
              prompt: {
                entry: send({
                  type: "SPEAK",
                  value: "Answer",
                }),
                on: { ENDSPEECH: "ask" },
    },
    ask: {
      entry: send("LISTEN"),
    },
                        },
                      },
                      p4: {
                        entry: [assign({ count1: 5 })],
                        initial: "prompt",
                      states: {
                        hist: { type: "history" },
                        prompt: {
                          entry: send({
                            type: "SPEAK",
                            value: "C'mon",
                          }),
                          on: { ENDSPEECH: "ask" },
    },
    ask: {
      entry: send("LISTEN"),
    },
                        },
                      },
                                p5: {
                                  initial: "prompt",
                                states: {
                                  hist: { type: "history" },
                                  prompt: {
                                    entry: send({
                                      type: "SPEAK",
                                      value: "Returning to the initial state",
                                    }),
                                    on: { ENDSPEECH: "#initial" },
                                  },
                                            },
                                          },
          },
        },
          nomatch: {
            entry: say(
              "Sorry, I don't know what it is. Tell me something I know."
            ),
            on: { ENDSPEECH: "prompt" },
          },
        },
      },
    helping1: {
		entry: say("Returning to the previous question"),
		on: { ENDSPEECH: "#greeting.prompt.p1.prompt" },
	},
  unsureee: {
    initial: "prompt",
    on: {
      RECOGNISED: [
        {
          target: "#WhoIsX.prompt.p1.prompt",
          cond: (context) => !!getEntity1(context, "denial"),
        },
        {
          target: "#WhoIsX.info",
          cond: (context) => context.recResult[0].utterance === "Yes.",
        },
  {
    target: ".nomatch",
  },
],
TIMEOUT: ".noinput",
},
states: {
noinput: {
entry: say("Please answer me"),
on: { ENDSPEECH: "ask" },
},
prompt: {
  entry: send((context) => ({
    type: "SPEAK",
    value: `Did you mean ${context.p}?`,
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
    celebrityQuestion: {
		id: "celebrityQuestion",
    initial: "prompt",
      on: {
        RECOGNISED: [
         {
            target: "helping2",
            cond: (context) => !!getEntity1(context, "message"),
            actions: assign({
              message: (context: SDSContext) => getEntity(context, "message"),
            }),
          },
          {
            target: "confirmYes",
            cond: (context) => !!getEntity(context, "confirmation"),
            actions: assign({
              confirmation: (context: SDSContext) => getEntity(context, "confirmation"),
            }),
          },
           {
            target: "denyNo",
            cond: (context) => !!getEntity(context, "denial"),
            actions: assign({
              denial: (context: SDSContext) => getEntity(context, "denial"),
            }),
          },
          {
            target: "unsure2",
            cond: (context) => getEntity(context, "message") === false,
            actions: assign({p: (context: { recResult: { utterance: any; }[]; }) => context.recResult[0].utterance}),
            },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".noinput",
      },
      states: {
        noinput: {
        entry: say("I don't quite hear you"),
        on: { ENDSPEECH: "prompt" },
      },
        prompt: {
          initial: "choice",
          states: {
            choice: {
              always: [
                {target: "p2.hist",
                cond: (context) => context.count2 === 2,
              },
              {target: "p3.hist",
                cond: (context) => context.count2 === 3,
              },
              {target: "p4.hist",
              cond: (context) => context.count2 === 4,
            },
            {target: "p5.hist",
              cond: (context) => context.count2 === 5,
            },
              "p1",
            ],
              },
p1: {
  entry: [assign({ count2: 2 })],
initial: "prompt",
states: {
  prompt: {
    entry: send({
      type: "SPEAK",
      value: "Would you like to meet them?",
    }),
    on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
},
},
p2: {
  entry: [assign({ count2: 3 })],
  initial: "prompt",
states: {
  hist: { type: "history" },
  prompt: {
    entry: send({
      type: "SPEAK",
      value: "Please answer me",
    }),
    on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
            },
          },
          p3: {
            entry: [assign({ count2: 4 })],
            initial: "prompt",
          states: {
            hist: { type: "history" },
            prompt: {
              entry: send({
                type: "SPEAK",
                value: "Answer",
              }),
              on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
                      },
                    },
                    p4: {
                      entry: [assign({ count2: 5 })],
                      initial: "prompt",
                    states: {
                      hist: { type: "history" },
                      prompt: {
                        entry: send({
                          type: "SPEAK",
                          value: "C'mon",
                        }),
                        on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
                      },
                    },
                              p5: {
                                initial: "prompt",
                              states: {
                                hist: { type: "history" },
                                prompt: {
                                  entry: send({
                                    type: "SPEAK",
                                    value: "Returning to the initial state",
                                  }),
                                  on: { ENDSPEECH: "#initial" },
                                },
                                          },
                                        },
        },
      },
        nomatch: {
          entry: say(
            "Sorry, I don't know what it is. Tell me something I know."
          ),
          on: { ENDSPEECH: "prompt" },
        },
      },
    },
    helping: {
		entry: say("Returning to the previous question"),
		on: { ENDSPEECH: "#greeting.prompt.p1.prompt" },
	},
    confirmYes: {
      entry: send((context) => ({
        type: "SPEAK",
        value: `Ok`,
      })),
      on: { ENDSPEECH: "#whatday.prompt.p1.prompt" },
  },
  denyNo: {
  entry: send((context) => ({
        type: "SPEAK",
        value: `OK`,
      })),
      on: { ENDSPEECH: "#greeting" },
  },
    helping2: {
		entry: say("Returning to the previous question"),
		on: { ENDSPEECH: "#WhoIsX.prompt.p1.prompt" },
	},
  unsure2: {
    initial: "prompt",
    on: {
      RECOGNISED: [
        {
          target: "#celebrityQuestion.prompt.p1.prompt",
          cond: (context) => !!getEntity1(context, "denial"),
        },
        {
          target: "whatday.prompt.p1.prompt",
          cond: (context) => context.recResult[0].utterance === "Yes.",
        },
  {
    target: ".nomatch",
  },
],
TIMEOUT: ".noinput",
},
states: {
noinput: {
entry: say("Please answer me"),
on: { ENDSPEECH: "ask" },
},
prompt: {
  entry: send((context) => ({
    type: "SPEAK",
    value: `Did you mean ${context.p}?`,
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
whatDayCelebrity: {
  id: "whatDayCelebrity",
  initial: "prompt",
  on: {
    RECOGNISED: [
     {
        target: "helpinggg",
        cond: (context) => !!getEntity1(context, "message"),
        actions: assign({
          message: (context: SDSContext) => getEntity(context, "message"),
        }),
      },
      {
        target: "day1",
        cond: (context) => !!getEntity(context, "dayInfo"),
        actions: assign({
    dayInfo: (context) => getEntity(context, "dayInfo"),
        }),
      },
      {
        target: "unsure10",
        cond: (context) => getEntity(context, "message") === false,
        actions: assign({dayInfo: (context: { recResult: { utterance: any; }[]; }) => context.recResult[0].utterance}),
        },
      {
        target: ".nomatch",
      },
    ],
    TIMEOUT: ".prompt",
  },
  states: {
    noinput: {
    entry: say("I don't quite hear you"),
    on: { ENDSPEECH: "prompt" },
  },
    prompt: {
      initial: "choice",
      states: {
        choice: {
          always: [
            {target: "p2.hist",
            cond: (context) => context.count4 === 2,
          },
          {target: "p3.hist",
            cond: (context) => context.count4 === 3,
          },
          {target: "p4.hist",
          cond: (context) => context.count4 === 4,
        },
        {target: "p5.hist",
          cond: (context) => context.count4 === 5,
        },
          "p1",
        ],
          },
p1: {
entry: [assign({ count4: 2 })],
initial: "prompt",
states: {
prompt: {
entry: send({
  type: "SPEAK",
  value: "On which day is it?",
}),
on: { ENDSPEECH: "ask" },
},
ask: {
entry: send("LISTEN"),
},
},
},
p2: {
entry: [assign({ count4: 3 })],
initial: "prompt",
states: {
hist: { type: "history" },
prompt: {
entry: send({
  type: "SPEAK",
  value: "Please answer me",
}),
on: { ENDSPEECH: "ask" },
},
ask: {
entry: send("LISTEN"),
},
        },
      },
      p3: {
        entry: [assign({ count4: 4 })],
        initial: "prompt",
      states: {
        hist: { type: "history" },
        prompt: {
          entry: send({
            type: "SPEAK",
            value: "Answer",
          }),
          on: { ENDSPEECH: "ask" },
},
ask: {
entry: send("LISTEN"),
},
                  },
                },
                p4: {
                  entry: [assign({ count4: 5 })],
                  initial: "prompt",
                states: {
                  hist: { type: "history" },
                  prompt: {
                    entry: send({
                      type: "SPEAK",
                      value: "C'mon",
                    }),
                    on: { ENDSPEECH: "ask" },
},
ask: {
entry: send("LISTEN"),
},
                  },
                },
                          p5: {
                            initial: "prompt",
                          states: {
                            hist: { type: "history" },
                            prompt: {
                              entry: send({
                                type: "SPEAK",
                                value: "Returning to the initial state",
                              }),
                              on: { ENDSPEECH: "#initial" },
                            },
                                      },
                                    },
    },
  },
    nomatch: {
      entry: say(
        "Sorry, I don't know what it is. Tell me something I know."
      ),
      on: { ENDSPEECH: "prompt" },
    },
  },
},
day1: {
  entry: send((context) => ({
    type: "SPEAK",
    value: `OK, ${context.dayInfo}`,
  })),
  on: { ENDSPEECH: "#wholeday.prompt.p1.prompt" },
},
helpinggg: {
entry: say("Returning to the previous question"),
on: { ENDSPEECH: "#celebrityQuestion.prompt.p1.prompt" },
},
unsure10: {
initial: "prompt",
on: {
  RECOGNISED: [
    {
      target: "#whatDayCelebrity.prompt.p1.prompt",
      cond: (context) => !!getEntity1(context, "denial"),
    },
    {
      target: "day1",
      cond: (context) => context.recResult[0].utterance === "Yes.",
    },
{
target: ".nomatch",
},
],
TIMEOUT: ".noinput",
},
states: {
noinput: {
entry: say("Please answer me"),
on: { ENDSPEECH: "ask" },
},
prompt: {
entry: send((context) => ({
type: "SPEAK",
value: `Did you mean ${context.dayInfo}?`,
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
 welcome: {
      id: "welcome",
      initial: "prompt",
      on: {
        RECOGNISED: [
         {
            target: "helping3",
            cond: (context) => !!getEntity1(context, "message"),
            actions: assign({
              message: (context: SDSContext) => getEntity(context, "message"),
            }),
          },
          {
            target: "info",
            cond: (context) => !!getEntity(context, "type"),
            actions: assign({
              p: (context) => getEntity(context, "type"),
            }),
          },
          {
            target: "unsure3",
            cond: (context) => getEntity(context, "message") === false,
            actions: assign({p: (context: { recResult: { utterance: any; }[]; }) => context.recResult[0].utterance}),
            },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".prompt",
      },
      states: {
        noinput: {
        entry: say("I don't quite hear you"),
        on: { ENDSPEECH: "prompt" },
      },
        prompt: {
          initial: "choice",
          states: {
            choice: {
              always: [
                {target: "p2.hist",
                cond: (context) => context.count3 === 2,
              },
              {target: "p3.hist",
                cond: (context) => context.count3 === 3,
              },
              {target: "p4.hist",
              cond: (context) => context.count3 === 4,
            },
            {target: "p5.hist",
              cond: (context) => context.count3 === 5,
            },
              "p1",
            ],
              },
p1: {
  entry: [assign({ count3: 2 })],
initial: "prompt",
states: {
  prompt: {
    entry: send({
      type: "SPEAK",
      value: "What will the meeting be about?",
    }),
    on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
},
},
p2: {
  entry: [assign({ count3: 3 })],
  initial: "prompt",
states: {
  hist: { type: "history" },
  prompt: {
    entry: send({
      type: "SPEAK",
      value: "Please answer me",
    }),
    on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
            },
          },
          p3: {
            entry: [assign({ count3: 4 })],
            initial: "prompt",
          states: {
            hist: { type: "history" },
            prompt: {
              entry: send({
                type: "SPEAK",
                value: "Answer",
              }),
              on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
                      },
                    },
                    p4: {
                      entry: [assign({ count3: 5 })],
                      initial: "prompt",
                    states: {
                      hist: { type: "history" },
                      prompt: {
                        entry: send({
                          type: "SPEAK",
                          value: "C'mon",
                        }),
                        on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
                      },
                    },
                              p5: {
                                initial: "prompt",
                              states: {
                                hist: { type: "history" },
                                prompt: {
                                  entry: send({
                                    type: "SPEAK",
                                    value: "Returning to the initial state",
                                  }),
                                  on: { ENDSPEECH: "#initial" },
                                },
                                          },
                                        },
        },
      },
        nomatch: {
          entry: say(
            "Sorry, I don't know what it is. Tell me something I know."
          ),
          on: { ENDSPEECH: "prompt" },
        },
      },
    },
    info: {
      entry: send((context) => ({
        type: "SPEAK",
        value: `OK, ${context.p}`,
      })),
      on: { ENDSPEECH: "whatday" },
    },
    helping3: {
		entry: say("Returning to the previous question"),
		on: { ENDSPEECH: "#greeting.prompt.p1.prompt" },
	},
  unsure3: {
    initial: "prompt",
    on: {
      RECOGNISED: [
        {
          target: "#welcome.prompt.p1.prompt",
          cond: (context) => !!getEntity1(context, "denial"),
        },
        {
          target: "info",
          cond: (context) => context.recResult[0].utterance === "Yes.",
       },
  {
    target: ".nomatch",
  },
],
TIMEOUT: ".noinput",
},
states: {
noinput: {
entry: say("Please answer me"),
on: { ENDSPEECH: "ask" },
},
prompt: {
  entry: send((context) => ({
    type: "SPEAK",
    value: `Did you mean ${context.p}?`,
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
    whatday: {
      id: "whatday",
      initial: "prompt",
      on: {
        RECOGNISED: [
         {
            target: "helping4",
            cond: (context) => !!getEntity1(context, "message"),
            actions: assign({
              message: (context: SDSContext) => getEntity(context, "message"),
            }),
          },
          {
            target: "day",
            cond: (context) => !!getEntity(context, "dayInfo"),
            actions: assign({
				dayInfo: (context) => getEntity(context, "dayInfo"),
            }),
          },
          {
            target: "unsure4",
            cond: (context) => getEntity(context, "message") === false,
            actions: assign({dayInfo: (context: { recResult: { utterance: any; }[]; }) => context.recResult[0].utterance}),
            },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".prompt",
      },
      states: {
        noinput: {
        entry: say("I don't quite hear you"),
        on: { ENDSPEECH: "prompt" },
      },
        prompt: {
          initial: "choice",
          states: {
            choice: {
              always: [
                {target: "p2.hist",
                cond: (context) => context.count4 === 2,
              },
              {target: "p3.hist",
                cond: (context) => context.count4 === 3,
              },
              {target: "p4.hist",
              cond: (context) => context.count4 === 4,
            },
            {target: "p5.hist",
              cond: (context) => context.count4 === 5,
            },
              "p1",
            ],
              },
p1: {
  entry: [assign({ count4: 2 })],
initial: "prompt",
states: {
  prompt: {
    entry: send({
      type: "SPEAK",
      value: "On which day is it?",
    }),
    on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
},
},
p2: {
  entry: [assign({ count4: 3 })],
  initial: "prompt",
states: {
  hist: { type: "history" },
  prompt: {
    entry: send({
      type: "SPEAK",
      value: "Please answer me",
    }),
    on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
            },
          },
          p3: {
            entry: [assign({ count4: 4 })],
            initial: "prompt",
          states: {
            hist: { type: "history" },
            prompt: {
              entry: send({
                type: "SPEAK",
                value: "Answer",
              }),
              on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
                      },
                    },
                    p4: {
                      entry: [assign({ count4: 5 })],
                      initial: "prompt",
                    states: {
                      hist: { type: "history" },
                      prompt: {
                        entry: send({
                          type: "SPEAK",
                          value: "C'mon",
                        }),
                        on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
                      },
                    },
                              p5: {
                                initial: "prompt",
                              states: {
                                hist: { type: "history" },
                                prompt: {
                                  entry: send({
                                    type: "SPEAK",
                                    value: "Returning to the initial state",
                                  }),
                                  on: { ENDSPEECH: "#initial" },
                                },
                                          },
                                        },
        },
      },
        nomatch: {
          entry: say(
            "Sorry, I don't know what it is. Tell me something I know."
          ),
          on: { ENDSPEECH: "prompt" },
        },
      },
    },
    day: {
      entry: send((context) => ({
        type: "SPEAK",
        value: `OK, ${context.dayInfo}`,
      })),
      on: { ENDSPEECH: "#wholeday.prompt.p1.prompt" },
    },
    helping4: {
		entry: say("Returning to the previous question"),
		on: { ENDSPEECH: "#welcome.prompt.p1.prompt" },
	},
  unsure4: {
    initial: "prompt",
    on: {
      RECOGNISED: [
        {
          target: "#whatday.prompt.p1.prompt",
          cond: (context) => !!getEntity1(context, "denial"),
        },
        {
          target: "day",
          cond: (context) => context.recResult[0].utterance === "Yes.",
        },
  {
    target: ".nomatch",
  },
],
TIMEOUT: ".noinput",
},
states: {
noinput: {
entry: say("Please answer me"),
on: { ENDSPEECH: "ask" },
},
prompt: {
  entry: send((context) => ({
    type: "SPEAK",
    value: `Did you mean ${context.dayInfo}?`,
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
wholeday: {
      id: "wholeday",
      initial: "prompt",
      on: {
        RECOGNISED: [
         {
            target: "helping5",
            cond: (context) => !!getEntity1(context, "message"),
            actions: assign({
              message: (context: SDSContext) => getEntity(context, "message"),
            }),
          },
          {
            target: "wday",
            cond: (context) => !!getEntity(context, "confirmation"),
            actions: assign({
              confirmation: (context: SDSContext) => getEntity(context, "confirmation"),
            }),
          },
          {
			  target: "nwday",
			  cond: (context) => !!getEntity(context, "denial"),
            actions: assign({
              denial: (context: SDSContext) => getEntity(context, "denial"),
            }),
          },
          {
            target: "unsure5",
            cond: (context) => getEntity(context, "message") === false,
            actions: assign({p: (context: { recResult: { utterance: any; }[]; }) => context.recResult[0].utterance}),
            },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".noinput",
      },
      states: {
        noinput: {
        entry: say("I don't quite hear you"),
        on: { ENDSPEECH: "prompt" },
      },
        prompt: {
          initial: "choice",
          states: {
            choice: {
              always: [
                {target: "p2.hist",
                cond: (context) => context.count5 === 2,
              },
              {target: "p3.hist",
                cond: (context) => context.count5 === 3,
              },
              {target: "p4.hist",
              cond: (context) => context.count5 === 4,
            },
            {target: "p5.hist",
              cond: (context) => context.count5 === 5,
            },
              "p1",
            ],
              },
p1: {
  entry: [assign({ count5: 2 })],
initial: "prompt",
states: {
  prompt: {
    entry: send({
      type: "SPEAK",
      value: "Will it take the whole day?",
    }),
    on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
},
},
p2: {
  entry: [assign({ count5: 3 })],
  initial: "prompt",
states: {
  hist: { type: "history" },
  prompt: {
    entry: send({
      type: "SPEAK",
      value: "Please answer me",
    }),
    on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
            },
          },
          p3: {
            entry: [assign({ count5: 4 })],
            initial: "prompt",
          states: {
            hist: { type: "history" },
            prompt: {
              entry: send({
                type: "SPEAK",
                value: "Answer",
              }),
              on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
                      },
                    },
                    p4: {
                      entry: [assign({ count5: 5 })],
                      initial: "prompt",
                    states: {
                      hist: { type: "history" },
                      prompt: {
                        entry: send({
                          type: "SPEAK",
                          value: "C'mon",
                        }),
                        on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
                      },
                    },
                              p5: {
                                initial: "prompt",
                              states: {
                                hist: { type: "history" },
                                prompt: {
                                  entry: send({
                                    type: "SPEAK",
                                    value: "Returning to the initial state",
                                  }),
                                  on: { ENDSPEECH: "#initial" },
                                },
                                          },
                                        },
        },
      },
        nomatch: {
          entry: say(
            "Sorry, I don't know what it is. Tell me something I know."
          ),
          on: { ENDSPEECH: "prompt" },
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
    helping5: {
		entry: say("Returning to the previous question"),
		on: { ENDSPEECH: "#whatday.prompt.p1.prompt" },
	},  
  unsure5: {
    initial: "prompt",
    on: {
      RECOGNISED: [
        {
          target: "#wholeday.prompt.p1.prompt",
          cond: (context) => !!getEntity1(context, "denial"),
        },
        {
          target: "wday",
          cond: (context) => context.recResult[0].utterance === "Yes." && context.p === "Yes.",
        },
        {
          target: "nwday",
          cond: (context) => context.recResult[0].utterance === "Yes." && context.p === "No.",
        },
  {
    target: ".nomatch",
  },
],
TIMEOUT: ".noinput",
},
states: {
noinput: {
entry: say("Please answer me"),
on: { ENDSPEECH: "ask" },
},
prompt: {
  entry: send((context) => ({
    type: "SPEAK",
    value: `Did you mean ${context.p}?`,
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
  whattime: {
      id: "whattime",
      initial: "prompt",
      on: {
        RECOGNISED: [
         {
            target: "helping6",
            cond: (context) => !!getEntity1(context, "message"),
            actions: assign({
              message: (context: SDSContext) => getEntity(context, "message"),
            }),
          },
          {
            target: "time",
            cond: (context) => !!getEntity(context, "timeInfo"),
            actions: assign({
              timeInfo: (context) => getEntity(context, "timeInfo"),
            }),
          },
          {
            target: "unsure6",
            cond: (context) => getEntity(context, "message") === false,
            actions: assign({timeInfo: (context: { recResult: { utterance: any; }[]; }) => context.recResult[0].utterance}),
            },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".noinput",
      },
      states: {
        noinput: {
        entry: say("I don't quite hear you"),
        on: { ENDSPEECH: "prompt" },
      },
        prompt: {
          initial: "choice",
          states: {
            choice: {
              always: [
                {target: "p2.hist",
                cond: (context) => context.count6 === 2,
              },
              {target: "p3.hist",
                cond: (context) => context.count6 === 3,
              },
              {target: "p4.hist",
              cond: (context) => context.count6 === 4,
            },
            {target: "p5.hist",
              cond: (context) => context.count6 === 5,
            },
              "p1",
            ],
              },
p1: {
  entry: [assign({ count6: 2 })],
initial: "prompt",
states: {
  prompt: {
    entry: send({
      type: "SPEAK",
      value: "What time is your meeting?",
    }),
    on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
},
},
p2: {
  entry: [assign({ count6: 3 })],
  initial: "prompt",
states: {
  hist: { type: "history" },
  prompt: {
    entry: send({
      type: "SPEAK",
      value: "Please answer me",
    }),
    on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
            },
          },
          p3: {
            entry: [assign({ count6: 4 })],
            initial: "prompt",
          states: {
            hist: { type: "history" },
            prompt: {
              entry: send({
                type: "SPEAK",
                value: "Answer",
              }),
              on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
                      },
                    },
                    p4: {
                      entry: [assign({ count6: 5 })],
                      initial: "prompt",
                    states: {
                      hist: { type: "history" },
                      prompt: {
                        entry: send({
                          type: "SPEAK",
                          value: "C'mon",
                        }),
                        on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
                      },
                    },
                              p5: {
                                initial: "prompt",
                              states: {
                                hist: { type: "history" },
                                prompt: {
                                  entry: send({
                                    type: "SPEAK",
                                    value: "Returning to the initial state",
                                  }),
                                  on: { ENDSPEECH: "#initial" },
                                },
                                          },
                                        },
        },
      },
        nomatch: {
          entry: say(
            "Sorry, I don't know what it is. Tell me something I know."
          ),
          on: { ENDSPEECH: "prompt" },
        },
      },
    },
    time: {
      entry: send((context) => ({
        type: "SPEAK",
        value: `OK, ${context.timeInfo}`,
      })),
      on: { ENDSPEECH: "nwsum" },
  },
    helping6: {
		entry: say("Returning to the previous question"),
		on: { ENDSPEECH: "#wholeday.prompt.p1.prompt" },
	},
  unsure6: {
    initial: "prompt",
    on: {
      RECOGNISED: [
        {
          target: "#whattime.prompt.p1.prompt",
          cond: (context) => !!getEntity1(context, "denial"),
        },
        {
          target: "nwsum",
          cond: (context) => context.recResult[0].utterance === "Yes.",
        },
  {
    target: ".nomatch",
  },
],
TIMEOUT: ".noinput",
},
states: {
noinput: {
entry: say("Please answer me"),
on: { ENDSPEECH: "ask" },
},
prompt: {
  entry: send((context) => ({
    type: "SPEAK",
    value: `Did you mean ${context.p}?`,
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
  nwsum: {
      initial: "prompt",
      id: "nwsum",
      on: {
        RECOGNISED: [
         {
            target: "helping7",
            cond: (context) => !!getEntity1(context, "message"),
            actions: assign({
              message: (context: SDSContext) => getEntity(context, "message"),
            }),
          },
          {
            target: "confirm",
            cond: (context) => !!getEntity(context, "confirmation"),
            actions: assign({
              confirmation: (context: SDSContext) => getEntity(context, "confirmation"),
            }),
          },
           {
            target: "deny",
            cond: (context) => !!getEntity(context, "denial"),
            actions: assign({
              denial: (context: SDSContext) => getEntity(context, "denial"),
            }),
          },
          {
            target: "unsure7",
            cond: (context) => getEntity(context, "message") === false,
            actions: assign({p: (context: { recResult: { utterance: any; }[]; }) => context.recResult[0].utterance}),
            },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".noinput",
      },
      states: {
        noinput: {
        entry: say("I don't quite hear you"),
        on: { ENDSPEECH: "prompt" },
      },
        prompt: {
          initial: "choice",
          states: {
            choice: {
              always: [
                {target: "p2.hist",
                cond: (context) => context.count7 === 2,
              },
              {target: "p3.hist",
                cond: (context) => context.count7 === 3,
              },
              {target: "p4.hist",
              cond: (context) => context.count7 === 4,
            },
            {target: "p5.hist",
              cond: (context) => context.count7 === 5,
            },
              "p1",
            ],
              },
p1: {
  entry: [assign({ count7: 2 })],
initial: "prompt",
states: {
  prompt: {
    entry: send((context) => ({
      type: "SPEAK",
      value: `Would you like to create a meeting titled ${context.p} on ${context.dayInfo} at ${context.timeInfo}?`,
    })),
    on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
},
},
p2: {
  entry: [assign({ count7: 3 })],
  initial: "prompt",
states: {
  hist: { type: "history" },
  prompt: {
    entry: send({
      type: "SPEAK",
      value: "Please answer me",
    }),
    on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
            },
          },
          p3: {
            entry: [assign({ count7: 4 })],
            initial: "prompt",
          states: {
            hist: { type: "history" },
            prompt: {
              entry: send({
                type: "SPEAK",
                value: "Answer",
              }),
              on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
                      },
                    },
                    p4: {
                      entry: [assign({ count7: 5 })],
                      initial: "prompt",
                    states: {
                      hist: { type: "history" },
                      prompt: {
                        entry: send({
                          type: "SPEAK",
                          value: "C'mon",
                        }),
                        on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
                      },
                    },
                              p5: {
                                initial: "prompt",
                              states: {
                                hist: { type: "history" },
                                prompt: {
                                  entry: send({
                                    type: "SPEAK",
                                    value: "Returning to the initial state",
                                  }),
                                  on: { ENDSPEECH: "#initial" },
                                },
                                          },
                                        },
        },
      },
        nomatch: {
          entry: say(
            "Sorry, I don't know what it is. Tell me something I know."
          ),
          on: { ENDSPEECH: "prompt" },
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
      on: { ENDSPEECH: "#greeting.prompt.p1.prompt" },
  },
    helping7: {
		entry: say("Returning to the previous question"),
		on: { ENDSPEECH: "#whattime.prompt.p1.prompt" },
	},
  unsure7: {
    initial: "prompt",
    on: {
      RECOGNISED: [
        {
          target: "#nwsum.prompt.p1.prompt",
          cond: (context) => !!getEntity1(context, "denial"),
        },
        {
          target: "confirm",
          cond: (context) => context.recResult[0].utterance === "Yes." && context.p === "Yes.",
        },
        {
          target: "greeting",
          cond: (context) => context.recResult[0].utterance === "Yes." && context.p === "No.",
        },
  {
    target: ".nomatch",
  },
],
TIMEOUT: ".noinput",
},
states: {
noinput: {
entry: say("Please answer me"),
on: { ENDSPEECH: "ask" },
},
prompt: {
  entry: send((context) => ({
    type: "SPEAK",
    value: `Did you mean ${context.p}?`,
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
    wsum: {
      initial: "prompt",
      on: {
        RECOGNISED: [
         {
            target: "helping8",
            cond: (context) => !!getEntity1(context, "message"),
            actions: assign({
              message: (context: SDSContext) => getEntity(context, "message"),
            }),
          },
          {
            target: "confirm",
            cond: (context) => !!getEntity(context, "confirmation"),
            actions: assign({
              confirmation: (context: SDSContext) => getEntity(context, "confirmation"),
            }),
          },
          {
            target: "unsure8",
            cond: (context) => getEntity(context, "message") === false,
            actions: assign({p: (context: { recResult: { utterance: any; }[]; }) => context.recResult[0].utterance}),
            },
          {
			  target: "deny",
			  cond: (context) => !!getEntity(context, "denial"),
            actions: assign({
              denial: (context: SDSContext) => getEntity(context, "denial"),
            }),
          },
          {
            target: ".nomatch",
          },
        ],
        TIMEOUT: ".noinput",
      },
      states: {
        noinput: {
        entry: say("I don't quite hear you"),
        on: { ENDSPEECH: "prompt" },
      },
        prompt: {
          initial: "choice",
          states: {
            choice: {
              always: [
                {target: "p2.hist",
                cond: (context) => context.count8 === 2,
              },
              {target: "p3.hist",
                cond: (context) => context.count8 === 3,
              },
              {target: "p4.hist",
              cond: (context) => context.count8 === 4,
            },
            {target: "p5.hist",
              cond: (context) => context.count8 === 5,
            },
              "p1",
            ],
              },
p1: {
  entry: [assign({ count8: 2 })],
initial: "prompt",
states: {
  prompt: {
    entry: send((context) => ({
      type: "SPEAK",
      value: `Would you like to create a meeting titled ${context.p} on ${context.dayInfo} for the whole day?`,
    })),
    on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
},
},
p2: {
  entry: [assign({ count8: 3 })],
  initial: "prompt",
states: {
  hist: { type: "history" },
  prompt: {
    entry: send({
      type: "SPEAK",
      value: "Please answer me",
    }),
    on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
            },
          },
          p3: {
            entry: [assign({ count8: 4 })],
            initial: "prompt",
          states: {
            hist: { type: "history" },
            prompt: {
              entry: send({
                type: "SPEAK",
                value: "Answer",
              }),
              on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
                      },
                    },
                    p4: {
                      entry: [assign({ count8: 5 })],
                      initial: "prompt",
                    states: {
                      hist: { type: "history" },
                      prompt: {
                        entry: send({
                          type: "SPEAK",
                          value: "C'mon",
                        }),
                        on: { ENDSPEECH: "ask" },
  },
  ask: {
    entry: send("LISTEN"),
  },
                      },
                    },
                              p5: {
                                initial: "prompt",
                              states: {
                                hist: { type: "history" },
                                prompt: {
                                  entry: send({
                                    type: "SPEAK",
                                    value: "Returning to the initial state",
                                  }),
                                  on: { ENDSPEECH: "#initial" },
                                },
                                          },
                                        },
        },
      },
        nomatch: {
          entry: say(
            "Sorry, I don't know what it is. Tell me something I know."
          ),
          on: { ENDSPEECH: "prompt" },
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
      on: { ENDSPEECH: "#greeting.prompt.p1.prompt" },
  },
    helping8: {
		entry: say("Returning to the previous question"),
		on: { ENDSPEECH: "#wholeday.prompt.p1.prompt" },
	},
  unsure8: {
    initial: "prompt",
    on: {
      RECOGNISED: [
        {
          target: "#nwsum.prompt.p1.prompt",
          cond: (context) => !!getEntity1(context, "denial"),
        },
        {
          target: "confirm",
          cond: (context) => context.recResult[0].utterance === "Yes." && context.p === "Yes.",
        },
        {
          target: "greeting",
          cond: (context) => context.recResult[0].utterance === "Yes." && context.p === "No.",
        },
  {
    target: ".nomatch",
  },
],
TIMEOUT: ".noinput",
},
states: {
noinput: {
entry: say("Please answer me"),
on: { ENDSPEECH: "ask" },
},
prompt: {
  entry: send((context) => ({
    type: "SPEAK",
    value: `Did you mean ${context.p}?`,
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
},
};

const kbRequest = (text: string) =>
  fetch(
    new Request(
      `https://cors.eu.org/https://api.duckduckgo.com/?q=${text}&format=json&skip_disambig=1`
    )
  ).then((data) => data.json());
