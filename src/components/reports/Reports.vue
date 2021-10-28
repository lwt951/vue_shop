<template>
  <div>
    <!-- 麵包屑導航區域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>數據統計</el-breadcrumb-item>
      <el-breadcrumb-item>數據報表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片區域 -->
    <el-card>
      <!-- 為echarts準備一個含寬高的Dom -->
      <div id="echartsBox" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>
<script>
// 導入echarts
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      // 需要合併的原報表數據
      localOption: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  // 此時頁面上的元素已經被渲染可以獲取Dom, created()則不能獲取Dom
  async mounted() {
    // 基於準備好的Dom, 初始化echart實俐
    const myChart = echarts.init(document.getElementById('echartsBox'))
    // 準備echarts配置對象
    const { data: result } = await this.$http.get('reports/type/1')
    if (result.meta.status !== 200) {
      return this.$message.error(result.meta.msg)
    }
    // 用lodash組件的merge方法合併兩報表對象(此方法不會有重名屬性覆蓋問題)
    const option = _.merge(this.localOption, result.data)
    // 展示echarts數據
    myChart.setOption(option)
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.echarts {
  width: 300px;
  height: 300px;
}
</style>
