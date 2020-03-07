<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理员</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="2">
          <el-button v-if="userInfo.role === 'root'" size="medium" @click="showAddDialog()">添加管理员</el-button>
        </el-col>
        <el-col :span="8">
          <el-alert
            v-if="userInfo.role === 'root'"
            title="相关管理员信息请在线下核实后修改"
            type="warning"
            :closable="false"
          ></el-alert>
        </el-col>
        <el-col :span="8">
          <el-alert
            v-if="userInfo.role === 'admin'"
            title="tip: 如需添加管理员，请线下联系超级管理员"
            type="info"
            :closable="false"
          ></el-alert>
        </el-col>
      </el-row>
      <el-table :data="userList" stripe border="">
        <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
        <el-table-column prop="userid" label="ID" align="center" width="150"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column label="性别" align="center">
          <template v-slot="scope">{{scope.row.gender == 'male' ? '男' : '女'}}</template>
        </el-table-column>
        <el-table-column prop="job" label="职务" align="center"></el-table-column>
        <el-table-column prop="phone_number" label="联系电话" align="center"></el-table-column>
        <el-table-column label="权限类型" align="center">
          <template v-slot="scope">
            <i v-if="scope.row.role==='root'" class="el-icon-key"></i>
            {{scope.row.role == 'root' ? '超级管理员' : '普通管理员'}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template v-slot="scope">{{scope.row.create_date | dateformat('yyyy-mm-dd HH:MM')}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="225">
          <template v-slot="scope">
            <el-button
              v-if="userInfo.role === 'root'"
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.userid)"
            ></el-button>
            <el-button
              v-if="userInfo.role === 'root'"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.userid)"
            ></el-button>
            <el-tooltip effect="dark" content="查询出入库操作记录" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="showActionsDialog(scope.row.username)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加管理员"
      :visible.sync="addDialogVisible"
      width="550px"
      @close="addDialogClosed"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
        <el-form-item label="姓名:" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="gender">
          <el-radio-group v-model="addForm.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="职务:" prop="job">
          <el-input v-model="addForm.job"></el-input>
        </el-form-item>
        <el-form-item label="电话:" prop="phone_number">
          <el-input v-model="addForm.phone_number"></el-input>
        </el-form-item>
        <el-form-item label="权限:">
          <el-radio-group v-model="addForm.role">
            <el-radio label="admin">管理员</el-radio>
            <el-radio label="root">超级管理员</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改管理员信息"
      :visible.sync="editDialogVisible"
      width="550px"
      @close="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="管理员ID:">
          <el-input v-model="editForm.userid" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名:" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="性别:">
          <el-radio-group v-model="editForm.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="职务:" prop="job">
          <el-input v-model="editForm.job"></el-input>
        </el-form-item>
        <el-form-item label="电话:" prop="phone_number">
          <el-input v-model="editForm.phone_number"></el-input>
        </el-form-item>
        <el-form-item label="权限:">
          <el-radio-group v-model="editForm.role">
            <el-radio label="admin">管理员</el-radio>
            <el-radio label="root">超级管理员</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="最近操作记录" :visible.sync="ationsDialogVisible" width="1000px" top="10vh">
      <div>入库记录 ↓</div>
      <el-table :data="importActionList" style="width: 100%" border="" stripe>
        <el-table-column prop="import_id" label="入库单号" width="140" align="center"></el-table-column>
        <el-table-column label="入库日期" width="140" align="center">
          <template v-slot="scope">{{scope.row.import_date | dateformat('yyyy-mm-dd')}}</template>
        </el-table-column>
        <el-table-column prop="med_id" label="药批文号" width="180" align="center"></el-table-column>
        <el-table-column label="生产日期" width="127" align="center">
          <template v-slot="scope">{{scope.row.med_product_date | dateformat('yyyy-mm-dd')}}</template>
        </el-table-column>
        <el-table-column label="有效期至" width="127" align="center">
          <template v-slot="scope">{{scope.row.med_using_date | dateformat('yyyy-mm-dd')}}</template>
        </el-table-column>
        <el-table-column prop="med_count" label="入库数量" align="center"></el-table-column>
        <el-table-column prop="total_money" label="总金额(元)" align="center"></el-table-column>
      </el-table>
      <div>出库记录 ↓</div>
      <el-table :data="exportActionList" border="" stripe>
        <el-table-column prop="export_id" label="出库单号" width="140" align="center"></el-table-column>
        <el-table-column label="出库日期" width="140" align="center">
          <template v-slot="scope">{{scope.row.export_date | dateformat('yyyy-mm-dd')}}</template>
        </el-table-column>
        <el-table-column prop="med_id" label="药批文号" width="180" align="center"></el-table-column>
        <el-table-column label="生产日期" width="127" align="center">
          <template v-slot="scope">{{scope.row.med_product_date | dateformat('yyyy-mm-dd')}}</template>
        </el-table-column>
        <el-table-column label="有效期至" width="127" align="center">
          <template v-slot="scope">{{scope.row.med_using_date | dateformat('yyyy-mm-dd')}}</template>
        </el-table-column>
        <el-table-column prop="med_count" label="出库方式" align="center">
          <template v-slot="scope">
            <el-tag type="success" size="small" v-if="scope.row.export_method == 'sell'">售出</el-tag>
            <el-tag type="danger" size="small" v-else>退货</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="med_count" label="出库数量" align="center"></el-table-column>
        <el-table-column prop="total_money" label="总金额(元)" align="center"></el-table-column>
      </el-table>
      <div>————查看更多请前往药品进出管理模块</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ationsDialogVisible=false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data () {
    const checkMobile = (rule, val, callback) => {
      const regMobile = /^[1][3456789]\d{9}$/
      if (regMobile.test(val)) {
        return callback()
      }
      callback(new Error('手机号格式不合法！'))
    }
    return {
      userList: [],
      addDialogVisible: false,
      addForm: {
        username: '',
        job: '',
        gender: '',
        phone_number: '',
        role: 'admin'
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入管理员姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        job: [
          { required: true, message: '请输入管理员职务', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        gender: [{ required: true, message: '管理员性别为必选项' }],
        phone_number: [
          { required: true, message: '请输入管理员联系方式', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        role: [{ required: true, message: '管理员权限为必选项' }]
      },
      editDialogVisible: false,
      editForm: {
        userid: '',
        username: '',
        job: '',
        gender: '',
        phone_number: null,
        role: 'admin'
      },
      editFormRules: {
        username: [
          { required: true, message: '请输入管理员姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        gender: [{ required: true, message: '管理员性别为必选项' }],
        job: [
          { required: true, message: '请输入管理员职务', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        phone_number: [
          { required: true, message: '请输入管理员联系方式', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        role: [{ required: true, message: '管理员权限为必选项' }]
      },
      ationsDialogVisible: false,
      importActionList: [],
      exportActionList: []
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    async getUserList () {
      // 向服务器请求管理员列表
      const { data: res } = await this.$http.get('users')
      if (res.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.message,
          center: true
        })
      }
      this.userList = res.data.userList
    },
    showAddDialog () {
      this.addDialogVisible = true
    },
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return undefined
        const { data: res } = await this.$http.post('users', this.addForm)
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
        this.getUserList()
        this.addDialogVisible = false
      })
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    async showEditDialog (id) {
      // 根据管理员id向服务器请求管理员信息，赋值editForm
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.status !== 200) {
        return this.$message({
          type: 'error',
          message: '获取管理员信息失败！',
          center: true
        })
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return undefined
        const id = this.editForm.userid
        const { data: res } = await this.$http.put(
          `users/${id}`,
          this.editForm
        )
        if (res.status !== 200) {
          return this.$message({
            type: 'error',
            message: res.message,
            center: true
          })
        }
        this.$message.success({
          type: 'error',
          message: res.message,
          center: true
        })
        this.getUserList()
        this.editDialogVisible = false
      })
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    async deleteUser (id) {
      // 根据id删除管理员
      const confirmResult = await this.$confirm(
        '此操作将永久删除该条记录, 是否继续?',
        '删除此管理员',
        {
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(`users/${id}`)
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
        this.getUserList()
      }
    },
    async showActionsDialog (username) {
      // 根据管理员id查询其出入库操作记录（出入库记录表）
      const { data: res1 } = await this.$http.get('importstore', {
        params: {
          query: username,
          pagesize: 3,
          pagenum: 1
        }
      })
      if (res1.status !== 200) {
        this.$message({
          type: 'error',
          message: res1.message,
          center: true
        })
      }
      this.importActionList = res1.data.importList
      const { data: res2 } = await this.$http.get('exportstore', {
        params: {
          query: username,
          pagesize: 3,
          pagenum: 1
        }
      })
      if (res2.status !== 200) {
        this.$message({
          type: 'error',
          message: res2.message,
          center: true
        })
      }
      this.exportActionList = res2.data.exportList
      this.ationsDialogVisible = true
    }
  },
  created () {
    this.getUserList()
  }
}
</script>
<style lang="less" scoped>
</style>
