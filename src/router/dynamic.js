/*
* 动态路由文件
* */
export  const dynamic = () => {
  const menuItems = [
    {
      path: '/CarbonAccounting',
      component: () => import('@/view/CarbonAccounting/index.vue'),
      meta: {
        name:"产品碳排核算",
        icon:'el-icon-my-mode2',
      },
      children: [
        {
          path: '/carbonOverview',
          component: () => import('@/view/CarbonAccounting/carbonOverview/index.vue'),
          meta: {
            name:"碳排总览",
            icon:'el-icon-my-menu2',
            iconActive: 'el-icon-my-menu1'
          }
        },
        {
          path: '/accounting',
          component: () => import('@/view/CarbonAccounting/accounting/index.vue'),
          meta: {
            name:"碳排核算",
            icon: 'el-icon-my-calculator2',
            iconActive: 'el-icon-my-calculator1'
          }
        },
        {
          path: '/CarbonEmissionFactorDatabase',
          component: () => import('@/view/CarbonAccounting/CarbonEmissionFactorDatabase/index.vue'),
          meta: {
            name:"碳排因子库",
            icon: 'el-icon-my-data2',
            iconActive: 'el-icon-my-data1'
          }
        },
        {
          path: '/CarbonModel',
          component: () => import('@/view/CarbonAccounting/CarbonModel/index.vue'),
          meta: {
            name:"碳排模型",
            icon: 'el-icon-my-set2',
            iconActive: 'el-icon-my-set1'
          }
        },
        {
          path: '/CarbonReport',
          component: () => import('@/view/CarbonAccounting/CarbonReport/index.vue'),
          meta: {
            name:"碳排报告",
            icon: 'el-icon-my-report2',
            iconActive: 'el-icon-my-report1'
          }
        },
        {
          path: '/ProductInformationDatabase',
          component: () => import('@/view/CarbonAccounting/ProductInformationDatabase/index.vue'),
          meta: {
            name:"产品信息库",
            icon: 'el-icon-my-book2',
            iconActive: 'el-icon-my-book1'
          }
        },
        {
          path: '/StandardDocumentLibrary',
          component: () => import('@/view/CarbonAccounting/StandardDocumentLibrary/index.vue'),
          meta: {
            name:"标准文件库",
            icon: 'el-icon-my-file2',
            iconActive: 'el-icon-my-file1'
          }
        },
      ]
    },
  ];
  return {
    menuItems
  }
}
