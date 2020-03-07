<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>药品类别</el-breadcrumb-item>
      <el-breadcrumb-item>药品分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入查询信息"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="clearQuery"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <el-table :data="cateList" stripe border="">
        <el-table-column prop="cate_id" label="分类ID" align="center" width="150"></el-table-column>
        <el-table-column prop="cate_name" label="分类名称" align="center"></el-table-column>
        <el-table-column label="创建时间" align="center">
          <template v-slot="scope">{{scope.row.create_date | dateformat('yyyy-mm-dd HH:MM')}}</template>
        </el-table-column>
        <el-table-column label="创建人" align="center">
          <template v-slot="scope">{{scope.row.create_user.username}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="225">
          <template v-slot="scope">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.cate_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteCate(scope.row.cate_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[6,, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="550px" @close="addDialogClosed">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="创建人ID">
          <el-input v-model="addForm.userid" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="addForm.username" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改分类信息"
      :visible.sync="editDialogVisible"
      width="550px"
      @close="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="分类id">
          <el-input v-model="editForm.cate_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="editForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="创建人ID">
          <el-input v-model="editForm.create_user_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="editForm.create_user_name" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagesize: 8,
        pagenum: 1
      },
      total: 0,
      cateList: [],
      addDialogVisible: false,
      addForm: {
        cate_name: '',
        userid: '',
        username: ''
      },
      addFormRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        cate_id: '',
        cate_name: '',
        create_user_id: '',
        create_user_name: ''
      },
      editFormRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    search () {
      this.queryInfo.pagenum = 1
      this.getCateList()
    },
    clearQuery () {
      this.queryInfo.pagenum = 1
      this.getCateList()
    },
    async getCateList () {
      const { data: res } = await this.$http.get('cates', {
        params: this.queryInfo
      })
      if (res.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.message,
          center: true
        })
      }
      this.cateList = res.data.cateList
      this.total = res.data.total
    },
    async handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    async handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddDialog () {
      this.addForm.userid = this.userInfo.userid
      this.addForm.username = this.userInfo.username
      this.addDialogVisible = true
    },
    async addCate () {
      const { data: res } = await this.$http.post('cates', this.addForm)
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
      this.getCateList()
      this.addDialogVisible = false
    },
    addDialogClosed (id) {
      this.$refs.addFormRef.resetFields()
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`cates/${id}`)
      if (res.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.status,
          center: true
        })
      }
      this.editForm = {
        cate_id: res.data.cate_id,
        cate_name: res.data.cate_name,
        create_user_id: res.data.create_user.userid,
        create_user_name: res.data.create_user.username
      }
      this.editDialogVisible = true
    },
    async editCate () {
      const { data: res } = await this.$http.put(`cates/${this.editForm.cate_id}`, { cate_name: this.editForm.cate_name })
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
      this.getCateList()
      this.editDialogVisible = false
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    async deleteCate (id) {
      // 根据分类id删除分类
      const confirmResult = await this.$confirm(
        '此操作将永久删除该条记录, 是否继续?',
        '删除此分类',
        {
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(`cates/${id}`)
        if (res.status !== 200) {
          this.$message({
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
        this.getCateList()
      }
    }
  },
  created () {
    this.getCateList()
  }
}
</script>
<style lang="less" scoped>
</style>
