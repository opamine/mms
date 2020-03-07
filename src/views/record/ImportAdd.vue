<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>药品进出</el-breadcrumb-item>
      <el-breadcrumb-item>药品入库管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-divider content-position="left" class="left-title">药品入库登记</el-divider>
          <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="85px">
            <el-form-item label="入库单号:" prop="import_id">
              <el-input v-model="addForm.import_id"></el-input>
            </el-form-item>
            <el-form-item label="入库日期:" prop="import_date">
              <el-date-picker
                v-model="addForm.import_date"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="管理员ID:" prop="import_user">
              <el-input v-model="addForm.import_user" disabled></el-input>
            </el-form-item>
            <el-form-item label="管理员:" prop="import_user_name">
              <el-input v-model="addForm.import_user_name" disabled></el-input>
            </el-form-item>
            <el-form-item label="药批文号:" prop="med_id">
              <el-input v-model="addForm.med_id"></el-input>
            </el-form-item>
            <el-form-item label="生产日期:" prop="med_product_date">
              <el-date-picker
                v-model="addForm.med_product_date"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="有效期至:" prop="med_using_date">
              <el-date-picker
                v-model="addForm.med_using_date"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="入库数量:" prop="med_count">
              <el-input-number v-model="addForm.med_count" :min="0"></el-input-number>
              <el-button @click="getTotalMoney">计算总金额</el-button>
            </el-form-item>
            <el-form-item label="总金额:" prop="total_money">
              <el-input v-model="addForm.total_money"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addRecord" size="medium">保存</el-button>
              <el-button @click="resetForm" size="medium">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="18">
          <el-divider content-position="left">药品入库记录</el-divider>
          <el-row :gutter="20">
            <el-col :span="16">
              <el-alert title="入库记录按时间最新排序" type="warning" :closable="false" :center="true"></el-alert>
            </el-col>
            <el-col :span="8">
              <el-input
                placeholder="根据管理员姓名查询入库记录"
                class="input-with-select"
                v-model="queryInfo.query"
                clearable
                @clear="clearQuery"
              >
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-table :data="importList" style="width: 100%" border="" stripe>
            <el-table-column prop="import_id" label="入库单号" width="140" align="center"></el-table-column>
            <el-table-column label="入库日期" width="140" align="center">
              <template v-slot="scope">{{scope.row.import_date | dateformat('yyyy-mm-dd')}}</template>
            </el-table-column>
            <el-table-column prop="import_user.userid" label="管理员ID" align="center"></el-table-column>
            <el-table-column prop="import_user.username" label="管理员" align="center"></el-table-column>
            <el-table-column prop="med_id" label="药批文号" width="180" align="center">
              <template v-slot="scope">
                {{scope.row.med_id}}
                <i
                  class="el-icon-info"
                  @click="showMedInfoDialog(scope.row.med_id)"
                ></i>
              </template>
            </el-table-column>
            <el-table-column label="生产日期" align="center">
              <template v-slot="scope">{{scope.row.med_product_date | dateformat('yyyy-mm-dd')}}</template>
            </el-table-column>
            <el-table-column label="有效期至" align="center">
              <template v-slot="scope">{{scope.row.med_using_date | dateformat('yyyy-mm-dd')}}</template>
            </el-table-column>
            <el-table-column prop="med_count" label="入库数量" align="center"></el-table-column>
            <el-table-column prop="total_money" label="总金额(元)" align="center"></el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[7, 8, 9]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background=""
          ></el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="药品详细信息" :visible.sync="medInfoDialogVisible" width="650px">
      <el-row :gutter="20">
        <el-col :span="12">药品编号：{{medInfo.med_id}}</el-col>
        <el-col :span="12">药品名称：{{medInfo.med_name}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">所属分类：{{'西药'}}</el-col>
        <el-col :span="12">是否OTC：{{medInfo.otc ? '非处方药' : '处方药'}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">药品剂型：{{medInfo.dosage_form}}</el-col>
        <el-col :span="12">药品规格：{{medInfo.specification}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">常用单位：{{medInfo.unit}}</el-col>
        <el-col :span="12">最小单位：{{medInfo.min_unit}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">库存上限：{{medInfo.inventory_up}}</el-col>
        <el-col :span="12">库存下限：{{medInfo.inventory_floor}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">生产厂商：{{medInfo.source_name}}</el-col>
        <el-col :span="12">厂家地址：{{medInfo.source_place}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">进价：{{medInfo.import_price}}</el-col>
        <el-col :span="12">零售价：{{medInfo.export_price}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">备注：{{medInfo.remark}}</el-col>
      </el-row>
      <el-row :gutter="20"></el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="medInfoDialogVisible=false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      addForm: {
        import_id: '',
        import_date: null,
        import_user: '', // 向服务器发送 管理员ID
        import_user_name: '',
        med_id: '',
        med_product_date: null,
        med_using_date: null,
        med_count: 0,
        total_money: null
      },
      addFormRules: {
        import_id: [
          { required: true, message: '请填写入库单号', trigger: 'blur' }
        ],
        import_date: [
          { required: true, message: '请选择入库日期', trigger: 'blur' }
        ],
        import_user: [
          { required: true, message: '请填写管理员id', trigger: 'blur' }
        ],
        import_user_name: [
          { required: true, message: '请填写管理员姓名', trigger: 'blur' }
        ],
        med_id: [
          { required: true, message: '请输入药批文号', trigger: 'blur' }
        ],
        med_product_date: [
          { required: true, message: '请选择药品的生产日期', trigger: 'blur' }
        ],
        med_using_date: [
          { required: true, message: '请选择药品的有效期', trigger: 'blur' }
        ],
        med_count: [
          { type: 'integer', message: '药品数量须为正整数', trigger: 'change' }
        ],
        total_money: [
          {
            required: true,
            message: '请计算或手动输入入库总金额',
            trigger: 'blur'
          }
        ]
      },
      queryInfo: {
        query: '',
        pagesize: 8,
        pagenum: 1
      },
      total: 0,
      importList: [],
      medInfo: {},
      medInfoDialogVisible: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    search () {
      this.queryInfo.pagenum = 1
      this.getImportList()
    },
    clearQuery () {
      this.queryInfo.pagenum = 1
      this.getImportList()
    },
    async handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getImportList()
    },
    async handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getImportList()
    },
    async getImportList () {
      const { data: res } = await this.$http.get('importstore', {
        params: this.queryInfo
      })
      if (res.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.message,
          center: true
        })
      }
      this.importList = res.data.importList
      this.total = res.data.total
    },
    async getTotalMoney () {
      if (this.addForm.med_id) {
        const { data: res } = await this.$http.get(
          `medicines/${this.addForm.med_id}`
        )
        if (res.status !== 200) {
          return this.$message({
            type: 'error',
            message: res.message + ' 请正确填写药批文号！',
            center: true
          })
        }
        this.addForm.total_money =
          res.data.import_price * this.addForm.med_count
      } else {
        this.$message({
          type: 'error',
          message: '请填写药批文号！',
          center: true
        })
      }
    },
    addRecord () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return undefined
        if (this.addForm.med_count === 0) {
          return this.$message({
            type: 'error',
            message: '请填写药品入库数量！',
            center: true
          })
        }
        const { data: res } = await this.$http.post(
          'importstore',
          this.addForm
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
        this.getImportList()
        this.resetForm()
      })
    },
    resetForm () {
      this.$refs.addFormRef.resetFields()
    },
    async showMedInfoDialog (id) {
      const { data: res } = await this.$http.get(`medicines/${id}`)
      if (res.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.message,
          center: true
        })
      }
      this.medInfo = res.data
      this.medInfoDialogVisible = true
    }
  },
  created () {
    this.getImportList()
    this.addForm.import_user = this.userInfo.userid
    this.addForm.import_user_name = this.userInfo.username
  }
}
</script>
<style lang="less" scoped>
.el-divider__text {
  font-size: 20px;
}
.el-pagination {
  text-align: center;
}
.el-dialog .el-row {
  border-left: 1px solid rgb(202, 202, 202);
  margin-right: 10px !important;
  margin-left: 10px !important;
  &:first-of-type {
    border-top: 1px solid rgb(202, 202, 202);
  }
  .el-col {
    border-right: 1px solid rgb(202, 202, 202);
    border-bottom: 1px solid rgb(202, 202, 202);
    padding: 10px;
  }
}
</style>
