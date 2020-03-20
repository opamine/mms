<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>供应商管理</el-breadcrumb-item>
      <el-breadcrumb-item>供应商列表</el-breadcrumb-item>
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
          <el-button @click="addDialogVisible=true">添加供应商</el-button>
        </el-col>
      </el-row>
      <el-table :data="sourceList" stripe border="">
        <el-table-column prop="manu_id" label="厂家编号" align="center" width="150"></el-table-column>
        <el-table-column prop="manufacturer" label="厂家名称" align="center" width="300"></el-table-column>
        <el-table-column prop="place" label="所在地区" align="center" width="200"></el-table-column>
        <el-table-column prop="main_sale" label="主营产品" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template v-slot="scope">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.manu_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteSource(scope.row.manu_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[6, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog
      title="添加供应商"
      :visible.sync="addDialogVisible"
      width="550px"
      @close="addDialogClosed"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="厂家编号" prop="manu_id">
          <el-input v-model="addForm.manu_id"></el-input>
        </el-form-item>
        <el-form-item label="厂家名称" prop="manufacturer">
          <el-input v-model="addForm.manufacturer"></el-input>
        </el-form-item>
        <el-form-item label="所在地区" prop="place">
          <el-input v-model="addForm.place"></el-input>
        </el-form-item>
        <el-form-item label="主营产品" prop="main_sale">
          <el-input v-model="addForm.main_sale"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSource">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改供应商信息"
      :visible.sync="editDialogVisible"
      width="550px"
      @close="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="厂家编号">
          <el-input v-model="editForm.manu_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="厂家名称" prop="manufacturer">
          <el-input v-model="editForm.manufacturer"></el-input>
        </el-form-item>
        <el-form-item label="所在地区" prop="place">
          <el-input v-model="editForm.place"></el-input>
        </el-form-item>
        <el-form-item label="主营产品" prop="main_sale">
          <el-input v-model="editForm.main_sale"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSource">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagesize: 8,
        pagenum: 1
      },
      total: 0,
      sourceList: [],
      addDialogVisible: false,
      addForm: {
        manu_id: '',
        manufacturer: '',
        place: '',
        main_sale: ''
      },
      addFormRules: {
        manu_id: [
          { required: true, message: '请填写厂商编号', trigger: 'blur' }
        ],
        manufacturer: [
          { required: true, message: '请填写厂商名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        manu_id: '',
        manufacturer: '',
        place: '',
        main_sale: ''
      }
    }
  },
  methods: {
    search () {
      this.queryInfo.pagenum = 1
      this.getSourceList()
    },
    clearQuery () {
      this.queryInfo.pagenum = 1
      this.getSourceList()
    },
    async getSourceList () {
      const { data: res } = await this.$http.get('sources', {
        params: this.queryInfo
      })
      if (res.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.message,
          center: true
        })
      }
      this.sourceList = res.data.sourceList
      this.total = res.data.total
    },
    async handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getSourceList()
    },
    async handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getSourceList()
    },
    async addSource () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return undefined
        const { data: res } = await this.$http.post('sources', this.addForm)
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
        this.getSourceList()
        this.addDialogVisible = false
      })
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`sources/${id}`)
      if (res.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.message,
          center: true
        })
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editSource () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return undefined
        const id = this.editForm.manu_id
        const { data: res } = await this.$http.put(
          `sources/${id}`,
          this.editForm
        )
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
        this.getSourceList()
        this.editDialogVisible = false
      })
    },
    async deleteSource (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该条记录, 是否继续?',
        '删除此供应商',
        {
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(`sources/${id}`)
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
        this.getSourceList()
      }
    }
  },
  created () {
    this.getSourceList()
  }
}
</script>
<style lang="less" scoped>
.el-pagination {
  text-align: center;
}
</style>
