import chalk from 'chalk';
import { PaintArea, PaintSinglePixel } from './paint-strategies';


export type HexColor = `#${string}`;

export type Pixel = {
    x: number;
    y: number;
    value?: HexColor;
};

export type Palette = Record<string, HexColor>;

export interface IPaintStrategy {
    paint(canvas: Canvas, pixel: Pixel, color?: HexColor): void;
}

export const tools = ['pencil', 'bucket'];
export type Tool = (typeof tools)[number];

export const toolStrategies: Record<Tool, IPaintStrategy> = {
    pencil: new PaintSinglePixel(),
    bucket: new PaintArea()
};

export class Canvas {
    width: number;
    height: number;
    pixels: Pixel[][] = [];
    tool: Tool;
    
    private palette: Palette;
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
        this.tool = 'pencil';
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

        console.log(`Cursor: X: ${this.cursor.x} Y: ${this.cursor.y} | Tool: ${this.tool}`);
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
     * Switch to the next tool and re-render the canvas.
     */
    switchTool(): void {
        const currentToolIndex = tools.indexOf(this.tool);
        const nextToolIndex = (currentToolIndex + 1) % tools.length;
        this.tool = tools[nextToolIndex];
        this.render();
    }

    /**
     * Paint the selected pixel and re-render the canvas.
     */
    paint(colorKey: string): void {
        toolStrategies[this.tool].paint(this, this.selectedPixel, this.palette[colorKey]);
        this.render();
    }

    /**
     * Clear the selected pixel or area removing its value and re-render the canvas.
     */
    clear(): void {
        toolStrategies[this.tool].paint(this, this.selectedPixel);
        this.render();
    }

    /**
     * Get the string representation of a pixel.
     */
    private drawPixel(pixel: Pixel): string {
        const isSelected = pixel.x == this.cursor.x && pixel.y == this.cursor.y;
        if (isSelected && pixel.value)
            return chalk.hex(this.selectedColor).bgHex(pixel.value)(this.selectedChar);
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
