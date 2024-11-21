<script setup lang="ts">
import { UnwrapNestedRefs, WatchStopHandle, reactive, watch } from 'vue';
import { eventBus } from '../core/EventBus';
import PropNumberInput from './PropNumberInput.vue';
import PropTextInput from './PropTextInput.vue';
import { DrawingElementPropsView, DrawingElementPropsViewGroupItem } from '../core/element/ElementPropsView';
import { EVENT_EL_SELECTED, EVENT_EL_UNSELECTED } from '../core/element/ElementEvent';
import jsonpath from 'jsonpath';
import deepcopy from 'deepcopy';
import { DrawingElement } from '../core/element/Element';

type DrawingElementPropsModalItem = DrawingElementPropsViewGroupItem & {
    data: string | boolean | number
};
type DrawingElementPropsModal = DrawingElementPropsView & {
    groups: {
        items: DrawingElementPropsModalItem[]
    }[]
};

const emit = defineEmits(["update"]);

const propViewModal = reactive<DrawingElementPropsModal>({ groups: [] });
let binnedProp: object | undefined;

let propWatcher: WatchStopHandle;

const bindPropWithView = (obj: object, view: DrawingElementPropsView) => {
    binnedProp = obj;
    console.log(obj)
    const viewClone = deepcopy(view);
    viewClone.groups.forEach((group) => {
        group.items.forEach((item) => {
            Object.assign(item, { data: jsonpath.value(obj, item.propPath) });
        });
    });
    Object.assign(propViewModal, viewClone);
}

const unbindProp = () => {
    Object.assign(propViewModal, { groups: [] });
}

const handleKeydown = (e: KeyboardEvent) => {
    e.stopPropagation();
}

const handleKeyPress = (e: KeyboardEvent) => {
    e.stopPropagation();
}

const updateProp = (item: DrawingElementPropsModalItem) => {
    console.log("updateProp", item)
    if (!binnedProp) {
        return;
    }
    jsonpath.apply(binnedProp, item.propPath, () => item.data);
    emit('update');
}

const onPropChange = (el: UnwrapNestedRefs<DrawingElement>) => {
    propViewModal.groups.forEach((group) => {
        group.items.forEach((item) => {
            (item as any).data = jsonpath.value(el.prop, item.propPath)
        });
    });
}

const TYPE_COMPONENT_MAPPING: Record<DrawingElementPropsViewGroupItem["type"], any> = {
    "number": PropNumberInput,
    "boolean": "",
    "color": "",
    "select": "",
    "text": PropTextInput,
    "json": "",
};
/************************************
 * Event listeners
 ***********************************/

eventBus.on(EVENT_EL_SELECTED, ({ el }) => {
    bindPropWithView(el.reactive, el.propSchema);
    //setup prop watcher
    propWatcher = watch(el.reactive, () => onPropChange(el), { deep: true });
    console.log(el);
});

eventBus.on(EVENT_EL_UNSELECTED, () => {
    unbindProp();
    propWatcher?.();
});


</script>

<template>
    <div class="shadow-lg z-[910000] bg-white" @keydown="handleKeydown" @keypress="handleKeyPress">
        <div class="m-4" v-if="propViewModal" v-for="group in propViewModal.groups">
            <div class="text-xs text-gray-700">{{ group.label }}</div>
            <div class="block container columns-2 mt-2">
                <component class="mb-2 gap-x-10" v-for="item in group.items" :key="item.propPath"
                    :is="TYPE_COMPONENT_MAPPING[item.type]" @finish="updateProp(item)" v-model="item.data"><span v-html="item.label"></span></component>
            </div>
        </div>

    </div>
</template>


<style scoped></style>
