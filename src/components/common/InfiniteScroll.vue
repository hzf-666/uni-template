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
  contentClass: {
    type: [String, Object, Array],
    default: () => ([]),
  },
  contentStyle: {
    type: [String, Object],
    default: () => ({}),
  },
  itemClass: {
    type: [String, Object, Array, Function],
    default: () => ([]),
  },
  itemStyle: {
    type: [String, Object, Function],
    default: () => ({}),
  },
  list: {
    type: [Array],
    default: () => (null),
  },
  height: {
    type: [String],
    default: () => ('100%'),
  },
  maxHeight: {
    type: [String],
    default: () => (null),
  },
  load: {
    type: [Function],
    default: () => (null),
  },
  noMore: {
    type: [Boolean],
    default: () => (true),
  },
  loadingText: {
    type: [String],
    default: () => ('加载中...'),
  },
  noMoreText: {
    type: [String],
    default: () => ('没有更多了'),
  },
  immediate: {
    type: [Boolean],
    default: () => (true),
  },
  distance: {
    type: [Number],
    default: () => (0),
  },
  delay: {
    type: [Number],
    default: () => (200),
  },
  scrollIntoView: {
    type: [String],
    default: () => (null),
  },
  refresher: {
    type: [Function],
    default: () => (null),
  },
});
const {
  myClass, myStyle, contentClass, contentStyle, itemClass, itemStyle, list, height, maxHeight,
  load, noMore, loadingText, noMoreText, immediate, distance, delay, scrollIntoView, refresher,
} = toRefs(props);

const emit = defineEmits(['scroll']);

const bindClass = computed(() => setClass(myClass.value));
const bindStyle = computed(() => setStyle(myStyle.value));
const bindContentClass = computed(() => setClass(contentClass.value));
const bindContentStyle = computed(() => setStyle(contentStyle.value));
function bindItemClass(item) {
  return setClass(typeOf(itemClass.value, 'function') ? itemClass.value(item) : itemClass.value);
}
function bindItemStyle(item) {
  return setStyle(typeOf(itemStyle.value, 'function') ? itemStyle.value(item) : itemStyle.value);
}

let isUnmounted = false;
onUnmounted(() => {
  isUnmounted = true;
});

const style = computed(() => {
  const result = { height: maxHeight.value ? 'auto' : height.value };
  if (maxHeight.value) result.maxHeight = maxHeight.value;
  return result;
});

const loading = ref(false);
const onLoad = computed(() => {
  return async function() {
    loading.value = true;
    await load.value?.();
    loading.value = false;
  };
});

const currentInstance = getCurrentInstance(), query = uni.createSelectorQuery().in(currentInstance);
watch(immediate, (newVal) => {
  if (newVal) onLoad.value().then(onLoadImmediately);
}, {
  immediate: true,
});
const scrollRect = query.selectAll('#scrollContent, .infinite_scroll').boundingClientRect(() => {});
const viewHeight = ref(0);
function getHeight() {
  return new Promise(resolve => {
    scrollRect.exec(([data]) => {
      viewHeight.value = data[0].height;
      resolve({ viewHeight: viewHeight.value, contentHeight: data[1].height });
    });
  });
}
async function onLoadImmediately() {
  if (isUnmounted) return;
  const { viewHeight, contentHeight } = await getHeight();
  if (!noMore.value && contentHeight <= viewHeight) {
    await onLoad.value().then(onLoadImmediately);
  }
}

const scrolling = ref(false);
let scrollTimer = null;
function handleScrollToLower() {
  if (noMore.value) return;
  if (scrolling.value) {
    scrollTimer && clearTimeout(scrollTimer);
  } else {
    scrolling.value = true;
  }
  scrollTimer = setTimeout(() => {
    scrolling.value = false;
    if (!loading.value) onLoad.value();
  }, delay.value);
}

let timer = null;
const scrollOffset = query.select('.infinite_scroll').scrollOffset(() => {});
function onScroll(...args) {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    scrollOffset.exec(([, { scrollTop, scrollHeight }]) => {
      if (scrollTop + viewHeight.value > scrollHeight - distance.value) {
        handleScrollToLower();
      }
    });
  }, 200);
  emit('scroll', ...args);
}

const isShowView = ref(true), showText = ref(true);
function onRefresh() {
  showText.value = false;
  delayPromise(refresher.value?.(), 500).then(() => {
    isShowView.value = false;
    showText.value = true;
    nextTick(() => {
      isShowView.value = true;
    });
  });
}
</script>

<template>
  <scroll-view
    v-if="isShowView"
    class="infinite_scroll"
    :class="bindClass"
    :style="{ ...style, ...bindStyle }"
    :scroll-into-view="scrollIntoView"
    scroll-y
    :refresher-enabled="!!refresher"
    @refresherrefresh="onRefresh"
    @scroll="onScroll"
  >
    <div style="height: 0;">
      <div id="scrollContent" :class="bindContentClass" :style="bindContentStyle">
        <template v-if="list">
          <div
            v-for="(item, i) in list"
            :id="'scrollItem' + i"
            :key="i"
            :class="bindItemClass(item)"
            :style="bindItemStyle(item)"
          >
            <slot name="item" :index="i" :item="item" />
          </div>
        </template>
        <slot v-else />
      </div>

      <div v-if="showText && (loading || noMore)" class="scroll_text">{{ loading ? loadingText : noMoreText }}</div>
    </div>
  </scroll-view>
</template>

<style lang="scss" scoped>
.infinite_scroll {
  overflow: auto;

  .scroll_text {
    padding: 20rx;
    font-size: 24rx;
    color: $textColorSecondary;
    text-align: center;
  }
}
</style>
