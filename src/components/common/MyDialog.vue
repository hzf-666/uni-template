<script setup>
const props = defineProps({
  myClass: {
    type: [String, Object, Array],
    default: () => ([]),
  },
  myStyle: {
    type: [String, Object],
    default: () => ({}),
  },
  maskClass: {
    type: [String, Object, Array],
    default: () => ([]),
  },
  maskStyle: {
    type: [String, Object],
    default: () => ({}),
  },
  contentClass: {
    type: [String, Object, Array],
    default: () => ([]),
  },
  contentStyle: {
    type: [String, Object],
    default: () => ({}),
  },
  modelValue: {
    type: [Boolean],
    default: () => (false),
  },
  top: {
    type: [String, Number],
    default: () => (null),
  },
  bottom: {
    type: [String, Number],
    default: () => (null),
  },
  contentWidth: {
    type: [String, Number],
    default: () => ('80%'),
  },
  contentTop: {
    type: [String, Number],
    default: () => ('15vh'),
  },
  duration: {
    type: [Number],
    default: () => (300),
  },
  lockScroll: {
    type: [Boolean],
    default: () => (false),
  },
  inline: {
    type: [Boolean],
    default: () => (false),
  },
});
const {
  myClass, myStyle, contentClass, contentStyle, maskClass, maskStyle,
  modelValue, top, bottom, contentWidth, contentTop, duration, lockScroll, inline,
} = toRefs(props);

const emit = defineEmits(['update:modelValue']);

const bindClass = computed(() => setClass(myClass.value));
const bindStyle = computed(() => setStyle(myStyle.value));
const bindMaskClass = computed(() => setClass(maskClass.value));
const bindMaskStyle = computed(() => setStyle(maskStyle.value));
const bindContentClass = computed(() => setClass(contentClass.value));
const bindContentStyle = computed(() => setStyle(contentStyle.value));

const _contentWidth = computed(() => typeof contentWidth.value === 'number' ? rx(contentWidth.value) : contentWidth.value);
const _contentTop = computed(() => typeof contentTop.value === 'number' ? rx(contentTop.value) : contentTop.value);
const maskComputedStyle = ref({ top: 0, bottom: 0, right: 0, left: 0 }), contentComputedStyle = ref({});
watch(top, (newVal) => {
  if (newVal && !maskComputedStyle.value.top) maskComputedStyle.value.top = typeof newVal === 'number' ? rx(newVal) : newVal;
}, {
  immediate: true,
});
watch(bottom, (newVal) => {
  if (newVal && !maskComputedStyle.value.bottom) maskComputedStyle.value.bottom = typeof newVal === 'number' ? rx(newVal) : newVal;
}, {
  immediate: true,
});

function show() {
  _modelValue.value = true;
}
function hide() {
  _modelValue.value = false;
}

const _modelValue = ref(modelValue.value), visible = ref(modelValue.value);
const durationStr = computed(() => `${ duration.value }ms`);
watch(_modelValue, (newVal) => {
  emit('update:modelValue', newVal);
  if (newVal) {
    contentComputedStyle.value.opacity = 0;
    visible.value = true;
    setTimeout(() => {
      contentComputedStyle.value.opacity = 1;
    }, 100);
  } else {
    contentComputedStyle.value.opacity = 0;
    setTimeout(() => {
      visible.value = false;
    }, duration.value);
  }
});
watch(modelValue, (newVal) => {
  _modelValue.value = newVal;
});
</script>

<template>
  <div class="my_dialog" :class="bindClass" :style="{...bindStyle, display: inline ? 'inline-block' : 'block'}">
    <slot name="reference" :show="show" />

    <div
      v-if="visible"
      class="my_dialog_mask"
      :class="[{is_lock: lockScroll}, ...bindMaskClass]"
      :style="{...bindMaskStyle, ...maskComputedStyle}"
      @click="hide()"
    >
      <div
        class="my_dialog_content"
        :class="bindContentClass"
        :style="{
          ...bindContentStyle,
          ...contentComputedStyle,
          overflow: lockScroll ? 'hidden' : 'auto',
        }"
        @click.stop=""
      >
        <slot />
        <slot name="content" :hide="hide" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my_dialog {
  .my_dialog_mask {
    position: fixed;
    z-index: $zIndexPopper;
    overflow: hidden;
    background-color: $maskColorBase;

    &.is_lock {
      overflow: auto;

      &::before,
      &::after {
        display: block;
        height: v-bind(_contentTop);
        content: "";
      }
    }

    &:not(.is_lock) .my_dialog_content {
      position: absolute;
      top: v-bind(_contentTop);
      left: 50%;
      max-height: calc(100% - (v-bind(_contentTop) * 2));
      transform: translateX(-50%);
    }
  }

  .my_dialog_content {
    width: v-bind(_contentWidth);
    margin: auto;
    background-color: #fff;
    transition: opacity v-bind(durationStr);
  }
}
</style>
