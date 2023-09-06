<script setup>
import MyDrawer from '@c/common/MyDrawer.vue';

const modeDev = import.meta.env.MODE === 'development';
const { baseURL } = storeToRefs(store.useSettings());
</script>

<template>
  <MyDrawer v-if="modeDev" direction="rtl" v-bind="$attrs">
    <template #reference="{show}">
      <div class="config_icon_wrapper" @click="show">
        <img class="config_icon" src="/static/icon/more.png">
      </div>
    </template>
    <template #content>
      <div class="s_box">
        <div class="config_title">项目配置</div>
        <div class="s_area config_item_wrapper">
          <div class="config_item">
            <span class="config_label">接口地址：</span>
            <input
              v-model="baseURL"
              class="config_input"
              placeholder="请输入"
              placeholder-class="config_input_ph"
            >
          </div>
        </div>
      </div>
    </template>
  </MyDrawer>
</template>

<style lang="scss" scoped>
.config_icon_wrapper {
  position: fixed;
  top: 45rx;
  left: 50%;
  z-index: 10;
  padding: 6rx;
  cursor: pointer;
  background-color: $colorPrimary;
  border-radius: 6rx;
  box-shadow: 0 2rx 6rx 0 rgb(0 0 0 / 10%), 0 2rx 4rx -2rx rgb(0 0 0 / 10%);
  transform: translateX(-50%);

  .config_icon {
    display: block;
    width: 36rx;
    height: 36rx;
  }
}

.config_title {
  padding: 20rx;
  font-size: 30rx;
  font-weight: bold;
  color: $textColorPrimary;
}

.config_item_wrapper {
  width: 70vw;
  padding: 0 20rx;
  margin-bottom: 30rx;
  overflow: auto;

  .config_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90rx;
    color: $textColorRegular;

    .config_label {
      flex-shrink: 0;
    }

    .config_input {
      box-sizing: content-box;
      flex: 1;
      padding: 8rx 15rx;
      margin-left: 12rx;
      border: 1px solid $borderColorBase;
      border-radius: 8rx;
    }

    :deep() {
      .config_input_ph {
        color: $textColorPlaceholder;
      }
    }
  }
}
</style>
