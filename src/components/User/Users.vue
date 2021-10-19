<template>
  <div>
    <!-- 麵包屑導航區域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>用戶管理</el-breadcrumb-item>
      <el-breadcrumb-item>用戶列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片區域 -->
    <el-card class="box-card">
      <!-- 搜尋. 添加按鈕區域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="請输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="handleSearch"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleSearch"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用戶</el-button
          >
        </el-col>
      </el-row>
      <!-- 用戶列表區域 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="郵件"> </el-table-column>
        <el-table-column prop="mobile" label="電話"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="狀態">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按鈕 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 刪除按鈕 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUser(scope.row)"
            ></el-button>
            <!-- 分配角色按鈕 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分頁功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用戶彈出框 -->
    <!-- @close="$refs.addFormRef.resetFields() 關閉表單時重置表單內容 -->
    <el-dialog
      title="添加用戶"
      :visible.sync="addDialogVisible"
      @close="$refs.addFormRef.resetFields()"
    >
      <!-- 彈出框主體 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用戶名" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input
            v-model="addForm.password"
            autocomplete="off"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="郵件" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手機" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- 彈出框底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addUser">確定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用戶彈出框 -->
    <el-dialog
      title="修改用戶"
      :visible.sync="editDialogVisible"
      @close="$refs.editFormRef.resetFields()"
    >
      <!-- 彈出框主體 -->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用戶名" prop="username">
          <el-input
            v-model="editForm.username"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="郵件" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手機" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- 彈出框底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editUserInfo">確定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色彈出框 -->
    <el-dialog
      title="分配權限"
      :visible.sync="setRoleDialogVisible"
      width="50%"
    >
        <p>當前的用戶: {{ setRoleUser.username }}</p>
        <p>當前的角色: {{ setRoleUser.role_name }}</p>
        <p>
          分配新角色:
          <el-select  v-model="setRoleUser.newRoleId" placeholder="請選擇">
            <el-option
            v-for="item in rolesList"
            :label="item.roleName"
            :value="item.id"
            :key="item.id">
            {{item.roleName}}
            </el-option>
          </el-select>
        </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRoleInfo">確定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 驗證郵件的規則
    var checkMail = (rule, value, callback) => {
      const emailRules = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/
      if (!emailRules.test(value)) {
        return callback(new Error('電子郵件格式錯誤'))
      }
      callback()
    }
    // 驗證手機的規則
    var checkMobile = (rule, value, callback) => {
      const phoneRules = /^[0-9]{10}$/
      if (!phoneRules.test(value)) return callback(new Error('手機格式錯誤'))
      callback()
    }
    return {
      // 獲取用戶列表的參數對象
      queryInfo: {
        query: '',
        // 當前頁數
        pagenum: 1,
        // 當前每頁顯示多少條數據
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制用戶添加彈出框顯示與否
      addDialogVisible: false,
      // 添加用戶的表單數據
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用戶表單規則對象
      addFormRules: {
        // 用戶名稱驗證
        username: [
          { required: true, message: '請輸入用戶名稱', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用戶名稱長度為3~10字符之間',
            trigger: 'blur'
          }
        ],
        // 密碼驗證
        password: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密碼長度為6~15字符之間',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '請輸入電子郵件', trigger: 'blur' },
          { validator: checkMail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '請輸入手機', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改彈出框顯示與否
      editDialogVisible: false,
      // 修改資料對象
      editForm: {},
      // 分配角色彈框控制
      setRoleDialogVisible: false,
      // 分配權限當前用戶
      setRoleUser: {},
      // 所有角色列表數據
      rolesList: []
    }
  },
  methods: {
    async getUserList() {
      const { data: result } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.userList = result.data.users
      this.total = result.data.total
    },
    // 監聽 pagesize 改變的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 監聽頁碼值改變的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 監聽switch狀態的change事件
    async userStateChange(userInfo) {
      const { data: result } = await this.$http.put(
        `/users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (result.meta.status !== 200) {
        userInfo.meta.status = !userInfo.meta.status
        return this.$message.error(result.meta.msg)
      }
      this.$message.success(result.meta.msg)
    },
    // 處理搜尋事件
    handleSearch() {
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    // 添加用戶功能
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('表單內容有誤')
        const { data: result } = await this.$http.post('users', this.addForm)
        if (result.meta.status !== 201) {
          return this.$message.error(result.meta.msg)
        }
        this.$message.success(result.meta.msg)
        // 隱藏添加用戶的彈框
        this.addDialogVisible = false
        // 刷新列表
        this.getUserList()
      })
    },
    // 修改框彈出
    async showEditDialog(id) {
      const { data: result } = await this.$http.get(`/users/${id}`)
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.editForm = result.data
      this.editDialogVisible = true
    },
    // 修改用戶訊息並提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('表單內容有誤')
        const { data: result } = await this.$http.put(
          `/users/${this.editForm.id}`,
          this.editForm
        )
        if (result.meta.status !== 200) {
          return this.$message.error(result.meta.msg)
        }
        this.$message.success(result.meta.msg)
        // 隱藏修改用戶的彈框
        this.editDialogVisible = false
        // 刷新列表
        this.getUserList()
      })
    },
    // 刪除用戶資料by id
    async removeUser(userInfo) {
      const confirmResult = await this.$confirm(
        `確認刪除 ${userInfo.username} ?`,
        '提示',
        {
          confirmButtonText: '確定',
          cancleButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      // 如果用戶確認刪除，則返回值為字符串 confirm
      // 如果用戶取消刪除，則返回值為字符串 cancle
      if (confirmResult !== 'confirm') return this.$message.info('取消刪除')
      const { data: result } = await this.$http.delete(`/users/${userInfo.id}`)
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.$message.success(result.meta.msg)
      this.getUserList()
    },
    // 分配角色彈框
    async setRole(userInfo) {
      const { data: result } = await this.$http.get('roles')
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.rolesList = result.data
      // 把當前用戶資料賦值到本地setRoleUser
      this.setRoleUser = userInfo
      // 開啟分配角色彈框
      this.setRoleDialogVisible = true
    },
    // 分配角色送出
    async saveRoleInfo() {
      // 判斷用戶有沒有選擇新角色
      if (!this.setRoleUser.newRoleId) {
        return this.$message.error('請選擇要分配的角色')
      }
      const { data: result } = await this.$http.put(`users/${this.setRoleUser.id}/role`, { rid: this.setRoleUser.newRoleId })
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.$message.success(result.meta.msg)
      // 刷新列表
      this.getUserList()
      // 關閉彈框
      this.setRoleDialogVisible = false
    }
  },
  created() {
    this.getUserList()
  }
}
</script>
