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
  value: {
    type: [String, Number],
    default: () => (null),
  },
  max: {
    type: [Number],
    default: () => (99),
  },
  isDot: {
    type: [Boolean],
    default: () => (false),
  },
  hidden: {
    type: [Boolean],
    default: () => (false),
  },
  offset: {
    type: [Number, Array],
    default: () => (0),
  },
  inline: {
    type: [Boolean],
    default: () => (false),
  },
});
const { myClass, myStyle, value, max, isDot, hidden, offset, inline } = toRefs(props);

const bindClass = computed(() => setClass(myClass.value));
const bindStyle = computed(() => setStyle(myStyle.value));

const text = computed(() => {
  if (typeof value.value === 'number' && value.value > max.value) return max.value + '+';
  return value.value;
});
const badgeStyle = computed(() => {
  let offsetX, offsetY;
  if (typeof offset.value === 'number') {
    offsetX = offsetY = offset.value ? rx(offset.value) : 0;
  } else {
    offsetX = offset.value?.[0] ? rx(offset.value[0]) : 0;
    offsetY = offset.value?.[1] ? rx(offset.value[1]) : 0;
  }
  return { top: offsetY, left: offsetX ? `calc(100% + ${ offsetX })` : '100%' };
});
</script>

<template>
  <div class="my_badge" :class="[{is_inline: inline}, ...bindClass]" :style="bindStyle">
    <template v-if="!hidden">
      <div v-if="isDot" class="icon_badge_dot" :style="badgeStyle" />
      <div v-else-if="value" class="my_badge_content" :style="badgeStyle">{{ text }}</div>
    </template>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.my_badge {
  position: relative;

  &.is_inline {
    display: inline-block;
  }

  .icon_badge_dot,
  .my_badge_content {
    position: absolute;
    border: 2rx solid #fff;
  }

  .icon_badge_dot {
    width: 16rx;
    height: 16rx;
    background: $colorDanger;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  .my_badge_content {
    $size: 32rx;

    display: flex;
    align-items: center;
    justify-content: center;
    height: $size;
    padding: 0 10rx;
    font-size: 20rx;
    font-weight: bold;
    color: #fff;
    background: $colorDanger;
    border-radius: #{$size * 0.5};
    transform: translate(#{$size * -0.5}, -50%);
  }
}
</style>
