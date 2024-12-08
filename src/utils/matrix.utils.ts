export class MatrixUtils {
    static charsFromInput(input: string): string[][] {
        return input
            .split('\n')
            .map((line) => line
                .split('')
            ); 
    }

    static numbersFromInput(input: string): number[][] {
        return input
            .split('\n')
            .map((line) => line
                .split('')
                .map(parseFloat)
            );
    }

    static flip<T>(matrix: T[][]): T[][] {
        const ret: T[][] = [];
    
        for (let x = 0, xlen = matrix[0].length; x < xlen; x++) {
            ret[x] = [];
            for (let y = 0, ylen = matrix.length; y < ylen; y++) {
                ret[x][y] = matrix[y][x];
            }
        }
        return ret;
    }

    static clone<T>(matrix: T[][]): T[][] {
        return matrix.map((row) => row.slice());
    }
}


export class DebugMatrix<T> {
    private m: T[][] = [];

    constructor(private empty: T) { /* empty */}

    add(x: number, y: number, val: T) {
        this.m[y] ??= [];
        this.m[y][x] = val;
    }

    print() {
        const xMax = !this.m.length ? 0 :
            Math.max(0, ...this.m.map((row) => {
                return row.length; 
            }).filter(Boolean));
        const yMax = this.m.length;
        console.log(xMax, yMax);

        const rows: string[] = [];
        for (let y = 0; y < yMax; y++) {
            let row = '';
            for (let x = 0; x < xMax; x++) {
                row += this.m[y]?.[x] ?? this.empty;
            }
            rows.push(row);
        }
        console.log(rows.join('\n'));
    }

    static fromCoordsSet(s: Set<string>, fillChar = '#', emptyChar = '.') {
        const m = new DebugMatrix(emptyChar);

        for (let [key] of s.entries()) {
            const [x, y] = key.split(',');
            m.add(+x, +y, fillChar);
        }
        return m;
    }
}