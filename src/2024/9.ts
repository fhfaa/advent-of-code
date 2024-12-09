import { PuzzleDefinition } from "../puzzle";


type Block = {
  fileId: number;
  length: number;
  moved?: boolean;
}


const parseInput = (input: string): Block[] => {
  return input.split('').map((num, idx) => {
    return {
      fileId: idx % 2 === 0 ? Math.ceil(idx / 2) : -1,
      length: +num,
      moved: false,
    } as Block;
  });
}


const def: PuzzleDefinition = {
  part1: (input, isTest = false): number => {
    const blocks = parseInput(input);

    let checksum = 0;
    let totalIdx = 0;

    for (let i = 0; i < blocks.length; i++) {
      const curBlock = blocks[i];

      // File
      if (curBlock.fileId > -1) {
        for (let idx = 0; idx < curBlock.length; idx++) {
          checksum += (idx + totalIdx) * curBlock.fileId;
        }
        totalIdx += curBlock.length;

      // Space
      } else {
        let freeSlots = blocks[i].length;

        while (freeSlots > 0) {
          // Take the last file block from the back (discard gaps)
          const lastBlock = blocks.pop();
          if (lastBlock.fileId === -1) {
            continue;
          }

          // If we're only going to use up part of the last block,
          // we'll have to add the partial block back to the array.
          const addBackLen = lastBlock.length > freeSlots
            ? lastBlock.length - freeSlots
            : 0;

          // Fill up all slots in the current gap with data from the file
          // in the last block. Not really, but keep calculating the checksum
          // as if we had.
          const limit = Math.min(freeSlots, lastBlock.length)
          for (let idx = 0; idx < limit; idx++) {
            checksum += (idx + totalIdx) * lastBlock.fileId;
          }
          totalIdx += limit;
          freeSlots -= limit;
          
          // If we haven't used up the last file block completely but have
          // filled the entire current gap, add the unused part of the last
          // block back to the end of the blocks array.
          if (addBackLen > 0) {
            blocks.push({ fileId: lastBlock.fileId, length: addBackLen, moved: true });
          }
        }
      }
    }

    return checksum;
  },


  part2: (input, isTest = false): number => {
    const blocks = parseInput(input);

    let checksum = 0;
    let totalIdx = 0;

    outer: for (let i = 0; i < blocks.length; i++) {
      const curBlock = blocks[i];

      // File (ignore moved files because they're not there anymore)
      if (curBlock.fileId > -1 && !curBlock.moved) {
        for (let idx = 0; idx < curBlock.length; idx++) {
          checksum += (idx + totalIdx) * curBlock.fileId;
        }
        totalIdx += curBlock.length;
      
      // Gaps (ignore zero length because we've filled them already)
      } else if (curBlock.length > 0) {
        let freeSlots = blocks[i].length;

        // Work backward from the last block
        for (let iBackward = blocks.length - 1; iBackward > i; iBackward--) {
          const lastBlock = blocks[iBackward];

          // Skip gaps, files that have already been moved and files that wouldn't fit
          if (lastBlock.fileId === -1 || lastBlock.moved || lastBlock.length > freeSlots) {
            continue;
          }

          // Keep calculating checksum as if we'd moved the file into the gap
          for (let iMove = 0; iMove < lastBlock.length; iMove++) {
            checksum += (totalIdx + iMove) * lastBlock.fileId;
          }

          // Update gap size (could be >= 0 now)
          curBlock.length -= lastBlock.length;
          totalIdx += lastBlock.length;
          lastBlock.moved = true;

          // If the current gap still has room, process it again
          if (curBlock.length) {
            i--;
          }
          continue outer;
        }

        // No file found that fits
        totalIdx += curBlock.length;
      }
    }

    return checksum;
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 1928,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 6242766523059,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 2858,
    inputFile: 'example'
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 6272188244509,
  }]
};

export default def;