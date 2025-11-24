<template>
  <div class="card">
    <data-table-expand
      :data="tableData"
      :columns="columns"
      :showActions="false"
      :showExpand="isShow"
      show-index
    >
      <template v-for="(col, index) in columns" #[col.slotName]>
        <el-table-column :key="index" :label="col.label">
          <template #default="scope">
            <el-input :key="index" v-model="scope.row[col.slotName]" placeholder="请输入"></el-input>
          </template>
        </el-table-column>
      </template>
    </data-table-expand>

  </div>
</template>
<script>
import DataTableExpand from '@/components/publicComponent/DataTableExpand.vue';
export default {
  name: 'StepList',
  components: { DataTableExpand },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
    }
  },

  computed: {
  },
  mounted() {
    // this.fetchData();
  },
  methods: {
    // async fetchData() {
      // try {
        // 模拟 API 调用
        // const response = await this.$http.get('/api/users', {
        //   params: {
        //     page: this.page.currentPage,
        //     size: this.page.pageSize
        //   }
        // });

      //   this.tableData = response.data.list;
      //   this.page.total = response.data.total;
      // } catch (error) {
      //   this.$message.error('获取数据失败');
      // } finally {
      //   this.loading = false;
      // }
    // },
  },

}
</script>
<style scoped>
.card {
  width: 100%;
  height: 100%;
}
</style>
