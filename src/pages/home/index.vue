<script setup>
//
</script>

<template>
  <LayoutPage show-bar>
    <div class="comp_item">
      <MyBadge :value="5" inline>首页</MyBadge>
      <MyBadge my-class="ml_40" is-dot inline>首页</MyBadge>
      <MyBadge my-class="ml_40" :value="5" :max="4" inline>首页</MyBadge>
      <MyBadge my-class="ml_40" :value="5" :offset="[-30, 20]" inline>首页</MyBadge>
    </div>
  </LayoutPage>
</template>

<style lang="scss" scoped>
.comp_item {
  padding: 30rx;

  :deep() {
    .ml_40 {
      margin-left: 40rx;
    }
  }
}
</style>
