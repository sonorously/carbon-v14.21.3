<!-- 碳排核算 -->
<template>
  <div class="card">
    <div class="card-top">
      <h3>碳排足迹计算器</h3>
    </div>
    <div class="card-bottom">
      <el-steps class="step-title" :active="activeStep" finish-status="success" simple>
        <el-step
            v-for="(step, index) in stepList"
            :key="index"
            :title="step.stepName"
            @click.native="handleStepClick(index)"
        ></el-step>
      </el-steps>
      <div class="step-content">
        <div class="step-content-button">
          <el-row v-if="activeStep === 0">
            <el-col align="right">
              <el-button type="primary" @click="handleAddFile">导入</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="step-item">
          <div v-if="stepData[activeStep]">
            <step-list v-if="stepData[activeStep].isOpen === 0" :isShow="Boolean(stepData[activeStep].isOpen)" :columns="stepData[activeStep].columns" :tableData="stepData[activeStep].childData"></step-list>
            <expandable-table
                v-if="stepData[activeStep].isOpen === 1"
                :headers="stepData[activeStep].columns"
                :table-data="stepData[activeStep].childData"
                @input-change="handleInputChange"
                @expand-change="handleExpandChange"
            />
          </div>
        </div>
        <!--<step-one v-if="activeStep === 0" @next-step="handleNextStep" @prev-step="handlePrevStep"></step-one>
        <step-two v-if="activeStep === 1" @next-step="handleNextStep" @prev-step="handlePrevStep"></step-two>
        <step-three v-if="activeStep === 2" @next-step="handleNextStep" @prev-step="handlePrevStep"></step-three>
        <step-four v-if="activeStep === 3" @next-step="handleNextStep" @prev-step="handlePrevStep"></step-four>-->
        <div class="step-footer">
          <el-row style="margin: 20px 0">
            <el-col align="center">
              <el-button v-if="activeStep === 0" @click="back">返回</el-button>
              <el-button v-if="activeStep !== 0" type="primary" @click="prev">上一阶段</el-button>
              <el-button v-if="activeStep !== stepList.length-1" type="primary" @click="next">下一阶段</el-button>
              <el-button v-if="activeStep === stepList.length-1" type="primary" @click="submitStep">完成</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-dialog
        title="文件上传"
        :visible.sync="dialogVisible"
        width="450px"
        :modal="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
      <el-upload
          class="upload-demo"
          action=""
          :limit="1"
          ref="uploadFileList"
          :on-change="uploadChange"
          :auto-upload="false"
          accept=".xls,.xlsx"
          :file-list="uploadFiles">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">文件上传格式为excel文件，单次只能上传一个文件。</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearFile">取消</el-button>
        <el-button type="primary" @click="submitFile()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ExpandableTable from '@/components/publicComponent/ExpandableTable.vue';
import StepList from '@/view/CarbonAccounting/accounting/CalculateCarbonEmissionsStep/StepList.vue';
import { getTypeModelByProduct, saveCarbonDataAdd, analysisUploadExcel } from '@/api/index.js'
export default {
  name: 'accounting',
  components: { StepList, ExpandableTable },

  data() {
    return {
      productCategoryCode: this.$route.query.productCategoryCode,
      activeStep: 0,
      stepList: [], // 分步骤标头
      stepData: [], // 分步骤数据
      loading: false,
      dialogVisible: false,
      dialogForm: {
        productCategoryCode: this.$route.query.productCategoryCode,
      },
      uploadFiles:[],
    }
  },
  mounted() {
    let obj = {
      productCategoryCode: this.productCategoryCode,
    }
    this.getTypeModelByProduct(obj);
  },
  methods: {
    handleInputChange({ row, field, type }) {
      console.log(`${type}表格输入变化:`, row, field);
      // 这里可以添加数据验证或提交逻辑
    },
    handleExpandChange({ row, expandedRows }) {
      console.log('展开行变化:', row, expandedRows);
    },
    async getTypeModelByProduct (obj) {
      const res = await getTypeModelByProduct(obj);
      console.log('获取table列表：', res);
      this.stepList = res.data.stepList;
      this.stepData = res.data.tableList;
    },
    handleStepClick (index) {
      console.log('分步骤点击下标', index);
      console.log('分步骤点击后当前activeStep', this.activeStep);
    },
    back () {
      this.$router.push({
        path: '/accounting/calculate/CalculateCarbonEmissions'
      })
    },
    prev () {
      if (this.activeStep > 0) {
        this.activeStep--
      }
    },
    next () {
      if (this.activeStep < (this.stepList.length - 1)) this.activeStep++
    },
    async submitStep () {
      let obj = {
        productName: this.$route.query.productName, //产品名称
        accountingStandards: this.$route.query.accountingStandards, //核算标准
        productSubclassName: this.$route.query.productSubclassName, //产品型号
        supplierName: this.$route.query.supplierName, //企业名称
        productDesc: this.$route.query.productDesc, //产品描述
        productCategoryCode: this.$route.query.productCategoryCode, //产品类型
        tableList: this.stepData
      }
      console.log("this.stepData对应的的值：", this.stepData);
      console.log("查看保存数据传值：", obj);
      let res = await saveCarbonDataAdd( JSON.stringify(obj));
      if (res.status === 200) {
        console.log("保存接口信息：", res);
        this.$message.success('保存成功！');
        await this.$router.push({
          path: '/accounting'
        })
      }
    },
    /*// 下一步处理
    handleNextStep(stepData) {
      // 保存当前步骤数据（如果子组件传递了数据）
      // if (stepData) {
      //   Object.assign(this.form[`step${this.active + 1}`], stepData)
      // }

      // 验证当前步骤数据（可根据需要添加）
      // if (this.validateCurrentStep()) {
      //   this.active++
      // }
      if (this.active < 3) this.active++
    },
    // 上一步处理
    handlePrevStep() {
      if (this.active > 0) {
        this.active--
      }
    },*/
    async fetchData(res) {
      this.stepList = res.data.stepList;
      this.stepData = res.data.tableList;
    },
    // 文件上传
    handleAddFile() {
      this.dialogVisible = true;
    },
    async submitFile() {
      if(this.uploadFiles && this.uploadFiles.length > 0) {
        let file = this.uploadFiles[0].raw;
        let formData = new FormData();
        formData.append('file', file);
        formData.append('carbonFile', JSON.stringify(this.dialogForm));
        try {
          const res = await analysisUploadExcel(formData);
          console.log('当前res:',res.data,res.status);
          if(res.status === 200) {
            this.$message.success('文件上传成功');
            this.dialogVisible = false;
            this.clearFile();
            await this.fetchData(res);
          }
        }catch(error) {
          this.$message.error(error)
        }
      } else {
        return this.$message.error('需上传文件！');
      }
    },
    // 清除上传表单
    clearFile() {
      this.dialogVisible = false;
      this.uploadFiles = []
    },
    uploadChange(file,fileList){
      this.uploadFiles = fileList;
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
.step-title {
  height: 80px;
}
.step-content {
  height: calc(100% - 80px);
  overflow: hidden;
}
.step-content-button {
  margin: 10px 0;
}
.step-footer {
  height: 40px;
  margin: 20px 0;
}
.step-item {
  height: calc(100% - 160px);
  overflow: auto;
}

</style>
