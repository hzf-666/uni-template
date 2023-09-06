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
  minContent: {
    type: [String, Number],
    default: () => ('0%'),
  },
  maxContent: {
    type: [String, Number],
    default: () => ('70%'),
  },
  fixed: { /* 'ttb' | 'btt' 有效 */
    type: [Boolean],
    default: () => (true),
  },
  direction: {
    type: [String],
    default: () => ('btt'), /* 'rtl' | 'ltr' | 'ttb' | 'btt' */
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
  modelValue, top, bottom, minContent, maxContent, fixed, direction, duration, lockScroll, inline,
} = toRefs(props);

const emit = defineEmits(['update:modelValue']);

const bindClass = computed(() => setClass(myClass.value));
const bindStyle = computed(() => setStyle(myStyle.value));
const bindMaskClass = computed(() => setClass(maskClass.value));
const bindMaskStyle = computed(() => setStyle(maskStyle.value));
const bindContentClass = computed(() => setClass(contentClass.value));
const bindContentStyle = computed(() => setStyle(contentStyle.value));

const _minContent = computed(() => typeof minContent.value === 'number' ? rx(minContent.value) : minContent.value);
const _maxContent = computed(() => typeof maxContent.value === 'number' ? rx(maxContent.value) : maxContent.value);
const currentInstance = getCurrentInstance(), query = uni.createSelectorQuery().in(currentInstance);
const maskComputedStyle = ref({ top: 0, bottom: 0, right: 0, left: 0 }), contentComputedStyle = ref({}), transform = ref('none');
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
onMounted(() => {
  if (!fixed.value) {
    query.select('.my_drawer').boundingClientRect((data) => {
      if (!data) return;
      if (direction.value === 'ttb') maskComputedStyle.value.top = data.bottom + 'px';
      if (direction.value === 'btt') maskComputedStyle.value.bottom = `calc(100% - ${ data.top }px)`;
    }).exec();
  }
  switch (direction.value) {
    case 'rtl':
      contentComputedStyle.value = {
        'min-width': _minContent.value,
        'max-width': _maxContent.value,
        height: '100%',
        right: 0,
        transform: 'translateX(100%)',
      };
      break;
    case 'ltr':
      contentComputedStyle.value = {
        'min-width': _minContent.value,
        'max-width': _maxContent.value,
        height: '100%',
        left: 0,
        transform: 'translateX(-100%)',
      };
      break;
    case 'ttb':
      contentComputedStyle.value = {
        width: '100%',
        'min-height': _minContent.value,
        'max-height': lockScroll.value ? 'auto' : _maxContent.value,
        top: 0,
        transform: 'translateY(-100%)',
      };
      break;
    case 'btt':
      contentComputedStyle.value = {
        width: '100%',
        'min-height': _minContent.value,
        'max-height': lockScroll.value ? 'auto' : _maxContent.value,
        bottom: 0,
        transform: 'translateY(100%)',
      };
      break;
  }
  transform.value = contentComputedStyle.value.transform;
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
    visible.value = true;
    setTimeout(() => {
      contentComputedStyle.value.transform = 'none';
    }, 100);
  } else {
    contentComputedStyle.value.transform = transform.value;
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
  <div class="my_drawer" :class="bindClass" :style="{...bindStyle, display: inline ? 'inline-block' : 'block'}">
    <slot name="reference" :show="show" />

    <div
      v-if="visible"
      class="my_drawer_mask"
      :class="bindMaskClass"
      :style="{...bindMaskStyle, ...maskComputedStyle}"
      @click="hide()"
    >
      <div
        class="my_drawer_content"
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
.my_drawer {
  position: relative;

  .my_drawer_mask {
    position: fixed;
    z-index: $zIndexPopper;
    overflow: hidden;
    background-color: $maskColorBase;
  }

  .my_drawer_content {
    position: absolute;
    background-color: #fff;
    transition: transform v-bind(durationStr);
  }
}
</style>
