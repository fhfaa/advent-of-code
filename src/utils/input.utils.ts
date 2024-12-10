export class InputUtils {
    // Parse classic AoC 2d map as chars 
    static toCharMatrix(input: string): string[][] {
        return input
            .replace(/\r/g, '')
            .trim()
            .split('\n')
            .map((line) => line
                .split('')
            ); 
    }

    // Parse classic AoC 2d map as single digit numbers
    static toNumberMatrix(input: string): number[][] {
        return input
            .replace(/\r/g, '')
            .trim()
            .split('\n')
            .map((line) => line
                .split('')
                .map(parseFloat)
            );
    }
}