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
    <!-- 添加用户 -->
    <el-button @click="dialogFormVisible = true" class="addBtn" type="success" plain>添加用户</el-button>
    <!-- 添加用户的对话框 -->
    <el-dialog @close="closeDialog" title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="form.mobile" placeholder="请输入电话号码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

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
          <!-- 修改用户 -->
          <el-button
            @click="showEditDialog(obj.row)"
            plain
            size="small"
            type="primary"
            icon="el-icon-edit"
          ></el-button>
          <!-- 修改用户的对话框 -->
          <el-dialog title="修改用户" :visible.sync="editDialogFormVisible">
            <el-form :rules="rules" ref="editForm" :model="editForm" label-width="80px">
              <el-form-item label="用户名" prop="username">
                <el-tag type="info">{{ editForm.username }}</el-tag>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="editForm.mobile" placeholder="请输入手机"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editDialogFormVisible = false">取 消</el-button>
              <el-button @click="editUser" type="primary">确 定</el-button>
            </div>
          </el-dialog>
          <!-- 删除用户 -->
          <el-button
            plain
            size="small"
            type="danger"
            icon="el-icon-delete"
            @click="delUser(obj.row.id)"
          ></el-button>
          <!-- 分配角色给用户 -->
          <el-button
            plain
            size="small"
            type="success"
            icon="el-icon-check"
            @click="showAssignDialog(obj.row)"
          >分配角色</el-button>
          <!-- 分配角色给用户的对话框 -->
          <el-dialog title="分配角色" :visible.sync="assignDialogFormVisible">
            <el-form ref="assignForm" :model="assignForm" label-width="80px">
              <el-form-item label="用户名" prop="username">
                <el-tag type="info">{{ assignForm.username }}</el-tag>
              </el-form-item>
              <el-form-item label="角色列表">
                <el-select v-model="assignForm.rid" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :label="item.roleName"
                    :value="item.id"
                    :key="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="assignDialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="assignRole">确 定</el-button>
            </div>
          </el-dialog>
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
// import { async } from 'async'
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
      total: 0,
      dialogFormVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editDialogFormVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      assignDialogFormVisible: false,
      assignForm: {
        username: '',
        rid: '', // 记录角色id
        id: '' // 记录用户id
      },
      options: [], // 记录select选择器
      // value: '', // 记录select选择器
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 6,
            message: '长度在 3 到 6 个字符',
            trigger: ['change', 'blur']
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 3,
            max: 8,
            message: '长度在 3 到 8 个字符',
            trigger: ['change', 'blur']
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: ['blur', 'change']
          }
        ]
      }
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
      const { meta } = await this.$axios.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      if (meta.status === 200) {
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    },

    // 添加用户
    async addUser () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.form)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.dialogFormVisible = false
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭添加用户的对话框
    closeDialog () {
      this.$refs.form.resetFields()
    },

    // 显示修改用户的对话框
    showEditDialog (row) {
      this.editDialogFormVisible = true
      // console.log(row)
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },

    // 修改用户
    async editUser () {
      try {
        await this.$refs.editForm.validate()

        const { id, email, mobile } = this.editForm
        const { meta } = await this.$axios.put(`users/${id}`, {
          email,
          mobile
        })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getUserList()
          this.editDialogFormVisible = false
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },

    // 显示分配角色的对话框
    async showAssignDialog (row) {
      if (row.role_name === '超级管理员') {
        this.$message.error('超级管理员不可操作')
        return
      }
      this.assignDialogFormVisible = true
      console.log(row)
      // 回显用户名
      this.assignForm.username = row.username
      this.assignForm.id = row.id
      // 回显角色列表的当前角色
      // this.value = row.role_name
      const resUser = await this.$axios.get(`users/${row.id}`)
      if (resUser.meta.status === 200) {
        // console.log(resUser.data)
        const rid = resUser.data.rid
        // 如果是新增的用户，还没有角色，默认值后台给的是-1
        this.assignForm.rid = rid === -1 ? '' : rid
      }
      // 回显角色列表下拉选择框
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        // for (let i = 0; i < data.length; i++) {
        //   const str = {
        //     value: data[i].id, // 将角色id传给value
        //     label: data[i].roleName
        //   }
        //   this.options.push(str)
        // }
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },

    // 分配角色给用户
    async assignRole () {
      const { id, rid } = this.assignForm
      // 如果没有分配角色，不能提交
      if (rid === '') {
        this.$message.error('请分配角色')
        return
      }
      // if (rid === 0) {
      //   this.$message.error('超级管理员不可操作')
      //   return
      // }
      // 分配角色
      const { meta } = await this.$axios.put(`users/${id}/role`, { rid })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.assignDialogFormVisible = false
        this.getUserList()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style  lang='scss' scoped>
.users {
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .addBtn {
    margin-left: 10px;
  }
}
</style>
