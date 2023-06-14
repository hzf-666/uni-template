<script setup>
const title = ref('Hello');
const { httpCount } = storeToRefs(store.useGlobal());

onLoad(() => {
  http().then(res => {
    console.log(res);
  });
  // uni.login({
  //   provider: 'weixin',
  //   success: (result) => {
  //     console.log(result);
  //   },
  // });
});
</script>

<template>
  <view class="content">
    {{ httpCount }}
    <image class="logo" src="/static/logo.png" @click="httpCount++" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
  </view>
</template>

<style>
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
