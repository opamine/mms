<template>
  <div class="login-wrap">
    <div class="bg-fixed"></div>
    <div class="sys-title">
      <h2>MMS&sdot;医院药物管理系统</h2>
    </div>
    <div class="login-container">
      <div class="form-container">
        <h3>
          <i class="el-icon-user-solid"></i>管理员登录
        </h3>
        <el-form ref="loginFormRef" :model="loginForm" label-width="80px" :rules="loginFormRules">
          <el-form-item label="账号:" size="medium" prop="userid">
            <el-input placeholder="请输入账号" v-model="loginForm.userid"></el-input>
          </el-form-item>
          <el-form-item label="密码:" size="medium" prop="password">
            <el-input placeholder="请输入密码" v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="验证码:" size="medium" prop="captchaChar">
            <el-input v-model="loginForm.captchaChar" class="captchaInput"></el-input>
            <sidentify @refreshIdentifyCode="refreshIdentifyCode" :identifyCode="identifyCode"></sidentify>
          </el-form-item>
          <el-form-item size="medium" class="el-form-item-four">
            <el-button type="primary" size="medium" @click="logIn">登录</el-button>
            <el-button size="medium" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="medicine-img">
        <img src="../assets/img/101.png">
      </div>
    </div>
    <div class="author-info">
      <p>
        开发者：周志虎
        <span>班级：16医软3班</span>
      </p>
      <p>毕业设计：基于JavaScript医院药物管理系统</p>
      <p>所在院校：安徽中医药大学 医药信息工程学院</p>
      <p>©皖ICP备20001257号</p>
    </div>
  </div>
</template>

<script>
import SIdentify from '../components/SIdentify'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      loginForm: {
        userid: '',
        password: '',
        captchaChar: ''
      },
      loginFormRules: {
        userid: [
          { required: true, message: '请输入管理员id', trigger: 'blur' },
          { min: 5, max: 5, message: '管理员 ID 为 5 字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        captchaChar: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '长度应为4位', trigger: 'blur' }
        ]
      },
      identifyCode: '' // 来自服务器随机生成的验证码
    }
  },
  components: {
    sidentify: SIdentify
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    async getIdentifyCode () {
      // 向服务器请求验证码
      const { data: res } = await this.$http.get('getIdentifyCode')
      if (res.status !== 200) {
        this.$message({
          type: 'error',
          message: '获取验证码失败',
          center: true
        })
        return undefined
      }
      this.identifyCode = res.data
    },
    refreshIdentifyCode () {
      this.getIdentifyCode()
    },
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    async logIn () {
      // 登录主体
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        if (this.loginForm.captchaChar === this.identifyCode) {
          const { data: res } = await this.$http.post('login', {
            userid: this.loginForm.userid,
            password: this.loginForm.password
          })
          if (res.status !== 200) {
            this.loginForm.captchaChar = ''
            this.refreshIdentifyCode()
            return this.$message({
              type: 'error',
              message: res.message,
              center: true
            })
          }
          this.$message({
            type: 'success',
            message: res.message,
            center: true
          })
          this.setUserInfo(res.data)
          window.sessionStorage.setItem('token', res.token)
          this.$router.push('/home')
        } else {
          this.$message({
            type: 'error',
            message: '验证码错误！',
            center: true
          })
          this.loginForm.captchaChar = ''
          this.refreshIdentifyCode()
        }
      })
    }
  },
  mounted () {
    this.getIdentifyCode()
  }
}
</script>
<style lang="less" scoped>
.login-wrap {
  position: relative;
  height: 100%;
  background: linear-gradient(#394762, #6b7486, #394762);
  .bg-fixed {
    position: fixed;
    width: 100%;
    height: 100%;
    background: url(../assets/img/bg-fixed.png) repeat;
    background-size: 5px 5px;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .sys-title {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-330px);
    z-index: 99;
    h2 {
      font-size: 32px;
      font-weight: 400;
      letter-spacing: 10px;
      color: #fff;
    }
  }
  .login-container {
    position: absolute;
    width: 1200px;
    height: 400px;
    background-color: rgba(255, 255, 255, 0.6);
    box-shadow: 0 5px 5px rgba(10, 16, 20, 0.24), 0 0 2px rgba(10, 16, 20, 0.12);
    border-radius: 5px;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 99;
    overflow: hidden;
    .form-container {
      float: left;
      height: 100%;
      width: 345px;
      h3 {
        text-align: center;
        color: #515151;
        margin-top: 50px;
      }
      .el-form {
        width: 80%;
        margin: 30px auto 30px 10px;
        .captchaInput {
          width: 50%;
        }
      }
    }
    .medicine-img {
      float: right;
      height: 100%;
      opacity: 0.6;
      img {
        height: 100%;
        filter: brightness(95%);
      }
    }
  }
  .author-info {
    position: absolute;
    color: #eee;
    font-size: 18px;
    text-align: center;
    font-family: "楷体";
    left: 50%;
    transform: translateX(-50%);
    bottom: 10px;
    z-index: 99;
    p {
      margin-top: 5px;
      margin-bottom: 5px;
      &:last-of-type {
        font-size: 14px;
      }
    }
    span {
      margin-left: 30px;
    }
  }
}
</style>
