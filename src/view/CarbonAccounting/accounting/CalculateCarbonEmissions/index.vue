<!-- 碳排核算 -->
<template>
  <div class="card">
    <div class="card-top">
      <el-button @click="back" icon="el-icon-refresh-left">返回</el-button>
      <h3>碳排核算任务</h3>
    </div>
    <div class="card-bottom">
      <el-form ref="form" :model="form" :rules="rules" class="form-setting">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品类型：" prop="productCategoryCode">
              <el-cascader
                  v-model="productCategoryCode"
                  :options="options"
                  :props="cascaderProps"
                  @change="handleChange"
                  style="width: 100%"
              >
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准编号和名称：" prop="accountingStandards">
              <el-select v-model="form.accountingStandards" class="form-select">
                <el-option v-for="(item, index) in accountingStandardsList" :key="index" :value="item.standardFileCode" :label="item.standardFileName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品型号：" prop="productSubclassName">
              <el-input v-model="form.productSubclassName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称：" prop="supplierName">
              <el-input v-model="form.supplierName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="产品名称：" prop="productName">
              <el-input v-model="form.productName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="产品描述(可选)：">
              <el-input type="textarea" v-model="form.productDesc" :rows="5" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <el-row style="margin: 20px 0">
        <el-col align="center">
          <el-button type="primary" @click="calculationStart" style="width: 120px">开始计算</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getProductCategoryComboBox, getStandardFileComboBox } from '@/api/index.js'
export default {
  name: 'accounting',
  data() {
    return {
      form:{
        productName: "", //产品名称
        productCategoryCode: "", //产品类型
        accountingStandards: "", //核算标准
        productSubclassName: "", //产品型号
        supplierName: "", //企业名称
        productDesc: "", //产品描述
      },
      accountingStandardsList: [],
      // 级联
      productCategoryCode:[],
      options:[],
      cascaderProps: {
        value: 'productCategoryCode', // 指定值字段
        label: 'productCategoryName', // 指定显示字段
        children: 'child', // 指定子级字段
      },
      rules: {
        productCategoryCode: [{ required: true, message: '请选择', trigger: 'blur' }],
        accountingStandards: [{ required: true, message: '请输入', trigger: 'blur' }],
        productSubclassName: [{ required: true, message: '请输入', trigger: 'blur' }],
        supplierName: [{ required: true, message: '请选择', trigger: 'change' }],
        productName: [{ required: true, message: '请输入', trigger: 'blur' }],
        productDesc: [{ required: false, message: '请输入', trigger: 'blur' }],
      },
    }
  },
  mounted() {
    this.gteProductType();
    this.standardFileComboBox();
  },
  methods: {
    // 返回碳排核算页面
    back () {
      this.$router.push({
        path: '/accounting'
      })
    },
    // 跳转到碳排计算页面
    calculationStart () {
      // 路由跳转，params和query都是带参数
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$router.push({
            path: '/accounting/calculate/CalculateCarbonEmissionsStep',
            query: {
              productCategoryCode: this.form.productCategoryCode,
              accountingStandards: this.form.accountingStandards,
              productSubclassName: this.form.productSubclassName,
              supplierName: this.form.supplierName,
              productName: this.form.productName,
              productDesc: this.form.productDesc,

            }
          });
        }
      })
    },
    async gteProductType () {
      const res = await getProductCategoryComboBox({});
      try {
        if (res.status === 200) {
          this.options = res.data;
        }
      }
      catch (err) {
        this.$message.error(err.message);
      }
    },
    async standardFileComboBox() {
      const res = await getStandardFileComboBox({});
      try {
        this.accountingStandardsList = res.data.data;
        console.log('AAAAAAAAAAAAAA', res);
        console.log('BBBBBBBBBBBBBB', res.data);
        console.log('CCCCCCCCCCCCCC', this.accountingStandardsList);
      }
      catch (err) {
        this.$message.error(err.message);
      }
    },
    handleChange (value) {
      this.form.productCategoryCode = value[1];
      console.log('当前表单数据：', this.form);
      console.log('当前选择的数：', value);
    },
  },
}
</script>
<style scoped>
.card {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
.card-top {
  height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
}
.card-bottom {
  height: calc(100% - 60px);
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
}

</style>
