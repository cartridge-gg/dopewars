import { Outcome } from "./dojo/types";

type Encounter = "initial" | "repeat";

const muggerResponses: Record<Outcome, Record<Encounter, string[]>> = {
  [Outcome.Fought]: {
    initial: [
      "You've got some nerve! But this isn't over.",
      "Impressive moves, traveler. We'll remember that face.",
      "You think you've won? We'll be back, and with friends.",
      "Lucky punch... next time you won't be so fortunate.",
      "You might've won the fight, but the war? It's just beginning.",
    ],
    repeat: [
      "You again? You won't be lucky every time.",
      "Starting to hate that face of yours. We'll get our revenge.",
      "Twice now, you've bested us. But third time's the charm.",
      "You're making quite a reputation around here. It won't save you forever.",
      "How many more times are we gonna dance this dance?",
    ],
  },
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
  [Outcome.Fought]: {
    initial: [],
    repeat: [],
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
