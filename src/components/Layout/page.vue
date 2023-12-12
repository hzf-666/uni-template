<script setup>
import pagesJson from '@/pages.json';

const props = defineProps({
  headerClass: {
    type: [String, Object, Array],
    default: () => ([]),
  },
  padding: {
    type: [Number, Array],
    default: () => (0),
  },
  showHeader: {
    type: [Boolean],
    default: () => (true),
  },
  showBar: {
    type: [Boolean],
    default: () => (false),
  },
  beforeBack: {
    type: [Function],
    default: () => (null),
  },
  title: {
    type: [String],
    default: () => (null),
  },
  headerBg: {
    type: [Boolean],
    default: () => (true),
  },
  bg: {
    type: [Boolean],
    default: () => (true),
  },
  titleCenter: {
    type: [Boolean],
    default: () => (false),
  },
  showBack: {
    type: [Boolean],
    default: () => (false),
  },
});
const { headerClass, padding, showHeader, showBar, beforeBack, title, headerBg, bg, titleCenter, showBack } = toRefs(props);

const bindHeaderClass = computed(() => setClass(headerClass.value));

const { statusBarHeight, menuHeight, menuPaddingRight } = storeToRefs(store.useGlobal());
const _statusBarHeight = computed(() => statusBarHeight.value ? '-' + statusBarHeight.value : 0);
const _menuHeight = computed(() => menuHeight.value ? menuHeight.value : rx(80));

const areaPdObj = computed(() => {
  const obj = {
    'padding-left': 0,
    'padding-right': 0,
    'border-top-width': 0,
    'border-bottom-width': 0,
  };
  if (typeOf(padding.value, 'number')) {
    obj['border-top-width'] = obj['border-bottom-width'] = obj['padding-left'] = obj['padding-right'] = rx(padding.value);
  } else if (padding.value?.length) {
    const [p1, p2, p3, p4] = padding.value;
    switch (padding.value.length) {
      case 1:
        obj['border-top-width'] = obj['border-bottom-width'] = obj['padding-left'] = obj['padding-right'] = rx(p1);
        break;
      case 2:
        obj['border-top-width'] = obj['border-bottom-width'] = rx(p1);
        obj['padding-left'] = obj['padding-right'] = rx(p2);
        break;
      case 3:
        obj['border-top-width'] = rx(p1);
        obj['padding-left'] = obj['padding-right'] = rx(p2);
        obj['border-bottom-width'] = rx(p3);
        break;
      default:
        obj['border-top-width'] = rx(p1);
        obj['padding-right'] = rx(p2);
        obj['border-bottom-width'] = rx(p3);
        obj['padding-left'] = rx(p4);
        break;
    }
  }
  return obj;
});

/**
 * text: 按钮文字
 * pagePath: 页面路径
 * iconPath: 图片路径
 * selectedIconPath: 选中时的图片路径
*/
const badgeList = computed(() => {
  const result = tabBarList.value.map(() => null);
  return result;
});
const tabBarList = ref([
  {
    text: '首页',
    pagePath: 'pages/home/index',
    iconPath: 'static/logo.png',
  },
  {
    text: '我的',
    pagePath: 'pages/user/index',
    iconPath: 'static/logo.png',
  },
]);

const pages = getCurrentPages(), page = pages[pages.length - 1], isPageActive = pagePath => pagePath === page?.route;
const pageTitle = computed(() => {
  const target = pagesJson.pages.find(item => item.path === page?.route);
  return title.value === null ? target.style.navigationBarTitleText : title.value;
});

function onBack() {
  if (beforeBack.value) {
    beforeBack.value(doBack);
  } else {
    doBack();
  }
}
function doBack(...args) {
  uni.navigateBack(...args);
}

const currentInstance = getCurrentInstance(), query = uni.createSelectorQuery().in(currentInstance);
const headerHeight = ref(null), tabHeight = ref(null);
onMounted(() => {
  query.selectAll('.page_header, .tab_box').boundingClientRect((data) => {
    if (data[0]) headerHeight.value = data[0].height + 'px';
    if (data[1]) tabHeight.value = data[1].height + 'px';
  }).exec();
});
</script>

<template>
  <div class="s_box layout_page" :class="{is_bg: bg}">
    <div class="page_header" :class="bindHeaderClass">
      <slot
        v-if="showHeader"
        name="header"
        :top="_statusBarHeight"
        :menu-height="_menuHeight"
        :menu-padding-right="menuPaddingRight"
      >
        <div v-if="pageTitle || showBack" class="page_default_header" :class="{is_header_bg: headerBg, is_pr: menuPaddingRight}">
          <img v-if="pages.length > 1" class="page_header_back fs_0" src="/static/icon/title_return.png" @click="onBack()">
          <span v-if="pageTitle" class="page_header_title els" :class="{is_center: titleCenter}">{{ pageTitle }}</span>
        </div>
      </slot>
    </div>

    <slot name="up" :header-height="headerHeight" :tab-height="tabHeight" />

    <scroll-view
      class="page_main s_area"
      :style="{ 'border': '0 solid transparent', ...areaPdObj }"
      scroll-y
    >
      <slot />
      <slot name="content" :header-height="headerHeight" :tab-height="tabHeight" />
    </scroll-view>

    <slot name="down" :header-height="headerHeight" :tab-height="tabHeight" />

    <div v-if="showBar" class="tab_box">
      <div
        v-for="(item, i) in tabBarList"
        :key="i"
        class="tab_bar"
        :class="{is_active: isPageActive(item.pagePath)}"
        :style="{
          width: `calc(100% / ${tabBarList.length})`,
        }"
        @click="$uni.reLaunch({ url: '/' + item.pagePath })"
      >
        <template v-if="item.iconPath">
          <MyBadge :value="badgeList[i]" :offset="[0, 8]">
            <img mode="aspectFit" class="tab_bar_icon" :src="$resolvePath(`/${isPageActive(item.pagePath) ? item.selectedIconPath || item.iconPath : item.iconPath}`)">
          </MyBadge>
        </template>
        <span>{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout_page {
  position: relative;

  &.is_bg::before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    display: block;
    content: "";
    background-color: transparent; // 页面背景颜色
  }
}

.page_header {
  $pd: 30rx;
  $pl: calc(v-bind(menuPaddingRight) - $pd);

  position: relative;
  padding-top: v-bind(statusBarHeight);

  .page_default_header {
    position: relative;
    display: flex;
    align-items: center;
    height: v-bind(_menuHeight);
    padding: 0 $pd;
    font-size: 36rx;
    font-weight: bold;
    color: #fff;

    &.is_pr {
      padding-right: v-bind(menuPaddingRight);
    }

    &.is_header_bg::after {
      position: absolute;
      top: v-bind(_statusBarHeight);
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -1;
      content: "";
      background: $colorPrimary;
    }

    .page_header_back {
      $backSize: 40rx;
      $backMr: 24rx;

      width: $backSize;
      height: $backSize;
      margin-right: $backMr;
      cursor: pointer;

      + .page_header_title.is_center {
        padding-left: calc($pl - $backSize - $backMr);
      }
    }

    .page_header_title.is_center {
      padding-left: $pl;
      margin: auto;
      font-size: 34rx;
    }
  }
}

.tab_box {
  display: flex;
  padding-bottom: constant(safe-area-inset-bottom); // 获取底部安全距离，兼容 iOS 设备
  padding-bottom: env(safe-area-inset-bottom); // 获取底部安全距离，兼容 iPhone X 及以上设备
  line-height: 1;
  background-color: #fff;
  box-shadow: 0 -6rx 12rx 0 rgb(182 182 182 / 10%);

  .tab_bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 98rx;
    padding: 10rx;
    font-size: 20rx;
    color: $textColorPrimary;
    cursor: pointer;

    &.is_active {
      font-weight: bold;
      color: $colorPrimary;
    }

    .tab_bar_icon {
      width: 44rx;
      height: 44rx;
      object-fit: contain;
      margin-bottom: 12rx;
    }
  }
}
</style>
