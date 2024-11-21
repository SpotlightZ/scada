import { ELEMENTS_CONSTRUCTOR_MAP, ELEMENTS_META_MAP } from "../element/ElementMeta";
import { eventBus } from "../EventBus";
import { EVENT_EL_LIST_PANEL_ENTER_CURSOR_MODE, EVENT_EL_LIST_PANEL_SELECT_ITEM } from "./ElementListPanelEvent";
import { loadAllElements } from '../element/ElementLoader';

export class ElementListPanel {
    private loadingElements = false;
    constructor(onLoad?: () => void) {
        this.loadingElements = true;
        loadAllElements().then(() => {
            console.info("All elements loaded", ELEMENTS_CONSTRUCTOR_MAP); 
            this.loadingElements = false;
            onLoad?.();
        });
    }

    public selectElement(id: string) {
        if(!ELEMENTS_CONSTRUCTOR_MAP.has(id)) {
            throw new Error(`Element ${id} not found`);
        }
        eventBus.emit(EVENT_EL_LIST_PANEL_SELECT_ITEM, { creator: ELEMENTS_CONSTRUCTOR_MAP.get(id) });
    }

    public enterCursorMode() {
        eventBus.emit(EVENT_EL_LIST_PANEL_ENTER_CURSOR_MODE);
    }

    public getAllElementMeta() {
        if(this.loadingElements) {

        }
        return ELEMENTS_META_MAP;
    } 
}