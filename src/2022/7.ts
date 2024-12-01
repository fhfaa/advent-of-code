import { PuzzleDefinition } from '../puzzle';


interface File {
  name: string;
  size: number;
}

interface Folder {
  name: string;
  children: Array<File| Folder>;
  totalSize?: number;
}


function parse(input: string): { rootSize: number, folderSizes: number[] } {
  let cd: Folder[] = [{
    name: '/',
    children: [],
  }];

  input.split(/\n[$] /g).slice(1).forEach(cmd => {
    if (cmd[0] === 'l') { // ls
      cd.at(-1).children = cmd.split('\n').slice(1).map(lsEntry => {
        const [size, name] = lsEntry.split(' ');
        return size === 'dir' ?
          { name, children: [] } :
          { name, size: +size };
      });
      return;
    }

    const cdName = cmd.substring(3);
    if (cdName === '..') {
      cd.pop();
    } else {
      cd.push(cd.at(-1).children.find((f: File | Folder) => f.name === cdName) as Folder)
    }
  });

  const folderSizes: number[] = [];

  function updateSizes(folder: Folder): number {
    folder.totalSize = folder.children.reduce((sum, child) => {
      return sum + ('size' in child ? child.size : updateSizes(child as Folder));
    }, 0);
    folderSizes.push(folder.totalSize!);
    return folder.totalSize;
  }
  updateSizes(cd[0]);
  
  return { rootSize: cd[0].totalSize, folderSizes };
}




const def: PuzzleDefinition = {
  year: 2022,
  day: 7,


  part1: (input: string, isTest: boolean) => {
    // Sum all sizes under 100k (counting nested children multiple times)
    return parse(input).folderSizes.
      filter(size => size < 100_000).
      reduce((a,b) => a + b);
  },


  part2: (input: string, isTest: boolean) => {
    const { rootSize, folderSizes } = parse(input);
    const mustDelete = rootSize - (70_000_000 - 30_000_000);

    // Find first size greater than the space we need to free
    return folderSizes.
      sort((a, b) => a - b).
      find(size => size > mustDelete);
  },


  tests: [{
    name: 'Part 1 example',
    part: 1,
    expected: 95437,
    inputFile: 'example',
  }, {
    name: 'Part 1 my input',
    part: 1,
    expected: 1315285,
  }, {
    name: 'Part 2 example',
    part: 2,
    expected: 24933642,
    inputFile: 'example',
  }, {
    name: 'Part 2 my input',
    part: 2,
    expected: 9847279,
  }]
};

export default def;