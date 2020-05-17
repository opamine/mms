<template>
  <el-container>
    <el-header height="68px">
      <div class="sys-info">
        <img src="../assets/img/medical.png" @click="backToIndex">
        <span>MMS&sdot;医院药物管理系统</span>
      </div>
      <div class="logout">
        <el-button size="mini" @click="logout">退出登录</el-button>
      </div>
      <div class="editpwd" @click="editpwd">
        <i class="el-icon-edit-outline"></i>修改密码
      </div>
      <div class="user-info">
        <i class="el-icon-user-solid"></i>
        <span>欢迎您 , {{userInfo.username}}</span>
        <span class="role">(权限: {{userInfo.role === 'root' ? '超级管理员' : '管理员'}})</span>
      </div>
    </el-header>
    <el-container>
      <el-aside width="260px">
        <div class="time-viewer">
          <div>
            <i class="el-icon-alarm-clock"></i>&nbsp;现在是
          </div>
          <div>{{dateNow | dateformat('yyyy-mm-dd HH:MM:ss')}}</div>
        </div>
        <el-menu
          :default-active="$route.path"
          background-color="#405172"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          router
        >
          <el-menu-item index="/users" class="single-menu-item">
            <i class="el-icon-user"></i>
            <span>系统管理员</span>
          </el-menu-item>
          <el-menu-item index="/source" class="single-menu-item">
            <i class="el-icon-truck"></i>
            <span>供应商查询</span>
          </el-menu-item>
          <el-menu-item index="/catelist" class="single-menu-item">
            <i class="el-icon-menu"></i>
            <span>药品类管理</span>
          </el-menu-item>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-info"></i>
              <span>药品信息</span>
            </template>
            <el-menu-item index="/medicineadd">药品信息录入</el-menu-item>
            <el-menu-item index="/medicinelist">药品信息查询</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-document-copy"></i>
              <span>药品进出</span>
            </template>
            <el-menu-item index="/importadd">药品入库管理</el-menu-item>
            <el-menu-item index="/exportadd">药品出库管理</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-house"></i>
              <span>药品库存</span>
            </template>
            <el-menu-item index="/storage">药品库存查询</el-menu-item>
            <el-menu-item index="/overdue">药品过期预警</el-menu-item>
            <el-menu-item index="/overfloor">库存下限预警</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <keep-alive :include='["medicineadd"]'>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
    <el-footer height="40px">
      <span>Copyright 2020 - All rights reserved</span>
    </el-footer>
  </el-container>
</template>
<script>
import { setInterval } from 'timers'
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      dateNow: ''
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    backToIndex () {
      this.$router.push('/welcome')
    },
    logout () {
      this.setUserInfo({})
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    editpwd () {
      this.$router.push('/editpwd')
    }
  },
  created () {
    setInterval(() => {
      this.dateNow = Date.now()
    }, 1000)
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  padding-left: 102px;
  background-color: #394762;
  .sys-info {
    float: left;
    display: flex;
    height: 100%;
    align-items: center;
    color: #fff;
    font-size: 22px;
    cursor: pointer;
    img {
      width: 56px;
    }
    span {
      margin-left: 30px;
      letter-spacing: 5px;
      cursor: default;
    }
  }
  .user-info {
    float: right;
    height: 100%;
    margin-right: 20px;
    line-height: 68px;
    color: #fff;
    > span {
      margin-left: 5px;
      font-size: 14px;
      &.role {
        margin-left: 10px;
        font-size: 12px;
        color: rgb(184, 184, 184);
      }
    }
  }
  .editpwd {
    float: right;
    height: 100%;
    line-height: 72px;
    font-size: 13px;
    color: rgb(230, 230, 230);
    cursor: pointer;
  }
  .logout {
    float: right;
    height: 100%;
    line-height: 68px;
    margin-left: 20px;
  }
}
.el-aside {
  background-color: #405172;
  .time-viewer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 120px;
    background-color: #405172;
    color: #eee;
    div:nth-child(2) {
      font-size: 14px;
      margin-top: 10px;
    }
  }
  .el-menu {
    border-top: 1px solid #5972a5;
    border-bottom: 1px solid #5972a5;
    border-right: none;
    .el-menu-item {
      text-align: center;
    }
    .single-menu-item {
      text-align: initial;
      padding-left: 40px !important;
    }
  }
}
.el-footer {
  background-color: #262f41;
  text-align: center;
  line-height: 40px;
  color: #fff;
  font-size: 14px;
}
</style>
