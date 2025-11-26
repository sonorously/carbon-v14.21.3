<!--
@：组件调用方法：<step-two v-if="activeStep === 1" @next-step="handleNextStep" @prev-step="handlePrevStep"></step-two>
handleNextStep：父组件处理下一步的方法
handlePrevStep：父组件处理上一步的方法
-->
<template>
  <div class="card">
    <data-table-expand
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :showPagination="false"
        :showActions="false"
        show-index
        show-expand
        @refresh="fetchData"
    >
      <template #numbers="scope">
        <el-table-column label="核算状态">
          <template #default="scope">
            <el-input v-model="scope.row.numbers" placeholder="请输入"></el-input>
          </template>
        </el-table-column>
      </template>
    </data-table-expand>
    <el-row style="margin: 20px 0">
      <el-col align="center">
        <el-button type="primary" @click="back">上一阶段</el-button>
        <el-button type="primary" @click="next">下一阶段</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import DataTable from '@/components/publicComponent/DataTable.vue';
export default {
  name: 'StepOne',
  components: { DataTableExpand: DataTable },
  data() {
    return {
      loading: false,
      tableData: [
        {
          name: '张三',
          type: '1324234324',
          numbers: '',
          unit: 'tech',
          value: '23333',
          unit2: '4',
          description: '4',
        },
        {
          name: '张三',
          type: '1324234324',
          numbers: '',
          unit: 'tech',
          value: '23333',
          unit2: '4',
          description: '4',
        },
        {
          name: '张三',
          type: '1324234324',
          numbers: '',
          unit: 'tech',
          value: '23333',
          unit2: '4',
          description: '4',
        },
      ],
      columns: [
        {
          prop: 'name',
          label: '工艺过程名称',
        },
        {
          prop: 'type',
          label: '工艺过程消耗能源资源名称',
        },
        {
          prop: 'unit',
          label: '类型',
        },
        {
          slotName: 'numbers',
          label: '数量'
        },
        {
          prop: 'unit2',
          label: '单位',
        }
      ],
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    back(selection) {
      this.$emit('prev-step', selection);
    },
    next(selection) {
      this.$emit('next-step', selection);
    },
    async fetchData() {
      this.loading = false;
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
    },
  },

}
</script>
<style scoped>
.card {
  width: 100%;
  height: 100%;
}
</style>
