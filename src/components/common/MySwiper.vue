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
  itemClass: {
    type: [String, Object, Array],
    default: () => ([]),
  },
  itemStyle: {
    type: [String, Object],
    default: () => ({}),
  },
  modelValue: {
    type: [Array],
    default: () => ([]),
  },
  height: {
    type: [String, Number],
    default: () => (200),
  },
  current: {
    type: [Number],
    default: () => (0),
  },
  interval: {
    type: [Number],
    default: () => (2000),
  },
  duration: {
    type: [Number],
    default: () => (500),
  },
  autoplay: {
    type: [Boolean],
    default: () => (true),
  },
  circular: {
    type: [Boolean],
    default: () => (true),
  },
  indicatorDots: {
    type: [Boolean],
    default: () => (false),
  },
  indicatorColor: {
    type: [String],
    default: () => ('rgba(0, 0, 0, .3)'),
  },
  indicatorActiveColor: {
    type: [String],
    default: () => ('#000000'),
  },
  indicatorStyle: {
    type: [String, Object],
    default: () => (null),
  },
});
const {
  myClass, myStyle, itemClass, itemStyle, modelValue, height, current, interval, duration, autoplay, circular,
  indicatorDots, indicatorColor, indicatorActiveColor, indicatorStyle,
} = toRefs(props);

const emit = defineEmits(['update:modelValue', 'change']);

const bindClass = computed(() => setClass(myClass.value));
const bindStyle = computed(() => setStyle(myStyle.value));
const bindItemClass = computed(() => setClass(itemClass.value));
const bindItemStyle = computed(() => setStyle(itemStyle.value));
const bindIndicatorStyle = computed(() => {
  return indicatorStyle.value ? setStyle(indicatorStyle.value) : {
    bottom: rx(25),
    left: '50%',
    transform: 'translateX(-50%)',
  };
});

const _height = computed(() => typeof height.value === 'number' ? rx(height.value) : height.value);

const currentIndex = ref(current.value);
function onChange(e) {
  currentIndex.value = e.detail.current;
  emit('change', e);
}

const list = ref(modelValue.value);
watch(list, (newVal) => {
  emit('update:modelValue', newVal);
});
watch(modelValue, (newVal) => {
  list.value = newVal;
});
</script>

<template>
  <div class="my_swiper" :class="bindClass" :style="bindStyle">
    <swiper
      class="my_swiper_wrapper"
      :current="current"
      :interval="interval"
      :duration="duration"
      :autoplay="autoplay"
      :circular="circular"
      :indicator-dots="indicatorDots"
      :indicator-color="indicatorColor"
      :indicator-active-color="indicatorActiveColor"
      @change="onChange"
    >
      <swiper-item
        v-for="(item, i) in list"
        :key="i"
        class="my_swiper_item"
        :class="bindItemClass"
        :style="bindItemStyle"
      >
        <slot name="item" :item="item" :index="i" />
      </swiper-item>
    </swiper>

    <div v-if="!indicatorDots" class="my_swiper_indicator" :style="bindIndicatorStyle">
      <slot name="indicator" :current="currentIndex" :total="list.length" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my_swiper {
  position: relative;

  .my_swiper_wrapper {
    height: v-bind(_height);
  }

  /* #ifdef MP-WEIXIN */
  .my_swiper_item {
    :deep(> view) {
      height: 100%;
    }
  }
  /* #endif */

  .my_swiper_indicator {
    position: absolute;
  }
}
</style>
