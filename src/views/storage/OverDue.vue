<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>药品库存</el-breadcrumb-item>
      <el-breadcrumb-item>药品过期预警</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20" class="show-echart">
        <el-col :span="12" class="col-left">
          <div id="left" style="width:600px;height:300px;margin: 0 auto;"></div>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="12">
              <div class="warning-total">
                报警条目总数
                <p>{{warningTotal}}</p>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="store-total">
                库存条目总数
                <p>{{storeTotal}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="tip">
            <el-col :span="24">Tip: 库存药品会在有效期截止前一周内计入报警条目。</el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-table :data="warningList" border stripe>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column prop="med_info.med_name" label="药品名称" align="center"></el-table-column>
        <el-table-column label="药批文号" align="center">
          <template v-slot="scope">
            {{scope.row.med_id}}
            <i
              class="el-icon-info"
              @click="showMedInfoDialog(scope.row.med_id)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="生产日期" align="center">
          <template v-slot="scope">{{scope.row.product_date | dateformat('yyyy-mm-dd')}}</template>
        </el-table-column>
        <el-table-column label="有效期至" align="center">
          <template v-slot="scope">{{scope.row.using_date | dateformat('yyyy-mm-dd')}}</template>
        </el-table-column>
        <el-table-column prop="med_count" label="库存数量" align="center" width="180"></el-table-column>
        <el-table-column prop="dis_over_due" label="距离到期" align="center" width="180"></el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :page-size="queryInfo.pagesize"
        :current-page="queryInfo.pagenum"
        :total="warningTotal"
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
import echarts from 'echarts'

export default {
  data () {
    return {
      chartOption: {
        title: {
          text: '药品过期报警库存条目占比',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'center',
          data: ['药品过期报警条目', '库存总条目']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: [
              { value: 0, name: '药品过期报警条目' },
              { value: 0, name: '库存总条目' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, .5)'
              }
            }
          }
        ],
        color: ['#f56c6c', '#405172']
      },
      queryInfo: {
        pagesize: 5,
        pagenum: 1
      },
      warningTotal: 0,
      storeTotal: 0,
      warningList: [],
      medInfo: {},
      medInfoDialogVisible: false
    }
  },
  methods: {
    async getWarningList () {
      const { data: res } = await this.$http.get('inventory/overdue', {
        params: this.queryInfo
      })
      if (res.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.message,
          center: true
        })
      }
      this.chartOption.series[0].data[0].value = res.data.warningTotal
      this.chartOption.series[0].data[1].value = res.data.storeTotal
      this.warningTotal = res.data.warningTotal
      this.storeTotal = res.data.storeTotal
      const dateNow = Date.now()
      const warningList = res.data.warningList
      warningList.forEach(item => {
        let disTime = item.med_using_date - dateNow
        if (disTime > 0) {
          if ((disTime / 86400000 + '').split('.')[0] > 0) {
            item.dis_over_due = (disTime / 86400000 + '').split('.')[0] + ' 天'
          } else {
            item.dis_over_due =
              ((disTime % 86400000) / 3600000 + '').split('.')[0] + '小时'
          }
        } else {
          item.dis_over_due = '已过期'
        }
      })
      this.warningList = warningList
      this.renderPie()
    },
    renderPie () {
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
    // const myChart = echarts.init(document.getElementById('left'))
    // myChart.setOption(this.chartOption, true)
  }
}
</script>
<style lang="less" scoped>
.col-left {
  border-right: 1px solid rgb(240, 240, 240);
}
.warning-total,
.store-total {
  margin: 0 auto;
  font-size: 18px;
  color: #333;
  font-weight: 600;
  text-align: center;
  p {
    width: 180px;
    height: 100px;
    margin: 78px auto 0;
    line-height: 100px;
    text-align: center;
    color: #fff;
    font-size: 30px;
    font-weight: 400;
    background-color: #f56c6c;
    box-shadow: 0 5px 5px rgba(87, 87, 87, 0.5);
  }
}
.store-total {
  p {
    background-color: #405172;
  }
}
.el-row.show-echart {
  border-bottom: 1px solid rgb(240, 240, 240);
}
.el-row.tip {
  margin-top: 50px;
  text-align: center;
  font-size: 16px;
  color: rgb(95, 95, 95);
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
