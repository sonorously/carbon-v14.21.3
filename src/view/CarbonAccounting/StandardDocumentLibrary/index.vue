<!-- 标准文件库 -->
<template>
  <div class="card">
    <div class="card-top">
      <h3>标准文件库</h3>
      <div>
        <div class="icon-download" @click="handleAddFile">
          <img src="@/assets/icon/add.png" width="15px" height="15px"/>
          <span style="margin-left: 5px">上传文件</span>
        </div>
      </div>
    </div>
    <div class="card-bottom">
      <el-form ref="form" :model="form" class="form-setting">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-input v-model="form.fileName" placeholder="搜索文件名称" prefix-icon="el-icon-search" @blur="fetchData"></el-input>
          </el-col>
          <el-col :span="4">
            <el-date-picker
              v-model="form.uploadTime"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              @blur="fetchData"
            >
            </el-date-picker>
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
        <template #fileName>
          <el-table-column label="文件名称">
            <template #default="scoped">
              <div class="state-office">
                <div class="state-office-style" v-if="scoped.row.fileType === 'pdf'">
                  <div class="state-office-logo logo-pdf"></div>
                  <div>{{scoped.row.fileName}}</div>
                </div>
                <div class="state-office-style" v-if="scoped.row.fileType === 'xlsx'">
                  <div class="state-office-logo logo-excel"></div>
                  <div>{{scoped.row.fileName}}</div>
                </div>
                <div class="state-office-style" v-if="scoped.row.fileType === 'docx'">
                  <div class="state-office-logo logo-word"></div>
                  <div>{{scoped.row.fileName}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
        <!-- 自定义操作按钮 -->
        <template #action-buttons="{ row }">
          <el-button type="text" icon="el-icon-download" @click="handleView(row)">下载</el-button>
          <el-button type="text" icon="el-icon-delete" @click="handleDelete(row)" style="color: #f56c6c;">删除</el-button>
        </template>
      </data-table>
    </div>
    <el-dialog
        title="文件上传"
        :visible.sync="dialogVisible"
        width="450px"
        :modal="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" class="form-setting">
        <el-form-item label="文件来源：" prop="fileSource">
          <el-input v-model="dialogForm.fileSource" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="文件编码：" prop="fileCode">
          <el-input v-model="dialogForm.fileCode" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <el-upload
          class="upload-demo"
          action=""
          :limit="1"
          ref="uploadFileList"
          :on-change="uploadChange"
          :auto-upload="false"
          :file-list="uploadFiles">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">文件上传格式不限，单次只能上传一个文件。</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearFile">取消</el-button>
        <el-button type="primary" @click="submitFile('dialogForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { queryStandardFilePage,getStandardFile, saveStandardFileAdd, saveStandardFileDel } from '@/api/index.js'
import DataTable from '@/components/publicComponent/DataTable.vue';
import { handleBlobDownload } from '@/components/utils/index.js'
export default {
  name: 'StandardDocumentLibrary',
  components: { DataTable },
  data() {
    return {
      form:{
        region: '1',
        date: ''
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
          slotName: 'fileName',
          label: '文件名称'
        },
        {
          prop: 'fileSource',
          label: '文件来源',
        },
        {
          prop: 'uploadTime',
          label: '文件上传时间'
        },
      ],
      dialogVisible: false,
      dialogForm: {
        fileSource: '',
        fileCode: '',
      },
      dialogRules: {
        fileSource: [{ required: true, message: '请输入', trigger: 'blur' }],
        fileCode: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
      uploadFiles:[],
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
          fileName: this.form.fileName,
          uploadTime: this.form.uploadTime,
          pageNum: this.page.currentPage,
          pageSize: this.page.pageSize
        }
        const response = await queryStandardFilePage(obj);
        console.log('获取借口数据：', response);
        this.tableData = response.data.list;
        this.page.total = response.data.total;
      } catch (error) {
        this.$message.error('获取数据失败');
      } finally {
        this.loading = false;
      }
    },
    // 下载
    handleView(row) {
      let obj = {
        id: row.id,
      }
      this.$confirm(`确定下载 "${row.fileName}" 吗?`, '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          const response = await getStandardFile(obj);
          handleBlobDownload(response, row.fileName);
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
    // 删除
    handleDelete(row) {
      this.$confirm(`确定删除文件 "${row.fileName}" 吗?`, '提示', {
        type: 'warning'
      }).then( async () => {
        try {
          let res = await saveStandardFileDel({ id: row.id });
          if (res.status === 200) {
            this.$message.success('删除成功');
            await this.fetchData();
          }
        } catch (error) {
          this.$message.error('删除失败');
        }
      });
    },
    // 文件上传
    handleAddFile() {
      this.dialogVisible = true;
    },
    submitFile(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          console.log('文件列表：', this.uploadFiles);
          if(this.uploadFiles && this.uploadFiles.length > 0) {
            let file = this.uploadFiles[0].raw;
            console.log('文件:',file);
            console.log('文件2:',JSON.stringify(this.dialogForm));
            let formData = new FormData();
            formData.append('file', file);
            formData.append('standardFile', JSON.stringify(this.dialogForm));
            try {
              const res = await saveStandardFileAdd(formData);
              console.log('当前res:',res.data,res.status);
              if(res.status === 200) {
                this.$message.success('文件上传成功');
                this.dialogVisible = false;
                this.clearFile();
                await this.fetchData();
              }
            }catch(error) {
              this.$message.error(error)
            }
          } else {
            return this.$message.error('文件为必填项！');
          }
        }
      })
    },
    // 清除上传表单
    clearFile() {
      this.dialogVisible = false;
      this.dialogForm = {
        fileSource: '',
        fileCode: '',
      }
      this.uploadFiles = []
    },
    uploadChange(file,fileList){
      this.uploadFiles = fileList;
    },
    // 分页
    handleSizeChange(size) {
      this.page.pageSize = size;
      this.page.currentPage = 1;
      this.fetchData();
    },
    handleCurrentChange(page) {
      this.page.currentPage = page;
      this.fetchData();
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
.state-office {
  width: 100%;
  height: 100%;
}
.state-office-style{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}
.state-office-logo {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat; /* 背景图不平铺 */
  background-size: cover; /* 背景图按比例缩放，覆盖整个容器 */
  background-position: center center; /* 背景图垂直、水平均居中 */
}
.logo-pdf {
  background-image: url('./icon/file-pdf.png');
}
.logo-excel {
  background-image: url('./icon/file-excel.png');
}
.logo-markdown {
  background-image: url('./icon/file-markdown.png');
}
.logo-ppt {
  background-image: url('./icon/file-ppt.png');
}
.logo-word {
  background-image: url('./icon/file-word.png');
}
.logo-zip {
  background-image: url('./icon/file-zip.png');
}

</style>
