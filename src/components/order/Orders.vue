<template>
  <div>
    <!-- 麵包屑導航區域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>訂單管理</el-breadcrumb-item>
      <el-breadcrumb-item>訂單列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片區域 -->
    <el-card>
      <!-- 搜尋欄 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="請輸入內容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table stripe border :data="orderList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="訂單編號" prop="order_number"></el-table-column>
        <el-table-column label="訂單價格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '0'" type="danger"
              >未付款</el-tag
            >
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否發貨" prop="is_send"></el-table-column>
        <el-table-column label="下單時間">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="addressVisible = true"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location-outline"
              size="mini"
              @click="showProgress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分頁功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 3, 5, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址彈出框, 無功能-->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%">
      <el-form :model="address" label-width="80px">
        <el-form-item label="省縣區">
          <el-cascader
            v-model="address.address1"
            :options="citydata"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="詳細地址">
          <el-input v-model="address.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >確定</el-button
        >
      </span>
    </el-dialog>
    <!-- 查看物流進度彈框 -->
    <el-dialog title="物流進度" :visible.sync="progressVisible" width="50%">
        <!-- 時間線 -->
      <el-timeline>
        <el-timeline-item
          v-for="(progress, index) in progressInfo"
          :key="index"
          :timestamp="progress.time"
        >
          {{ progress.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressVisible = false">取消</el-button>
        <el-button type="primary" @click="progressVisible = false"
          >確定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import citydata from './citydata.js'
export default {
  data() {
    return {
      // 訂單列表
      orderList: [],
      // 獲取列表參數
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //  資料總筆數
      total: 0,
      // 控制修改地址彈框顯示
      addressVisible: false,
      // 修改地址對象
      address: {},
      // 地址數據
      citydata,
      // 物流進度
      progressInfo: [],
      // 控制物流彈框顯示
      progressVisible: false
    }
  },
  methods: {
    // 獲取訂單列表
    async getOrderList() {
      const { data: result } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (result.meta.status !== 200) {
        return this.$meessage.error(result.meta.msg)
      }
      this.orderList = result.data.goods
      this.total = result.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 假裝獲取物流資料並秀出物流進度彈框
    showProgress() {
      this.progressInfo = [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context:
            '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context:
            '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ]
      this.progressVisible = true
    }
  },
  created() {
    this.getOrderList()
  }
}
</script>
<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
