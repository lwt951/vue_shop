<template>
  <div>
    <!-- 麵包屑導航區域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分類</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片區域 -->
    <el-card>
      <!-- 添加按鈕區域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分類</el-button
          >
        </el-col>
      </el-row>
      <!-- 商品分類列表區域 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        show-index
        index-text="#"
        stripe
        border
        :expand-type="false"
        :selection-type="false"
        :show-row-hover="false"
        :columns="colums"
      >
        <!-- 是否有效模板 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-erroe"
            v-if="scope.row.cat_deleted"
            style="color: red"
          ></i>
          <i class="el-icon-success" v-else style="color: lightgreen"></i>
          <i></i>
        </template>
        <!-- 排序模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一級</el-tag>
          <el-tag
            type="success"
            v-else-if="scope.row.cat_level === 1"
            size="mini"
            >二級</el-tag
          >
          <el-tag type="warning" v-else size="mini">三級</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="operate" slot-scope="scope">
          <!-- 編輯按鈕 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCateDialog(scope.row)"
            >編輯</el-button
          >
          <!-- 刪除按鈕 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCate(scope.row)"
            >刪除</el-button
          >
        </template>
      </tree-table>
      <!-- 分頁功能 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :total="total"
        :page-size="queryInfo.pagesize"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 添加分類彈出框 -->
    <el-dialog
      title="添加分類"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分類的表單 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
      >
        <el-form-item label="分類名稱:" prop="cat_name" label-width="100px">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父級分類:" label-width="100px">
          <!-- options用來指定數據源 -->
          <!-- props用來指定配置對象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            ref="cascaderRef"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addCate">確定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改分類"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="addCateFormRules"
        ref="editCateFormRef"
      >
        <el-form-item label="分類名稱:" prop="cat_name" label-width="100px">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editCate">確定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查詢條件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分類的數據列表
      cateList: [],
      // 總數據條數
      total: 0,
      // 為table指定列的定義
      colums: [
        {
          label: '分類名稱',
          prop: 'cat_name',
          width: '400px'
        },
        {
          label: '是否有效',
          minWidth: '50px',
          // 表示此列定義為模板
          type: 'template',
          // 表示此列使用的模板
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          minWidth: '180px',
          type: 'template',
          template: 'operate'
        }
      ],
      // 添加彈出框控制
      addCateDialogVisible: false,
      // 添加分類對象
      addCateForm: {
        // 將要添加的分類名聲
        cat_name: '',
        // 父級分類的id
        cat_pid: 0,
        // 分類的等級 默認添加一級分類
        cat_level: 0
      },
      // 添加分類驗證規則
      addCateFormRules: {
        cat_name: [
          { required: true, message: '請輸入分類名稱', trigger: 'blur' },
          { min: 2, max: 16, message: '分類名稱長度不符', trigger: 'blur' }
        ]
      },
      // 父級分類列表
      parentCateList: [],
      // 指定級聯選擇器配置對象
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 選中的父級分類的id數組
      selectedKeys: [],
      // 修改彈出框控制
      editCateDialogVisible: false,
      // 修改分類對象
      editCateForm: {
        cat_name: ''
      }
    }
  },
  methods: {
    // 獲取商品分類列表
    async getCateList() {
      const { data: result } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      // 將商品分類列表賦值給cateList
      this.cateList = result.data.result
      // 為總條數數據賦值
      this.total = result.data.total
    },
    // 換頁功能
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 點擊按鈕顯示添加分類彈出框
    showAddCateDialog() {
      // 獲取父級分類列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 獲取父級分類列表
    async getParentCateList() {
      const { data: result } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (result.meta.status !== 200) {
        this.$message.error(result.meta.msg)
      }
      // 把獲取到的父級分類列表賦值到parantCateList
      this.parentCateList = result.data
    },
    // 選擇項發生變化觸發此函數
    parentCateChange() {
      // 父級分類的id
      this.addCateForm.cat_pid =
        this.selectedKeys[this.selectedKeys.length - 1] || 0
      // 為當前分類等級賦值
      this.addCateForm.cat_level = this.selectedKeys.length
      // 關閉父級選擇菜單
      this.$refs.cascaderRef.handleDropdownLeave()
    },
    // 點擊按鈕添加新的分類
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: result } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (result.meta.status !== 201) {
          return this.$message.error(result.meta.msg)
        }
        this.$message.success(result.meta.msg)
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 監聽表單關閉事件
    addCateDialogClosed() {
      // 清空選擇到的父級分類的id數組
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
      // 重置表單輸入框資料跟驗證
      this.$refs.addCateFormRef.resetFields()
      // 重置級聯選擇
    },
    // 點級修改按鈕事件
    showEditCateDialog(cateInfo) {
      this.editCateForm = cateInfo
      this.editCateDialogVisible = true
    },
    // 修改表單事件
    editCate() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: result } = await this.$http.put(
          `categories/${this.editCateForm.cat_id}`,
          { cat_name: this.editCateForm.cat_name }
        )
        if (result.meta.status !== 200) {
          return this.$message.error(result.meta.msg)
        }
        this.$message.success(result.meta.msg)
        this.getCateList()
        this.editCateDialogVisible = false
      })
    },
    // 監聽修改表單關閉事件
    editCateDialogClosed() {
      this.editCateForm = {}
      this.$refs.editCateFormRef.resetFields()
    },
    // 移除分類By id
    async removeCate(cateInfo) {
      const confirmResult = await this.$confirm(
        `確認刪除 ${cateInfo.cat_name} ?`,
        '提示',
        {
          confirmButtonText: '確定',
          cancleButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
          return this.$message('取消刪除')
      }
      const { data: result } = await this.$http.delete(`categories/${cateInfo.cat_id}`)
      if (result.meta.status !== 200) {
          return this.$message.error(result.meta.msg)
      }
      this.$message.success(result.meta.msg)
      this.getCateList()
    }
  },
  created() {
    this.getCateList()
  }
}
</script>
<style lang="scss" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
