import layout from '@/components/layout/component/index.vue'
const routes = [
  {
    path: '/accounting/calculate',
    component: layout,
    name: 'CalculateCarbonEmissions',
    meta: {
      name: '碳排核算'
    },
    children: [
      {
        path: '/accounting/calculate/CalculateCarbonEmissions',
        component: () => import('@/view/CarbonAccounting/accounting/CalculateCarbonEmissions'),
        meta: {
          name:"计算碳排",
          activeMenu: '/accounting',
        }
      },
      {
        path: '/accounting/calculate/CalculateCarbonEmissionsStep',
        component: () => import('@/view/CarbonAccounting/accounting/CalculateCarbonEmissionsStep'),
        meta: {
          name:"分步骤计算碳排",
          activeMenu: '/accounting',
        }
      },
    ]
  },

]
export default routes;
