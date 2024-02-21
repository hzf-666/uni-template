<script setup>
const { statusBarHeight, menuHeight, menuPaddingRight, isIOS } = storeToRefs(store.useGlobal());

onLaunch(() => {
  // console.log('App Launch');
  uni.getSystemInfo({
    success(e) {
      if (!uni.getMenuButtonBoundingClientRect) return;
      const { width, height, right, top } = uni.getMenuButtonBoundingClientRect();
      statusBarHeight.value = `${ e.statusBarHeight }px`;
      menuHeight.value = `${ height + (top - e.statusBarHeight) * 2 }px`;
      menuPaddingRight.value = `${ width + (e.screenWidth - right) * 2 }px`;
      isIOS.value = e.platform === 'ios';
    },
  });
});
onShow(() => {
  // console.log('App Show');
});
onHide(() => {
  // console.log('App Hide');
});
</script>

<style lang="scss">
/* 每个页面公共css */
@import "@/scss/index.scss";
</style>
