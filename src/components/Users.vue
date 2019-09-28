<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
    </el-input>
    <el-button class="addBtn" type="success" plain>添加用户</el-button>

    <!-- 表格 -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <!-- 作用域插槽 -->
        <template v-slot:default="obj">
          <!-- 根据elementUI文档，obj身上有row,column,$index,store四个属性 -->
          <!-- {{ obj.row }} -->
          <el-switch
            @change="changeState(obj.row)"
            v-model="obj.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="obj">
          <el-button plain size="small" type="primary" icon="el-icon-edit"></el-button>
          <el-button
            plain
            size="small"
            type="danger"
            icon="el-icon-delete"
            @click="delUser(obj.row.id)"
          ></el-button>
          <el-button plain size="small" type="success" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
// import axios from 'axios'

export default {
  created () {
    this.getUserList()
  },
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 4,
      userList: [],
      total: 0
    }
  },
  methods: {
    // 获取用户数据列表
    async getUserList () {
      const { meta, data } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
        // 配置请求头，将token令牌携带
        // headers: {
        //   Authorization: localStorage.getItem('token')
        // }
      })

      if (meta.status === 200) {
        // console.log(data.users)
        this.userList = data.users
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },

    // 分页 改变当前页
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },

    // 分页  改变每页多少条
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },

    // 删除单个用户
    async delUser (id) {
      try {
        await this.$confirm('您确认要删除吗？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success('删除成功')
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },

    // 搜索
    searchUser () {
      this.pagenum = 1
      this.getUserList()
    },

    // 修改用户状态
    async changeState (row) {
      const { meta } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style  lang='scss' scoped>
.users {
  .el-breadcrumb {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .addBtn {
    margin-left: 10px;
  }
}
</style>
