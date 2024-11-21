import { DrawingBoxStatus } from "./DrawingBox";

export const EVENT_DRAWING_BOX_STATE_CHANGE = 'drawing-box-state-change';


export type EventTypes = typeof EVENT_DRAWING_BOX_STATE_CHANGE;


/**
 * Extends the `mitt` module to include custom event types
 */
declare module 'mitt' {

    // 扩展 Mitt 类型定义，添加 on 方法的泛型参数
    export interface Emitter<Events extends Record<EventType, unknown>> {
        on(type: EventTypes, handler: (currentState: DrawingBoxStatus) => void): void;
        emit(type: EventTypes, currentState: DrawingBoxStatus): void;
    }
}


