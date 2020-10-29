<template>
    <div class="login-container">
      <div class="login-container-header2login">
        <div class="login-header">
          <img src="./images/login-header.png" alt="">
        </div>
        <el-form ref="ruleForm" :model="user" :rules="rules" class="login-form">
          <el-form-item prop="mobile">
            <el-input prefix-icon="el-icon-user" v-model="user.mobile" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input prefix-icon="el-icon-lock" v-model="user.code" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox-group v-model="user.agree">
              <el-checkbox label="我已阅读并同意用户协议和隐私条款" name="agree"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-btn"
              type="primary"
              :loading="isLoading"
              @click="submitForm('ruleForm')">登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
import { $requestLogin } from '../../api/login'
import { Message } from 'element-ui'
export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '13911111111', // 账号（手机号）
        code: '246810', // 密码（验证码）
        agree: false // 协议是否允许
      },
      rules: {
        mobile: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 12,
            message: '账号长度在 11 到 12 个字符',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 12,
            message: '密码长度在 6 到 12 个字符',
            trigger: 'blur'
          }
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请先勾选同意'))
              }
            },
            trigger: 'blur'
          }
        ]
      },
      isLoading: false // 是否登录中
    }
  },
  methods: {
    /*
     13911111111
     246810
    */
    submitForm (formNameRef) {
      this.$refs[formNameRef].validate((valid) => {
        if (valid) {
          // 验证规则通过进入此判断
          // 验证登录
          this.requestLogin()
        }
      })
    },

    // 验证登录
    async requestLogin () {
      // 加载中...
      this.isLoading = true
      try {
        // --$Ajax-- 发起登录请求
        const { status, data } = await $requestLogin(this.user)
        if (status === 201) {
          this.isLoading = false

          // 保存到LocalStorage本地存储中
          localStorage.setItem('token', data.data.token)
          Message({ message: '登录成功', type: 'success', duration: 1000 })

          // 跳转到主页
          await this.$router.replace('/home')
        }
      } catch (err) {
        this.isLoading = false
        Message({
          message: '手机号或验证码错误',
          type: 'warning',
          duration: 1000
        })

        // 验证码错误后，清空验证码输入框
        this.user.code = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .login-container{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url("./images/login_bg.jpg");
    background-size: cover;
    .login-container-header2login{
      background: rgba(241, 251, 254, 0.5);
      .login-header{
        position: relative;
        display: flex;
        justify-content: center;
        width: 100%;
        height: 150px;
        img{
          position: absolute;
          top: 40px;
          right: 20px;
          width: 150px;
          height: 150px;
        }
      }
      .login-form{
        padding: 0 50px 50px 50px;
        min-width: 300px;
        .login-btn{
          width: 100%;
        }
      }
    }
  }

</style>
