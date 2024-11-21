<script setup lang="ts">
const model = defineModel<string>({
    type: String,
    default: "",
});

const emit = defineEmits(["finish"]);

const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
        case "Enter":
            emit("finish");
            break;
    }
    e.stopPropagation();
}
</script>

<template>
    <div class="inline-block h-6 w-full text-xs text-current font-light shadow-sm items-center bg-gray-100">
        <div class="flex h-full">
            <div class="flex items-center justify-center w-6 text-gray-800  h-full">
                <slot></slot>
            </div>

            <input type="text" class="px-1.5 outline-none flex-1 min-w-0 h-full" v-model="model"
                @keydown="handleKeyDown" />
        </div>
    </div>
</template>


<style scoped></style>
