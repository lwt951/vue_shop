<template >
  <div>
    <!-- 麵包屑導航區域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>權限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片區域 -->
    <el-card>
      <!-- 添加角色按鈕 -->
      <el-button type="primary" @click="addDialogVisible = true"
        >添加角色</el-button
      >
      <!-- 角色列表區域 -->
      <el-table :data="rolesList" stripe border>
        <!-- 展開列 -->
        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-row :class="['bdbottom', 'vcenter', 'el-row-out', (i1 === 0) ? 'bdtop' : '']"
                v-for="(item1, i1) in scope.row.children"
                :key="item1.id">
                    <!-- 一級權限 -->
                    <el-col :span="5">
                        <el-tag closable @close="removeRight(scope.row, item1)">{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 二和三級權限 -->
                    <el-col :span="19">
                        <!-- -二級權限 -->
                        <el-row
                        :class="['vcenter', (i2 !== item1.children.length-1) ? 'bdbottom' : '']"
                        v-for="(item2, i2) in item1.children"
                        :key="item2.id">
                            <el-col :span="6">
                                <el-tag type="success"
                                closable
                                @close="removeRight(scope.row, item2)">
                                {{item2.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 三級權限 -->
                            <el-col :span="18">
                                <el-tag type="warning"
                                 v-for="item3 in item2.children"
                                 :key="item3.id"
                                 closable
                                 @close="removeRight(scope.row, item3)">
                                 {{item3.authName}}
                                 </el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名稱"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="290px">
          <template slot-scope="scope">
            <!-- 修改按鈕 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >編輯</el-button
            >
            <!-- 刪除按鈕 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRole(scope.row)"
              >刪除</el-button
            >
            <!-- 分配權限按鈕 -->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)"
              >分配權限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用戶彈出框 -->
    <!-- @close="$refs.addFormRef.resetFields() 關閉表單時重置表單內容 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      @close="$refs.addFormRef.resetFields()"
    >
      <!-- 彈出框主體 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名稱" prop="roleName">
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- 彈出框底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addRole">確定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用戶彈出框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      @close="$refs.editFormRef.resetFields()"
    >
      <!-- 彈出框主體 -->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名稱" prop="roleName">
          <el-input
            v-model="editForm.roleName"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 彈出框底部 -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editRoleInfo">確定</el-button>
      </div>
    </el-dialog>
    <!-- 分配權限彈出框 -->
    <el-dialog
      title="分配權限"
      :visible.sync="setDialogVisible"
      width="50%"
      @close="defKeys = []">
      <!-- 樹型控件 -->
      <el-tree
      :data="rightsLIst"
      :props="treeProps"
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys="defKeys"
      ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="allotRights">確定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 所有角色列表數據
      rolesList: [],
      // 添加角色框顯示控制
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加用戶表單規則對象
      addFormRules: {
        // 角色名稱驗證
        roleName: [
          { required: true, message: '請輸入角色名稱', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '用戶名稱長度為3~10字符之間',
            trigger: 'blur'
          }
        ],
        // 角色描述驗證
        roleDesc: [
          { required: true, message: '請輸入角色描述', trigger: 'blur' },
          {
            min: 2,
            max: 15,
            message: '密碼長度為6~15字符之間',
            trigger: 'blur'
          }
        ]
      },
      // 彈出修改框控制
      editDialogVisible: false,
      editForm: {},
      // 彈出分配權限框控制
      setDialogVisible: false,
      // 所有權線列表
      rightsLIst: [],
      // 樹形控件綁定對象
      treeProps: {
          children: 'children',
          label: 'authName'
        },
        // 默認選中的節點ID值數組
        defKeys: [],
        // 設置權限時的當前角色id
        setRoleId: ''
    }
  },
  methods: {
    // 獲取角色列表
    async getRolesList() {
      const { data: result } = await this.$http.get('roles')
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.rolesList = result.data
    },
    // 新增角色
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: result } = await this.$http.post('roles', this.addForm)
        if (result.meta.status !== 201) return this.$message.error(result.meta.msg)
        this.$message.success(result.meta.msg)
        // 關閉新增角色框
        this.addDialogVisible = false
        // 刷新列表
        this.getRolesList()
      })
    },
    // 顯示修改角色框
    async showEditDialog(id) {
        this.editDialogVisible = true
        const { data: result } = await this.$http.get(`roles/${id}`)
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
        this.editForm = result.data
    },
    // 修改角色
    editRoleInfo() {
        this.$refs.editFormRef.validate(async valid => {
            if (!valid) return
            const { data: result } = await this.$http.put(`roles/${this.editForm.roleId}`, this.editForm)
            if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
            this.$message.success('修改成功')
            // 關閉修改框
            this.editDialogVisible = false
            // 刷新列表
            this.getRolesList()
        })
    },
    // 刪除角色
    async removeRole(roleInfo) {
      const confirmResult = await this.$confirm(`確認刪除 ${roleInfo.roleName} ?`, '提示', {
        confirmButtonText: '確定',
        cancleButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用戶確認刪除，則返回值為字符串 confirm
      // 如果用戶取消刪除，則返回值為字符串 cancle
      if (confirmResult !== 'confirm') return this.$message.info('取消刪除')
      const { data: result } = await this.$http.delete(`/roles/${roleInfo.id}`)
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.$message.success(result.meta.msg)
      this.getRolesList()
    },
    // 根據ID刪除權限
    async removeRight(role, right) {
      // 彈框提示用戶是否刪除
      const confirmResult = await this.$confirm(`此操作將刪除${right.authName}權限是否繼續?`, '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用戶確認刪除，則返回值為字符串 confirm
      // 如果用戶取消刪除，則返回值為字符串 cancle
      if (confirmResult !== 'confirm') return this.$message('取消刪除')
      const { data: result } = await this.$http.delete(`roles/${role.id}/rights/${right.id}`)
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.$message.success(result.meta.msg)
      // 把刪除指定權限後的新資料賦值回去刷新列表
      role.children = result.data
    },
    // 顯示分配權限彈出框
    async showSetRightDialog(roleInfo) {
      this.setRoleId = roleInfo.id
      // 獲取所有權限的數據
      const { data: result } = await this.$http.get('/rights/tree')
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      // 把獲取到的權限數據賦值到本地rightsLIst
      this.rightsLIst = result.data
      // 遞歸獲取三級節點的id
      this.getLeafKeys(roleInfo, this.defKeys)
      // 秀出樹件彈出框
      this.setDialogVisible = true
    },
    // 遞歸獲取三級節點的id並保存到defKeys
    getLeafKeys(node, arr) {
      // 如果當前節點不包含children屬性則代表是三集節點
      if (!node.children) {
         return arr.push(node.id)
      }
      node.children.forEach(item => {
         this.getLeafKeys(item, arr)
         })
    },
    // 分配權限
    async allotRights() {
      // 獲取已勾選權限id列表賦值到rids
      const rids = [...this.$refs.treeRef.getCheckedKeys(),
                  ...this.$refs.treeRef.getHalfCheckedKeys()].toString()
      const { data: result } = await this.$http.post(`roles/${this.setRoleId}/rights`, { rids })
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.$message.success(result.meta.msg)
       // 關閉樹件彈框
      this.setDialogVisible = false
      // 刷新表單
      this.getRolesList()
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>
<style lang="scss" scoped>
.el-tag {
    margin: 7px;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-bottom: 1px solid #eee;
}

.el-row-out {
    padding: 0 40px;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>
