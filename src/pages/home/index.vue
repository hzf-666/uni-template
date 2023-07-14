<script setup>
import { uploadFile } from '@/api';

const title = ref('Hello');
const { httpCount } = storeToRefs(store.useGlobal());

onLoad(() => {
  console.log('Home Load');
});
function onUpload() {
  // uni.chooseFile({
  uni.chooseImage({
    count: 1,
    success: ({ tempFilePaths }) => {
      uploadFile({ filePath: tempFilePaths[0] }).then(res => {
        console.log(res);
      });
    },
  });
}
</script>

<template>
  <div class="content">
    {{ httpCount }}
    <button @click="onUpload">上传文件</button>
    <img class="logo" src="/static/logo.png" @click="httpCount++">
    <div class="text-area">
      <span class="title">{{ title }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 200rpx;
  height: 200rpx;
  margin: 200rpx auto 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
