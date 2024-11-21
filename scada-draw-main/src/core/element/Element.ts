import { UnwrapNestedRefs, WatchStopHandle, reactive, watch } from 'vue';
import { eventBus } from '../EventBus';
import { EVENT_EL_SELECTED, EVENT_EL_UNSELECTED } from './ElementEvent';
import { ElementProperty, } from './ElementProperty';
import { DrawingElementPropsView } from './ElementPropsView';
import { nanoid } from 'nanoid';

export type ElementOnClickCallback = (el: DrawingElement, me: MouseEvent) => void;

export interface StandardElementCreator<T = DrawingElement> {
    create(prop: ElementProperty, onClick?: ElementOnClickCallback): T;
}

export abstract class DrawingElement<T extends DrawingElement<T> = DefaultElement, P extends ElementProperty = ElementProperty> {
    public id: string;
    public readonly prop: P;
    public readonly propSchema: DrawingElementPropsView;
    public readonly dom: SVGElement;
    public readonly guid: string;

    public selected: boolean = false;

    private reactiveProp: UnwrapNestedRefs<typeof this.prop>;
    private reactivePropWatchStopHandle: WatchStopHandle;

    constructor(prop: P, propSchema: DrawingElementPropsView, dom: SVGElement, onClick?: ElementOnClickCallback) {
        this.prop = prop;
        this.propSchema = propSchema;
        this.dom = dom;
        // Used to watch prop changes
        this.reactiveProp = reactive(prop);
        // Watch prop changes, and update the element
        // Note: remember to stop the watch when the element is removed
        this.reactivePropWatchStopHandle = watch(this.reactiveProp, this.handlePropChange.bind(this), { deep: true });

        this.dom.addEventListener("mousedown", (e: MouseEvent) => { e.stopImmediatePropagation(); onClick && onClick(this, e); });
        this.update();

        // Generate a unique id for the element
        this.guid = nanoid();
        this.id = this.guid;
    }

    public renderTo(svgElement: SVGElement): DrawingElement<T> {
        svgElement.appendChild(this.dom);
        return this;
    }

    public remove() {
        this.reactivePropWatchStopHandle();
        this.dom.remove();
    }


    public abstract update(): void;

    public select(): void {
        this.selected = true;
        eventBus.emit(EVENT_EL_SELECTED, { el: this });
        this.update();
        console.log("DrawingElement.select", this);
    }

    public unselect(): void {
        this.selected = false;
        eventBus.emit(EVENT_EL_UNSELECTED, { el: this });
        this.update();
        console.log("DrawingElement.unselect", this);
    }

    public get reactive(): UnwrapNestedRefs<typeof this.prop> {
        return this.reactiveProp;
    }

    private handlePropChange() {
        // TODO handle rotation change xy
        this.update();
    }
}

export abstract class ForeignDrawingElement<T extends DrawingElement<T> = DefaultElement> extends DrawingElement<T> {
    public readonly innerDiv: HTMLDivElement;
    constructor(prop: ElementProperty, propSchema: DrawingElementPropsView, onClick?: ElementOnClickCallback) {
        const svgDom = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        const innerDiv = document.createElement("div");
        innerDiv.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

        innerDiv.style.display = "inner-block";
        innerDiv.style.width = "100%";
        innerDiv.style.height = "100%";

        svgDom.appendChild(innerDiv);
        super(prop, propSchema, svgDom, onClick);
        this.innerDiv = innerDiv;
    }
}

export abstract class SGVDrawingElement<T extends DrawingElement<T> = DefaultElement> extends DrawingElement<T> {


}

// Just for type checking
interface DefaultElement extends DrawingElement<DefaultElement> { }


export interface DrawingElementTree {
    root: DrawingElementTreeNode[];
}

export interface DrawingElementTreeNode {
    guid: string;
    el: DrawingElement;
    children: Map<string, DrawingElementTreeNode>;
}

export class DrawingElementTree {
    public static new() {
        return {
            root: []
        }
    }
    private constructor() {
        this.root = [];
    }
    public appendChild(node: DrawingElementTreeNode) {
        this.root.push(node);
    }
}

export class DrawingElementTreeNode {
    public guid: string;
    public el: DrawingElement;
    public children: Map<string, DrawingElementTreeNode>;

    constructor(guid: string, el: DrawingElement, children: Map<string, DrawingElementTreeNode>) {
        this.guid = guid;
        this.el = el;
        this.children = children;
    }

    public static appendChild(child: DrawingElementTreeNode) {

    }
}