import { eventBus } from "../EventBus";
import { EVENT_DRAWING_BOX_STATE_CHANGE } from "./DrawingBoxEvent";
import { StandardElementCreator } from '../element/Element';

export class DrawingBox {
    public stateMachine: DrawingBoxStateMachine = new DrawingBoxStateMachine();
    private currentCreator: StandardElementCreator;
    public loadCreator(creator: StandardElementCreator) {
        this.currentCreator = creator;
        this.stateMachine.load();
    }
}

export enum DrawingBoxStatus {
    IDLE,
    READY_TO_DRAW,
    DRAWING
}

export class DrawingBoxStateMachine {
    public state: DrawingBoxStatus = DrawingBoxStatus.IDLE;
    public load() {
        this.state = DrawingBoxStatus.READY_TO_DRAW;
        eventBus.emit(EVENT_DRAWING_BOX_STATE_CHANGE, this.state);
    }
    public draw() {
        this.state = DrawingBoxStatus.DRAWING;
        eventBus.emit(EVENT_DRAWING_BOX_STATE_CHANGE, this.state);
    }
    public drawComplete() {
        this.state = DrawingBoxStatus.IDLE;
        eventBus.emit(EVENT_DRAWING_BOX_STATE_CHANGE, this.state);
    }
}