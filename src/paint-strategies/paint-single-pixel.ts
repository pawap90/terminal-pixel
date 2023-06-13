import { Pixel, HexColor, Canvas, IPaintStrategy } from '../canvas';

export class PaintSinglePixel implements IPaintStrategy {
    paint(canvas: Canvas, pixel: Pixel, color?: HexColor): void {
        pixel.value = color;
    }
}
