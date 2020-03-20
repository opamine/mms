<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <router-link to="/users" class="show-count">
            <i class="el-icon-user-solid"></i>
            <p>管理人员</p>
            <p>{{userCount}}</p>
          </router-link>
        </el-col>
        <el-col :span="6">
          <router-link to="/source" class="show-count">
            <i class="el-icon-s-cooperation"></i>
            <p>药品来源商</p>
            <p>{{sourceCount}}</p>
          </router-link>
        </el-col>
        <el-col :span="6">
          <router-link to="/overfloor" class="show-count">
            <i class="el-icon-message-solid"></i>
            <p>库存下限预警</p>
            <p>{{overfloorCount}}</p>
          </router-link>
        </el-col>
        <el-col :span="6">
          <router-link to="/overdue" class="show-count">
            <i class="el-icon-warning"></i>
            <p>药品过期报警</p>
            <p>{{overdueCount}}</p>
          </router-link>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="card2">
      <el-row :gutter="20">
        <el-col :span="13">
          <div id="left" style="width:90%;height:400px;margin: 0 auto;"></div>
        </el-col>
        <el-col :span="5">
          <div class="right-title">入库记录</div>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities1"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
            >{{activity.content}}</el-timeline-item>
          </el-timeline>
          <div class="moreimport">
            <router-link to="/importadd">
              <i class="el-icon-right"></i>more...
            </router-link>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="right-title">出库记录</div>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities2"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
            >{{activity.content}}</el-timeline-item>
          </el-timeline>
          <div class="moreexport">
            <router-link to="/exportadd">
              <i class="el-icon-right"></i>more...
            </router-link>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import echarts from 'echarts'

export default {
  data () {
    return {
      userCount: 0,
      sourceCount: 0,
      overfloorCount: 0,
      overdueCount: 0,
      chartOption: {
        title: {
          text: '药品库存流通图'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['药品入库总量', '药品出库总量']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '药品入库总量',
            type: 'line',
            data: [700, 500, 400, 250, 400, 380, 420]
          },
          {
            name: '药品出库总量',
            type: 'line',
            data: [220, 182, 191, 234, 290, 340, 400]
          }
        ],
        color: ['#9a31c8', '#b6b12d']
      },
      activities1: [],
      activities2: []
    }
  },
  methods: {
    async getUSCount () {
      const { data: res } = await this.$http.get('leftcount')
      if (res.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.message,
          center: true
        })
      }
      this.userCount = res.data.userCount
      this.sourceCount = res.data.sourceCount
    },
    async getWarningCount () {
      const { data: res1 } = await this.$http.get('inventory/overdue', {
        params: {
          pagesize: 5,
          pagenum: 1
        }
      })
      if (res1.status !== 200) {
        this.$message({
          type: 'error',
          message: res1.message,
          center: true
        })
      } else {
        this.overdueCount = res1.data.warningTotal
      }
      const { data: res2 } = await this.$http.get('inventory/overfloor', {
        params: {
          pagesize: 5,
          pagenum: 1
        }
      })
      if (res2.status !== 200) {
        this.$message({
          type: 'error',
          message: res2.message,
          center: true
        })
      } else {
        this.overfloorCount = res2.data.warningTotal
      }
    },
    async getImportActivies () {
      const { data: res } = await this.$http.get('importstore', {
        params: {
          pagesize: 6,
          pagenum: 1
        }
      })
      if (res.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.message,
          center: true
        })
      }
      const importList = res.data.importList
      const len = importList.length
      for (let i = 0; i < len; i++) {
        const activeInfo = {
          content:
            importList[i].import_user.username +
            ' --' +
            importList[i].med_id +
            ' × ' +
            importList[i].med_count,
          timestamp: this.dateformat(importList[i].import_date, 'yyyy-mm-dd'),
          size: 'large',
          icon: 'el-icon-plus',
          color: '#0bbd87'
        }
        this.activities1.push(activeInfo)
      }
    },
    async getExportActivies () {
      const { data: res } = await this.$http.get('exportstore', {
        params: {
          pagesize: 6,
          pagenum: 1
        }
      })
      if (res.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.message,
          center: true
        })
      }
      const exportList = res.data.exportList
      const len = exportList.length
      for (let i = 0; i < len; i++) {
        const activeInfo = {
          content:
            exportList[i].export_user.username +
            ' --' +
            exportList[i].med_id +
            ' × ' +
            exportList[i].med_count,
          timestamp: this.dateformat(exportList[i].export_date, 'yyyy-mm-dd'),
          size: 'large',
          icon: 'el-icon-minus',
          color: '#409eff'
        }
        this.activities2.push(activeInfo)
      }
    }
  },
  created () {
    this.getUSCount()
    this.getWarningCount()
    this.getImportActivies()
    this.getExportActivies()
    // 代码内格式化日期
    // const dat = Date.now()
    // console.log(this.dateformat(dat, 'yyyy-mm-dd'))
  },
  mounted () {
    const myChart = echarts.init(document.getElementById('left'))
    myChart.setOption(this.chartOption)
  }
}
</script>
<style lang="less" scoped>
.el-col {
  .show-count {
    display: block;
    width: 80%;
    max-width: 220px;
    height: 110px;
    padding-top: 5px;
    border-radius: 5px;
    margin: 0 auto;
    text-align: center;
    text-decoration: none;
    color: #fff;
    font-size: 24px;
    // background:linear-gradient(90deg,#4c77a3c5,#409eff,#40a0ffcb);
    p {
      margin-top: 8px;
      font-size: 14px;
      &:nth-of-type(2) {
        margin-top: 5px;
        font-size: 26px;
      }
    }
  }
  &:nth-child(1) .show-count {
    background-color: #4f688d;
  }
  &:nth-child(2) .show-count {
    background-color: #574a86;
  }
  &:nth-child(3) .show-count {
    background-color: #92724e;
  }
  &:nth-child(4) .show-count {
    background-color: #924f4f;
  }
}
.el-card.card2 {
  margin-top: 25px;
  .right-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  .moreimport,
  .moreexport {
    padding-left: 40px;
    font-size: 14px;
    a {
      text-decoration: none;
      color: #18126b;
    }
  }
}
</style>
