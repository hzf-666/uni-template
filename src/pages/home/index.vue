<script setup>
const title = ref('Hello');
const { httpCount } = storeToRefs(store.useGlobal());

onLoad(() => {
  console.log('home load');
});
function onUpload() {
  // uni.chooseFile({
  uni.chooseImage({
    count: 2,
    success: (imgPath) => {
      console.log(imgPath.tempFilePaths);
      uni.uploadFile({
        url: 'http://localhost:3000/api/inner/common/upload',
        header: {
          Authorization: cache().get('token'),
        },
        // fileType: 'image',
        // files: imgPath.tempFilePaths.map(path => ({ filePath: path, name: 'file' })),
        files: imgPath.tempFilePaths,
        // filePath: imgPath.tempFilePaths[0],
        name: 'file',
        success: (res) => {
          console.log(res);
        },
        // fail: (error) => {}
      });
    }
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
