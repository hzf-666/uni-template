<script setup>
const title = ref('Hello');
const { httpCount } = storeToRefs(store.useGlobal());

onLoad(() => {
  http(['/api/inner/common/queryToken', {
    // method: 'post1',
    // params: {
    //   aaa: 666,
    // },
    // data: {
    //   bbb: 777,
    // },
  }]).then(res => {
    console.log(1);
    console.log(res);
  });
  setTimeout(() => {
    http(['/api/inner/common/user']).then(res => {
      console.log(2);
      console.log(res);
    });
  }, 1000);
  http(['/api/inner/common/permission']).then(res => {
    console.log(3);
    console.log(res);
  });
  // uni.login({
  //   provider: 'weixin',
  //   success: (result) => {
  //     console.log(result);
  //   },
  // });
});
function test() {
  http(['/api/inner/common/user']);
}
</script>

<template>
  <view class="content">
    <button @click="test">test</button>
    {{ httpCount }}
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
