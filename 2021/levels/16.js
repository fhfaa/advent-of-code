const fs = require('fs');
const lvl = __filename.replace(/.*?[\\\/]/g, '').replace(/[\D]/g, '');
let input = fs.readFileSync(`${__dirname}/../input/${lvl}.txt`, 'utf8').replace(/\r/g, '');

const VALUE_HAS_MORE_BYTES = '1';
const CHILD_LENGTH_IS_IN_BITS = '0';

// 
function parse(bits, startIdx = 0) {
  const version = parseInt(bits.substring(startIdx, startIdx + 3), 2);
  const typeId = parseInt(bits.substring(startIdx + 3, startIdx + 6), 2);

  const packet = { version, typeId }; // prepare return value
  let idx = startIdx + 6;

  switch (typeId) {
    // Type 4: Literal value packet
    case 4:
      packet.value = 0;
      let more = true;

      while (more) {
        packet.value = (packet.value * 16) + parseInt(bits.substring(idx + 1, idx + 5), 2);
        more = bits[idx] === VALUE_HAS_MORE_BYTES;
        idx += 5;
      }
      
      break;
    
    // Other: Operator packet
    default:
      const lengthType = bits[idx];
      packet.children = [];
      
      // Length of children is given in bits
      if (lengthType === CHILD_LENGTH_IS_IN_BITS) {
        let numBits = parseInt(bits.substring(idx + 1, idx + 1 + 15), 2);
        idx += 16;

        while (numBits > 0) {
          const newPacket = parse(bits, idx);
          packet.children.push(newPacket);
          numBits -= newPacket.bitLength;
          idx += newPacket.bitLength;
        }
      
      // Length of children is given in number of subpackets
      } else {
        let numPackets = parseInt(bits.substring(idx + 1, idx + 1 + 11), 2);
        idx += 12;

        while (numPackets --> 0) {
          const newPacket = parse(bits, idx);
          packet.children.push(newPacket);
          idx += newPacket.bitLength;
        }
      }
  }

  packet.bitLength = idx - startIdx;
  return packet;
}


// Part 1 -- Get sum of all version numbers
function part1(packet) {
  return packet.version + 
    (packet.children ? packet.children.reduce((ret, a) => ret + part1(a), 0) : 0);
}

// Part 2 -- Process operator packets
function part2(packet) {
  if (packet.typeId === 4) {
    return packet.value;
  }
  
  const childVals = packet.children.map(part2);
  switch (packet.typeId) {
    case 0: return childVals.reduce((a, b) => a + b, 0);
    case 1: return childVals.reduce((a, b) => a * b, 1); 
    case 2: return Math.min(...childVals);
    case 3: return Math.max(...childVals);
    case 5: return childVals[0]  >  childVals[1] ? 1 : 0;
    case 6: return childVals[0]  <  childVals[1] ? 1 : 0;
    case 7: return childVals[0] === childVals[1] ? 1 : 0;
    default: throw new Error('Invalid typeId' + packet.typeId);
  }
}



// input = '04005AC33890';
// input = '0600878021220122E1273080'

const parsedPackets = parse(input.
  split('').
  map(c => parseInt(c, 16).toString(2).padStart(4, '0')).
  join('')
);

console.log('Part 1: ', part1(parsedPackets));
console.log('Part 2: ', part2(parsedPackets));
