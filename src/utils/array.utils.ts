export class ArrayUtils {
    static flipMatrix = <T>(matrix: T[][]): T[][] => {
        const ret: T[][] = [];
    
        for (let x = 0, xlen = matrix[0].length; x < xlen; x++) {
            ret[x] = [];
            for (let y = 0, ylen = matrix.length; y < ylen; y++) {
                ret[x][y] = matrix[y][x];
            }
        }
        return ret;
    }
}