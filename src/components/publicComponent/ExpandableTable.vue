<template>
  <div class="expandable-table-container">
    <el-table
        :data="tableData"
        style="width: 100%"
        fit
        default-expand-all
        size="medium"
        :row-class-name="tableRowClassName"
        @expand-change="handleExpandChange"
    >
      <!-- 展开列 -->
      <el-table-column type="expand" width="50">
        <template slot-scope="props">
          <div class="child-table-container">
            <el-table
                :data="props.row.children"
                :show-header="false"
                :border="false"
                fit
                class="child-table"
            >
              <!-- 子表格不需要序号列 -->
              <el-table-column width="130" align="center"></el-table-column>
              <el-table-column
                  v-for="(header, index) in headers"
                  :key="index"
                  :prop="header.prop"
                  align="center"
              >
                <template slot-scope="scope">
                  <template v-if="header.slotName">
                    <!-- 插槽列显示为输入框 -->
                    <el-input
                        v-model="scope.row[header.slotName]"
                        @change="handleChildInputChange(scope.row, header.slotName)"
                        placeholder="请输入"
                    ></el-input>
                  </template>
                  <template v-else>
                    {{ scope.row[header.prop] }}
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>

      <!-- 序号列 -->
      <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
      ></el-table-column>

      <!-- 动态表头列 -->
      <el-table-column
          v-for="(header, index) in headers"
          :key="index"
          :prop="header.prop"
          :label="header.label"
          align="center"
      >
        <template slot-scope="scope">
          <template v-if="header.slotName">
            <!-- 插槽列显示为输入框 -->
            <el-input
                v-model="scope.row[header.slotName]"
                @change="handleInputChange(scope.row, header.slotName)"
                placeholder="请输入"
            ></el-input>
          </template>
          <template v-else>
            {{ scope.row[header.prop] }}
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ExpandableTable',
  props: {
    // 表头配置
    headers: {
      type: Array,
      required: true,
      default: () => []
    },
    // 表格数据
    tableData: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      // 存储当前展开的行
      expandedRows: []
    };
  },
  methods: {
    // 获取列宽度
    getColumnWidth(header) {
      // 根据标签长度动态计算宽度
      const baseWidth = 120;
      const extraWidth = header.label.length * 15;
      return baseWidth + extraWidth;
    },

    // 处理主表格输入框变化
    handleInputChange(row, field) {
      this.$emit('input-change', { row, field, type: 'parent' });
    },

    // 处理子表格输入框变化
    handleChildInputChange(row, field) {
      this.$emit('input-change', { row, field, type: 'child' });
    },

    // 处理展开行变化
    handleExpandChange(row, expandedRows) {
      this.expandedRows = expandedRows;
      this.$emit('expand-change', { row, expandedRows });
    },

    // 设置行样式
    tableRowClassName({ row, rowIndex }) {
      return this.expandedRows.includes(row) ? 'expanded-row' : '';
    }
  }
};
</script>

<style scoped>
.expandable-table-container {
  width: 100%;
}

/* 子表格容器样式 */
.child-table-container {
  padding: 10px 0;
}

/* 子表格样式 */
.child-table {
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background-color: #f9f9f9;
}

/* 子表格行样式 */
.child-table ::v-deep .el-table__row {
  background-color: #f9f9f9;
}

/* 子表格单元格样式 */
.child-table ::v-deep .el-table__cell {
  border-bottom: 1px solid #e6e6e6;
  padding: 8px 0;
}

/* 展开行样式 */
.expandable-table-container ::v-deep .expanded-row {
  background-color: #f0f9ff;
}

/* 输入框必填样式 */
.expandable-table-container ::v-deep .el-input__inner:required {
  border-color: #409eff;
}

/* 主表格和子表格对齐 */
.expandable-table-container ::v-deep .el-table__header-wrapper th,
.expandable-table-container ::v-deep .el-table__body-wrapper td {
  text-align: center;
}

/* 确保子表格与主表格列宽一致 */
.expandable-table-container ::v-deep .el-table__expand-column .cell {
  padding: 0;
}
</style>