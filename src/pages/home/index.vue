<script setup>
import Config from '@c/custom/Config.vue';

const showDrawer = ref(false);
const showDialog = ref(false);
const fileObj = ref({ url: '/static/logo.png' });
</script>

<template>
  <Config />

  <LayoutPage show-bar>
    <div class="comp_item">
      <MyBadge :value="5" inline>首页</MyBadge>
      <MyBadge my-class="ml_40" is-dot inline>首页</MyBadge>
      <MyBadge my-class="ml_40" :value="5" :max="4" inline>首页</MyBadge>
      <MyBadge my-class="ml_40" :value="5" :offset="[-30, 20]" inline>首页</MyBadge>
    </div>

    <div class="comp_item">
      <MyButton>按钮</MyButton>
      <MyButton my-class="ml_20" type="primary">按钮</MyButton>
      <MyButton my-class="ml_20" :round="false">按钮</MyButton>
      <MyButton my-class="ml_20" :border="false">按钮</MyButton>
      <MyButton my-class="mt_20" :size="70">按钮</MyButton>
      <MyButton my-class="mt_20 ml_20" disabled>按钮</MyButton>
    </div>

    <div class="comp_item">
      <MyDialog inline>
        <template #reference="{show}">
          <MyButton @click="show">打开弹窗</MyButton>
        </template>
        <template #content>这是弹窗内容。</template>
      </MyDialog>
      <MyDialog v-model="showDialog" my-class="ml_20" inline>
        <template #reference>
          <MyButton @click="showDialog = true">打开弹窗</MyButton>
        </template>
        <template #content>这是弹窗内容。</template>
      </MyDialog>
      <MyDialog my-class="ml_20" lock-scroll inline>
        <template #reference="{show}">
          <MyButton @click="show">弹窗滚动</MyButton>
        </template>
        <template #content>
          <div style="height: 1000px;">这是弹窗内容。</div>
        </template>
      </MyDialog>
    </div>

    <div class="comp_item">
      <MyDrawer inline>
        <template #reference="{show}">
          <MyButton @click="show">打开抽屉</MyButton>
        </template>
        <template #content>这是抽屉内容。</template>
      </MyDrawer>
      <MyDrawer v-model="showDrawer" my-class="ml_20" inline>
        <template #reference>
          <MyButton @click="showDrawer = true">打开抽屉</MyButton>
        </template>
        <template #content>这是抽屉内容。</template>
      </MyDrawer>
      <MyDrawer my-class="ml_20" direction="rtl" :min-content="350" inline>
        <template #reference="{show}">
          <MyButton @click="show">从右到左</MyButton>
        </template>
        <template #content>这是抽屉内容。</template>
      </MyDrawer>
    </div>

    <div class="comp_item">
      <MyImage src="/static/logo.png" />
      <MyImage my-class="ml_20" />
      <MyImage my-class="ml_20" src="123" />
      <MyImage
        my-class="ml_20"
        src="/static/logo.png"
        :width="100"
        :height="100"
        preview
      />
    </div>

    <div class="comp_item">
      <MyInput />
      <MyInput my-class="mt_20" :maxlength="10" />
      <MyInput my-class="mt_20" :width="300" />
      <MyInput my-class="mt_20" type="textarea" />
      <MyInput my-class="mt_20" type="textarea" :maxlength="100" />
      <MyInput my-class="mt_20" type="textarea" :rows="1" :auto-height="false" />
      <MyInput my-class="mt_20" type="textarea" placeholder="文本域" :rows="1" />
    </div>

    <div class="comp_item">
      <MyUpload />
      <MyUpload my-class="ml_40" type="image" />
      <MyUpload v-model="fileObj" my-class="ml_40" type="image" />
    </div>

    <div class="comp_item">
      <MySwiper :model-value="['一', '二', '三', '四', '五']" indicator-dots>
        <template #item="{item}">
          <div style="height: 100%; background-color: red;">{{ item }}</div>
        </template>
      </MySwiper>
    </div>

    <div class="comp_item">
      <EditorViewer html="<h1>标题</h1><p>这是一个段落</p><img src='http://admin.gzaipeiban.com/UploadFile/Test/1.jpg'>" />
    </div>
  </LayoutPage>
</template>

<style lang="scss" scoped>
.comp_item {
  padding: 30rx;

  :deep() {
    .mt_20 {
      margin-top: 20rx;
    }

    .ml_20 {
      margin-left: 20rx;
    }

    .ml_40 {
      margin-left: 40rx;
    }
  }
}
</style>
