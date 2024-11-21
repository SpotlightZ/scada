
export interface Position {
    x: number;
    y: number;
}

export class Position {
    private constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public static of({ x, y }: { x: number, y: number }): Position {
        return new Position(x, y);
    }

    public static zero(): Position {
        return new Position(0, 0);
    }

    public set({ x, y }: { x: number, y: number }): Position {
        this.x = x;
        this.y = y;
        return this;
    }

    public add(other: Position): Position {
        return new Position(this.x + other.x, this.y + other.y);
    }

    public subtract(other: Position): Position {
        return new Position(this.x - other.x, this.y - other.y);
    }

    public distanceTo(other: Position): number {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }
}
