<template>
  <div>
    <template v-for='v in menuList'>
      <el-submenu :index='v.path' v-if='v.children && v.children.length > 0' :key='v.path'>
        <template slot='title'>
          <i class="iconfont" v-if="$route.path === v.path" :class='v.meta.iconActive'></i>
          <i class="iconfont" v-else :class='v.meta.icon'></i>
          <span>{{v.meta.name}}</span>
        </template>
        <dynamic-menu :menuList='v.children' />
      </el-submenu>
      <el-menu-item :key='v.path' :index='v.path' @click="handleMenuClick(v)" v-else-if="!v.meta.notMenu">
        <i class="iconfont" v-if="$route.path === v.path" :class='v.meta.iconActive'></i>
        <i class="iconfont" v-else :class='v.meta.icon'></i>
        <span slot='title'>{{v.meta.name}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "DynamicMenu",
  props: {
    menuList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    handleMenuClick(item) {
      console.log('handleMenuClick===', item);
      const route = this.$route;
      const { meta } = route;
      // 如果当前路由的meta中定义了activeMenu，则使用它来保持父菜单高亮
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return route.path;
      // return this.$router.push(item.path)
    }
  }
};
</script>

<style scoped>
.iconfont{
  margin-right: 8px;
}
</style>
