import { CoordsSet } from "./matrix.utils";

type CoordsObj = { [xyCoords: string]: string | number; }
type RenderFn = (chr: string, empty: string) => string;

export class DebugMatrix{
    private m: string[][] = [];
    private emptyChr = ' ';

    constructor(empty?: string) {
        if (empty !== undefined) {
            this.emptyChr = empty;
        }
    }

    // Set the value at a specific x,y coord.
    add(x: number, y: number, val: string | number) {
        this.m[y] ??= [];
        this.m[y][x] = `${val}`;;
    }

    // Print Matrix from 0 to highest coordinate added.
    // Takes an optional `renderFn` that can transform each value before it is printed.
    print(renderFn?: RenderFn) {
        const yMax = this.m.length;
        const xMax = this.m.length ?
            Math.max(0, ...this.m.map((row) => row.length).filter(Boolean))
            : 0;

        const render: RenderFn = renderFn || ((chr, empty) => chr ?? empty);

        const rows: string[] = [];
        for (let y = 0; y < yMax; y++) {
            let row = '';
            for (let x = 0; x < xMax; x++) {
                row += render(this.m[y]?.[x], this.emptyChr);
            }
            rows.push(row);
        }
        console.log(rows.join('\n'));
    }

    // Init from Set with "x,y" coord keys
    static fromCoordsSet(s: CoordsSet, fillChar = '#', emptyChar = '.') {
        const m = new DebugMatrix(emptyChar);

        for (let key of s.keys()) {
            const [x, y] = key.split(',');
            m.add(+x, +y, fillChar);
        }
        return m;
    }

    // Init from POJO with "x,y" coord keys (for the years before Set was a thing)
    static fromCoordsObject(obj: CoordsObj, fillChar = '#', emptyChar = '.'): DebugMatrix {
        const m = new DebugMatrix(emptyChar);

        for (let [key, val] of Object.entries(obj)) {
            const [x, y] = key.split(',');
            m.add(+x, +y, `${val ?? fillChar}`);
        }
        return m;
    }
}