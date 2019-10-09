<template>
  <el-container class="index">
    <!-- 头部 -->
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>

      <div class="tit">
        <h1>电商后台管理系统</h1>
      </div>

      <div class="logout">
        欢迎光临~
        <a href="javascript:;" @click="logout">退出</a>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          router
          unique-opened
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :default-active="defaultActive"
        >
          <el-submenu :index="menu.path" v-for="menu in menuList" :key="menu.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <el-menu-item :index="item.path" v-for="item in menu.children" :key="item.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ item.authName }}</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>

      <!-- 主体部分 -->
      <el-main>
        <router-view></router-view>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },

  async created () {
    const { meta, data } = await this.$axios.get('menus')
    if (meta.status === 200) {
      this.menuList = data
    }
  },

  computed: {
    defaultActive () {
      // this.$router 整个路由对象 this.$router.push
      // this.$route  当前路由相关的信息 传参, path fullPath
      // console.log(this.$route)
      return this.$route.path.slice(1)
    }
  },

  methods: {
    // 退出
    logout () {
      this.$confirm('您确定要退出吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
          // 从本地删除token
          localStorage.removeItem('token')
          // 跳转路由登录
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消退出'
          })
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.index {
  height: 100%;
  // 头部
  .el-header {
    background-color: #d8d8d8;
    display: flex;

    .logo {
      width: 180px;
      img {
        height: 40px;
        margin: 10px;
      }
    }

    .tit {
      flex: 1;
      h1 {
        text-align: center;
        height: 60px;
        line-height: 60px;
        color: #545c64;
      }
    }

    .logout {
      width: 180px;
      height: 60px;
      line-height: 60px;
      text-align: right;
      font-weight: 700;

      a {
        color: orange;
      }
    }
  }
  // 侧边栏
  .el-aside {
    background-color: #545c64;
    .el-menu {
      border-right: none;
    }
  }
  // 主体
  .el-main {
    background-color: #ecf0f1;
  }
}

</style>
