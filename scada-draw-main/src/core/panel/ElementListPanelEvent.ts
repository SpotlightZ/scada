import { StandardElementCreator } from "../element/Element";

export const EVENT_EL_LIST_PANEL_SELECT_ITEM = 'el-list-panel-select-item';
export const EVENT_EL_LIST_PANEL_ENTER_CURSOR_MODE = 'el-list-panel-enter-cursor-mode';


export type ElementListPanelEventTypes = typeof EVENT_EL_LIST_PANEL_SELECT_ITEM;

export interface ElementListPanelEvent {
    creator: StandardElementCreator;
};

/**
 * Extends the `mitt` module to include custom event types
 */
declare module 'mitt' {

    // 扩展 Mitt 类型定义，添加 on 方法的泛型参数
    export interface Emitter<Events extends Record<EventType, unknown>> {
        on(type: ElementListPanelEventTypes, handler: (event: ElementListPanelEvent) => void): void;
        on(type: typeof EVENT_EL_LIST_PANEL_ENTER_CURSOR_MODE, handler: () => void): void;

        emit(type: ElementListPanelEventTypes, event: ElementListPanelEvent): void;
        emit(type: typeof EVENT_EL_LIST_PANEL_ENTER_CURSOR_MODE): void;
    }
}


