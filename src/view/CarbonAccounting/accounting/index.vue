<!-- 碳排核算 -->
<template>
  <div class="card">
    <div class="card-top">
      <h3>碳排核算任务</h3>
      <div>
        <div class="icon-download" @click="handleAdd">
          <img src="@/assets/icon/add.png" width="15px" height="15px"/>
          <span style="margin-left: 5px">计算碳排</span>
        </div>
      </div>
    </div>
    <div class="card-bottom">
      <el-form ref="form" :model="form" class="form-setting">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-select v-model="form.accountStatus" class="form-select" @change="fetchData">
              <el-option label="全部状态" value="99"></el-option>
              <el-option label="待核算" value="1"></el-option>
              <el-option label="核算中" value="2"></el-option>
              <el-option label="核算完成" value="3"></el-option>
              <el-option label="核算异常" value="4"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input v-model="form.queryName" placeholder="搜索企业名称/产品" prefix-icon="el-icon-search" @blur="fetchData"></el-input>
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
        <template #accountStatus>
          <el-table-column label="核算状态">
            <template v-slot:default="scoped">
              <div class="state-commons">
                <div class="state-common state-dhs" v-if="scoped.row.accountStatus === 1"> 待核算 </div>
                <div class="state-common state-hsz" v-if="scoped.row.accountStatus === 2"> 核算中 </div>
                <div class="state-common state-ywc" v-if="scoped.row.accountStatus === 3"> 已完成 </div>
                <div class="state-common state-ybh" v-if="scoped.row.accountStatus === 4"> 异常 </div>
              </div>
            </template>
          </el-table-column>
        </template>
        <!-- 自定义操作按钮 -->
        <template #action-buttons="{ row }">
          <el-button type="text" icon="el-icon-view" @click="handleView(row)">查看结果</el-button>
        </template>
      </data-table>
    </div>
    <el-dialog
        title="碳排核算结果"
        :visible.sync="dialogVisible"
        width="700px"
        :modal="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
      <el-row gutter="10">
        <el-col :span="12">
          <div style="margin-bottom: 20px">
            <p>产品名称</p>
            <p class="big-font">{{dialogData.productName}}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="margin-bottom: 20px">
            <p>企业名称</p>
            <p class="big-font">{{dialogData.supplierName}}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="margin-bottom: 20px">
            <p>核算标准</p>
            <p class="big-font">{{dialogData.accountStandardName}}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="margin-bottom: 20px">
            <p>核算日期</p>
            <p class="big-font">{{dialogData.accountTime}}</p>
          </div>
        </el-col>
        <el-col :span="24">
          <div style="margin-bottom: 20px">
            <p>总碳排放量</p>
            <p style="font-size: 24px;font-weight: bold;color: #9a9aee">{{ dialogData.countCarbon }}</p>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="big-font">各阶段碳排数据</div>
          <div id="lineChartID">
            <div v-for="(item, index) in dialogData.carbonCycleData" :key="index">
              <div class="progress-container">
                <div class="progress-title">
                  <div style="margin-bottom: 5px">{{item.name}}</div>
                  <div>
                    <span>{{item.value}} kg CO₂e</span>
                    <span>（{{item.percentage}}）</span>
                  </div>
                </div>
                <div class="progress-content">
                  <div class="progress-bar" :style="{ width: item.percentage, backgroundColor: item.color}"></div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px">
        <el-col :span="24">
          <div class="big-font">核算说明</div>
          <p class="remark">本核算结果基于{{dialogData.accountStandardName}}标准，涵盖产品全生命周期的碳排放数据。生产阶段为主要排放源， 主要来自电力消耗和生产工艺。建议企业优化生产工艺，采用可再生能源，以降低碳排放。</p>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="generateReport()">生成报告</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {queryCarbonAccountInfoPage, queryCarbonAccountReport, creatCarbonReport} from '@/api'
import DataTable from '@/components/publicComponent/DataTable.vue';
export default {
  name: 'accounting',
  components: { DataTable },
  data() {
    return {
      form:{
        queryName: '',
        accountStatus: '99',
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
          slotName: 'accountStatus',
          label: '核算状态'
        },
        {
          prop: 'supplierName',
          label: '企业名称'
        },
        {
          prop: 'productName',
          label: '产品名称'
        },
        {
          prop: 'countCarbon',
          label: '总碳排'
        },
        {
          prop: 'accountStartTime',
          label: '核算开始时间',
        },
        {
          prop: 'accountEndTime',
          label: '核算结束时间'
        }
      ],
      dialogVisible: false,
      dialogData: {},
      rowID:null,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchData();
      // this.getLineChart();
    })
  },
  methods: {
    handleAdd () {
      this.$router.push({
        path: '/accounting/calculate/CalculateCarbonEmissions'
      })
    },
    async fetchData() {
      this.loading = false;
      try {
        let obj = {
          queryName: this.form.queryName,
          accountStatus: this.form.accountStatus,
          pageNum: this.page.currentPage,
          pageSize: this.page.pageSize
        }
        const response = await queryCarbonAccountInfoPage(obj);
        console.log('获取借口数据：', response);
        this.tableData = response.data.list;
        this.page.total = response.data.total;
      } catch (error) {
        this.$message.error('获取数据失败');
      } finally {
        this.loading = false;
      }
    },
    // 查看报告
    handleView(row) {
      this.dialogVisible = true;
      this.rowID = row.id;
      this.getEmissionsData(row)
    },
    // 生成pdf
    async generateReport() {
      try {
        const res = await creatCarbonReport({id: this.rowID});
        console.log(res);
      }
      catch (error) {
        this.$message.error(error);
      }
    },
    async getEmissionsData(row) {
      const {data} = await queryCarbonAccountReport({id: row.id});
      this.dialogData = data;
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
  font-size: 14px;
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
.big-font {
  font-size: 16px;
  font-weight: bold;
  color: #1b1b1b;
}
#lineChartID {
  width: 100%;
  height: 320px;
  overflow-y: auto;
}
.remark {
  background-color: #ececef;
  border-radius: 6px;
  padding: 10px;
}

/* 进度条 */
.progress-title {
  margin-top: 10px;
  color: #2c3e50;
  display: flex;
  justify-content: space-between;
}

.progress-content {
  background-color: #ecf0f1;
  height: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #2ecc71;
  border-radius: 5px;
}
</style>
