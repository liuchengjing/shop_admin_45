<template>
  <div class="login">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules" status-icon>
      <img src="../assets/avatar.jpg" alt />
      <el-form-item label="用户名" prop="username">
        <el-input @keyup.enter.native="login" v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input @keyup.enter.native="login" v-model="form.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-button type="primary" class="login-btn" @click="login">登录</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form>
  </div>
</template>

<script>
// 导入 axios
// import axios from 'axios'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: [ 'change', 'blur' ] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: [ 'change', 'blur' ] }
        ]
      }
    }
  },
  methods: {
    reset () {
      // this.$ref.form.resetFields()  //$refs少写了一个s
      this.$refs.form.resetFields()
    },

    // login的async await优化
    async login () {
      try {
        await this.$refs.form.validate()

        const { meta, data } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          localStorage.setItem('token', data.token)
          // 登录成功，跳转到首页
          // console.log(meta.msg)
          // 消息提示框
          this.$message({
            message: '登录成功',
            type: 'success',
            duration: 1000
          })
          // 跳转到首页
          this.$router.push({ name: 'index' })
        } else {
        // 给用户提示，登录失败
        // console.log(meta.msg)
          this.$message({
            message: meta.msg,
            type: 'error',
            duration: 1000
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.login {
  background-color: #2d434c;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .el-form {
    width: 400px;
    background-color: #fff;
    padding: 20px;
    padding-top: 70px;
    margin: 200px auto;
    position: relative;
    border-radius: 20px;

    img {
      position: absolute;
      left: 50%;
      top: -30%;
      transform: translateX(-50%);
      border-radius: 50%;
      border: 5px solid #fff;
    }

    .login-btn {
      margin-left: 90px;
      margin-right: 90px;
    }
  }
}
</style>
