import deepmerge from "deepmerge";
import { DrawingElement, ElementOnClickCallback } from "../core/element/Element";
import { elementMeta } from "../core/element/ElementMeta";
import { ElementProperty, FillStrokeStyle, Layout } from "../core/element/ElementProperty";
import { LayoutSchema, StyleSchema, TextContentView, propViews } from "../core/element/ElementPropsView";

abstract class BasicShape<T extends DrawingElement<T>> extends DrawingElement<T> {
    constructor(prop: ElementProperty, views: any, dom: SVGElement, onClick?: (el: DrawingElement, me: MouseEvent) => void) {
        super(prop, views, dom, onClick);
    }

    public static defaultProp() {
        return {
            layout: Layout.zero(),
            style: { ...FillStrokeStyle.default() }
        }
    }

    public update(): void {
        this.dom.setAttribute('fill', this.prop.style!.fill!);
        this.dom.setAttribute('stroke', this.prop.style!.stroke!);
        this.dom.setAttribute('stroke-width', this.prop.style!.strokeWidth!.toString());
        this.dom.setAttribute('transform', `rotate(${this.prop.layout.rotation} ${this.prop.layout.position.x} ${this.prop.layout.position.y})`);
        this.dom.style.border = this.selected ? 'solid 1px blue' : '';
    }
}

@elementMeta({
    id: "circle",
    label: 'Circle',
    icon: `<svg height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                <circle r="6" cx="7" cy="7" stroke="black" stroke-width="1" fill="none" />
              </svg>`,
    creator: {
        create(prop: ElementProperty, onClick?: ElementOnClickCallback) { return new Circle(prop, onClick) }
    }
})
export class Circle extends BasicShape<Circle> {
    constructor(prop: ElementProperty, onClick?: (el: DrawingElement, me: MouseEvent) => void) {
        const dom = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        // Apply default prop
        prop = deepmerge(Circle.defaultProp(), prop);
        super(prop, propViews(LayoutSchema, StyleSchema), dom, onClick);
    }

    public update(): void {
        const rx = this.prop.layout.size.width / 2;
        const ry = this.prop.layout.size.height / 2;

        this.dom.setAttribute('cx', (this.prop.layout.position.x + rx).toString());
        this.dom.setAttribute('cy', (this.prop.layout.position.y + ry).toString());
        this.dom.setAttribute('rx', rx.toString());
        this.dom.setAttribute('ry', ry.toString());

        super.update();
    }

    public renderTo(svgElement: SVGElement): DrawingElement {
        svgElement.appendChild(this.dom);
        return this;
    }

    public static defaultProp() {
        return {
            layout: Layout.zero(),
            style: { ...FillStrokeStyle.default() }
        }
    }
}


@elementMeta({
    id: "rect",
    label: 'Rect',
    icon: `<svg height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                <rect width="14" height="14" stroke="black" stroke-width="2" fill="none" />
            </svg>`,
    creator: {
        create(prop: ElementProperty, onClick?: ElementOnClickCallback) { return new Rect(prop, onClick) }
    }
})
export class Rect extends BasicShape<Rect> {
    constructor(prop: ElementProperty, onClick?: (el: DrawingElement, me: MouseEvent) => void) {
        const dom = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        // Apply default prop
        prop = deepmerge(Rect.defaultProp(), prop);
        super(prop, propViews(LayoutSchema, StyleSchema), dom, onClick);
    }

    public update(): void {
        this.dom.setAttribute('x', this.prop.layout.position.x.toString());
        this.dom.setAttribute('y', this.prop.layout.position.y.toString());
        this.dom.setAttribute('width', this.prop.layout.size.width.toString());
        this.dom.setAttribute('height', this.prop.layout.size.height.toString());

        super.update();
    }

    public static defaultProp() {
        return {
            layout: Layout.zero(),
            style: { ...FillStrokeStyle.default() }
        }
    }
}

@elementMeta({
    id: "line",
    label: 'Line',
    icon: `<svg height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="0" x2="14" y2="14" stroke="black" stroke-width="1" />
              </svg>`,
    creator: {
        create(prop: ElementProperty, onClick?: ElementOnClickCallback) { return new Line(prop, onClick) }
    }
})
export class Line extends BasicShape<Line> {
    constructor(prop: ElementProperty, onClick?: (el: DrawingElement, me: MouseEvent) => void) {
        const dom = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        // Apply default prop
        prop = deepmerge(Line.defaultProp(), prop);
        super(prop, propViews(LayoutSchema, StyleSchema), dom, onClick);
    }

    public update(): void {
        this.dom.setAttribute('x1', this.prop.layout.position.x.toString());
        this.dom.setAttribute('y1', this.prop.layout.position.y.toString());
        this.dom.setAttribute('x2', (this.prop.layout.position.x + this.prop.layout.size.width).toString());
        this.dom.setAttribute('y2', (this.prop.layout.position.y + this.prop.layout.size.height).toString());
        super.update();
    }

    public static defaultProp() {
        return {
            layout: Layout.zero(),
            style: { ...FillStrokeStyle.default() },
        }
    }
}

//<?xml version="1.0" encoding="UTF-8"?><svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="36" height="36" rx="3" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M16 19V16H32V19" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 34H26" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 18L24 34" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
//Text
@elementMeta({
    id: "text",
    label: 'Text',
    icon: `<svg height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="14" font-size="14" fill="black">T</text>
            </svg>`,
    creator: {
        create(prop: ElementProperty, onClick?: ElementOnClickCallback) {
            return new Text(prop, onClick)
        }
    }
})
export class Text extends BasicShape<Text> {
    constructor(prop: ElementProperty, onClick?: (el: DrawingElement, me: MouseEvent) => void) {
        const dom = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        // Apply default prop
        prop = deepmerge(Text.defaultProp(), prop);
        super(prop, propViews(LayoutSchema, StyleSchema, TextContentView), dom, onClick);
        // Fixed attribute

        // BaseLine on top
        this.dom.setAttribute('dominant-baseline', 'hanging');
    }

    public update(): void {
        this.dom.setAttribute('x', this.prop.layout.position.x.toString());
        this.dom.setAttribute('y', this.prop.layout.position.y.toString());

        this.dom.setAttribute('font-size', this.prop.style!.fontSize!.toString());

        this.dom.innerHTML = "123";

        super.update();
    }

    public static defaultProp() {
        return {
            layout: Layout.zero(),
            style: {
                ...FillStrokeStyle.default(),
                fontSize: 14,
                fontFamily: 'Arial',
                content: {
                    text: ""
                }
            }
        }
    }
}