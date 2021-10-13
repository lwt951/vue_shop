<template>
  <div>
    <el-button type="info" @click="loginout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    loginout() {
      sessionStorage.clear()
      this.$router.push('/login')
      console.log(this.$route)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
