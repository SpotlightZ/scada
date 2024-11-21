import { UnwrapNestedRefs } from "vue";
import { DrawingElement } from "./Element";

export const EVENT_EL_SELECTED = 'el-selected';
export const EVENT_EL_UNSELECTED = 'el-unselected';
export const EVENT_EL_RESIZE_START = 'el-resize-start';
export const EVENT_EL_RESIZE = 'el-resize';
export const EVENT_EL_RESIZE_END = 'el-resize-end';
export const EVENT_EL_MOVE_START = 'el-move-start';
export const EVENT_EL_MOVE = 'el-move';
export const EVENT_EL_MOVE_END = 'el-move-end';

export type DrawingElementEventTypes = typeof EVENT_EL_SELECTED
    | typeof EVENT_EL_UNSELECTED
    | typeof EVENT_EL_RESIZE_START
    | typeof EVENT_EL_RESIZE
    | typeof EVENT_EL_RESIZE_END
    | typeof EVENT_EL_MOVE_START
    | typeof EVENT_EL_MOVE
    | typeof EVENT_EL_MOVE_END;

export interface ElementEvent {
    el: UnwrapNestedRefs<DrawingElement>;
};

/**
 * Extends the `mitt` module to include custom event types
 */
declare module 'mitt' {

    // 扩展 Mitt 类型定义，添加 on 方法的泛型参数
    export interface Emitter<Events extends Record<EventType, unknown>> {
        on(type: DrawingElementEventTypes, handler: (event: ElementEvent) => void): void;
    }
}


