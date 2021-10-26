<template>
  <div>
    <!-- 麵包屑導航區域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片區域 -->
    <el-card>
      <!-- 搜尋. 添加按鈕區域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="請輸入內容"
            v-model="queryInfo.query"
            @keyup.enter.native="handelSearch"
            clearable
            @clear="handelClear"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handelSearch"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表區域 -->
      <el-table :data="goodsList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名稱" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品價格(元)"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="創建時間" width="140px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGood(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分頁功能區域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsList: [],
      // 獲取列表配置對象
      queryInfo: {
        // 當前頁數
        pagenum: 1,
        // 每頁顯示資料數
        pagesize: 10,
        // 查詢參數
        query: ''
      },
      // 商品列表資料總比數
      total: 0
    }
  },
  methods: {
    // 獲取商品列表
    async getGoodsList() {
      const { data: result } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.total = result.data.total
      this.goodsList = result.data.goods
    },
    // 當前顯示資料數變更觸發
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 當前頁數變更觸發
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 處理搜索事件
    handelSearch() {
      // 判斷有無輸入內容
      if (!this.queryInfo.query.trim()) {
        return this.$message.error('請輸入搜尋關鍵字')
      }
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    // 處理清空搜索框事件
    handelClear() {
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    // 根據id刪除事件
    async removeGood(id) {
      const confirmResult = await this.$confirm(
        '此操作將永久刪除該刪品，是否繼續?',
        '提示',
        {
          confirmButtonText: '確定',
          cancleButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message('取消刪除')
      }
      const { data: result } = await this.$http.delete(`goods/${id}`)
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
        this.$message.success(result.meta.msg)
        this.getGoodsList()
    },
    // 跳轉到商品添加頁面
    goAddPage() {
      this.$router.push('/goods/add')
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>
