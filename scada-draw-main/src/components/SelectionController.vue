<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { Position, Layout } from '../core/element/ElementProperty';

const emit = defineEmits(["update", "finished"]);

const visible = ref(false);
const layout = reactive<Layout>(Layout.of({ x: 10, y: 10, width: 100, height: 100 }));

const originMousePosition: Position = Position.of({ x: 0, y: 0 });
const originLayout: Layout = Layout.of({ x: 0, y: 0, width: 0, height: 0 });

let resizing = false;

defineExpose({
    show(propLayout: Layout) {
        Object.assign(layout, propLayout);
        visible.value = true;
    },
    close() {
        visible.value = false;
    },
    getVisible() {
        return visible.value;
    },
});

let mouseMoveHandler: (e: MouseEvent) => void;


const handleLeftResize = (e: MouseEvent) => {
    const xDiff = e.clientX - originMousePosition.x;
    const width = originLayout.size.width - xDiff;
    if (width < 10) {
        return;
    }
    layout.position.x = originLayout.position.x + xDiff;
    layout.size.width = width;
};

const handleRightResize = (e: MouseEvent) => {
    const xDiff = e.clientX - originMousePosition.x;
    const width = originLayout.size.width + xDiff;
    if (width < 10) {
        return;
    }
    layout.size.width = originLayout.size.width + xDiff;
};

const handleTopResize = (e: MouseEvent) => {
    const yDiff = e.clientY - originMousePosition.y;
    const height = originLayout.size.height - yDiff;
    if (height < 10) {
        return;
    }
    layout.position.y = originLayout.position.y + yDiff;
    layout.size.height = height;
};

const handleBottomResize = (e: MouseEvent) => {
    const yDiff = e.clientY - originMousePosition.y;
    const height = originLayout.size.height + yDiff;
    if (height < 10) {
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

onMounted(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keydown', handleKeyPress);
});

</script>

<template>
    <div v-if="visible" class="absolute cursor-move z-[900000]"
        :style="{ left: layout.position.x + 'px', top: layout.position.y + 'px', width: layout.size.width + 'px', height: layout.size.height + 'px' }"
        @mousedown="e => onMouseDown(e, handleMove)">
    </div>
</template>

<style scoped>

</style>