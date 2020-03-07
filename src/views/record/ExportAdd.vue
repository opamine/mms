<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>药品进出</el-breadcrumb-item>
      <el-breadcrumb-item>药品出库管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-divider content-position="left" class="left-title">药品出库登记</el-divider>
          <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="85px">
            <el-form-item label="出库单号:" prop="export_id">
              <el-input v-model="addForm.export_id"></el-input>
            </el-form-item>
            <el-form-item label="出库日期:" prop="export_date">
              <el-date-picker
                v-model="addForm.export_date"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="管理员ID:" prop="export_user">
              <el-input v-model="addForm.export_user" disabled></el-input>
            </el-form-item>
            <el-form-item label="管理员:" prop="export_user_name">
              <el-input v-model="addForm.export_user_name" disabled></el-input>
            </el-form-item>
            <el-form-item label="出库方式:" prop="export_method">
              <el-radio-group v-model="addForm.export_method">
                <el-radio label="sell">售出</el-radio>
                <el-radio label="return">退货</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="药品编号:" prop="med_id">
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
            <el-form-item label="出库数量:" prop="med_count">
              <el-input-number v-model="addForm.med_count" :min="0"></el-input-number>
              <el-button @click="getTotalMoney">计算总金额</el-button>
            </el-form-item>
            <el-form-item label="总金额:" prop="total_money">
              <el-input v-model="addForm.total_money"></el-input>
            </el-form-item>
            <el-form-item class="last-form-item">
              <el-button type="primary" @click="addRecord" size="medium">保存</el-button>
              <el-button @click="resetForm" size="medium">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="18">
          <el-row>
            <el-divider content-position="left">药品售出记录</el-divider>
            <el-table :data="exportSellList" style="width: 100%" border="" stripe>
              <el-table-column prop="export_id" label="出库单号" width="180" align="center"></el-table-column>
              <el-table-column label="出库日期" width="180" align="center">
                <template v-slot="scope">{{scope.row.export_date | dateformat('yyyy-mm-dd')}}</template>
              </el-table-column>
              <el-table-column prop="export_user.userid" label="管理员ID" align="center"></el-table-column>
              <el-table-column prop="export_user.username" label="管理员" align="center"></el-table-column>
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
              <el-table-column prop="med_count" label="出库数量" align="center"></el-table-column>
              <el-table-column prop="total_money" label="总金额(元)" align="center"></el-table-column>
            </el-table>
            <el-pagination
              @current-change="handleCurrentChange"
              layout="prev, pager, next"
              :page-size="queryInfo.pagesize"
              :current-page="queryInfo.pagenum"
              :total="total"
            ></el-pagination>
          </el-row>
          <el-row>
            <el-divider content-position="left">药品退货记录</el-divider>
            <el-table :data="exportReturnList" style="width: 100%" border="" stripe>
              <el-table-column prop="export_id" label="出库单号" width="180" align="center"></el-table-column>
              <el-table-column label="出库日期" width="180" align="center">
                <template v-slot="scope">{{scope.row.export_date | dateformat('yyyy-mm-dd')}}</template>
              </el-table-column>
              <el-table-column prop="export_user.userid" label="管理员ID" align="center"></el-table-column>
              <el-table-column prop="export_user.username" label="管理员" align="center"></el-table-column>
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
              <el-table-column prop="med_count" label="出库数量" align="center"></el-table-column>
              <el-table-column prop="total_money" label="总金额(元)" align="center"></el-table-column>
            </el-table>
            <div class="watch-more">
              <router-link to="/exportlist">--查看药品出库 全部记录--</router-link>
            </div>
          </el-row>
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
        export_id: '',
        export_date: null,
        export_user: '', // 向服务器发送 管理员ID
        export_user_name: '',
        export_method: '',
        med_id: '',
        med_product_date: null,
        med_using_date: null,
        med_count: 0,
        total_money: null
      },
      addFormRules: {
        export_id: [
          { required: true, message: '请填写出库单号', trigger: 'blur' }
        ],
        export_date: [
          { required: true, message: '请选择出库日期', trigger: 'blur' }
        ],
        export_user: [
          { required: true, message: '请填写管理员id', trigger: 'blur' }
        ],
        export_user_name: [
          { required: true, message: '请填写管理员姓名', trigger: 'blur' }
        ],
        export_method: [{ required: true, message: '请选择出库方式' }],
        med_id: [
          { required: true, message: '请输入药品编号', trigger: 'blur' }
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
            message: '请计算或手动输入出库总金额',
            trigger: 'blur'
          }
        ]
      },
      queryInfo: {
        pagesize: 5,
        pagenum: 1
      },
      total: 0,
      exportSellList: [],
      exportReturnList: [],
      medInfo: {},
      medInfoDialogVisible: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    async getExportSellList () {
      const { data: res } = await this.$http.get('exportstore/sell', {
        params: this.queryInfo
      })
      if (res.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.message,
          center: true
        })
      }
      this.exportSellList = res.data.exportSellList
      this.total = res.data.total
    },
    async getExportReturnList () {
      const { data: res } = await this.$http.get('exportstore/return')
      if (res.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.message,
          center: true
        })
      }
      this.exportReturnList = res.data.exportReturnList
    },
    async handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getExportSellList()
    },
    async getTotalMoney () {
      if (this.addForm.med_id && this.addForm.export_method) {
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
        if (this.addForm.export_method === 'sell') {
          this.addForm.total_money =
            res.data.export_price * this.addForm.med_count
        } else {
          this.addForm.total_money =
            res.data.import_price * this.addForm.med_count
        }
      } else {
        this.$message({
          type: 'error',
          message: '请填写药批文号，选择出库方式！',
          center: true
        })
      }
    },
    addRecord () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return undefined
        if (!valid) return undefined
        if (this.addForm.med_count === 0) {
          return this.$message({
            type: 'error',
            message: '请填写药品出库数量！',
            center: true
          })
        }
        const { data: res } = await this.$http.post(
          'exportstore',
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
        this.getExportSellList()
        this.getExportReturnList()
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
    this.getExportSellList()
    this.getExportReturnList()
    this.addForm.export_user = this.userInfo.userid
    this.addForm.export_user_name = this.userInfo.username
  }
}
</script>
<style lang="less" scoped>
.el-divider__text {
  font-size: 20px;
}
.last-form-item {
  margin-bottom: 0;
}
.el-pagination {
  text-align: center;
}
.watch-more {
  text-align: center;
  a {
    text-decoration: none;
    font-size: 14px;
    color: #409eff;
  }
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
