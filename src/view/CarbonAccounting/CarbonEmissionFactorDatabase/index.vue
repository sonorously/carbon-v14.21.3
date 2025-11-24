<!-- 碳排因子库 -->
<template>
  <div class="card">
    <div class="card-top">
      <h3>碳排因子库</h3>
      <div>
        <div class="icon-download" @click="handleAdd">
          <img src="@/assets/icon/add.png" width="15px" height="15px"/>
          <span style="margin-left: 5px">添加因子</span>
        </div>
      </div>
    </div>
    <div class="card-bottom">
      <el-form ref="form" :model="form" class="form-setting">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-select v-model="form.factorCategory" class="form-select" @change="fetchData">
              <el-option label="全部分类" value="99"></el-option>
              <el-option v-for="(item, index) in factorCategoryList" :key="index" :value="item.factorCategoryCode" :label="item.factorCategoryName"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input v-model="form.factorName" placeholder="搜索因子名称" prefix-icon="el-icon-search" @blur="fetchData"></el-input>
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
        <!-- 自定义操作按钮 -->
        <template #action-buttons="{ row }">
          <el-button type="text" icon="el-icon-edit" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" @click="handleDelete(row)" style="color: #f56c6c;">删除</el-button>
        </template>
      </data-table>
    </div>

    <el-dialog
      :title="titleName[dialogIndex]"
      :visible.sync="dialogVisible"
      width="450px"
      :modal="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" class="form-setting">
        <el-form-item label="因子名称：" prop="factorName">
          <el-input v-model="dialogForm.factorName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="因子数值：" prop="factorValue">
          <el-input v-model="dialogForm.factorValue" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="单位：" prop="factorUnit">
          <el-input v-model="dialogForm.factorUnit" placeholder="例如：kg CO₂/kWh"></el-input>
        </el-form-item>
        <el-form-item label="分类：" prop="factorCategory">
          <el-select v-model="dialogForm.factorCategory" class="form-select">
            <el-option v-for="(item, index) in factorCategoryList" :key="index" :value="item.factorCategoryCode" :label="item.factorCategoryName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="因子来源：" prop="factorSouce">
          <el-input v-model="dialogForm.factorSouce" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="备注(可选)：" prop="remark">
          <el-input type="textarea" v-model="dialogForm.remark" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitFactor('dialogForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCarbonFactorCategoryComboBox,
  saveCarbonFactorAdd,
  queryCarbonFactorPage,
  saveCarbonFactorModify,
  saveCarbonFactorDel,
} from "@/api";
import DataTable from '@/components/publicComponent/DataTable.vue';
import { getContextHeight } from '@/components/utils/index.js'
export default {
  name: 'CarbonEmissionFactorDatabase',
  components: { DataTable },
  data() {
    return {
      Subscript:["₀","₁","₂","₃","₄","₅","₆","₇","₈","₉"],
      Superscript:["⁰","¹","²","³","⁴","⁵","⁶","⁷","⁸","⁹"],
      form:{
        factorName: '',
        factorCategory: '99',
      },
      factorCategoryList: [],
      loading: false,
      tableData: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      columns: [
        {
          prop: 'factorName',
          label: '因子名称',
        },
        {
          prop: 'factorValue',
          label: '因子数值',
        },
        {
          prop: 'factorUnit',
          label: '单位',
        },
        {
          prop: 'factorCategory',
          label: '分类',
        },
        {
          prop: 'factorSouce',
          label: '因子来源',
        },
      ],
      //
      dialogVisible: false,
      titleName: ['添加碳排因子','编辑碳排因子'],
      dialogIndex: 0,
      dialogForm: {
        factorName: '',
        factorValue: '',
        factorUnit: '',
        factorCategory: '',
        factorSouce: '',
        remark: '',
      },
      dialogRules: {
        factorName: [{ required: true, message: '请输入', trigger: 'blur' }],
        factorValue: [{ required: true, message: '请输入', trigger: 'blur' }],
        factorUnit: [{ required: true, message: '请输入', trigger: 'blur' }],
        factorCategory: [{ required: true, message: '请选择', trigger: 'change' }],
        factorSouce: [{ required: true, message: '请输入', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
    }
  },
  mounted() {
    getContextHeight();
    this.fetchData();
    this.getCarbonFactorCategoryComboBox();
  },
  methods: {
    async fetchData() {
      this.loading = false;
      try {
        let obj = {
          factorName: this.form.factorName,
          factorCategory: this.form.factorCategory,
          pageNum: this.page.currentPage,
          pageSize: this.page.pageSize
        }
        const response = await queryCarbonFactorPage(obj);
        console.log('获取借口数据：', response);
        this.tableData = response.data.list;
        this.page.total = response.data.total;
      } catch (error) {
        this.$message.error('获取数据失败');
      } finally {
        this.loading = false;
      }
    },
    async getCarbonFactorCategoryComboBox() {
      try {
        let res = await getCarbonFactorCategoryComboBox({});
        console.log(res);
        this.factorCategoryList = res.data;
      } catch (error) {
        console.log(error);
      }
    },

    handleDelete(row) {
      this.$confirm(`确定删除当前数据?`, '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          let res = await saveCarbonFactorDel({id: row.id});
          if (res.status === 200) {
            this.$message.success('删除成功');
            await this.fetchData();
          }
        } catch (error) {
          this.$message.error('删除失败');
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
    },
    handleAdd () {
      this.dialogIndex = 0;
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogIndex = 1;
      this.dialogVisible = true;
      this.dialogForm = row;
    },
    // 新增 / 编辑
    submitFactor(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          switch (this.dialogIndex) {
            case 0:
              try {
                const res = await saveCarbonFactorAdd(this.dialogForm);
                console.log('当前res:',res.data,res.status);
                if(res.status === 200) {
                  this.$message.success('新增因子成功');
                  this.dialogVisible = false;
                  this.clearDialogForm();
                  await this.fetchData();
                }
              }catch(error) {
                this.$message.error(error)
              }
              break;
            case 1:
              try {
                const res = await saveCarbonFactorModify(this.dialogForm);
                console.log('当前res:',res.data,res.status);
                if(res.status === 200) {
                  this.$message.success('编辑因子成功');
                  this.dialogVisible = false;
                  this.clearDialogForm();
                  await this.fetchData();
                }
              }catch(error) {
                this.$message.error(error)
              }
              break;
            default:
              break;
          }

        }
      })
    },
    clearDialogForm () {
      this.dialogForm = {
        factorName: '',
        factorValue: '',
        factorUnit: '',
        factorCategory: '',
        factorSouce: '',
        remark: '',
      }
    },
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
