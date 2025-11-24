<template>
  <div class="data-table-container">
    <!-- 表格顶部操作栏 -->
    <div v-if="$slots.toolbar || $props.showRefresh" class="table-toolbar">
      <slot name="toolbar">
        <div class="toolbar-default">
          <el-button v-if="showRefresh" type="text" icon="el-icon-refresh" @click="handleRefresh"> 刷新 </el-button>
        </div>
      </slot>
    </div>

    <!-- 主表格 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      :border="border"
      :stripe="stripe"
      :size="size"
      :max-height="maxHeight"
      :highlight-current-row="highlightCurrentRow"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      v-bind="$attrs"
    >
      <!-- 选择列 -->
      <el-table-column v-if="showSelection" type="selection" width="55" align="center"/>
      <!-- 序号列 -->
      <el-table-column v-if="showIndex" type="index" :label="indexLabel" width="80" align="center"/>
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
  name: 'DataTable',
  inheritAttrs: false,

  props: {
    // 数据相关
    data: {
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
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['medium', 'small', 'mini'].includes(value)
    },
    maxHeight: {
      type: [String, Number],
      default: 500
    },

    // 功能开关
    showSelection: {
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
    showRefresh: {
      type: Boolean,
      default: false
    },
    highlightCurrentRow: {
      type: Boolean,
      default: true
    },

    // 分页配置
    showPagination: {
      type: Boolean,
      default: true
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
    }
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

    // 编辑操作
    handleEdit(row) {
      this.$emit('edit', row);
    },

    // 删除操作
    handleDelete(row) {
      this.$emit('delete', row);
    },

    // 刷新
    handleRefresh() {
      this.$emit('refresh');
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
.data-table-container {
  background: #fff;
}

.table-toolbar {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  background: #f5f7fa;
}

.toolbar-default {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-pagination {
  padding: 16px;
  text-align: right;
  border-top: 1px solid #ebeef5;
  background: #fff;
}
</style>
