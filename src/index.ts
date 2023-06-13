import chalk from 'chalk';
import { Canvas, Palette } from './canvas';
import { Controller } from './controller';

const palette: Palette = {
    '1': '#f0dab1',
    '2': '#e39aac',
    '3': '#c45d9f',
    '4': '#634b7d',
    '5': '#6461c2',
    '6': '#2ba9b4',
    '7': '#93d4b5',
    '8': '#f0f6e8'
};

// Draw menu.
let menu = 'Move: ↑ ↓ ← → | Clear color: del | Exit: q | Switch tool: t\nPalette: ';
for (const colorKey in palette) {
    menu += chalk.hex('#212121').bgHex(palette[colorKey])(` ${colorKey} `);
}

const canvas = new Canvas(32, 24, palette, menu);

// Handle user commands.
const controller = new Controller()
    .on('up', () => canvas.move('up'))
    .on('down', () => canvas.move('down'))
    .on('left', () => canvas.move('left'))
    .on('right', () => canvas.move('right'))
    .on('t', () => canvas.switchTool())
    .on('delete', () => canvas.clear())
    .on('q', () => process.exit(0));

// Paint the current pixel using numbers.
for (const colorKey in palette) {
    controller.on(colorKey, () => canvas.paint(colorKey));
}

controller.build();

// Start app.
canvas.initialize();
canvas.render();
