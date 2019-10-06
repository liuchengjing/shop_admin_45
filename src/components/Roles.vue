<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加按钮 -->
    <el-button type="success" plain>添加角色</el-button>

    <!-- 表格 -->
    <el-table :data="rolesList" style="width: 100%">
      <el-table-column type="expand">
        <template v-slot:default="{ row }">
          <el-row v-for="level1 in row.children" :key="level1.id" class="level1">
            <el-col :span="4">
              <el-tag closable @close="delRights(row, level1.id)">{{ level1.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="level2 in level1.children" :key="level2.id" class="level2">
                <el-col :span="4">
                  <el-tag
                    type="success"
                    closable
                    @close="delRights(row, level2.id)"
                  >{{ level2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    type="warning"
                    class="level3"
                    closable
                    @close="delRights(row, level3.id)"
                  >{{ level3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>

      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <!-- 修改用户 -->
          <el-button
            plain
            size="small"
            type="primary"
            icon="el-icon-edit"
          ></el-button>
          <!-- <el-dialog title="修改用户" :visible.sync="editDialogFormVisible">
            <el-form :rules="rules" ref="editForm" :model="editForm" label-width="80px">
              <el-form-item label="用户名" prop="username">
                <el-tag type="info">{{ editForm.username }}</el-tag>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"  placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="editForm.mobile"  placeholder="请输入手机"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editDialogFormVisible = false">取 消</el-button>
              <el-button @click="editUser" type="primary">确 定</el-button>
            </div>
          </el-dialog>-->
          <!-- 删除用户 -->
          <el-button
            plain
            size="small"
            type="danger"
            icon="el-icon-delete"
          ></el-button>
          <!-- 分配角色 -->
          <el-button
            plain
            size="small"
            type="success"
            icon="el-icon-check"
            @click="showAssignDialog(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="assignVisible" width="40%">
      <el-tree
        :data="data"
        show-checkbox
        default-expand-all
        :props="defaultProps"
        ref="tree"
        node-key="id"
      ></el-tree>
      <span slot="footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRights">分 配</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      assignVisible: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '' // 记录正在授权的角色的id
    }
  },

  created () {
    this.getRoleList()
  },

  methods: {
    // 角色列表
    async getRoleList () {
      const { data, meta } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.rolesList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 删除角色的指定权限
    async delRights (row, rightId) {
      // console.log(row)
      const { data, meta } = await this.$axios.delete(
        `roles/${row.id}/rights/${rightId}`
      )
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 显示树型权限
    async showAssignDialog (row) {
      this.roleId = row.id
      this.assignVisible = true
      const { meta, data } = await this.$axios.get('rights/tree')
      if (meta.status === 200) {
        this.data = data
        // 回显所有的当前角色已有的权限
        const ids = []
        // ids.push(row.children.children.children.id)//这样写是不行的
        row.children.forEach(l1 => {
          // l1 就是一个一级权限
          l1.children.forEach(l2 => {
            // l2 就是一个二级权限
            l2.children.forEach(l3 => {
              // l3 就是一个三级权限
              // console.log(l3)
              ids.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 分配权限
    async assignRights () {
      // 获取当前设置的权限的id
      const ids = this.$refs.tree.getCheckedKeys()
      const halfs = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...ids, ...halfs].join(',')// 数组转字符串
      // 根据获取的分配的权限id,发送ajax请求，进行分配
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids: rids })
      if (meta.status === 200) {
        this.assignVisible = false
        this.$message.success(meta.msg)
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.roles {
  .el-table {
    .level1 {
      margin-bottom: 5px;
      border-bottom: 1px dotted #ccc;
    }
    .level2 {
      margin-bottom: 5px;
    }
    .level3 {
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }
}
</style>
