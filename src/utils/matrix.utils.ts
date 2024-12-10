export type CoordsSet = Set<string>;
export type FindFn = <T>(val: T, x: number, y: number, matrix: T[][]) => boolean;

export class MatrixUtils {
    // Add a border consisting of a specific char|number around a matrix
    // so we don't need out-of-bounds checks (>=0 && <length) when checking
    // neighbours or 'moving' single steps.
    static addBorder<T>(matrix: T[][], borderChr: T): T[][] {
        const len = matrix[0].length;
        return [
            new Array(len + 2).fill(borderChr),
            ...matrix.map((row) => [borderChr, ...row, borderChr]),
            new Array(len + 2).fill(borderChr),
        ];
    }

    // Get a set of all coords that contain a specific value
    static findCoords<T>(matrix: T[][], findVal: T): CoordsSet {
        const s = new Set<string>();
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0, xlen = matrix[y].length; x < xlen; x++) {
                if (matrix[y][x] === findVal) {
                    s.add(`${x},${y}`);
                };
            }
        }
        return s;
    }

    // Get a set of all coords that return true for a given callback
    static findCoordsByFn<T>(matrix: T[][], findFn: FindFn): CoordsSet {
        const s = new Set<string>();
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0, xlen = matrix[y].length; x < xlen; x++) {
                if (findFn(matrix[y][x], x, y, matrix)) {
                    s.add(`${x},${y}`);
                }
            }
        }
        return s;
    }


    // Flip X and Y axes and return a new matrix
    static flipXY<T>(matrix: T[][]): T[][] {
        const ret: T[][] = [];
    
        for (let x = 0, xlen = matrix[0].length; x < xlen; x++) {
            ret[x] = [];
            for (let y = 0, ylen = matrix.length; y < ylen; y++) {
                ret[x][y] = matrix[y][x];
            }
        }
        return ret;
    }

    // Clone a matrix
    static clone<T>(matrix: T[][]): T[][] {
        return matrix.map((row) => row.slice());
    }
}