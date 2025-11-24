<!-- 产品信息库 -->
<template>
  <div class="card">
    <div class="card-top">
      <h3>产品信息库</h3>
      <div>
        <div class="icon-download" @click="handleAdd">
          <img src="@/assets/icon/add.png" width="15px" height="15px"/>
          <span style="margin-left: 5px">新增产品</span>
        </div>
      </div>
    </div>
    <div class="card-bottom">
      <el-form ref="form" :model="form" class="form-setting">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-input v-model="form.queryName" placeholder="搜索产品名称/编码" prefix-icon="el-icon-search" @blur="fetchData"></el-input>
          </el-col>
          <el-col :span="4">
            <el-cascader
                v-model="productCategoryCode"
                :options="options"
                :props="cascaderProps"
                @change="handleChange"
                style="width: 100%"
            >
            </el-cascader>
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
        :title="dialogTitle[dialogIndex]"
        :visible.sync="dialogVisible"
        width="450px"
        :modal="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" class="form-setting">
        <el-form-item label="产品名称：" prop="productName">
          <el-input v-model="dialogForm.productName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="产品编码：" prop="productCode">
          <el-input v-model="dialogForm.productCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="产品类型：" prop="productCategoryCode">
          <el-cascader
              v-model="productCategoryCodeDialog"
              :options="options"
              :props="cascaderProps"
              @change="handleChangeDialog"
              style="width: 100%"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="产品型号：" prop="productSubclassName">
          <el-input v-model="dialogForm.productSubclassName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="产品描述：" prop="productDesc">
          <el-input type="textarea" row="3" v-model="dialogForm.productDesc" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit('dialogForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import DataTable from '@/components/publicComponent/DataTable.vue';
import {saveProductInfoAdd, queryProductInfoPage, getProductCategoryComboBox} from "@/api";
export default {
  name: 'ProductInformationDatabase',
  components: { DataTable },
  data() {
    return {
      form:{
        queryName: '',
        productCategoryCode: '',
      },
      productCategoryCode:[],
      options:[],
      cascaderProps: {
        value: 'productCategoryCode',    // 指定值字段
        label: 'productCategoryName',    // 指定显示字段
        children: 'child'                // 指定子级字段
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
          prop: 'productName',
          label: '产品名称',
        },
        {
          prop: 'productCode',
          label: '产品编码',
        },
        {
          prop: 'productCategoryName',
          label: '产品类型',
        },
        {
          prop: 'productSubclassName',
          label: '产品型号',
        },
        {
          prop: 'productDesc',
          label: '产品描述',
        }
      ],
      dialogVisible: false,
      dialogTitle: ['新增产品', '编辑产品'],
      dialogIndex: 0,
      dialogForm: {
        productName: '',
        productCode: '',
        productCategoryCode: '',
        productSubclassName: '',
        productDesc: ''
      },
      productCategoryCodeDialog: [],
      dialogRules: {
        productName: [{ required: true, message: '请输入', trigger: 'blur' }],
        productCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        productCategoryCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        productSubclassName: [{ required: true, message: '请输入', trigger: 'blur' }],
        productDesc: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
    }
  },
  mounted() {
    this.fetchData();
    this.gteProductType();
  },
  methods: {
    async fetchData() {
      this.loading = false;
      try {
        let obj = {
          queryName: this.form.queryName,
          productCategoryCode: this.form.productCategoryCode,
          pageNum: this.page.currentPage,
          pageSize: this.page.pageSize
        }
        const response = await queryProductInfoPage(obj);
        console.log('获取借口数据：', response);
        this.tableData = response.data.list;
        this.page.total = response.data.total;
      } catch (error) {
        this.$message.error('获取数据失败');
      } finally {
        this.loading = false;
      }
    },
    async gteProductType () {
      const res = await getProductCategoryComboBox({});
      this.options = res.data;
      console.log(res);
    },
    handleChange (value) {
      this.form.productCategoryCode = value[1];
      console.log('当前表单数据：', this.form);
      console.log('当前选择的数：', value);
      this.fetchData();
    },
    handleChangeDialog (value) {
      this.dialogForm.productCategoryCode = value[1];
      console.log('当前表单数据：', this.form);
      console.log('当前选择的数：', value);
      this.fetchData();
    },
    handleEdit(row) {
      this.dialogIndex = 1;
      this.dialogForm = row;
      this.dialogVisible = true;
    },
    // 新增
    handleAdd() {
      this.dialogIndex = 0;
      this.dialogVisible = true;
    },

    handleDelete(row) {
      this.$confirm(`确定删除用户 "${row.queryName}" 吗?`, '提示', {
        type: 'warning'
      }).then(async () => {
        // try {
        // await this.$http.delete(`/api/users/${row.id}`);
        // this.$message.success('删除成功');
        // this.fetchData();
        // } catch (error) {
        //   this.$message.error('删除失败');
        // }
      });
    },
    cancel () {
      this.dialogVisible = false;
      this.dialogForm = {
        productName: '',
        productCode: '',
        productCategoryCode: '',
        productSubclassName: '',
        productDesc: ''
      }
    },
    submit (form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          try {
            const res = await saveProductInfoAdd(this.dialogForm);
            console.log('当前res:',res.data,res.status);
            if(res.status === 200) {
              this.$message.success('产品新增成功');
              this.dialogVisible = false;
              this.cancel();
              await this.fetchData();
            }
          }catch(error) {
            this.$message.error(error)
          }
        }
      })
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
</style>
