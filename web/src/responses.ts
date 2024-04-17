import { Action, Outcome, PlayerStatus } from "./dojo/types";

type Encounter = "initial" | "repeat";


const muggerResponses: Record<Outcome, Record<Encounter, string[]>> = {
  [Outcome.Escaped]: {
    initial: [
      "You might've outrun us this time, but the shadows talk. We'll find you.",
      "Swift move, but luck only lasts so long. The streets don't forget.",
      "Sprinting away won't save you forever. Next time, you won't see us coming.",
      "Think you're a ghost? We have a knack for hunting phantoms.",
      "Quick on your feet, huh? Makes the eventual catch even sweeter.",
    ],
    repeat: [
      "Again? Starting to admire your nerve, if not your wisdom.",
      "You're getting good at this game, but remember, every chase ends eventually.",
      "Lightning fast once more, but the storm is still coming.",
      "Twice the escape, double the desire to get you next time.",
      "Fancy footwork won't save you every time. Your luck is running thin.",
    ],
  },
  [Outcome.Captured]: {
    initial: [
      "Thought you could outrun us? Now your stash are ours.",
      "Every step you took, we were right behind. Thanks for the bonus haul.",
      "Nice try, but your pockets are a lot lighter now. Oh, and we'll be taking those drugs, too.",
      "You might be fast, but not fast enough to keep your money or your stash.",
      "Your escape plan had one flaw: leaving us your loot. Better luck next time.",
    ],
    repeat: [
      "Back again? Your pockets are like an ATM for us. Oh, and we'll help ourselves to those drugs again.",
      "You're like a broken record: run, get caught, lose loot. When will you learn?",
      "Twice in our net, and twice the profits. Thanks for the consistent supply, pal.",
      "Starting to think you're doing this on purpose. Easy pickings for us either way.",
      "Deja vu? For us, it's like hitting the jackpot every time. Your stash will do nicely.",
    ],
  },
  // To be implemented
  [Outcome.Died]: {
    initial: [],
    repeat: [],
  },
  // Not needed
  [Outcome.Paid]: {
    initial: [],
    repeat: [],
  },
  // Not needed
  [Outcome.Victorious]: {
    initial: ["Its about sending a message!"],
    repeat: [],
  },
  // Not needed
  [Outcome.Drugged]: {
    initial: ["Its about sending a message!"],
    repeat: [],
  },
};

const copResponses: Record<Outcome, Record<Encounter, string[]>> = {
  [Outcome.Escaped]: {
    initial: [
      "You might've outrun me, but my colleagues are everywhere.",
      "Enjoy your little victory. The law is long-armed.",
      "Swift move, but the badge never forgets.",
      "You've dodged us today, but there's always a tomorrow.",
      "Impressive speed, but the chase is far from over.",
    ],
    repeat: [
      "Again? You're pushing your luck.",
      "You seem to make a habit of this. Won't last forever.",
      "Your luck's got to run out at some point.",
      "Think you can outrun the law every time? Think again.",
      "You won't be so lucky next time.",
    ],
  },
  [Outcome.Paid]: {
    initial: [
      "This will do... for now. But remember, we're watching.",
      "The price of freedom is never cheap. Remember that.",
      "Your donation to the force is appreciated. Move along.",
      "We could've made things difficult. Smart move.",
      "A wise choice. It's easier when you cooperate.",
    ],
    repeat: [
      "Your pockets seem to always be ready for us. Convenient.",
      "Again? Might as well set up a direct deposit to the station.",
      "You're a regular benefactor, aren't you?",
      "Should've guessed it's you. Always ready to pay the toll.",
      "Keep this up and we might just give you a loyalty card.",
    ],
  },
  [Outcome.Captured]: {
    initial: [
      "Thought you could sneak past the law? Your drugs are confiscated, and you're coming with us.",
      "All those drugs won't save you behind bars. Welcome to your new home.",
      "The streets talk, and they've led us right to you. Those drugs? Property of the state now.",
      "You might've thought those drugs were your ticket to riches. Now they're your ticket to jail.",
      "Running an operation under our noses? Those drugs are ours now, and you've got a cell waiting.",
    ],
    repeat: [
      "Back so soon? Should've known better. Those drugs? Confiscated. Again.",
      "Starting to think you enjoy the jail food. We've got your regular cell ready.",
      "You really never learn, do you? Those drugs are coming with us. Again.",
      "The definition of insanity is doing the same thing over and over and expecting different results. Welcome back.",
      "It's like you're asking to be caught. Drugs confiscated. Enjoy your stay.",
    ],
  },
  // Not needed
  [Outcome.Died]: {
    initial: [],
    repeat: [],
  },
  // Not needed
  [Outcome.Victorious]: {
    initial: ["Its about sending a message!"],
    repeat: [],
  },
  // Not needed
  [Outcome.Drugged]: {
    initial: [],
    repeat: [],
  },
};

const goblinResponses: Record<Outcome, Record<Encounter, string[]>> = {
  [Outcome.Escaped]: {
    initial: [
      "No? Too wary of the whimsical? Your loss, my cautious friend!",
      "Ah, refusing the ticket to the stars? Earthbound forever, then!",
      "No takers? Are you sure? The skies won’t dance by themselves!",
      "Rejected? But we were about to paint the cosmos! Maybe next time?",
      "Allergic to fun, are we? Very well, I'll keep the magic to myself!",
      "Oh, a straight arrow! That’s fine, more giggles for me!",
    ],
    repeat: [
      "Back again to say 'no'? You really are a stick in the mud!",
      "You sure are consistent! My potions are wasted on the wary.",
      "Declining again? You're missing out on all the fun, my friend!",
      "Always the party pooper, eh? Suit yourself, more for me!",
      "A recurring no? You do like to play it safe. How dully delightful!",
      "Refusing again? One day, you’ll see what you're missing!",
    ],
  },
  [Outcome.Paid]: {
    initial: [],
    repeat: [],
  },
  [Outcome.Captured]: {
    initial: [],
    repeat: [],
  },
  // Not needed
  [Outcome.Died]: {
    initial: [],
    repeat: [],
  },
  // Not needed
  [Outcome.Victorious]: {
    initial: [],
    repeat: [],
  },
  // Not needed
  [Outcome.Drugged]: {
    initial: [
      "Buckle up, buttercup! Your mind's about to sprout wings and fly!",
      "Hehehe, sip this and watch the stars do cartwheels around the moon!",
      "Oh, the fun has just begun! Try not to lose your toes in the clouds!",
      "Right down the rabbit hole we go! Who said reality can’t be twisted?",
      "Ever seen your thoughts dance? You're in for a treat!",
      "Hang onto your hat! Things are gonna get wibbly-wobbly!",
    ],
    repeat: [
      "Back for more magical mischief? Your mind must be thirsty for stars!",
      "Ah, my favorite guinea pig! Ready for another spin around the cosmos?",
      "I knew you’d come back! Got a fresh batch of brain ticklers for you!",
      "You must like your world all swirly-twirly, huh? Let’s stir it up again!",
      "Round two of brain-twisting fun! Hold on, I'm turning it up a notch!",
      "Can’t get enough of the magic, can you? Let’s add another splash of chaos!",
    ],
  },
};

function getRandomIdx(length: number): number {
  return Math.floor(Math.random() * length);
}

// if first time, use initial response. repeat is a mix of initial and repeat
function getResponse(
  outcome: Outcome,
  isInitial: boolean,
  responses: Record<Outcome, Record<Encounter, string[]>>,
): string {
  const encounterType = isInitial ? "initial" : "repeat";
  const lines = isInitial
    ? responses[outcome][encounterType]
    : [...responses[outcome].initial, ...responses[outcome].repeat];

  return lines[getRandomIdx(lines.length)];
}

export function getMuggerResponses(
  outcome: Outcome,
  isInitial: boolean,
): string {
  return getResponse(outcome, isInitial, muggerResponses);
}

export function getCopResponses(outcome: Outcome, isInitial: boolean): string {
  return getResponse(outcome, isInitial, copResponses);
}

export function getGoblinResponses(outcome: Outcome, isInitial: boolean): string {
  return getResponse(outcome, isInitial, goblinResponses);
}





const encounterSentences: Record<PlayerStatus, Record<Action, string[]>> = {
  [PlayerStatus.Normal]: {
    [Action.Pay]: [],
    [Action.Run]: [],
    [Action.Fight]: [],
    [Action.Accept]:[],
    [Action.Decline]: []
  },
  [PlayerStatus.AtPawnshop]: {
    [Action.Pay]: [],
    [Action.Run]: [],
    [Action.Fight]: [],
    [Action.Accept]:[],
    [Action.Decline]: []
  },
  [PlayerStatus.BeingMugged]: {
    [Action.Pay]: [
      "You come on my block trying to buy me off? I'll take the cash but don't come around here again.",
      "Hell yeah, next time we see you, it'll be double.",
      "Keep paying up, and you just might wake up tomorrow. No guarantees.",
      "This'll do for now. But don't get too comfortable. I may be back for more.",
      "Looks like you're starting to understand how things work around here.",
      "Not bad, you paid what you owe. For now. But don't get too comfortable, kid.",
      "Hah! Is that all you got? You wanna hustle in this hood you gotta step up your game.",
      "You'll be seeing me again real soon to collect. Count on it.",
      "Don't go thinking this payment buys you protection. It don't.",
      "This payment don't even begin to make up for what you owe me.",
      "This is just a down payment on the beating I still owe you."
    ],
    [Action.Run]: [
      "Go ahead and run you slippery rat bastard!",
      "You must got some big cojones trying to run away from me!",
      "You got lucky today you little cockroach.",
      "You got lucky punk! Me and my boy here are gonna hunt you down and make you real sorry!",
      "Ain't no escaping us. We run these streets, and we'll find you.",
      "Clearly you don't know who runs these parts. But you'll learn.",
      "Run while you can fool.",
      "You can run, but you can't hide. Remember that rat. I'm coming for you.",
      "I got friends in low places. Places you don't want to know about. Keep running.",
      "You better watch your back. I'm coming for you when you least expect it.",
      "I'll find you, and when I do, boom! Right between the eyes.",
      "The streets talk, and word travels fast. I'll find you.",
      "You'll regret the day you tried to hustle on my block.",
      "My reach extends farther than you can imagine. Nowhere is safe.",
      "I'm gonna make you regret ever stepping foot in my territory."

    ],
    [Action.Fight]: [
      "Give me what you have before I turn yo ass to swiss cheese.",
      "Dealing on my block huh? Hand over the money. Consider it a tax for operating in my hood.",
      "Yo hustler, I don't think you belong here.",
      "Run me that paper homie!",
      "I'm gonna make you an offer you can't refuse. Hand it over, or hand over your life.",
      "Hand it over if you want to keep that pretty face of yours intact. Don't test me.",
      "You must have a death wish coming into my territory unannounced. Now pay the price.",
      "Hand it over nice and easy, or this can get real ugly, real fast. Your choice.",
      "Cough it up or you'll be coughing up blood.",
      "Stealing business from me? You must have a death wish.",
      "Trying to hustle on my block right under my nose?! You got guts, I'll give you that.",
      "The boys and I are gonna have fun teaching you what happens when you steal from us.",
      "I'll make an example out of you. Show everyone what happens when they cross us.",
      "Stealing business and disrespecting me in my own neighborhood? Huge mistake."
    ],
    [Action.Accept]:[],
    [Action.Decline]: []
  },
  [PlayerStatus.BeingArrested]: {
    [Action.Pay]: [
      "It's the least you can do for your troubles. Now get out of our face.",
      "I'll let you slide for now, my snack budget's running low for the week.",
      "I ought to arrest you for bribery, but this job doesn't pay enough.",
      "Yeah, yeah just hand over the money and we'll call it even for now.",
      "A real hustler would have tried to negotiate. You gave in too easy.",
      "Is that the best those corner sales can get you? Pathetic.",
      "I've seen kids offer up more than this to stay out of trouble. Amateur.",
    ],
    [Action.Run]: [
      "If the donut shop hadn't run out of glaze this morning, you'd be in cuffs by now.",
      "You must enjoy this game of cat and mouse. Don't get too cocky.",
      "This isn't over. You can't run forever.",
      "You're just delaying the inevitable. There's no escape from justice.",
      "Yeah, real nice. You got away this time but don't get too comfortable out there, pal.",
      "You think you're some drug lord? I've seen better. Mark my words, we'll catch up to you eventually.",
      "You ain't getting far, punk. I'll hunt you down if it's the last thing I do!",
      "Don't get too comfortable out there. We know these streets better than you.",
      "Run all you want, but next time I'm letting the police dogs off the leash to hunt you down.",

    ],
    [Action.Fight]: [
      "You have the right to remain silent. Anything you say can and will be used against you in a court of law.",
      "Stop right there! You fit the description. You have any drugs on you?",
      "Freeze! I can't stand punks like you! Ruining our neighborhoods!",
      "Congratulations, you've just won an all-inclusive stay at the local correctional resort!",
      "Alright, fun's over. Hand over the drugs now!",
      "Thought you were clever out there? These cuffs say otherwise.",
      "For a supposed dealer, you make this way too easy. At least put up a challenge next time.",
      "And you call yourself a drug dealer? Pathetic.",
      "My grandma could sling better than you. You're a joke.",
    ],
    [Action.Accept]:[],
    [Action.Decline]: []
  },
  [PlayerStatus.BeingDrugged]: {
    [Action.Run]:[],
    [Action.Fight]: [],
    [Action.Pay]:[],
    [Action.Accept]: [
      "Oh, ho, ho! You're in for a ride! Buckle up, buttercup, the stars await!",
      "Zing! Zap! Off you go! Don't tell the elf lords where you got 'em, capisce?",
      "Right choice, my human friend! These will tickle your soul! And maybe your toes too!",
    ],
    [Action.Decline]: [
      "No? Too scared? Bah! More cosmic journeys for me!",
      "Ah, you're missing out! These shrooms could make even a troll smile!",
      "Suit yourself, but when the sky calls, don't come crying for my stash!",

    ],
  }
}

export function getSentence(
  status: PlayerStatus,
  action: Action
): string {

  const sentences = encounterSentences[status][action]
  return sentences[getRandomIdx(sentences.length)]
}