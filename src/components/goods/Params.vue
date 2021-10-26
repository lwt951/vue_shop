<template>
  <div>
    <!-- 麵包屑導航區域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>參數列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片視圖區域 -->
    <el-card>
      <!-- 警告文字區域 -->
      <el-alert
        title="注意!只允許第三級分類設置相關參數"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <!-- 選擇商品分類級聯區域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>選擇商品分類: </span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 標籤頁區域 -->
      <el-tabs v-model="activeName" @tab-click="handelTabClick">
        <!-- 動態參數標籤 -->
        <el-tab-pane label="動態參數" name="many">
          <!-- 添加參數按鈕 -->
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            size="mini"
            @click="addParamsVisible = true"
            >添加參數</el-button
          >
          <el-table style="width: 100%" :data="ParamsList" stripe border>
            <!-- 展開行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循環渲染tag標籤 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeAttrVals(scope.row, index)"
                >
                  {{ item }}
                  <!-- new tag/input切換標籤 -->
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  class="button-new-tag"
                  v-else
                  size="small"
                  @click="showInput"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="參數名稱" prop="attr_name">
            </el-table-column>
            <!-- 操作區域 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 編輯按鈕 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                  >編輯</el-button
                >
                <!-- 刪除按鈕 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row)"
                  >刪除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 靜態屬性標籤 -->
        <el-tab-pane label="靜態屬性" name="only">
          <!-- 添加屬性按鈕 -->
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            size="mini"
            @click="addParamsVisible = true"
            >添加屬性</el-button
          >
          <el-table style="width: 100%" :data="ParamsList" stripe border>
            <!-- 展開行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循環渲染tag標籤 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeAttrVals(scope.row, index)"
                >
                  {{ item }}
                  <!-- new tag/input切換標籤 -->
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  class="button-new-tag"
                  v-else
                  size="small"
                  @click="showInput"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="參數名稱" prop="attr_name">
            </el-table-column>
            <!-- 操作區域 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 編輯按鈕 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                  >編輯</el-button
                >
                <!-- 刪除按鈕 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row)"
                  >刪除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加參數/屬性彈出框 -->
    <el-dialog
      :title="'添加' + dialogTitle"
      :visible.sync="addParamsVisible"
      width="50%"
      @close="addParamsDialogClosed"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsFormRef"
      >
        <el-form-item
          :label="dialogTitle + ':'"
          prop="attr_name"
          label-width="100px"
        >
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsVisible = false">取消</el-button>
        <el-button type="primary" @click="addParams">確定</el-button>
      </span>
    </el-dialog>
    <!-- 編輯參數/屬性彈出框 -->
    <el-dialog
      :title="'修改' + dialogTitle"
      :visible.sync="editParamsVisible"
      width="50%"
      @close="editParamsDialogClosed"
    >
      <el-form
        :model="editParamsForm"
        :rules="addParamsFormRules"
        ref="editParamsFormRef"
      >
        <el-form-item
          :label="dialogTitle + ':'"
          prop="attr_name"
          label-width="100px"
        >
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsVisible = false">取消</el-button>
        <el-button type="primary" @click="editParams">確定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品分類的數據列表
      cateList: [],
      // 級聯選擇器雙向綁定的數組
      selectedCateKeys: [],
      // 指定級聯選擇器配置對象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 被選中的頁籤名稱
      activeName: 'many',
      // 參數屬性列表
      ParamsList: [],
      // 添加參數屬性彈框控制
      addParamsVisible: false,
      // 添加參數屬性資料對象
      addParamsForm: {
        attr_name: ''
      },
      // 添加參數屬性規則對象
      addParamsFormRules: {
        attr_name: [{ required: true, message: '請輸入名稱', trigger: 'blur' }]
      },
      // 控制修改框顯示與否
      editParamsVisible: false,
      // 修改參數屬性資料對象
      editParamsForm: {
        attr_name: ''
      },
      // new tag/input切換控制
      inputVisible: false,
      // new tag/input輸入的雙向綁定值
      inputValue: ''
    }
  },
  methods: {
    async getCateList() {
      const { data: result } = await this.$http.get('categories')
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.cateList = result.data
    },
    // 監控級聯選擇器選擇
    handleChange() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.ParamsList = []
      }
      // 根據當前所選id跟標籤去api請求資料
      this.getParamsList()
    },
    // 監控標籤tab點擊事件
    handelTabClick() {
      this.getParamsList()
    },
    // 獲取參數屬性列表
    async getParamsList() {
      // 判斷當前有無選擇分類
      if (this.cataId) {
        // 獲取動態參數或靜態屬性
        const { data: result } = await this.$http.get(
          `categories/${this.cataId}/attributes`,
          // 判斷要獲取動態參數或靜態屬性
          { params: { sel: this.activeName } }
        )
        if (result.meta.status !== 200) {
          return this.$message.error(result.meta.msg)
        }
        this.ParamsList = result.data
        // 將attr_vals從字符串轉成數組
        this.ParamsList.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
      }
    },
    // 添加參數屬性函數
    addParams() {
      this.$refs.addParamsFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: result } = await this.$http.post(
          `categories/${this.cataId}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (result.meta.status !== 201) {
          return this.$message.error(result.meta.msg)
        }
        this.$message.success(result.meta.msg)
        this.getParamsList()
        this.addParamsVisible = false
      })
    },
    // 添加彈框關閉事件
    addParamsDialogClosed() {
      this.addParamsForm = {}
      this.$refs.addParamsFormRef.resetFields()
    },
    // 顯示彈出修改框
    async showEditDialog(cateInfo) {
      // 取得最新當前參數資料
      const { data: result } = await this.$http.get(
        `categories/${cateInfo.cat_id}/attributes/${cateInfo.attr_id}`,
        { params: { attr_sel: this.activeName } }
      )
      if (result.meta.status !== 200) {
        this.$message.error(result.meta.msg)
      }
      this.editParamsForm = result.data
      this.editParamsVisible = true
    },
    // 修改參數/屬性函數
    editParams() {
      this.$refs.editParamsFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: result } = await this.$http.put(
          `categories/${this.editParamsForm.cat_id}/attributes/${this.editParamsForm.attr_id}`,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (result.meta.status !== 200) {
          return this.$message.error(result.meta.msg)
        }
        this.$message.success(result.meta.msg)
        this.editParamsVisible = false
        this.getParamsList()
      })
    },
    // 修改彈出框關閉事件
    editParamsDialogClosed() {
      this.editParamsForm = {}
      this.$refs.editParamsFormRef.resetFields()
    },
    // 刪除參數/屬性函數
    async removeParams(cateInfo) {
      const confirmResult = await this.$confirm(
        `確認刪除 ${cateInfo.attr_name} ?`,
        '提示',
        {
          confirmButtonText: '確定',
          cancleButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      // 如果用戶確認刪除，則返回值為字符串 confirm
      // 如果用戶取消刪除，則返回值為字符串 cancle
      if (confirmResult !== 'confirm') {
        return this.$message('取消刪除')
      }
      const { data: result } = await this.$http.delete(
        `categories/${cateInfo.cat_id}/attributes/${cateInfo.attr_id}`
      )
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.$message.success(result.meta.msg)
      this.getParamsList()
    },
    // 處理添加attr_vals
    handleInputConfirm(row) {
      if (this.inputValue.trim().length === 0) {
        this.inputValue = ''
        this.inputVisible = false
        return
      }
      // 如果沒有return，則證明輸入有效內容，需做後續處理
      // 將新內容推進attr_vals數組裡
      row.attr_vals.push(this.inputValue.trim())
      this.inputValue = ''
      this.inputVisible = false
      // 調用處理attr_vals API的函數
      this.saveAttrVals(row)
    },
    // 點擊new tag顯示文本輸入框
    showInput() {
      this.inputVisible = true
      // 讓文本框自動獲得焦點
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 移除attr_vals事件
    removeAttrVals(row, index) {
      // 移除對應index的value值
      row.attr_vals.splice(index, 1)
      // 調用處理attr_vals API的函數
      this.saveAttrVals(row)
    },
    // 將對attr_valus的操作存成一個函數 以供調用
    async saveAttrVals(row) {
      const { data: result } = await this.$http.put(
        `categories/${this.cataId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.$message.success(result.meta.msg)
    }
  },
  computed: {
    // 按鈕禁用狀態 禁用返回true 否則返回false
    isBtnDisabled() {
      return !(this.selectedCateKeys.length === 3)
    },
    // 當前選中的三級分類id
    cataId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 動態計算添加框標題
    dialogTitle() {
      return this.activeName === 'many' ? '動態參數' : '靜態屬性'
    }
  },
  created() {
    this.getCateList()
  }
}
</script>
<style lang="scss" scoped>
.cat_opt {
  margin: 15px 0px;
}
.el-tag {
  margin: 15px;
}
.el-tag:first-child {
  margin-left: 55px;
}
.input-new-tag {
  width: 120px;
}
.button-new-tag {
  margin: 15px;
}
</style>
