
export interface Size {
    width: number;
    height: number;
}

export class Size {
    private constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public static of({ width, height }: { width: number, height: number }): Size {
        return new Size(width, height);
    }

    public set({ width, height }: { width: number, height: number }): Size {
        this.width = width;
        this.height = height;
        return this;
    }

    public add(other: Size): Size {
        return new Size(this.width + other.width, this.height + other.height);
    }

    public subtract(other: Size): Size {
        return new Size(this.width - other.width, this.height - other.height);
    }

    public area(): number {
        return this.width * this.height;
    }

    public static zero(): Size {
        return new Size(0, 0);
    }

    public static one(): Size {
        return new Size(1, 1);
    }
}