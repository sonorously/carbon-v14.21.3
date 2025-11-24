<!-- 碳排模型 -->
<template>
  <div class="card">
    <div class="card-top">
      <h3>碳排核算模型</h3>
    </div>
    <div class="card-bottom">
      <el-form ref="form" :model="form" class="form-setting">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-select v-model="form.modelStatus" class="form-select" @blur="fetchData">
              <el-option label="全部状态" value="2"></el-option>
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="form.modelType" class="form-select" @blur="fetchData">
              <el-option label="全部类型" value="99"></el-option>
              <el-option v-for="(item, index) in modelTypeList" :key="index" :value="item.modelTypeCode" :label="item.modelTypeName"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input v-model="form.modelName" placeholder="搜索模型名称" prefix-icon="el-icon-search" @blur="fetchData"></el-input>
          </el-col>
        </el-row>
      </el-form>
      <data-table
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :total="page.total"
        :current-page="page.currentPage"
        :page-size="page.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @refresh="fetchData"
      >
        <template #modelStatus>
          <el-table-column label="启用状态">
            <template #default="scope">
              <div class="state-commons">
                <div class="state-common state-ywc" v-if="scope.row.modelStatus === 1"> 启用 </div>
                <div class="state-common state-dhs" v-if="scope.row.modelStatus === 0"> 禁用 </div>
              </div>
            </template>
          </el-table-column>
        </template>
        <!-- 自定义操作按钮 -->
        <template #action-buttons="{ row }">
          <el-button type="text" icon="el-icon-download" @click="handleDownload(row)">下载</el-button>
          <el-button type="text" icon="el-icon-switch-button" v-if="row.modelStatus === 1" @click="handleView1(row)" style="color: #f56c6c;">停用</el-button>
          <el-button type="text" icon="el-icon-video-play" v-if="row.modelStatus === 0" @click="handleView2(row)" style="color: #8af56c;">启用</el-button>
        </template>
      </data-table>
    </div>
  </div>
</template>
<script>
import DataTable from '@/components/publicComponent/DataTable.vue';
import {
  queryCarbonModelPage,
  saveCarbonModelAdd,
  saveCarbonModelModify,
  getModelTypeComboBox,
  getCarbonModelFile
} from "@/api";
import { handleBlobDownload } from '@/components/utils/index.js'
export default {
  name: 'CarbonModel',
  components: { DataTable },
  data() {
    return {
      form:{
        modelStatus: '2',
        modelType: '99',
        modelName: ''
      },
      modelTypeList: [],
      loading: false,
      tableData: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      columns: [
        {
          prop: 'modelName',
          label: '模型名称',
        },
        {
          prop: 'useTime',
          label: '开始使用时间'
        },
        {
          prop: 'modelType',
          label: '模型类型',
        },
        {
          slotName: 'modelStatus',
          label: '启用状态'
        },
        {
          prop: 'modelVersion',
          label: '版本',
        }
      ],
    }
  },
  mounted() {
    this.fetchData();
    this.getModelTypeComboBox();
  },
  methods: {
    async fetchData() {
      this.loading = false;
      try {
        let obj = {
          queryName: this.form.queryName,
          reportTime: this.form.reportTime,
          pageNum: this.page.currentPage,
          pageSize: this.page.pageSize
        }
        const response = await queryCarbonModelPage(obj);
        console.log('获取借口数据：', response);
        this.tableData = response.data.list;
        this.page.total = response.data.total;
      } catch (error) {
        this.$message.error('获取数据失败');
      } finally {
        this.loading = false;
      }
    },
    async getModelTypeComboBox() {
      try {
        let res = await getModelTypeComboBox({});
        console.log(res);
        this.modelTypeList = res.data;
      } catch (error) {
        console.log(error);
      }


    },
    handleDownload (row) {
      let obj = {
        id: row.id,
      }
      this.$confirm(`确定下载 "${row.modelName}" 吗?`, '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          const response = await getCarbonModelFile(obj);
          handleBlobDownload(response, row.modelFilePath);
          console.log('收到 octet-stream 响应:', {
            status: response.status,
            headers: response.headers,
            blobSize: response.data.size,
            blobType: response.data.type
          });
          this.$message.success('下载成功');
        } catch (error) {
          this.$message.error(error);
        }
      });
    },

    handleView1(row) {
      let obj = {
        id: row.id,
        modelStatus: 0,
      }
      this.changStatus(obj)
    },
    handleView2(row) {
      let obj = {
        id: row.id,
        modelStatus: 1,
      }
      this.changStatus(obj)
    },
    async changStatus (obj) {
      try {
        let {status} = await saveCarbonModelModify(obj);
        if (status === 200) {
          this.$message.success('切换成功');
          await this.fetchData();
        }
      } catch (error) {
        this.$message.error(error)
      }

    },

    handleSizeChange(size) {
      this.page.pageSize = size;
      this.page.currentPage = 1;
      this.fetchData();
    },
    handleCurrentChange(page) {
      this.page.currentPage = page;
      this.fetchData();
    }
  },
}
</script>
<style scoped>
.card {
  width: 100%;
  height: 100%;
}
.card-top {
  height: 60px;
  padding: 0 20px 20px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-bottom {
  height: calc(100% - 60px);
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
}
/* 非系统图标下载按钮 带背景颜色 */
.icon-download {
  width: 100px;
  height: 32px;
  background-color: rgb(77,146,252);
  color: #ffffff;
  font-size: 14px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.state-commons {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.state-common {
  width: 50px;
  height:20px;
  text-align: center;
  border-radius: 15px;
}
.state-ywc {
  background-color: rgb(221,250,228);
  color: rgb(44,92,51);
}
.state-hsz {
  background-color: rgb(217,230,253);
  color: rgb(34,57,163);
}
.state-dhs {
  background-color: rgb(253,248,190);
  color: rgb(115,70,22);
}
.state-ybh {
  background-color: rgb(249,223,222);
  color: rgb(132,37,29);
}
</style>
