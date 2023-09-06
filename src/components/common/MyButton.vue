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
  fullWidth: {
    type: [Boolean],
    default: () => (false),
  },
  border: {
    type: [Boolean],
    default: () => (true),
  },
  type: {
    type: [String],
    default: () => (null),
  },
  size: {
    type: [Number],
    default: () => (60),
  },
  round: {
    type: [Boolean],
    default: () => (true),
  },
  disabled: {
    type: [Boolean],
    default: () => (false),
  },
});
const { myClass, myStyle, fullWidth, border, type, size, round, disabled } = toRefs(props);

const bindClass = computed(() => setClass(myClass.value));
const bindStyle = computed(() => setStyle(myStyle.value));

const typeClass = computed(() => type.value ? `is_${ type.value }` : '');
const sizeStyle = computed(() => {
  let fontSize;
  if (size.value < 40) {
    fontSize = 22;
  } else if (size.value < 60) {
    fontSize = 24;
  } else if (size.value < 80) {
    fontSize = 28;
  } else if (size.value < 100) {
    fontSize = 32;
  } else {
    fontSize = 34;
  }
  const halfSize = rx(size.value * 0.5);
  const style = {
    height: rx(size.value),
    'min-width': rx(size.value * 2.4),
    'font-size': rx(fontSize),
    'padding-left': halfSize,
    'padding-right': halfSize,
  };
  if (fullWidth.value) style.width = '100%';
  if (!border.value) style['box-shadow'] = 'none';
  if (round.value) style['border-radius'] = halfSize;
  return style;
});

const emit = defineEmits(['click']);
function onClick(...args) {
  if (disabled.value) return;
  emit('click', ...args);
}
</script>

<template>
  <div
    class="my_button"
    :class="[{[typeClass]: typeClass}, {is_disabled: disabled}, ...bindClass]"
    :style="{...sizeStyle, ...bindStyle}"
    @click="onClick"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.my_button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  line-height: 1;
  color: $colorPrimary;
  letter-spacing: 1rx;
  white-space: nowrap;
  cursor: pointer;
  background-color: #fff;
  border-radius: 8rx;
  box-shadow: inset 0 0 2rx 2rx $colorPrimary;

  &.is_disabled {
    color: #fff;
    cursor: not-allowed;
    background: $fillColorDisabled;
    box-shadow: none;
  }

  &:not(.is_disabled) {
    &.is_primary {
      color: #fff;
      background: $colorPrimary;
      box-shadow: none;
    }
  }
}
</style>
