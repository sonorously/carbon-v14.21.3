<template>
  <div style="height: 100%;overflow-y: auto">
    <div class="one">
      <div class="one-a">
        <div class="one-a-left">
          <p>核算产品数量</p>
          <p style="font-size: 30px;font-weight: bold;">{{accountCollectObj.accountProductAmount}}</p>
          <p>
            <i v-if="accountCollectObj.accountProductWithLastMonthFlag === '1'" class="el-icon-top" style="color: red;font-weight: bold;"></i>
            <i v-else class="el-icon-bottom" style="color: red;font-weight: bold;"></i>
            <span style="color: red">{{accountCollectObj.accountProductWithLastMonth}}</span>较上月
          </p>
        </div>
        <div class="one-a-right">
          <div class="one-a-right-bg">
            <img src="@/assets/icon/mode.png" width="30px" height="30px" style="margin-top: 10px"/>
          </div>
        </div>
      </div>
      <div class="one-a">
        <div class="one-a-left">
          <p>行业覆盖数量</p>
          <p style="font-size: 30px;font-weight: bold;">{{accountCollectObj.industriesCovered}}</p>
          <p>
            <i v-if="accountCollectObj.industriesCoveredLastMonthFlag === '1'" class="el-icon-top" style="color: red;font-weight: bold;"></i>
            <i v-else class="el-icon-bottom" style="color: red;font-weight: bold;"></i>
            <span style="color: red">{{accountCollectObj.industriesCoveredLastMonth}}</span>较上月
          </p>
        </div>
        <div class="one-a-right">
          <div class="one-a-right-bg">
            <img src="@/assets/icon/git.png" width="30px" height="30px" style="margin-top: 10px"/>
          </div>
        </div>
      </div>
      <div class="one-a">
        <div class="one-a-left">
          <p>核算企业数量</p>
          <p style="font-size: 30px;font-weight: bold;">{{accountCollectObj.accountEnterpriseNumber}}</p>
          <p>
            <i v-if="accountCollectObj.accountEnterpriseNumberLastMonthFlag === '1'" class="el-icon-top" style="color: red;font-weight: bold;"></i>
            <i v-else class="el-icon-bottom" style="color: red;font-weight: bold;"></i>
            <span style="color: red">{{accountCollectObj.accountEnterpriseNumberLastMonth}}</span>较上月
          </p>
        </div>
        <div class="one-a-right">
          <div class="one-a-right-bg">
            <img src="@/assets/icon/datacenter.png" width="30px" height="30px" style="margin-top: 10px"/>
          </div>
        </div>
      </div>
      <div class="one-a">
        <div class="one-a-left">
          <p>总碳排放量</p>
          <p style="font-size: 30px;font-weight: bold;">{{accountCollectObj.carbonEmissionsTotal}}</p>
          <p>
            <i v-if="accountCollectObj.carbonEmissionsTotalLastMonthFlag === '1'" class="el-icon-top" style="color: red;font-weight: bold;"></i>
            <i v-else class="el-icon-bottom" style="color: red;font-weight: bold;"></i>
            <span style="color: red">{{accountCollectObj.carbonEmissionsTotalLastMonth}}</span>较上月
          </p>
        </div>
        <div class="one-a-right">
          <div class="one-a-right-bg">
            <img src="@/assets/icon/cloud.png" width="30px" height="25px" style="margin-top: 10px"/>
          </div>
        </div>
      </div>

    </div>
    <div class="two">
      <div class="two-a">
        <div class="card-top">
          <h3>碳足迹总览</h3>
          <div>
<!--            <el-button>月度</el-button>-->
<!--            <el-button>季度</el-button>-->
<!--            <el-button>年度</el-button>-->
          </div>
        </div>
        <div id="lineChartID" class="card-bottom"></div>
      </div>
      <div class="two-b">
        <div class="card-top">
          <h3>各阶段碳排放分布</h3>
          <div>
<!--            <el-button type="text">详情</el-button>-->
          </div>
        </div>
        <div id="ringChartID" class="card-bottom"></div>
      </div>
    </div>
    <div class="three">
      <div class="card-top">
        <h3>产品碳足迹摘要</h3>
        <div>
<!--          <div class="icon-download">-->
<!--            <img src="@/assets/icon/d2.png" width="15px" height="15px"/>-->
<!--            <span style="margin-left: 5px">导出数据</span>-->
<!--          </div>-->
        </div>
      </div>
      <div class="card-bottom" id="tableHeight">
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
            :showActions="false"
            :height="height"
        >
          <template #phone1>
            <el-table-column label="核算状态">
              <template v-slot:default="scoped">
                <div class="state-commons">
                  <div class="state-common state-ywc" v-if="scoped.row.status === '4'"> 已完成 </div>
                  <div class="state-common state-dhs" v-if="scoped.row.status === '2'"> 待核算 </div>
                  <div class="state-common state-hsz" v-if="scoped.row.status === '3'"> 核算中 </div>
                  <div class="state-common state-ybh" v-if="scoped.row.status === '5'"> 已驳回 </div>
                </div>
              </template>
            </el-table-column>
          </template>
        </data-table>
      </div>
    </div>
  </div>
</template>

<script>
import {queryCarbonAccountCollect, queryCarbonOverview, queryCarbonDigest} from "@/api/index.js"
import DataTable from '@/components/publicComponent/DataTable.vue';
export default {
  name: 'carbonOverview',
  components: { DataTable },
  data() {
    return {
      Subscript:["₀","₁","₂","₃","₄","₅","₆","₇","₈","₉"], // 下标
      Superscript:["⁰","¹","²","³","⁴","⁵","⁶","⁷","⁸","⁹"], // 上标
      isShow: false,
      loading: false,
      accountCollectObj: {},
      overviewObj: {},
      tableData: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      columns: [
        {
          prop: 'supplierName',
          label: '产品名称'
        },
        {
          prop: 'productName',
          label: '企业名称'
        },
        {
          prop: 'countCarbon',
          label: '总碳排放量'
        },
        {
          prop: 'maintages',
          label: '主要排放阶段'
        },
        {
          prop: 'accountTime',
          label: '核算日期'
        }
      ],
      height: 0,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getHeight();
      this.queryCarbonAccountCollect();
      this.queryCarbonOverview();
      this.queryCarbonDigest();
      this.fetchData();
    })
  },
  methods: {
    async queryCarbonAccountCollect () {
      const {data} = await queryCarbonAccountCollect({});
      this.accountCollectObj = data
      console.log('1:', data);
    },
    async queryCarbonOverview () {
      const {data} = await queryCarbonOverview({});
      this.overviewObj = data;
      await this.getLineCharts();
      await this.getRingCharts();
      console.log('2:',data);
    },
    async queryCarbonDigest () {
      const {data} = await queryCarbonDigest({});
      this.tableData = data.list;
      console.log('3:',data);
    },
    // 动态给table的高度赋值
    getHeight() {
      let divID = document.getElementById('tableHeight');
      // -90 的原因是有上下20的padding，50的分页高度
      let divHeight = divID.offsetHeight - 90;
      this.height = divHeight;
      console.log('当前div的高度', divHeight);
    },
    // 折线图
    getLineCharts(){
      let myCharts = this.$echarts.init(document.getElementById('lineChartID'));
      myCharts.resize();
      let options = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: "rgba(4, 21, 48, 0.75)",
          borderColor: "rgb(43,72,114)", //设置边框颜色
          textStyle: {
            color: '#ffffff',
          },
          // formatter: function (params) {
          //   let result = params[0].name + '<br/>';
          //   params.forEach((item, index) => {
          //     // 为每个数据项使用预定义的富文本样式
          //     result += `{squareMarker${index}|} ${item.seriesName}: ${item.data}<br/>`;
          //   });
          //   return result;
          // },
          rich: {
            // 可以定义一个通用的样式，或者为不同系列定义不同样式
            squareMarker0: {
              width: 12,
              height: 12,
              backgroundColor: 'rgb(74,129,245)', // 颜色也可以在formatter中动态设置
              borderColor: '#314659',
              borderWidth: 2,
              borderRadius: 2, // 0为直角，根据需要调整
              // 还可以定义阴影等效果
              // shadowColor: 'rgba(0, 0, 0, 0.5)',
              // shadowBlur: 4
            },
            squareMarker1: {
              width: 12,
              height: 12,
              backgroundColor: 'rgb(242,208,101)', // 颜色也可以在formatter中动态设置
              borderColor: '#4b5508',
              borderWidth: 2,
              borderRadius: 2, // 0为直角，根据需要调整
              // 还可以定义阴影等效果
              // shadowColor: 'rgba(0, 0, 0, 0.5)',
              // shadowBlur: 4
            },
          }
        },
        color:['rgb(74,129,245)','rgb(242,208,101)'],
        legend: {
          top: 0,
          left: 'center',
          itemGap: 20,
          textStyle: {
          },
          itemStyle: {
            borderWidth: 1,         // 图例图标边框宽度
            borderColor: 'rgba(7,145,214,0.4)'  // 图例图标边框颜色
          },
          icon: 'roundRect',
          data: ['产品碳排放量(吨CO₂)', '核算产品数量']
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {//x轴线的颜色以及宽度 刻度线
              show: true,
              lineStyle: {
                color: "rgba(7,145,214,1)",
                width: 1,
                type: "solid"
              }
            },
            //是否显示刻度线
            axisTick: {
              show: true
            },
            axisLabel: {
              textStyle: {
              },
            },
            splitLine: {//分割线配置
              show: false,
              lineStyle: {
                color: "#666",
              }
            },
            data: this.overviewObj.carbonFootprint.month
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '产品碳排放量(吨CO₂)',
            nameLocation: 'middle',
            nameRotate: 90,
            nameGap: 100,
            position: 'left',
            axisLabel: {//y轴文字的配置
              textStyle: {
                margin: 15
              },
              // formatter: '{value} %'//y轴的每一个刻度值后面加上‘%’号
            },
            axisTick: {
              show: false,
            },
            axisLine: {//y轴线的颜色以及宽度
              show: false,
              lineStyle: {
                color: "#666",
                width: 1,
                type: "solid"
              },
            },
            splitLine: {//分割线配置
              show:true,
              lineStyle: {
                color: "rgba(7,145,214,0.4)",
                width: 1,
                type: "dashed",
              }
            }
          },
          {
            type: 'value',
            name: '核算产品数量',
            nameLocation: 'middle',
            nameRotate: 270,
            nameGap: 30,
            position: 'right',
            axisLabel: {//y轴文字的配置
              textStyle: {
                margin: 15
              },
              // formatter: '{value} %'//y轴的每一个刻度值后面加上‘%’号
            },
            axisTick: {
              show: false,
            },
            axisLine: {//y轴线的颜色以及宽度
              show: false,
              lineStyle: {
                color: "#666",
                width: 1,
                type: "solid"
              },
            },
            splitLine: {//分割线配置
              show:true,
              lineStyle: {
                color: "rgba(214,173,7,0.4)",
                width: 1,
                type: "dashed",
              }
            }
          }
        ],
        series: [
          {
            name: '产品碳排放量(吨CO₂)',
            type: 'line',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            smooth:true,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgb(74,129,245)'
                  },
                  {
                    offset: 0.2,
                    color: 'rgba(74,129,245,0.4)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(74,129,245,0)'
                  }
                ]),//线条渐变色
                lineStyle: { // 系列级个性化折线样式
                  width: 2,
                  type: 'solid',
                  color: 'rgb(74,129,245)',
                }
              },
              emphasis: {
                color: 'rgb(74,129,245)',
                lineStyle: { // 系列级个性化折线样式
                  width: 2,
                  type: 'dotted',
                  color: 'rgb(74,129,245)',
                }
              }
            },//线条样式
            data: this.overviewObj.carbonFootprint.carbonNum,
            yAxisIndex: 0
          },
          {
            name: '核算产品数量',
            type: 'line',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            smooth:true,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgb(242,208,101)'
                  },
                  {
                    offset: 0.2,
                    color: 'rgba(242,208,101,0.4)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(242,208,101,0)'
                  }
                ]),//线条渐变色

                lineStyle: {        // 系列级个性化折线样式
                  width: 2,
                  type: 'solid',
                  color: 'rgb(242,208,101)',
                }
              },
              emphasis: {
                color: 'rgb(242,208,101)',
                lineStyle: {        // 系列级个性化折线样式
                  width: 2,
                  type: 'dotted',
                  color: 'rgb(242,208,101)',
                }
              }
            },//线条样式
            data: this.overviewObj.carbonFootprint.productNum,
            yAxisIndex: 1
          },
        ]
      };
      myCharts.setOption(options);
      window.addEventListener('resize',function (){
        myCharts.resize();
      });
    },
    // 环状图
    getRingCharts() {
      let myCharts = this.$echarts.init(document.getElementById('ringChartID'));
      myCharts.resize();
      let options = {
        tooltip: {
          // trigger: 'axis',
          backgroundColor: "rgba(4, 21, 48, 0.75)",
          borderColor: "rgb(43,72,114)", //设置边框颜色
          textStyle: {
            color: '#ffffff',
          },
        },
        legend: {
          top: '0%',
          left: 'center'
        },
        series: [
          {
            // name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.overviewObj.carbonEmissionDistribution
          }
        ]
      };
      myCharts.setOption(options);
      window.addEventListener('resize',function (){
        myCharts.resize();
      });
    },

    // table列表
    async fetchData() {
      this.loading = false;
      try {
        let obj = {
          pageNum: this.page.currentPage,
          pageSize: this.page.pageSize
        }
        const response = await queryCarbonDigest(obj);
        console.log('获取借口数据：', response);
        this.tableData = response.data.list;
        this.page.total = response.data.total;
      } catch (error) {
        this.$message.error('获取数据失败');
      } finally {
        this.loading = false;
      }
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
  }
}
</script>

<style scoped>
.one {
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.one-a {
  flex: 1;
  background: #ffffff;
  border-radius: 6px;
  display: flex;

}
.one-a-left {
  flex: 1;
  padding: 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.one-a-right {
  width: 100px;
  display: flex;
  justify-content: center;
}
.one-a-right-bg {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  text-align: center;
  background-color: rgb(233,238,255);
  margin-top: 30px;
}

.two {
  width: 100%;
  height: 450px;
  margin-top: 20px;
  display: flex;
  gap: 20px;
}
.two-a, .two-b {
  background-color: #ffffff;
  border-radius: 6px;
}
.two-a {
  flex: 1;
}
.card-top {
  height: 50px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-bottom {
  height: calc(100% - 50px);
  padding: 20px;
}
.two-b {
  width: 500px;
  height: 100%;
}

.three {
  width: 100%;
  height: calc(100% - 640px);
  min-height: 300px;
  border-radius: 6px;
  margin-top: 20px;
  background-color: #ffffff;
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
