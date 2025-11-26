<template>
  <div class="expandable-table-container">
    <el-table
        :data="tableData"
        style="width: 100%"
        fit
        :default-expand-all="isOpen === 1"
        size="medium"
        :row-class-name="tableRowClassName"
        @expand-change="handleExpandChange"
    >
      <!-- 展开列 - 根据isOpen控制显示 -->
      <el-table-column v-if="isOpen === 1" type="expand" width="50">
        <template #default="props">
          <div class="child-table-container">
            <el-table :data="props.row.children" :show-header="false" :border="false" fit class="child-table">
              <!-- 子表格不需要序号列 -->
              <el-table-column width="130" align="center"></el-table-column>
              <el-table-column v-for="(header, index) in headers" :key="index" :prop="header.prop" align="center">
                <template #default="scope">
                  <!-- 动态渲染输入组件 -->
                  <component-renderer
                      :header="header"
                      :row-data="scope.row"
                      :type="'child'"
                      @input-change="handleChildInputChange"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>

      <!-- 序号列 -->
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>

      <!-- 动态表头列 -->
      <el-table-column v-for="(header, index) in headers" :key="index" :prop="header.prop" :label="header.label" align="center">
        <template #default="scope">
          <!-- 动态渲染输入组件 -->
          <component-renderer
              :header="header"
              :row-data="scope.row"
              :type="'parent'"
              @input-change="handleInputChange"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// 组件渲染器 - 用于根据inputType动态渲染不同的输入组件
const ComponentRenderer = {
  name: 'ComponentRenderer',
  props: {
    header: {
      type: Object,
      required: true
    },
    rowData: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: 'parent'
    }
  },
  methods: {
    handleInputChange(value) {
      this.$emit('input-change', {
        row: this.rowData,
        field: this.header.slotName,
        value: value,
        type: this.type
      });
    },

    // 检查是否应该显示输入组件
    shouldShowInputComponent() {
      const { header, rowData } = this;
      const { slotName } = header;

      // 如果没有slotName，直接显示文本
      if (!slotName) return false;

      // 检查行数据中是否有slotName对应的字段
      return rowData.hasOwnProperty(slotName);
    }
  },
  render(h) {
    const { header, rowData } = this;
    const { inputType, slotName, prop } = header;

    // 如果没有slotName，直接显示prop对应的文本
    if (!slotName) {
      return h('span', rowData[prop] || '');
    }

    // 如果行数据中没有slotName对应的字段，不显示输入组件
    if (!this.shouldShowInputComponent()) {
      return h('span', '');
    }

    // 根据inputType渲染不同的组件
    switch (inputType) {
      case '1': // 输入框
        return h('el-input', {
          props: {
            value: rowData[slotName],
            placeholder: '请输入'
          },
          on: {
            input: (value) => {
              rowData[slotName] = value;
              this.handleInputChange(value);
            },
            change: (value) => {
              this.handleInputChange(value);
            }
          }
        });

      case '2': // 下拉框
        return h('el-select', {
          props: {
            value: rowData[slotName],
            class: 'form-select'
          },
          on: {
            input: (value) => {
              rowData[slotName] = value;
              this.handleInputChange(value);
            },
            change: (value) => {
              this.handleInputChange(value);
            }
          }
        }, [
          (rowData.selectList || []).map(item =>
              h('el-option', {
                props: {
                  value: item.code,
                  label: item.name
                },
                key: item.code
              })
          )
        ]);

      default:
        // 默认情况下显示slotName对应的值
        return h('span', rowData[slotName] || '');
    }
  }
};

export default {
  name: 'ExpandableTable',
  components: {
    ComponentRenderer
  },
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
    },
    // 是否显示展开效果：0-不展示，1-展示
    isOpen: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 存储当前展开的行
      expandedRows: []
    };
  },
  methods: {
    // 处理主表格输入变化
    handleInputChange({ row, field, value, type }) {
      this.$emit('input-change', {
        row,
        field,
        value,
        type: 'parent'
      });
    },

    // 处理子表格输入变化
    handleChildInputChange({ row, field, value, type }) {
      this.$emit('input-change', {
        row,
        field,
        value,
        type: 'child'
      });
    },

    // 处理展开行变化
    handleExpandChange(row, expandedRows) {
      this.expandedRows = expandedRows;
      this.$emit('expand-change', { row, expandedRows });
    },

    // 设置行样式
    tableRowClassName({ row }) {
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

/* 下拉框样式 */
.form-select {
  width: 100%;
}
</style>