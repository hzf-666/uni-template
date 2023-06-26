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
  <view class="content">
    {{ httpCount }}
    <button @click="onUpload">上传文件</button>
    <image class="logo" src="/static/logo.png" @click="httpCount++" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
  </view>
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
