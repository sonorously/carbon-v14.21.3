<template>
  <div class="data-table-container">
    <!-- 主表格 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      :border="border"
      :fit="fit"
      :stripe="stripe"
      :size="size"
      :max-height="maxHeight"
      :highlight-current-row="highlightCurrentRow"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      v-bind="$attrs"
      class="data-table"
    >
      <!-- 选择列 -->
      <el-table-column v-if="showSelection" type="selection" width="55" align="center"/>
      <!-- 展开列 -->
      <el-table-column v-if="showExpand" type="expand" width="1" align="center">
        <template #default="scope">
          <el-table
            :data="scope.row.children"
            :border="false"
            :stripe="false"
            :fit="fit"
            size="size"
            :max-height="maxHeight"
            :highlight-current-row="highlightCurrentRow"
            v-bind="$attrs"
            :show-header="false"
            :cell-style="cellStyle"
            :cell-class-name="cellClassName"
            class="data-table-expand"
          >
            <el-table-column width="81" align="center"/>
            <template v-for="column in columns">
              <!-- 自定义列 -->
              <slot v-if="column.slotName" :name="column.slotName" :column="column" :row="column">
                <el-table-column :key="column.prop" v-bind="column" align="center"/>
              </slot>
              <!-- 普通列 -->
              <el-table-column v-else :key="column.prop" v-bind="column" align="center">
                <!-- 支持自定义单元格内容 -->
                <template v-if="column.formatter" #default="scope">
                  {{ column.formatter(scope.row, scope.column, scope.$index) }}
                </template>
              </el-table-column>
            </template>
          </el-table>
        </template>
      </el-table-column>
      <!-- 序号列 -->
      <el-table-column v-if="showIndex" type="index" :label="indexLabel" width="80" align="center">
        <template #default="scope">
          <!-- 自定义展开图标，通过作用域插槽获取当前行数据 -->
          <div v-if="showExpand" style="display: flex;justify-content: center;align-items: center;">
            <span>{{ scope.$index + 1 }}</span>
            <i class="el-icon-my-arrow rotating-transition" :class="{'rotating': scope.row.isRotating}"  @click.stop="toggleExpand(scope.row)"></i>
          </div>
          <div v-else>
            <span>{{ scope.$index + 1 }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 动态列渲染 -->
      <template v-for="column in columns">
        <!-- 自定义列 -->
        <slot v-if="column.slotName" :name="column.slotName" :column="column" :row="column">
          <el-table-column :key="column.prop" v-bind="column" align="center"/>
        </slot>
        <!-- 普通列 -->
        <el-table-column v-else :key="column.prop" v-bind="column" align="center">
          <!-- 支持自定义单元格内容 -->
          <template v-if="column.formatter" #default="scope">
            {{ column.formatter(scope.row, scope.column, scope.$index) }}
          </template>
        </el-table-column>
      </template>
      <!-- 操作列插槽 -->
      <slot name="actions" v-bind="{ row: $data, column: $props }">
        <el-table-column v-if="showActions" :label="actionsLabel" :width="actionsWidth" align="center" fixed="right">
          <template #default="scope">
            <slot name="action-buttons" :row="scope.row" :index="scope.$index">
              <!-- 默认操作按钮 -->
              <el-button v-if="showEdit" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button v-if="showDelete" type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </slot>
          </template>
        </el-table-column>
      </slot>
    </el-table>

    <!-- 分页组件 -->
    <div v-if="showPagination" class="table-pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :layout="paginationLayout"
        :total="total"
        :small="paginationSmall"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataTableExpand',
  inheritAttrs: false,
  props: {
    // 数据相关
    data: {
      type: Array,
      default: () => []
    },
    dataList: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    },
    rowKey: {
      type: [String, Function],
      default: 'id'
    },

    // 列配置
    columns: {
      type: Array,
      default: () => []
    },

    // 表格样式
    border: {
      type: Boolean,
      default: false
    },
    stripe: {
      type: Boolean,
      default: false
    },
    fit: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['medium', 'small', 'mini'].includes(value)
    },
    maxHeight: {
      type: [String, Number],
      default: null
    },

    // 功能开关
    showSelection: {
      type: Boolean,
      default: false
    },
    showExpand: {
      type: Boolean,
      default: false
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    indexLabel: {
      type: String,
      default: '序号'
    },
    showActions: {
      type: Boolean,
      default: true
    },
    actionsLabel: {
      type: String,
      default: '操作'
    },
    actionsWidth: {
      type: [String, Number],
      default: '200'
    },
    showEdit: {
      type: Boolean,
      default: true
    },
    showDelete: {
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {
      type: Boolean,
      default: true
    },

    // 分页配置
    showPagination: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100]
    },
    paginationLayout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    paginationSmall: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'selection-change',
    'sort-change',
    'row-click',
    'edit',
    'delete',
    'refresh',
    'size-change',
    'current-change',
    'update:currentPage',
    'update:pageSize'
  ],
  computed: {
    tableData() {
      return this.data;
    },
    tableDataList () {
      return this.dataList;
    },
  },
  data() {
    return {
      expandedRows: new Set() // 用于存储展开的行
    };
  },
  methods: {
    // 选择变化
    handleSelectionChange(selection) {
      this.$emit('selection-change', selection);
    },
    // 排序变化
    handleSortChange(sort) {
      this.$emit('sort-change', sort);
    },
    // 行点击
    handleRowClick(row, column, event) {
      this.$emit('row-click', row, column, event);
    },
    // 行点击展开
    toggleExpand(row) {
      row.isRotating = !row.isRotating;
      // 通过ref获取表格实例，并调用toggleRowExpansion方法:cite[4]
      this.$refs.tableRef.toggleRowExpansion(row);
    },
    // 展开表格的背景颜色
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex >= 1) {
        return {
          backgroundColor: '#f4f4f4', // 背景色
          borderLeft: '1px solid #ebeef5',
        };
      }
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // 为序号列添加特定类名
        return 'index-cell';
      } else {
        // 为其他列添加特定类名
        return 'normal-cell';
      }
    },
    // 编辑操作
    handleEdit(row) {
      this.$emit('edit', row);
    },

    // 删除操作
    handleDelete(row) {
      this.$emit('delete', row);
    },

    // 分页大小变化
    handleSizeChange(size) {
      this.$emit('update:pageSize', size);
      this.$emit('size-change', size);
    },

    // 当前页变化
    handleCurrentChange(page) {
      this.$emit('update:currentPage', page);
      this.$emit('current-change', page);
    },

    // 清空选择
    clearSelection() {
      this.$refs.tableRef.clearSelection();
    },

    // 获取当前选择的行
    getSelectionRows() {
      return this.$refs.tableRef.selection;
    },

    // 切换行的选择状态
    toggleRowSelection(row, selected) {
      this.$refs.tableRef.toggleRowSelection(row, selected);
    },

    // 设置当前行
    setCurrentRow(row) {
      this.$refs.tableRef.setCurrentRow(row);
    }
  }
};
</script>

<style scoped>
.rotating-transition {
  /* 添加平滑的过渡效果 */
  transition: transform 1s ease; /* 可根据需要调整过渡时间:cite[1] */
}
/* 应用动画的类名 */
.rotating {
  transform: rotate(180deg);
}
/* 隐藏表头中展开列的单元格 */
.data-table >>> .el-table__expand-column .cell {
  display: none;
}
.data-table-container {
  background: #fff;
}
/* 去除表格的默认边框和线 */

/* 去除表格最外层的边框线:cite[3] */
.data-table-expand >>> .el-table--border {
  border: none;
}
  /* 去除表格底部的横线:cite[1]:cite[3]:cite[8] */
.data-table >>> .el-table::before {
  height: 0 !important;
}
  /* 可选：去除表头底部的边框线 */
.data-table-expand  >>> .el-table th.is-leaf {
  border-bottom: none;
}
  /* 设置序号列样式 */
.data-table-expand  >>> .index-cell {
  background-color: transparent !important; /* 透明背景 */
  border: none !important; /* 无边框 */
}
  /* 设置其他数据列的边框和背景色 */
.data-table-expand  >>> .el-table__body .normal-cell {
  border-top: 1px solid #ebeef5;
  background-color: #ffffff; /* 背景色，可按需调整 */
}
  /* 设置其他表头列的边框和背景色 */
.data-table-expand  >>> .el-table__header .normal-cell {
  border-bottom: none !important;
  background-color: #f5f7fa; /* 表头背景色 */
}
.data-table-expand  >>> .el-table td.el-table__cell {
  border-bottom: unset!important;
}
.data-table-expand  >>> .el-table th.el-table__cell.is-leaf {
  border-bottom: unset!important;
}

.table-pagination {
  padding: 16px;
  text-align: right;
  border-top: 1px solid #ebeef5;
  background: #fff;
}
</style>
