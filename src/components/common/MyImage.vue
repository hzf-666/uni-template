<script setup>
import { rx } from '../../utils';

const props = defineProps({
  myClass: {
    type: [String, Object, Array],
    default: () => ([]),
  },
  myStyle: {
    type: [String, Object],
    default: () => ({}),
  },
  width: {
    type: [String, Number],
    default: () => (160),
  },
  height: {
    type: [String, Number],
    default: () => (160),
  },
  src: {
    type: [String],
    default: () => (null),
  },
  /**
   * scaleToFill  不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素
   * aspectFit    保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
   * aspectFill   保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
   * widthFix     宽度不变，高度自动变化，保持原图宽高比不变
   * heightFix    高度不变，宽度自动变化，保持原图宽高比不变 App 和 H5 平台 HBuilderX 2.9.3+ 支持、微信小程序需要基础库 2.10.3
   * top          不缩放图片，只显示图片的顶部区域
   * bottom       不缩放图片，只显示图片的底部区域
   * center       不缩放图片，只显示图片的中间区域
   * left         不缩放图片，只显示图片的左边区域
   * right        不缩放图片，只显示图片的右边区域
   * top left     不缩放图片，只显示图片的左上边区域
   * top right    不缩放图片，只显示图片的右上边区域
   * bottom left  不缩放图片，只显示图片的左下边区域
   * bottom right 不缩放图片，只显示图片的右下边区域
  */
  fit: {
    type: [String],
    default: () => ('scaleToFill'),
  },
  round: {
    type: [String, Number],
    default: () => (null),
  },
  emptyText: {
    type: [String],
    default: () => ('暂无图片'),
  },
  errorText: {
    type: [String],
    default: () => ('加载出错'),
  },
  showEmpty: {
    type: [Boolean],
    default: () => (true),
  },
  showError: {
    type: [Boolean],
    default: () => (true),
  },
  preview: {
    type: [Boolean],
    default: () => (false),
  },
});
const { myClass, myStyle, width, height, src, fit, round, emptyText, errorText, showEmpty, showError, preview } = toRefs(props);

const emit = defineEmits(['click']);

const bindClass = computed(() => setClass(myClass.value));
const bindStyle = computed(() => setStyle(myStyle.value));

const borderRadius = computed(() => {
  if (typeof round.value === 'number') {
    return rx(round.value);
  }
  return 0;
});
const textCommonStyle = computed(() => ({ 'border-radius': round.value === null ? rx(10) : borderRadius.value }));
const imgStyle = computed(() => {
  const obj = { 'border-radius': borderRadius.value };
  // #ifdef H5
  if (['top', 'bottom', 'center', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'].includes(fit.value)) {
    obj['width'] = 'auto';
    obj['height'] = 'auto';
    obj['position'] = 'absolute';
  }
  switch (fit.value) {
    case 'scaleToFill':
      obj['object-fit'] = 'fill';
      break;
    case 'aspectFit':
      obj['object-fit'] = 'contain';
      break;
    case 'aspectFill':
      obj['object-fit'] = 'cover';
      break;
    case 'top':
      obj['top'] = 0;
      obj['left'] = '50%';
      obj['transform'] = 'translateX(-50%)';
      break;
    case 'bottom':
      obj['bottom'] = 0;
      obj['left'] = '50%';
      obj['transform'] = 'translateX(-50%)';
      break;
    case 'center':
      obj['top'] = '50%';
      obj['left'] = '50%';
      obj['transform'] = 'translate(-50%, -50%)';
      break;
    case 'left':
      obj['top'] = '50%';
      obj['left'] = 0;
      obj['transform'] = 'translateY(-50%)';
      break;
    case 'right':
      obj['top'] = '50%';
      obj['right'] = 0;
      obj['transform'] = 'translateY(-50%)';
      break;
    case 'top left':
      obj['top'] = 0;
      obj['left'] = 0;
      break;
    case 'top right':
      obj['top'] = 0;
      obj['right'] = 0;
      break;
    case 'bottom left':
      obj['bottom'] = 0;
      obj['left'] = 0;
      break;
    case 'bottom right':
      obj['bottom'] = 0;
      obj['right'] = 0;
      break;
  }
  // #endif
  return obj;
});
const isError = ref(false);

function onClick(...args) {
  emit('click', ...args);
  if (!preview.value) return;
  uni.previewImage({ urls: [src.value] });
}
</script>

<template>
  <div
    class="my_image"
    :class="bindClass"
    :style="{
      ...bindStyle,
      width: fit === 'heightFix' ? 'auto' : typeof width === 'number'? $rx(width) : width,
      height: fit === 'widthFix' ? 'auto' : typeof height === 'number'? $rx(height) : height,
    }"
  >
    <template v-if="src">
      <img
        v-show="!isError"
        :mode="fit"
        class="my_image_img"
        :style="imgStyle"
        :src="src"
        @error="isError = true"
        @load="isError = false"
        @click="onClick"
      >
      <slot v-if="showError && isError" name="error">
        <div class="my_image_text" :style="textCommonStyle">{{ errorText }}</div>
      </slot>
    </template>
    <slot v-else-if="showEmpty" name="empty">
      <div class="my_image_text" :style="textCommonStyle">{{ emptyText }}</div>
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.my_image {
  position: relative;
  display: inline-block;
  overflow: hidden;

  .my_image_img {
    width: 100%;
    height: 100%;
  }

  .my_image_text {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 20rx;
    font-size: 24rx;
    color: $textColorSecondary;
    text-align: center;
    border: 2rx solid $borderColorBase;
  }
}
</style>
