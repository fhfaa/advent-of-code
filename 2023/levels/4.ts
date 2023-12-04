import { Puzzle } from "../../puzzle";


type Card2 = {
  cardCount: number;
  winningNumbersCount: number;
} 


export const P = new Puzzle({
  year: 2023,
  day: 4,


  part1: (input, isTest = false): number => {
    return input.
      split('\n').
      reduce((fullScore: number, line: string) => {
        // Extract lists of winning numbers as number[]
        const [_, left, right] = line.split(/: +| \| +/);
        const winning = left.
          split(/ +/).
          map(parseFloat);

        // Extract drawn numbers as number[] and filter out numbers that didn't win
        const numFound = right.
          split(/ +/).map(parseFloat).
          filter(num => winning.includes(num)).length;

        // If we have at least one winning number, the score is 2^(numFound-1)
        const cardScore = numFound ? 2 ** (numFound - 1) : 0;
        return fullScore + cardScore;
      }, 0);
  },

  
  part2: (input, isTest = false): number => {
    const cards = input.
      split('\n').
      map((line: string): Card2 => {
        // Extract lists of winning numbers as number[]
        const [_, left, right] = line.split(/: +| \| +/);
        const winning = left.
          split(/ +/).
          map(parseFloat);

        // Find the number of winning numbers on each the card
        return {
          cardCount: 1,
          winningNumbersCount: right.split(/ +/).map(parseFloat).filter(num => winning.includes(num)).length
        };
      });
    
    return cards.reduce((totalCards: number, card: Card2, idx: number): number => {
      // Any winning numbers? win free cards!
      // e.g. if we have <3> winning numbers on card <7>: we get one free card each of the next <3> cards:
      // one free card #8, one free card #9 and one free card #10
      if (card.winningNumbersCount) {
        cards.
          slice(idx + 1, idx + 1 + card.winningNumbersCount).
          forEach(nextCard => nextCard.cardCount += card.cardCount);
      }
      // count cards up until the current one
      return totalCards + card.cardCount;
    }, 0);
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 13,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1, 
    expected: 23847,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 30,
    inputFile: 'example'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 8570000,
  }]
});
