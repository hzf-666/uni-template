<script setup>
const props = defineProps({
  myClass: {
    type: [String, Object, Array],
    default: () => ([]),
  },
  myStyle: {
    type: [String, Object],
    default: () => ({}),
  },
  html: {
    type: [String],
    default: () => (''),
  },
});
const { myClass, myStyle, html } = toRefs(props);

const bindClass = computed(() => setClass(myClass.value));
const bindStyle = computed(() => setStyle(myStyle.value));

const htmlStr = computed(() => {
  return html.value.replace(/<([^/][^>]*)>/g, (...args) => {
    const index = args[1].indexOf(' '), startIndex = index == -1 ? args[1].length : index, attrs = args[1].slice(startIndex);
    const arr = attrs ? attrs.split('" ') : [], tag = args[1].slice(0, startIndex);
    let flag = true;
    arr.forEach((item, i) => {
      if (item.trim().startsWith('class="')) {
        flag = false;
        const classArr = item.split('=');
        arr[i] = `${ classArr[0] }=${ classArr[1].trim() } ${ tag }`;
      }
    });
    return `<${ tag }${ flag ? ' class="' + tag + '"' : '' }${ arr.join('" ') }>`;
  });
});
</script>

<template>
  <div class="editor_viewer" :class="bindClass" :style="bindStyle">
    <rich-text :nodes="htmlStr" />
  </div>
</template>

<style lang="scss" scoped>
.editor_viewer {
  overflow: auto;

  :deep() {
    .img {
      max-width: 100%;
    }

    .table {
      width: 100%;
    }

    .p {
      margin: 16rx 0;
    }
  }
}
</style>
