<template>
  <div>
    <!-- 麵包屑導航區域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片區域 -->
    <el-card>
      <el-alert
        title="添加商品訊息"
        type="info"
        show-icon
        :closable="false"
        center=""
      ></el-alert>
      <!-- 步驟條 -->
      <el-steps :active="+activeIndex" align-center finish-status="success">
        <el-step title="基本訊息"></el-step>
        <el-step title="商品參數"></el-step>
        <el-step title="商品屬性"></el-step>
        <el-step title="商品圖片"></el-step>
        <el-step title="商品內容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tabs標籤頁區 -->
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本訊息" name="0">
            <el-form-item label="商品名稱" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品價格" prop="goods_price">
              <el-input
                v-model.number="addForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model.number="addForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品數量" prop="goods_number">
              <el-input
                v-model.number="addForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分類" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品參數" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(item2, index2) in item.attr_vals"
                  :key="index2"
                  :label="item2"
                  border
                  va
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品屬性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品圖片" name="3">
            <!-- action 圖片要上傳到的後台api地址 -->
            <el-upload
              :headers="uploadHeaders"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handelUploadSuccess"
            >
              <el-button size="small" type="primary">點擊上傳</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品內容" name="4">
            <!-- 富文本編輯器組件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按鈕 -->
            <el-button type="primary" class="btnAdd" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 圖片預覽彈窗 -->
    <el-dialog
      title="圖片預覽"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="previewPath" alt="預覽圖片" style="width: 100%" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 控制步驟條與表單的雙向綁定數據
      activeIndex: '0',
      // 表單數據對象
      addForm: {
        goods_name: '',
        goods_price: 1,
        goods_weight: 0,
        goods_number: 1,
        goods_cat: [],
        // 圖片數組
        pics: [],
        // 商品詳情描述
        goods_introduce: '',
        attrs: []
      },
      // 表單驗證規則對象
      addFormRules: {
        goods_name: [
          { required: true, message: '請輸入商品名稱', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '請輸入商品價格', trigger: 'blur' },
          { type: 'number', message: '商品價格必須為數字' }
        ],
        goods_weight: [
          { required: true, message: '請輸入商品重量', trigger: 'blur' },
          { type: 'number', message: '商品重量必須為數字' }
        ],
        goods_number: [
          { required: true, message: '請輸入商品數量', trigger: 'blur' },
          { type: 'number', message: '商品數量必須為數字' }
        ],
        goods_cat: [
          { required: true, message: '請選擇商品分類', trigger: 'blur' }
        ]
      },
      // 商品分類列表
      cateList: [],
      // 級聯選擇器配置對象
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 動態參數列表數據
      manyTableData: [],
      // 靜態屬性列表數據
      onlyTableData: [],
      // 圖片上傳headers配置
      uploadHeaders: {
        Authorization: sessionStorage.getItem('token')
      },
      // 圖片預覽彈窗控制
      previewDialogVisible: false,
      // 當前預覽圖片位置
      previewPath: ''
    }
  },
  methods: {
    // 獲取分類列表
    async getCateList() {
      const { data: result } = await this.$http.get('categories')
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.cateList = result.data
    },
    // 級聯選擇器改變事件
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // Tab切換事件
    beforeTabLeave(newActiveName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('未選擇商品分類')
        return false
      }
    },
    // 獲取商品參數
    async getParamList(selName) {
      const { data: result } = await this.$http.get(
        `categories/${this.cataId}/attributes`,
        { params: { sel: selName } }
      )
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      if (selName === 'many') {
        result.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = result.data
      } else {
        this.onlyTableData = result.data
      }
    },
    // 點擊tab處理函數
    tabClicked() {
      // 證明訪問動態參數面板
      if (this.activeIndex === '1') {
        // 獲取商品參數清單
        this.getParamList('many')
      } else if (this.activeIndex === '2') {
        // 獲取商品屬性清單
        this.getParamList('only')
      }
    },
    // 刪除圖片處理函數
    handleRemove(file) {
      this.addForm.pics.forEach((item, index, arr) => {
        if (item.pic === file.response.data.tmp_path) {
          arr.splice(index, 1)
        }
      })
    },
    // 處理圖片預覽效果
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // 圖片上傳成功鉤子
    handelUploadSuccess(response) {
      // 拼接圖片訊息對象
      const picInfo = { pic: response.data.tmp_path }
      // 將圖片訊息對象push到pics數組裡
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('請填寫必要的表單項')
        }
        // 處理添加表單
        // 將goods_cat應api要求轉成字符串
        this.addForm.goods_cat = this.addForm.goods_cat.join(',')
        // 處理attrs(動態參數, 靜態屬性)
        this.manyTableData.forEach((item) => {
          const manyObj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(manyObj)
        })
        this.onlyTableData.forEach((item) => {
          const onlyObj = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(onlyObj)
        })
        const { data: result } = await this.$http.post('goods', this.addForm)
        if (result.meta.status !== 201) {
          this.addForm.goods_cat = this.addForm.goods_cat.split(',')
          return this.$message.error(result.meta.msg)
        }
        this.$message.success(result.meta.msg)
        // 跳轉到商品列表頁面
        this.$router.push('/goods')
      })
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cataId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="scss" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.btnAdd {
  margin-top: 15px;
}
</style>
