<template>
  <div>
    <!-- 麵包屑導航區域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>權限管理</el-breadcrumb-item>
      <el-breadcrumb-item>權限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片區域 -->
    <el-card>
      <el-table :data="rightsList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="authName"
          label="權限名稱"
        ></el-table-column>
        <el-table-column prop="path" label="路徑"></el-table-column>
        <el-table-column prop="level" label="權限等級">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一級</el-tag>
            <el-tag type="success" v-if="scope.row.level === '1'">二級</el-tag>
            <el-tag type="warning" v-if="scope.row.level === '2'">三級</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 權限列表
      rightsList: []
    }
  },
  methods: {
    // 獲取權限列表
    async getRightsList() {
      const { data: result } = await this.$http.get('rights/list')
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.rightsList = result.data
    }
  },
  created() {
    this.getRightsList()
  }
}
</script>
