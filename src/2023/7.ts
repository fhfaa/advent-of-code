import { PuzzleDefinition } from '../puzzle';

type Hand = {
  fixedCards: string[],
  sortedCards: string[],
  bid: number,
  score: number
}

enum Scores {
  FIVE = 6,
  FOUR = 5,
  FULLHOUSE = 4,
  THREE = 3,
  TWOPAIR = 2,
  ONEPAIR = 1,
  HIGHCARD = 0
}


const parseLineAndCalcScore = (input: string, part: 1|2): Hand[] => {
  return input.
    split('\n').
    map(line => {
      const [cards, bid] = line.split(' ');

      // Change letters so for easier string comparison of values via charCodes.
      // In part 2, Jacks have the lowest value of all cards.
      const fixedCards = cards.
        replace(/T/g, 'a').
        replace(/J/g, part === 1 ? 'b' : '0').
        replace(/Q/g, 'c').
        replace(/K/g, 'd').
        replace(/A/g, 'e').
        split('');

      const sortedCards = fixedCards.slice().sort();

    return {
      fixedCards: fixedCards,
      sortedCards: sortedCards,
      bid: +bid,
      score: getHandScore(sortedCards),
    } as Hand;
  });
}


const getHandScore = (sortedCards: string[]): number => {
  // For card 2 to 5, create a string of 0 (same as last card) and 1 (different from last card)
  const changes = sortedCards.
    slice(1).
    reduce((ret, next, idx) => {
      return ret + (sortedCards[idx] !== next ? '1' : '0');
    }, '');
  
  // Use changes string and regex to determine the kind of hand:
  // e.g.: if this hand has4 of a (kind with cards already sorted by value), the
  // "change" in cards must be between the first or last 2 cards (1000 or 0001 resp.)
  switch (true) {
    case changes === '0000':
      return Scores.FIVE;
    case /1000|0001/.test(changes):
      return Scores.FOUR;
    case /^0?0100?$/.test(changes):
      return Scores.FULLHOUSE;
    case /00/.test(changes):
      return Scores.THREE;
    case /^.?011?0.?$/.test(changes):
      return Scores.TWOPAIR; 
    case changes.indexOf('0') > -1:
      return Scores.ONEPAIR;
    default:
      return Scores.HIGHCARD;
  }
}


// Sort hands by score, then by higher card (1st to last) in the original order.
// In part 2 Jacks are always the lowest card, even when they're used as a wildcard.
const sortHands = (h1: Hand, h2: Hand): number => {
  if (h1.score === h2.score) {
    // If two cards have the same score, compare their first cards and sort by that.
    // If the first (second, third...) are the same, keep going until there are 2 diff cards.
    for (let i = 0; i < 5; i++) {
      if (h1.fixedCards[i] === h2.fixedCards[i]) {
        continue;
      }
      return h1.fixedCards[i] < h2.fixedCards[i] ? -1 : 1;
    }
  }
  return h1.score < h2.score ? -1 : 1;
}


// Part2: Use Jacks as wildcards to create hands with a higher score
// Note that 'J' has already been replaced with '0' here. 
const upgradeJacks = (hand: Hand) => {
  const jacks = hand.sortedCards.filter(c => c === '0').length;

  if (jacks) {
    switch (hand.score) {
      case Scores.FIVE:
      case Scores.FOUR:
      case Scores.FULLHOUSE:
        // FOUR and FULLHOUSE can be upgraded to FIVE by replacing the Jacks
        // with the only other non-Jack card.
        hand.score = Scores.FIVE;
        break;
      case Scores.THREE:
        // Can be upgraded to FOUR. Either three Jacks are turned into one of
        // the single cards, or one jack into the one there's three of.
        hand.score = Scores.FOUR;
        break;
      case Scores.TWOPAIR:
        // Can be upgraded to FOUR if we have two Jacks, or FULLHOUSE if we have one.
        hand.score = jacks === 2 ? Scores.FOUR : Scores.FULLHOUSE;
        break;
      case Scores.ONEPAIR:
        // Can be upgraded to THREE, regardless of whether we have 1 or 2 Jacks
        hand.score = Scores.THREE;
        break;
      case Scores.HIGHCARD:
        // Can be upgraded to ONEPAIR
        hand.score = Scores.ONEPAIR;
    }
  }
  return hand;
}


/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */



const def: PuzzleDefinition = {
  year: 2023,
  day: 7,

  /* ************************************************************************* */

  part1: (input: string, isTest: boolean) => {
    return parseLineAndCalcScore(input, 1).
      sort(sortHands).
      reduce((total, hand, idx) => total + (hand.bid * (idx + 1)), 0);
  },

  /* ************************************************************************* */

  part2: (input: string, isTest: boolean) => {
    return parseLineAndCalcScore(input, 2).
      map(upgradeJacks).
      sort(sortHands).
      reduce((total, hand, idx) => total + (hand.bid * (idx + 1)), 0);
  },

  /* ************************************************************************* */

  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 6440,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 246163188,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 5905,
    inputFile: 'example',
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 245794069,
  }]
};

export default def;