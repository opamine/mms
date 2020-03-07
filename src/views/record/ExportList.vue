<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>药品出库记录</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="根据管理员姓名查询出库记录"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="clearQuery"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-alert title="出库记录按时间最新排序" type="warning" :closable="false" :center="true"></el-alert>
        </el-col>
      </el-row>
      <el-table :data="exportList" border="" stripe>
        <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
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
        <el-table-column prop="med_count" label="出库方式" align="center">
          <template v-slot="scope">
            <el-tag type="success" size="small" v-if="scope.row.export_method == 'sell'">售出</el-tag>
            <el-tag type="danger" size="small" v-else>退货</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="med_count" label="出库数量" align="center"></el-table-column>
        <el-table-column prop="total_money" label="总金额(元)" align="center"></el-table-column>
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
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagesize: 8,
        pagenum: 1
      },
      total: 0,
      exportList: [],
      medInfo: {},
      medInfoDialogVisible: false
    }
  },
  methods: {
    search () {
      this.queryInfo.pagenum = 1
      this.getExportList()
    },
    clearQuery () {
      this.queryInfo.pagenum = 1
      this.getExportList()
    },
    async handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getExportList()
    },
    async handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getExportList()
    },
    async getExportList () {
      // 获取出库记录表
      const { data: res } = await this.$http.get('exportstore', {
        params: this.queryInfo
      })
      if (res.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.message,
          center: true
        })
      }
      this.exportList = res.data.exportList
      this.total = res.data.total
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
    this.getExportList()
  }
}
</script>
<style lang="less" scoped>
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
