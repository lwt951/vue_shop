<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 頭像區域 -->
      <div class="avater-box">
        <img src="../assets/logo1.jpg" alt="logo" />
      </div>
      <!-- 表單區域 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="login-form"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!-- 用戶名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密碼 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按鈕區 -->
        <el-form-item class="bts">
          <el-button type="primary" @click="login">登入</el-button>
          <el-button type="info" @click="resetLoginform">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表單綁定數據對象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表單規則對象
      loginFormRules: {
        // 用戶名稱驗證
        username: [
          { required: true, message: '請輸入用戶名稱', trigger: 'blur' },
          { min: 5, max: 16, message: '用戶名稱長度不符', trigger: 'blur' }
        ],
        // 密碼驗證
        password: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          { min: 5, max: 16, message: '密碼長度不符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 點擊表單重置
    resetLoginform() {
      this.$refs.loginFormRef.resetFields()
    },
    // 表單預驗證
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: result } = await this.$http.post('login', this.loginForm)
        if (result.meta.status !== 200) {
          return this.$message({ message: result.meta.msg, type: 'error' })
        }
        this.$message({ message: result.meta.msg, type: 'success' })
        // 儲存token至sessionStorage
        sessionStorage.setItem('token', result.data.token)
        // 跳轉頁面至Home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  background-color: #fff;
  width: 450px;
  height: 300px;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avater-box {
    width: 130px;
    height: 130px;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px #ddd;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.bts {
  display: flex;
  justify-content: flex-end;
}
.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
