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
  modelValue: {
    type: [String],
    default: () => (null),
  },
  width: {
    type: [String, Number],
    default: () => ('100%'),
  },
  placeholder: {
    type: [String],
    default: () => ('请输入'),
  },
  type: {
    type: [String],
    default: () => ('text'),
  },
  password: {
    type: [Boolean],
    default: () => (false),
  },
  disabled: {
    type: [Boolean],
    default: () => (false),
  },
  maxlength: {
    type: [Number],
    default: () => (null),
  },
  autoHeight: {
    type: [Boolean],
    default: () => (true),
  },
  rows: {
    type: [Number],
    default: () => (2),
  },
  showonly: {
    type: [Boolean],
    default: () => (false),
  },
});
const { myClass, myStyle, modelValue, width, placeholder, type, password, disabled, maxlength, autoHeight, rows, showonly } = toRefs(props);

const emit = defineEmits(['update:modelValue', 'click', 'input', 'focus', 'blur', 'confirm']);

const _width = computed(() => typeof width.value === 'number' ? rx(width.value) : width.value);
const isTextarea = computed(() => type.value === 'textarea');
const _maxlength = computed(() => maxlength.value > 0 ? maxlength.value : -1);
const _placeholder = computed(() => showonly.value ? '' : placeholder.value);
const _disabled = computed(() => showonly.value || disabled.value);
const textareaStyle = computed(() => {
  const result = {}, sum = rows.value - 1;
  if (sum <= 0) return result;
  const height = `calc(var(--input-height) + 16px * ${ sum })`;
  if (autoHeight.value) {
    return { 'min-height': height };
  } else {
    return { height };
  }
});

const bindClass = computed(() => setClass(myClass.value));
const bindStyle = computed(() => setStyle(myStyle.value));

function onClick(...args) {
  emit('click', ...args);
}
function onInput(...args) {
  emit('input', ...args);
}
function onFocus(...args) {
  emit('focus', ...args);
}
function onBlur(...args) {
  emit('blur', ...args);
}
function onConfirm(...args) {
  emit('confirm', ...args);
}
const lineCount = ref(0);
function onLineChange(e) {
  lineCount.value = e.detail.lineCount;
}

const modelVal = ref(modelValue.value);
const valuelength = computed(() => modelVal.value?.length || 0);
watch(modelVal, (newVal) => {
  emit('update:modelValue', newVal);
});
watch(modelValue, (newVal) => {
  modelVal.value = newVal;
});
</script>

<template>
  <div class="my_input" :class="bindClass" :style="bindStyle" @click="onClick">
    <div v-if="!isTextarea" class="my_input_prefix">
      <div />
      <slot name="prefix" />
    </div>
    <textarea
      v-if="isTextarea"
      v-model="modelVal"
      class="my_input_inner is_textarea"
      :class="{is_single_line: rows <= 1 && !lineCount}"
      :style="textareaStyle"
      placeholder-class="placeholder_css"
      :placeholder="_placeholder"
      :disabled="_disabled"
      :maxlength="_maxlength"
      :auto-height="autoHeight"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
      @linechange="onLineChange"
    />
    <input
      v-else
      v-model="modelVal"
      class="my_input_inner"
      placeholder-class="placeholder_css"
      :placeholder="_placeholder"
      :type="type"
      :password="password"
      :disabled="_disabled"
      :maxlength="_maxlength"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
    >
    <span v-if="maxlength > 0" class="my_input_count" :class="{is_textarea: isTextarea}">{{ valuelength }} / {{ maxlength }}</span>
    <div v-if="!isTextarea" class="my_input_suffix">
      <slot name="suffix" />
      <div />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my_input {
  --input-height: 40rx;
  --input-padding-x: 20rx;
  --input-padding-y: 12rx;

  position: relative;
  display: inline-flex;
  width: v-bind(_width);
  vertical-align: top;
  border: 2rx solid $borderColorBase;
  border-radius: 8rx;

  .my_input_inner {
    box-sizing: content-box;
    flex: 1;
    height: var(--input-height);
    min-height: 0;
    padding: var(--input-padding-y) var(--input-padding-x);
    line-height: 1;
    color: $textColorRegular;

    &.is_textarea {
      min-height: var(--input-height);
      line-height: 1.2;

      &.is_single_line {
        padding-top: calc(var(--input-padding-y) + 4rx);
        padding-bottom: calc(var(--input-padding-y) - 4rx);
      }
    }
  }

  :deep() {
    .placeholder_css {
      color: $textColorPlaceholder;
    }
  }

  .my_input_prefix,
  .my_input_suffix {
    display: flex;
    column-gap: var(--input-padding-x);
    align-items: center;
    line-height: 0;
  }

  .my_input_count {
    align-self: center;
    margin-right: var(--input-padding-x);
    line-height: 1;
    color: $textColorSecondary;

    &.is_textarea {
      position: absolute;
      right: var(--input-padding-x);
      bottom: var(--input-padding-y);
      margin-right: 0;
    }
  }
}
</style>
