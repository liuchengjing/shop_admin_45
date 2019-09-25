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
      <el-aside width="200px">
        <el-menu
          unique-opened
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#fff"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
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
    },

    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },

    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang='scss' scoped>
// 头部
.index {
  height: 100%;

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

  .el-aside {
    background-color: #545c64;
  }

  .el-main {
    background-color: #ecf0f1;
  }
}

// 侧边栏
.el-aside {
  .el-menu {
    border-right: none;

    .el-icon-menu {
      color: #909399;
    }
  }
}
</style>
