<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { ElementProperty, Layout } from '../core/element/ElementProperty';
import { calculatePointOnCircle } from '../core/MathUtil';
import { Position } from '../core/util/Position';

const MIN_W_H = 10;

const emit = defineEmits(["update", "finished"]);

const visible = ref(false);
const lineMode = ref(false);
const layout = reactive<Layout>(Layout.of({ x: 10, y: 10, width: 100, height: 100, rotation: 0 }));

const originMousePosition: Position = Position.of({ x: 0, y: 0 });
const originLayout: Layout = Layout.of({ x: 0, y: 0, width: 0, height: 0, rotation: 0 });

let resizing = false;

let mouseMoveHandler: (e: MouseEvent) => void;

defineExpose({
    show(prop: ElementProperty) {
        Object.assign(layout, prop.layout);
        visible.value = true;
    },
    showMovingMode(prop: ElementProperty, mouseEvent: MouseEvent) {
        Object.assign(layout, prop.layout);
        onMouseDown(mouseEvent, handleMove);
        visible.value = true;
    },
    showCreatingMode(prop: ElementProperty, mouseEvent: MouseEvent, lineMode: boolean = false) {
        Object.assign(layout, prop.layout);
        lineMode = lineMode;
        onMouseDown(mouseEvent, handleBottomRightResize);
        visible.value = true;
    },
    close() {
        visible.value = false;
    },
    getVisible() {
        return visible.value;
    },
});


const handleLeftResize = (e: MouseEvent) => {
    const xDiff = e.clientX - originMousePosition.x;
    const width = originLayout.size.width - xDiff;
    if (width < MIN_W_H) {
        return;
    }
    layout.position.x = originLayout.position.x + xDiff;
    layout.size.width = width;
};

const handleRightResize = (e: MouseEvent) => {
    const xDiff = e.clientX - originMousePosition.x;
    const width = originLayout.size.width + xDiff;
    if (width < MIN_W_H) {
        return;
    }
    layout.size.width = originLayout.size.width + xDiff;
};

const handleTopResize = (e: MouseEvent) => {
    const yDiff = e.clientY - originMousePosition.y;
    const height = originLayout.size.height - yDiff;
    if (height < MIN_W_H) {
        return;
    }
    layout.position.y = originLayout.position.y + yDiff;
    layout.size.height = height;
};

const handleBottomResize = (e: MouseEvent) => {
    const yDiff = e.clientY - originMousePosition.y;
    const height = originLayout.size.height + yDiff;
    if (height < MIN_W_H) {
        return;
    }
    layout.size.height = height;
};

const handleBottomRightResize = (e: MouseEvent) => {
    handleRightResize(e);
    handleBottomResize(e);
};

const handleTopRightResize = (e: MouseEvent) => {
    handleRightResize(e);
    handleTopResize(e);
};

const handleBottomLeftResize = (e: MouseEvent) => {
    handleLeftResize(e);
    handleBottomResize(e);
};

const handleTopLeftResize = (e: MouseEvent) => {
    handleLeftResize(e);
    handleTopResize(e);
};

const handleRotate = (e: MouseEvent) => {
    const originCenterX = originLayout.position.x + originLayout.size.width / 2;
    const originCenterY = originLayout.position.y + originLayout.size.height / 2;
    const originAngle = Math.atan2(originMousePosition.y - originCenterY, originMousePosition.x - originCenterX) * 180 / Math.PI;
    const mouseAngle = Math.atan2(e.clientY - originCenterY, e.clientX - originCenterX) * 180 / Math.PI;

    const fixedAngle = Math.atan2(originLayout.size.height, originLayout.size.width) * 180 / Math.PI + 90;
    
    layout.rotation = originLayout.rotation + (mouseAngle - originAngle);
    const r = Math.pow(Math.pow(originLayout.size.width, 2) + Math.pow(originLayout.size.height, 2), 0.5) / 2;
    
    const newCenterPoint = calculatePointOnCircle(originLayout.position.x, originLayout.position.y, r, layout.rotation + fixedAngle);
    
    layout.position.x = originLayout.position.x - (newCenterPoint.x - originCenterX);
    layout.position.y = originLayout.position.y - (newCenterPoint.y - originCenterY);
};

const handleMove = (e: MouseEvent) => {
    const xDiff = e.clientX - originMousePosition.x;
    const yDiff = e.clientY - originMousePosition.y;
    layout.position.x = originLayout.position.x + xDiff;
    layout.position.y = originLayout.position.y + yDiff;
};

const onMouseDown = (e: MouseEvent, handler: (e: MouseEvent) => void) => {
    originMousePosition.x = e.clientX;
    originMousePosition.y = e.clientY;

    originLayout.position.set(layout.position);
    originLayout.size.set(layout.size);

    mouseMoveHandler = handler;

    resizing = true;
    e.stopImmediatePropagation();
};

const handleKeyPress = (e: KeyboardEvent) => {
    console.log('key press', e.key);
    if (e.key === 'Escape') {
        visible.value = false;
        resizing = false;
    }
};

const onMouseMove = (e: MouseEvent) => {
    if (!resizing) return;
    mouseMoveHandler(e);
    emit('update', layout);
};

const onMouseUp = () => {
    resizing = false;
    emit('finished', layout);
};

watch(layout, (newVal) => {
    emit('update', newVal);
});


onMounted(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keydown', handleKeyPress);
});

</script>

<template>
    <div v-if="visible" class="control absolute cursor-move z-[900000] select-none"
        :style="{ left: layout.position.x + 'px', top: layout.position.y + 'px', width: layout.size.width + 'px', height: layout.size.height + 'px', transform: `rotate(${layout.rotation}deg)`, 'transform-origin': 'top left' }"
        @mousedown="e => onMouseDown(e, handleMove)">
        <div class="-top-1.5 left-1.5 right-1.5 h-3 cursor-ns-resize absolute z-[900001]"
            @mousedown="e => onMouseDown(e, handleTopResize)"></div>
        <div class="-bottom-1.5 left-1.5 right-1.5 h-3 cursor-ns-resize absolute z-[900001]"
            @mousedown="e => onMouseDown(e, handleBottomResize)"></div>

        <div class="-left-1.5 top-1.5 bottom-1.5 w-3 cursor-ew-resize absolute z-[900001]"
            @mousedown="e => onMouseDown(e, handleLeftResize)"></div>
        <div class="-right-1.5 top-1.5 bottom-1.5 w-3 cursor-ew-resize absolute z-[900001]"
            @mousedown="e => onMouseDown(e, handleRightResize)"></div>

        <div class="-top-1.5 -left-1.5 w-3 h-3 cursor-nwse-resize absolute rounded-full z-[900002]"
            @mousedown="e => onMouseDown(e, handleTopLeftResize)"></div>
        <div class="-top-1.5 -right-1.5 w-3 h-3 cursor-nesw-resize absolute rounded-full z-[900002]"
            @mousedown="e => onMouseDown(e, handleTopRightResize)"></div>
        <div class="-bottom-1.5 -right-1.5 w-3 h-3 cursor-nwse-resize absolute rounded-full z-[900002]"
            @mousedown="e => onMouseDown(e, handleBottomRightResize)"></div>
        <div class="-bottom-1.5 -left-1.5 w-3 h-3 cursor-nesw-resize absolute rounded-full z-[900002]"
            @mousedown="e => onMouseDown(e, handleBottomLeftResize)"></div>

        <div class="-top-3 -left-3 w-5 h-5 cursor-rotate absolute rounded-full z-[900000]"
            @mousedown="e => onMouseDown(e, handleRotate)"></div>
        <div class="-top-3 -right-3 w-5 h-5 cursor-rotate absolute rounded-full z-[900000]"
            @mousedown="e => onMouseDown(e, handleRotate)"></div>
        <div class="-bottom-3 -right-3 w-5 h-5 cursor-rotate absolute rounded-full z-[900000]"
            @mousedown="e => onMouseDown(e, handleRotate)"></div>
        <div class="-bottom-3 -left-3 w-5 h-5 cursor-rotate absolute rounded-full z-[900000]"
            @mousedown="e => onMouseDown(e, handleRotate)"></div>



        <div class="handle -top-[0.1875rem] -left-[0.1875rem]"></div>
        <div class="handle -top-[0.1875rem] -right-[0.1875rem]"></div>
        <div class="handle -bottom-[0.1875rem] -left-[0.1875rem]"></div>
        <div class="handle -bottom-[0.1875rem] -right-[0.1875rem]"></div>

        <div class="absolute -bottom-6 left-0 right-0 text-[10px] text-white text-center">
            <span class="bg-blue-500 rounded px-1 py-0.5 whitespace-nowrap">W {{ layout.size.width }} H {{
                layout.size.height }}</span>
        </div>
    </div>
</template>

<style scoped>
.control {
    border: solid 1px #3f8ae2;
}

.handle {
    background-color: white;
    border: solid 1px #3f8ae2;
    @apply w-1.5 h-1.5 absolute z-[900001];
}

.cursor-top-down {
    cursor: url('data:image/svg+xml;utf8,<svg width="14" height="14" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 11.9876L23.9938 4L32 12" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 36.0124L24.0061 44L16 36" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 4V44" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'), 14 14, auto;
}

.cursor-rotate {
    cursor: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgMzNDMTAgMjUuNzAxMSAxNC4xMDMgMTkuNDE2OCAyMCAxNi41OTE5QzIyLjEzNDcgMTUuNTY5MyAyNC41MDQ2IDE1IDI3IDE1QzM2LjM4ODggMTUgNDQgMjMuMDU4OSA0NCAzMyIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xOCAyOEwxMCAzM0w0IDI1IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+'), auto;
}
</style>