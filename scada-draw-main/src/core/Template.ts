import { Layout, Style } from "./element/ElementProperty";

export interface TemplateDefinition {
    name: string;
    uuid: string;
    nodes: TemplateNode[];
}

export interface TemplateNode {
    type: string;
    id: string;
    layout: Layout;
    style: Style;
}


