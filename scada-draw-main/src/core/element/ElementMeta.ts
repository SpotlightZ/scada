import { StandardElementCreator } from './Element';
export interface ElementIconResource {
    icon: string;
    label: string;
}

export interface ElementIdentity {
    id: string;
}

export interface ElementBuilder {
    creator: StandardElementCreator;
}

export type ElementMeta = ElementIconResource & ElementIdentity & ElementBuilder;

export function elementMeta(meta: ElementMeta) {
    return function(constructor: Function) {
        constructor.prototype.icon = meta.icon;
        constructor.prototype.label = meta.label;
        constructor.prototype.id = meta.id;
        constructor.prototype.creator = meta.creator;
        // 
        ELEMENTS_CONSTRUCTOR_MAP.set(meta.id, meta.creator);
        ELEMENTS_META_MAP.set(meta.id, meta);
    }
}

export const ELEMENTS_CONSTRUCTOR_MAP = new Map<string, StandardElementCreator>();
export const ELEMENTS_META_MAP = new Map<string, ElementMeta>();