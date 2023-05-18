import chalk from 'chalk';

type HexColor = `#${string}`;

export type Pixel = {
    x: number;
    y: number;
    value?: HexColor;
};

export type Palette = Record<string, HexColor>;

export class Canvas {
    private width: number;
    private height: number;
    private palette: Palette;
    private pixels: Pixel[][] = [];
    private cursor: Omit<Pixel, 'value'> = { x: 0, y: 0 };
    private borders: { top: string; side: string; bottom: string };
    private footer: string;

    private readonly pixelChar = '  ';
    private readonly selectedChar = '▁▁';
    private readonly selectedColor = '#F5F5F5';

    /**
     * Get the pixel that is currently selected by the cursor.
     */
    get selectedPixel(): Pixel {
        return this.pixels[this.cursor.y][this.cursor.x];
    }

    constructor(width: number, height: number, palette: Palette, footer: string) {
        this.width = width;
        this.height = height;
        this.palette = palette;
        this.footer = footer;
        this.borders = this.generateBoundaries();
    }

    /**
     * Initialize the canvas with empty pixels
     */
    initialize() {
        for (let row = 0; row < this.height; row++) {
            this.pixels[row] = [];
            for (let col = 0; col < this.width; col++) {
                this.pixels[row][col] = {
                    x: col,
                    y: row
                };
            }
        }
    }

    /**
     * Render the canvas to the console
     */
    render(): void {
        let output = this.borders.top + '\n';
        for (let row = 0; row < this.height; row++) {
            output += this.borders.side;
            for (let col = 0; col < this.width; col++) {
                const pixel = this.pixels[row][col];
                output += this.drawPixel(pixel);
            }
            output += `${this.borders.side}\n`;
        }

        output += this.borders.bottom;

        console.clear();
        console.log(output);

        console.log(`Cursor: X: ${this.cursor.x} Y: ${this.cursor.y}`);
        console.log(this.footer);
    }

    /**
     * Move the cursor and re-render the canvas.
     */
    move(direction: 'up' | 'down' | 'left' | 'right'): void {
        if (direction == 'up' && this.cursor.y > 0) {
            this.cursor.y--;
        } else if (direction == 'down' && this.cursor.y < this.height - 1) {
            this.cursor.y++;
        } else if (direction == 'left' && this.cursor.x > 0) {
            this.cursor.x--;
        } else if (direction == 'right' && this.cursor.x < this.width - 1) {
            this.cursor.x++;
        }

        this.render();
    }

    /**
     * Paint the selected pixel and re-render the canvas.
     */
    paint(colorKey: string): void {
        this.selectedPixel.value = this.palette[colorKey];
        this.render();
    }

    /**
     * Clear the selected pixel removing its value and re-render the canvas.
     */
    clear(): void {
        this.selectedPixel.value = undefined;
        this.render();
    }

    /**
     * Get the string representation of a pixel.
     */
    private drawPixel(pixel: Pixel): string {
        const isSelected = pixel.x == this.cursor.x && pixel.y == this.cursor.y;
        if (isSelected && pixel.value)
            return chalk.hex(this.selectedColor).bgHex(pixel.value)(
                this.selectedChar
            );
        if (pixel.value) return chalk.bgHex(pixel.value)(this.pixelChar);
        if (isSelected) return chalk.hex(this.selectedColor)(this.selectedChar);

        return this.pixelChar;
    }

    private generateBoundaries() {
        return {
            top: '┌' + '─'.repeat(this.width * this.pixelChar.length) + '┐',
            bottom: '└' + '─'.repeat(this.width * this.pixelChar.length) + '┘',
            side: '│'
        };
    }
}
