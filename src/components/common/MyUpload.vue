<script setup>
import { uploadFile } from '@/api';

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
    type: [Object, Array],
    default: () => (null),
  },
  action: {
    type: [String, Function],
    default: () => (null),
  },
  multiple: {
    type: [Boolean],
    default: () => (false),
  },
  limit: { // 上传文件数量限制，0 表示无限制
    type: [Number],
    default: () => (9),
  },
  size: { // 上传文件大小限制（单位：M），0 表示无限制
    type: [Number],
    default: () => (2),
  },
  type: {
    type: [String],
    default: () => (null),
  },
  props: {
    type: [Object],
    default: () => ({}),
  },
});
const { myClass, myStyle, modelValue, action, multiple, limit, size, type, props: fnProps } = toRefs(props);

const emit = defineEmits(['update:modelValue']);

const bindClass = computed(() => setClass(myClass.value));
const bindStyle = computed(() => setStyle(myStyle.value));

const photo = computed(() => type.value === 'image');
function getUploadFn(filePath) {
  if (typeOf(action.value, 'function')) {
    return action.value(filePath);
  } else {
    return uploadFile({ filePath }, { action: action.value, tipOptions: { show: false } });
  }
}
const uniFn = {
  image: uni.chooseImage,
  video: uni.chooseVideo,
  media: uni.chooseMedia,
};
function onUpload() {
  const count = multiple.value ? limit.value : 1;
  let fn;
  if (['image', 'video', 'media'].includes(type.value)) {
    fn = uniFn(type.value);
  } else {
    // #ifdef MP-WEIXIN
    fn = uni.chooseMessageFile;
    // #endif
    // #ifndef MP-WEIXIN
    fn = uni.chooseFile;
    // #endif
  }
  fn({
    ...fnProps.value,
    count,
    success(res) {
      if (fnProps.value.success) {
        fnProps.value.success(res);
      } else {
        onSuccess(type.value === 'video' ? [{ tempFilePath: res.tempFilePath, size: res.size }] : res.tempFiles);
      }
    },
  });
}
async function onSuccess(tempFiles) {
  const filePathList = [];
  tempFiles.forEach(item => {
    if (item.size <= size.value * 1024 * 1024) {
      filePathList.push(item.path || item.tempFilePath);
    }
  });
  if (!multiple.value && !filePathList.length) {
    return uni.showToast({
      mask: true,
      icon: 'none',
      duration: 1500,
      title: `上传${ (photo.value ? '图片' : '文件') }大小超过 ${ size.value }M ！`,
    });
  }
  const result = [];
  await Promise.all(filePathList.map(getUploadFn)).then(resList => {
    resList.forEach(res => {
      if (res.code == 200) {
        result.push(res.data);
      }
    });
  });
  const failCount = tempFiles.length - result.length;
  uni.showToast({
    mask: true,
    icon: result.length && !failCount ? 'success' : 'none',
    duration: 1500,
    title: result.length ? multiple.value && failCount ? `上传成功${ result.length }个，失败${ failCount }个` : '上传成功' : '上传失败',
  });
  if (result.length) {
    fileValue.value = multiple.value ? result : result[0];
  }
}

function onPreview() {
  uni.previewImage({ urls: [fileValue.value.url] });
}

const fileValue = ref(modelValue.value);
watch(fileValue, (newVal) => {
  emit('update:modelValue', newVal);
});
watch(fileValue, (newVal) => {
  fileValue.value = newVal;
});
</script>

<template>
  <div class="my_upload" :class="bindClass" :style="bindStyle" @click="onUpload">
    <slot>
      <div v-if="photo" class="my_upload_photo">
        <template v-if="fileValue?.url">
          <img mode="aspectFit" class="photo_img" :src="fileValue.url" @click.stop="onPreview()">
          <span class="icon_photo_img_close" @click.stop="fileValue = multiple ? [] : {name: '', url: ''}">×</span>
        </template>
        <span v-else class="icon_photo_img_add">+</span>
      </div>
      <div v-else class="my_upload_file">上传文件</div>
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.my_upload {
  display: inline-block;
  vertical-align: bottom;
  cursor: pointer;
}

.my_upload_photo {
  position: relative;
  width: 160rx;
  height: 160rx;
  overflow: hidden;
  color: $textColorSecondary;
  border: 4rx dashed $borderColorBase;
  border-radius: 8rx;

  .photo_img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .icon_photo_img_add {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 54rx;
    transform: translate(-50%, -50%);
  }

  .icon_photo_img_close {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30rx;
    height: 30rx;
    padding-bottom: 8rx;
    padding-left: 6rx;
    font-size: 28rx;
    line-height: 1;
    color: #fff;
    cursor: pointer;
    background-color: $maskColorBase;
    border-bottom-left-radius: 80%;
  }
}

.my_upload_file {
  padding: 15rx 20rx;
  line-height: 1;
  color: #fff;
  cursor: pointer;
  background-color: $colorPrimary;
  border-radius: 8rx;
}
</style>
