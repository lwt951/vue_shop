<template>
  <el-container>
    <!-- 頭部區域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="logo" />
        <span>電商後臺管理系統</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <!-- 頁面主體區域 -->
    <el-container>
      <!-- 側邊攔 -->
      <el-aside :width="isCollapse ? '64px' : '200px'" >
        <!-- 側邊欄導航區域 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
        >
          <!-- 一級菜單 -->
          <el-submenu
            :index="item.id.toString()"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <!-- icon區域 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 名字區域 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二級菜單 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <i class="el-icon-menu"></i>
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右側內容主體 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左側菜單數據
      menuList: [],
      isCollapse: false,
      iconObj: {
        125: 'el-icon-s-custom',
        103: 'el-icon-s-platform',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-marketing'
      }
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    loginout() {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    // 獲取所有菜單
    async getMenuList() {
      const { data: result } = await this.$http.get('menus')
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.menuList = result.data
    },
    // 菜單摺疊功能
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang='scss' scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    > span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
