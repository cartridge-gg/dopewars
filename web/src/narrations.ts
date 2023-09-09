import { Outcome } from "./dojo/types";

type Encounter = "initial" | "repeat";

const Narrations: Record<Outcome, Record<Encounter, string[]>> = {
  [Outcome.Paid]: {
    initial: [
      "Smart move, handing over the cash. But know that we're always watching.",
      "The streets have their own tax. Good on you for understanding.",
      "Easiest way to keep your bones unbroken. Now get lost.",
      "Blood or money, always easier when it's the latter. Move along.",
      "We could've taken it by force, but you're wise to avoid the pain.",
    ],
    repeat: [
      "You again? It's like a subscription service with you. Convenient.",
      "Your pockets seem to refill just for us. Do keep coming back.",
      "Another day, another payout. Maybe consider a different route?",
      "Consistency is key, huh? We appreciate your 'donations'.",
      "Back so soon? At this rate, we should give you a loyalty card.",
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
      "Thought you could outrun us? Now your cash and stash are ours.",
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
};

function getRandomIdx(length: number): number {
  return Math.floor(Math.random() * length);
}

// if first time, use initial response. repeat is a mix of initial and repeat
export function getNarration(outcome: Outcome, isInitial: boolean): string {
  const encounterType = isInitial ? "initial" : "repeat";
  const lines = isInitial
    ? Narrations[outcome][encounterType]
    : [...Narrations[outcome].initial, ...Narrations[outcome].repeat];

  return lines[getRandomIdx(lines.length)];
}
