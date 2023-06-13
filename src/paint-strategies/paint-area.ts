import { Pixel, HexColor, Canvas, IPaintStrategy } from '../canvas';

/**
 * Paints the area that is connected to the selected pixel.
 * Implements the flood fill algorithm.
 */
export class PaintArea implements IPaintStrategy {
    paint(canvas: Canvas, pixel: Pixel, color?: HexColor): void {
        this.paintNext(canvas, pixel, color, pixel.value);
    }

    private paintNext(
        canvas: Canvas,
        pixel: Pixel,
        targetColor?: HexColor,
        currentColor?: HexColor
    ) {
        // Return if out of boundaries.
        if (pixel.x < 0 || pixel.x >= canvas.width || pixel.y < 0 || pixel.y >= canvas.height)
            return;

        // Return if the pixel is not the current color (doesn't belong to the area)
        if (canvas.pixels[pixel.y][pixel.x].value != currentColor) 
            return;

        canvas.pixels[pixel.y][pixel.x].value = targetColor;

        // Recursively fill the next pixels in 4 directions.
        this.paintNext(canvas, { x: pixel.x + 1, y: pixel.y }, targetColor, currentColor);
        this.paintNext(canvas, { x: pixel.x - 1, y: pixel.y }, targetColor, currentColor);
        this.paintNext(canvas, { x: pixel.x, y: pixel.y + 1 }, targetColor, currentColor);
        this.paintNext(canvas, { x: pixel.x, y: pixel.y - 1 }, targetColor, currentColor);
    }
}
