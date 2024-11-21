import { DrawingElement } from "../core/element/Element";
import { elementMeta } from "../core/element/ElementMeta";
import { ElementProperty } from "../core/element/ElementProperty";
import { LayoutSchema, StyleSchema, propViews } from "../core/element/ElementPropsView";


@elementMeta({
    id: "input",
    icon: `<svg viewBox="0 0 1024 1024" width="14" height="14"><path d="M341.333333 213.333333h128v597.333334H341.333333v85.333333h341.333334v-85.333333h-128V213.333333h128V128H341.333333v85.333333zM85.333333 298.666667a42.666667 42.666667 0 0 0-42.666666 42.666666v341.333334a42.666667 42.666667 0 0 0 42.666666 42.666666h256v-85.333333H128V384h213.333333V298.666667H85.333333z m597.333334 85.333333h213.333333v256h-213.333333v85.333333h256a42.666667 42.666667 0 0 0 42.666666-42.666666V341.333333a42.666667 42.666667 0 0 0-42.666666-42.666666h-256v85.333333z" fill="#000000"></path></svg>`,
    label: 'Input',
    creator: {
        create(prop: ElementProperty) { return new Input(prop) }
    }
})
export class Input extends DrawingElement {
    constructor(prop: ElementProperty, onClick?: (el: DrawingElement, me: MouseEvent) => void) {
        const dom = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        super(prop, propViews(LayoutSchema, StyleSchema), dom, onClick);
    }

    public update(): void {
        this.dom.setAttribute('x1', this.prop.layout.position.x.toString());
        this.dom.setAttribute('y1', this.prop.layout.position.y.toString());
        this.dom.setAttribute('x2', (this.prop.layout.position.x + this.prop.layout.size.width).toString());
        this.dom.setAttribute('y2', (this.prop.layout.position.y + this.prop.layout.size.height).toString());
        this.dom.setAttribute('stroke', this.prop?.style?.stroke || 'none');
        // this.lineSvg.setAttribute('transform', `rotate(${this.rotate}`);
    }
}