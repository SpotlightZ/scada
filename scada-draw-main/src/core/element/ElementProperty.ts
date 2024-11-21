import { Position } from "../util/Position";
import { Size } from "../util/Size";

export interface ElementProperty {
    layout: Layout;
    style?: Style;
}


export interface Layout {
    position: Position;
    size: Size;
    zIndex: number;
    rotation: number;
}

export class Layout {
    private constructor(position: Position, size: Size, rotation: number = 0, zIndex: number = 0) {
        this.position = position;
        this.size = size;
        this.rotation = rotation;
        this.zIndex = zIndex;
    }

    public clone(): Layout {
        return new Layout(Position.of({ x: this.position.x, y: this.position.y }), Size.of({ width: this.size.width, height: this.size.height }));
    }

    public static of({ x, y, width, height, rotation, zIndex }: { x: number, y: number, width: number, height: number, rotation?: number, zIndex?: number }): Layout {
        return new Layout(Position.of({ x, y }), Size.of({ width, height }), rotation ?? 0, zIndex ?? 0);
    }

    public set({ x, y, width, height }: { x: number, y: number, width: number, height: number }): Layout {
        this.position.set({ x, y });
        this.size.set({ width, height });
        return this;
    }

    public static zero(): Layout {
        return new Layout(Position.zero(), Size.zero());
    }
}


export type Style =  Partial<FontStyle & FillStrokeStyle & TransformStyle>;

export interface FontStyle {
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
}

export interface FillStrokeStyle {
    fill: string;
    stroke: string;
    strokeWidth: number;
    strokeLinecap: string;
    strokeLinejoin: string;
    strokeDasharray: string;
}

export interface TransformStyle {
    translate: Position;
    scale: Size;
}

export class FontStyle {
    public static default() {
        return {
            fontSize: 12,
            fontWeight: 'normal',
            fontFamily: 'Arial'
        }
    }
}

export class FillStrokeStyle {
    public static default() {
        return {
            fill: 'yellow',
            stroke: 'gray',
            strokeWidth: 1,
            strokeLinecap: 'butt',
            strokeLinejoin: 'miter',
            strokeDasharray: ''
        }
    }

}

export class TransformStyle {
    static default() {
        return {
            translate: Position.zero(),
            scale: Size.of({ width: 1, height: 1 })
        }
    }
}
