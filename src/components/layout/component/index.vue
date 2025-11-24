<template>
  <div class="content-app">
    <!-- 左边菜单  -->
    <aside class="content-left">
      <el-menu
        :default-active="activeMenu"
        router
        class="el-menu-demo"
      >
        <dynamic-menu :menuList='menuItems' />
      </el-menu>
    </aside>
    <!-- 右边页面内容  -->
    <main class="content-main">
      <router-view style="height: 100%"></router-view>
    </main>
  </div>

</template>

<script>
import dynamicMenu from "@/components/layout/component/menu/DynamicMenu.vue";
import {dynamic} from "@/router/dynamic";
const {menuItems} = dynamic()
export default {
  components: {dynamicMenu},
  name: 'layout',
  data() {
   return {
     menuItems: menuItems,
   }
  },
  mounted() {
    console.log('123123:',this.menuItems,menuItems)
  },
  computed: {
    activeMenu() {
      return this.$route.fullPath
    }
  }
};
</script>
<style scoped>
.content-app {
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
}
.content-left {
  width: 240px;
  //background: #f0f0f0;
}
.content-main {
  flex: 1;
  padding: 20px;
  background: rgb(244,246,249);
}

</style>
