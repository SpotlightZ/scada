import { beforeAll, expect, test } from 'vitest'
import { Circle, DrawingElement } from '../src/core/element/Element'
import { Layout } from '../src/core/element/ElementProperty';

const dom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

const prop = {
    layout: Layout.of({ x: 0, y: 0, width: 10, height: 10 }),
    style: { fill: 'red', stroke: 'black', strokeWidth: 1 }
};

class TestElement extends DrawingElement {
    public update(): void {
        throw new Error('Method not implemented.');
    }
    constructor(prop: any, dom: any) {
        super(prop, {groups: []}, dom);
    }   
}

const element = new TestElement(prop, dom);

test("Element DOM", () => {
    expect(element.dom).toBeDefined();
});

test("Element Layout Prop", () => {
    expect(element.prop.layout).toBeDefined();
    expect(element.prop.layout.position.x).toBe(0);
    expect(element.prop.layout.position.y).toBe(0);
    expect(element.prop.layout.size.width).toBe(10);
    expect(element.prop.layout.size.height).toBe(10);
});

test("Element ", () => {

    expect(element.prop).toBe(prop);
    // expect(circle.propSchema).toBe(schemas(LayoutSchema, StyleSchema));
    expect(element.dom.tagName).toBe('ellipse');
    expect(element.selected).toBe(false);
    // expect(circle.reactive).toBe(prop);

    
    element.renderTo(dom);

    element.select();
    expect(element.selected).toBe(true);

    element.unselect();
    expect(element.selected).toBe(false);

    element.remove();
    expect(element.dom.parentNode).toBe(null);

});