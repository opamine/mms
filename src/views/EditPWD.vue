<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>修改登录密码</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row class="edit-info">
        <el-col :span="12" :offset="6">
          <el-alert
            title="密码长度限制在 6 - 15 位 , 可包含 英文大小写, 数字, 不可包含特殊符号 ' . 、 + 、 - 、 * 、 / 、空格' 等"
            type="info"
            :closable="false"
          ></el-alert>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="8">
          <el-form ref="editFormRef" :model="editForm" :rules="editFormRules">
            <el-form-item prop="oldPassword">
              <el-input placeholder="请输入旧密码" v-model="editForm.oldPassword" show-password></el-input>
            </el-form-item>
            <el-form-item prop="newPassword">
              <el-input type="password" placeholder="请输入新密码" v-model="editForm.newPassword"></el-input>
            </el-form-item>
            <el-form-item prop="checkPassword">
              <el-input type="password" placeholder="请确认新密码" v-model="editForm.checkPassword"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="checkModify">提交</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data () {
    const checkPassword = (rule, val, callback) => {
      const regPassword = /^[a-zA-Z0-9]{6,15}$/
      if (regPassword.test(val)) {
        return callback()
      }
      callback(new Error('密码格式不正确！'))
    }
    return {
      editForm: {
        oldPassword: '',
        newPassword: '',
        checkPassword: ''
      },
      editFormRules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度须控制在 6 - 15 字符',
            trigger: 'blur'
          },
          { validator: checkPassword, trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度须控制在 6 - 15 字符',
            trigger: 'blur'
          },
          { validator: checkPassword, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度须控制在 6 - 15 字符',
            trigger: 'blur'
          },
          { validator: checkPassword, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    resetForm () {
      this.$refs.editFormRef.resetFields()
    },
    checkModify () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return undefined
        if (this.editForm.newPassword !== this.editForm.checkPassword) {
          this.$message({
            type: 'error',
            message: '两次新密码输入不一致，请重新输入！',
            center: true
          })
          return undefined
        }
        const { data: res } = await this.$http.put(`users/password/${this.userInfo.userid}`, this.editForm)
        if (res.status !== 200) {
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
        this.resetForm()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-row.edit-info {
  margin: 40px 0;
}
.el-form {
  .el-form-item {
    margin-bottom: 32px;
  }
}

.el-alert {
  height: 30px;
}
</style>
