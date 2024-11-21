<script setup lang="ts">
/**
 * Mouse - Keyboard Event
 * transform to Element Event
 * and then publish Element Event
 */

import { ref, onMounted, onUnmounted } from 'vue';
import ResizeController from './ResizeController.vue';
import ToolBar from './ToolBar.vue';
import { Layout } from '../core/element/ElementProperty';
import { StandardElementCreator } from '../core/element/Element';
import { DrawingElement } from '../core/element/Element';
import { eventBus } from '../core/EventBus';
import { EVENT_EL_LIST_PANEL_ENTER_CURSOR_MODE, EVENT_EL_LIST_PANEL_SELECT_ITEM } from '../core/panel/ElementListPanelEvent';
import { Position } from '../core/util/Position';
import { DrawingBox } from '../core/drawing-box/DrawingBox';



const svgElement = ref<SVGElement | null>(null);
const controlBoxLayout = { x: 0, y: 0, width: 0, height: 0 };
const controlBox = ref<InstanceType<typeof ResizeController>>();

const drawingBox = new DrawingBox();

let currentElement: DrawingElement | null;
const selectedElements: DrawingElement[] = [];
let maxZIndex = 0;

const currentMode = ref<string>('cursor');

let currentElementCreator: StandardElementCreator | null;

const drawingBoxMouseMode = {
    startPos: Position.zero(),
    curPos: Position.zero(),
    mode: 'none' as 'none' | 'drag' | 'place',
}


const handleItemClick = (e: DrawingElement, me: MouseEvent) => {
    currentElement = e;
    // Directly in moving mode
    controlBox.value?.showMovingMode(e.prop, me);
    e.select();
    console.log('item clicked', e.prop.layout);
};



const drawElement = (layout: Layout) => {

    const element = currentElementCreator?.create({ layout: layout.clone(),  }, handleItemClick);
    if (element) {
        element.renderTo(svgElement.value!);
        currentElement = element;
        console.log(element)
        // Enter select mode, open prop panel
        element.select();
    }
}

/********************************************************** 
 Handle Element List Panel Event
 **********************************************************/

eventBus.on(EVENT_EL_LIST_PANEL_ENTER_CURSOR_MODE, () => {
    currentElementCreator = null;
    currentMode.value = 'drawing';
});

eventBus.on(EVENT_EL_LIST_PANEL_SELECT_ITEM, ({ creator }) => {
    currentElementCreator = creator;
    currentMode.value = 'drawing';

});

/********************************************************** 
 Drawing Box Event
 **********************************************************/

const handleDrawingBoxMouseDown = (e: MouseEvent) => {
    if (currentMode.value !== 'cursor') {
        drawingBoxMouseMode.startPos = Position.of({ x: e.clientX, y: e.clientY });
        drawingBoxMouseMode.mode = 'place';
    }

    if (e.target instanceof SVGElement) {
        controlBox.value?.close();
        currentElement?.unselect();
        currentElement = null;

    }
};

const handleDrawingBoxMouseMove = (e: MouseEvent) => {
    drawingBoxMouseMode.curPos.set({ x: e.clientX, y: e.clientY });
    if (drawingBoxMouseMode.mode === 'place') {
        // If the mouse is moved more than 5 pixels, it's drag mode
        // show the creating mode
        if (drawingBoxMouseMode.startPos.distanceTo(drawingBoxMouseMode.curPos) > 5) {
            drawingBoxMouseMode.mode = 'drag';

            const layout = Layout.of({ x: e.clientX, y: e.clientY, width: 0, height: 0 });
            drawElement(layout);
            // TODO 
            controlBox.value?.showCreatingMode({ layout }, e);
        }
    }
};

const handleDrawingBoxMouseUp = (e: MouseEvent) => {
    if (drawingBoxMouseMode.mode === 'place') {
        const layout = Layout.of({ x: e.clientX - 50, y: e.clientY - 50, width: 100, height: 100 });
        drawElement(layout);
        // TODO 
        controlBox.value?.showMovingMode({ layout }, e);
        drawingBoxMouseMode.mode = 'none';
        currentMode.value = 'cursor';
    }
};

/********************************************************** 
 Control Box Event
 **********************************************************/
const handleControlBoxUpdate = (layout: Layout) => {
    if (currentElement) {
        Object.assign(currentElement!.reactive.layout, layout);
    }
};

const handleControlBoxFinished = (layout: Layout) => {
    if (layout.size.width < 2 || layout.size.height < 2) {
        currentElement?.remove();
        controlBox.value?.close();
    }
    if (drawingBoxMouseMode.mode !== 'none') {
        currentMode.value = 'cursor';
    }
};


const SHORTCUTS_OPERATION: Record<string, () => void> = {
    'Escape': () => {
        if (!controlBox.value?.getVisible()) {
            currentMode.value = 'cursor';
        }
    },
    'Delete': () => {
        controlBox.value?.close();
        currentElement?.remove();
    },
    'Backspace': () => {
        controlBox.value?.close();
        currentElement?.remove();
    },

};

const registerShortcuts = () => {
    document.addEventListener('keydown', (e) => {
        SHORTCUTS_OPERATION[e.key]?.();
    });
};


onMounted(() => {
    registerShortcuts();

});

onUnmounted(() => {
    // document.removeEventListener('keydown');
    // TODO remove all event listeners
});
</script>

<template>
    <div class="relative h-screen w-full">
        <ResizeController ref="controlBox" :layout="controlBoxLayout" @update="handleControlBoxUpdate"
            @finished="handleControlBoxFinished"></ResizeController>
        <svg ref="svgElement" class="absolute inset-0" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
            @mousedown="handleDrawingBoxMouseDown" @mousemove="handleDrawingBoxMouseMove"
            @mouseup="handleDrawingBoxMouseUp">
        </svg>
        <ToolBar class="absolute bottom-2 ml-2"></ToolBar>
    </div>
</template>

<style scoped></style>
