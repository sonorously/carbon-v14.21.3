<!-- 碳排报告 -->
<template>
  <div class="card">
    <div class="card-top">
      <h3>碳排报告</h3>
      <div>
<!--        <div class="icon-download">-->
<!--          <img src="@/assets/icon/add.png" width="15px" height="15px"/>-->
<!--          <span style="margin-left: 5px">生成报告</span>-->
<!--        </div>-->
      </div>
    </div>
    <div class="card-bottom">
      <el-form ref="form" :model="form" class="form-setting">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-input v-model="form.queryName" placeholder="搜索报告名称/企业" prefix-icon="el-icon-search" @blur="fetchData"></el-input>
          </el-col>
          <el-col :span="4">
            <el-col :span="4">
              <el-date-picker
                v-model="form.reportTime"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                @blur="fetchData"
              >
              </el-date-picker>
            </el-col>
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
        <template #reportStatus>
          <el-table-column label="状态">
            <template #default="scope">
              <div class="state-commons">
                <div class="state-common state-ywc" v-if="scope.row.reportStatus === '1'">已完成</div>
                <div class="state-common state-hsz" v-if="scope.row.reportStatus === '2'">生成中</div>
                <div class="state-common state-dhs" v-if="scope.row.reportStatus === '3'">生成异常</div>
              </div>
            </template>
          </el-table-column>
        </template>
        <!-- 自定义操作按钮 -->
        <template #action-buttons="{ row }">
          <el-button type="text" icon="el-icon-download" @click="handleView(row)">下载</el-button>
        </template>
      </data-table>
    </div>
  </div>
</template>
<script>
import DataTable from '@/components/publicComponent/DataTable.vue';
import {queryCarbonReportPage, getCarbonReportFile} from "@/api";
import { handleBlobDownload } from '@/components/utils/index.js'
export default {
  name: "CarbonReport",
  components: { DataTable },
  data() {
    return {
      form:{
        queryName: '',
        reportTime: ''
      },
      loading: false,
      tableData: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      columns: [
        {
          prop: 'reportName',
          label: '报告名称',
        },
        {
          prop: 'reportTime',
          label: '报告生成时间',
        },
        {
          prop: 'supplierName',
          label: '企业名称',
        },
        {
          slotName: 'reportStatus',
          label: '状态'
        }
      ],
    }
  },
  mounted() {
    this.fetchData();
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
        const response = await queryCarbonReportPage(obj);
        console.log('获取借口数据：', response);
        this.tableData = response.data.list;
        this.page.total = response.data.total;
      } catch (error) {
        this.$message.error('获取数据失败');
      } finally {
        this.loading = false;
      }
    },

    handleView(row) {
      this.$confirm(`确定下载 "${row.reportName}" 吗?`, '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          const response = await getCarbonReportFile({id: row.id});
          handleBlobDownload(response, row.reportName);
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
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.state-common {
  width: 50px;
  height:20px;
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
