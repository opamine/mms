<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>药品库存</el-breadcrumb-item>
      <el-breadcrumb-item>库存下限预警</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <div id="left" style="width:100%;height:650px;margin: 0 auto;"></div>
        </el-col>
        <el-col :span="16">
          <el-table :data="warningList" border="" stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="med_name" label="药品名称" align="center"></el-table-column>
            <el-table-column label="药批文号" align="center" width="180">
              <template v-slot="scope">
                {{scope.row.med_id}}
                <i
                  class="el-icon-info"
                  @click="showMedInfoDialog(scope.row.med_id)"
                ></i>
              </template>
            </el-table-column>
            <el-table-column prop="med_cate.cate_name" label="药品分类" align="center"></el-table-column>
            <el-table-column prop="source_name" label="生产厂商" align="center" width="250"></el-table-column>
            <el-table-column prop="source_place" label="厂商地址" align="center"></el-table-column>
            <el-table-column prop="inventory_floor" label="库存下限" align="center"></el-table-column>
            <el-table-column prop="inventory_count" label="当前库存" align="center"></el-table-column>
          </el-table>
          <el-pagination
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :page-size="queryInfo.pagesize"
            :current-page="queryInfo.pagenum"
            :total="warningTotal"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="药品详细信息"
      :visible.sync="medInfoDialogVisible"
      width="650px"
    >
      <el-row :gutter="20">
        <el-col :span="12">药品名称：{{medInfo.med_name}}</el-col>
        <el-col :span="12">药批文号：{{medInfo.med_id}}</el-col>
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
import echarts from 'echarts'

export default {
  data () {
    return {
      queryInfo: {
        pagesize: 10,
        pagenum: 1
      },
      warningTotal: 0,
      warningList: [],
      chartOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['当前库存', '库存下限', '欠补']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value'
          }
        ],
        yAxis: [
          {
            type: 'category',
            axisTick: {
              show: false
            },
            data: []
          }
        ],
        series: [
          {
            name: '当前库存',
            type: 'bar',
            label: {
              show: true,
              position: 'inside'
            },
            data: []
          },
          {
            name: '库存下限',
            type: 'bar',
            stack: '总量',
            label: {
              show: true
            },
            data: []
          },
          {
            name: '欠补',
            type: 'bar',
            stack: '总量',
            label: {
              show: true,
              position: 'left'
            },
            data: []
          }
        ],
        color: ['#f56c6c', '#405172', '#61A0A8']
      },
      medInfo: {},
      medInfoDialogVisible: false
    }
  },
  methods: {
    async getWarningList () {
      const { data: res } = await this.$http.get('inventory/overfloor', {
        params: this.queryInfo
      })
      if (res.status !== 200) {
        this.$message({
          type: 'error',
          message: res.message,
          center: true
        })
      }
      this.warningList = res.data.warningList
      this.warningTotal = res.data.warningTotal
      const len = this.warningList.length
      for (let i = 0; i < len; i++) {
        this.chartOption.yAxis[0].data.push(this.warningList[i].med_id)
        this.chartOption.series[0].data.push(this.warningList[i].inventory_count)
        this.chartOption.series[1].data.push(this.warningList[i].inventory_floor)
        this.chartOption.series[2].data.push(this.warningList[i].inventory_count - this.warningList[i].inventory_floor)
      }
      const myChart = echarts.init(document.getElementById('left'))
      myChart.setOption(this.chartOption, true)
    },
    async handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getWarningList()
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
    this.getWarningList()
  },
  mounted () {
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
