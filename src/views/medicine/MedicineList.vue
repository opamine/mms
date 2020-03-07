<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>药品信息</el-breadcrumb-item>
      <el-breadcrumb-item>药品信息列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入查询信息"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getMedicineList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getMedicineList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button @click="goToAdd()">添加药品信息</el-button>
        </el-col>
        <el-col :span="6">
          <el-alert type="warning" title="tip: 药品唯一性以药品批准文号为准！" :closable="false"></el-alert>
        </el-col>
      </el-row>
      <el-table :data="medicineList" stripe border="">
        <el-table-column type="expand" width="50" align="center">
          <template v-slot="scope">备注：{{scope.row.remark}}</template>
        </el-table-column>
        <el-table-column type="index" width="50" align="center" label="#"></el-table-column>
        <el-table-column prop="med_name" label="药品名称" width="" align="center"></el-table-column>
        <el-table-column prop="med_id" label="批准文号" width="" align="center"></el-table-column>
        <el-table-column prop="med_cate.cate_name" label="所属分类" width="" align="center"></el-table-column>
        <el-table-column prop="dosage_form" label="剂型" width="60" align="center"></el-table-column>
        <el-table-column prop="specification" label="规格" width="" align="center"></el-table-column>
        <el-table-column prop="unit" label="常用单位" width="60" align="center"></el-table-column>
        <el-table-column prop="min_unit" label="最小单位" width="60" align="center"></el-table-column>
        <el-table-column prop="inventory_up" label="库存上限" width="" align="center">
          <template v-slot="scope">
            {{scope.row.inventory_up === 0 ? '---' : scope.row.inventory_up}}
          </template>
        </el-table-column>
        <el-table-column prop="inventory_floor" label="库存下限" width="" align="center"></el-table-column>
        <el-table-column prop="source_name" label="生产厂商" width="200" align="center">
          <template v-slot="scope">
            {{scope.row.source_name ? scope.row.source_name : '---'}}
          </template>
        </el-table-column>
        <el-table-column prop="source_place" label="地址" width="" align="center">
          <template v-slot="scope">
            {{scope.row.source_place ? scope.row.source_place : '---'}}
          </template>
        </el-table-column>
        <el-table-column prop="import_price" label="进价(元)" width="" align="center">
          <template v-slot="scope">
            {{scope.row.import_price === 0 ? '---' : scope.row.import_price}}
          </template>
        </el-table-column>
        <el-table-column prop="export_price" label="零售价(元)" width="" align="center">
          <template v-slot="scope">
            {{scope.row.export_price === 0 ? '---' : scope.row.export_price}}
          </template>
        </el-table-column>
        <el-table-column label="药物类型" width="" align="center">
          <template v-slot="scope">{{scope.row.otc ? '非处方药' : '处方药'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template v-slot="scope">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.med_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeMed(scope.row.med_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog
      title="修改药品信息"
      :visible.sync="editDialogVisible"
      width="60%"
      @close="editDialogClosed"
      top="10vh"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="85px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="药品名称:" prop="med_name">
              <el-input v-model="editForm.med_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批准文号:" prop="med_id">
              <el-input v-model="editForm.med_id"  disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属分类:" prop="med_cate_id">
              <el-select v-model="editForm.med_cate" placeholder="请选择所属分类">
                <el-option v-for="item in cateList" :label="item.cate_name" :value="item.cate_id" :key="item.cate_id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否OTC:" prop="otc">
              <el-radio-group v-model="editForm.otc">
                <el-radio :label="true" size="medium" border="">非处方药</el-radio>
                <el-radio :label="false" size="medium" border="">处方药</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="药品剂型:" prop="dosage_form">
              <el-input v-model="editForm.dosage_form"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="药品规格:" prop="specification">
              <el-input v-model="editForm.specification"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="常用单位:" prop="unit">
              <el-input v-model="editForm.unit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小单位:" prop="min_unit">
              <el-input v-model="editForm.min_unit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="库存上限:" prop="inventory_up">
              <el-input-number v-model="editForm.inventory_up" :min="0" size="medium" label="描述文字"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存下限:" prop="inventory_floor">
              <el-input-number
                v-model="editForm.inventory_floor"
                :min="0"
                size="medium"
                label="描述文字"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="生产厂商:" prop="source_name">
              <el-input v-model="editForm.source_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="厂家地址:" prop="source_place">
              <el-input v-model="editForm.source_place"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="进价(元):" prop="import_price">
              <el-input-number
                v-model="editForm.import_price"
                :min="0"
                size="medium"
                :controls="false"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="零售价(元):" prop="export_price">
              <el-input-number
                v-model="editForm.export_price"
                :min="0"
                size="medium"
                :controls="false"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <el-input type="textarea" v-model="editForm.remark" resize="none"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editMed">确 定</el-button>
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
        pagesize: 5,
        pagenum: 1
      },
      total: 0,
      cateList: [],
      medicineList: [],
      editDialogVisible: false,
      editForm: {
        med_id: '',
        med_name: '',
        med_cate: '',
        dosage_form: '',
        specification: '',
        unit: '',
        min_unit: '',
        inventory_up: 0,
        inventory_floor: 0,
        source_name: '',
        source_place: '',
        import_price: 0,
        export_price: 0,
        otc: null,
        remark: ' '
      },
      editFormRules: {
        med_id: [
          { required: true, message: '请填写药品批准文号', trigger: 'blur' }
        ],
        med_name: [
          { required: true, message: '请填写药品名称', trigger: 'blur' }
        ],
        med_cate_id: [
          { required: true, message: '请选择药品分类', trigger: 'blur' }
        ],
        otc: [{ required: true, message: '请选择药品类型', trigger: 'blur' }],
        dosage_form: [
          { required: true, message: '请填写药品剂型', trigger: 'blur' }
        ],
        specification: [
          { required: true, message: '请填写药品规格', trigger: 'blur' }
        ],
        unit: [{ required: true, message: '请填写药品单位', trigger: 'blur' }],
        min_unit: [
          { required: true, message: '请填写药品最小单位', trigger: 'blur' }
        ],
        inventory_floor: [
          { required: true, message: '请填写药品库存下限', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    clearQuery () {
      this.queryInfo.query = ''
      this.getMedicineList()
    },
    search () {
      this.queryInfo.query = ''
      this.getMedicineList()
    },
    async handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getMedicineList()
    },
    async handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getMedicineList()
    },
    async getCateList () {
      const { data: res } = await this.$http.get('cates', {
        params: {
          query: '',
          pagesize: 5,
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
      const total = res.data.total
      const { data: res2 } = await this.$http.get('cates', {
        params: {
          query: '',
          pagesize: total,
          pagenum: 1
        }
      })
      if (res2.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.message,
          center: true
        })
      }
      this.cateList = res2.data.cateList
    },
    async getMedicineList () {
      // 获取药品信息列表
      const { data: res } = await this.$http.get('medicines', {
        params: this.queryInfo
      })
      if (res.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.message,
          center: true
        })
      }
      this.medicineList = res.data.medicineList
      this.total = res.data.total
    },
    goToAdd () {
      this.$router.push('/medicineadd')
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`medicines/${id}`)
      if (res.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.message,
          center: true
        })
      }
      res.data.med_cate = res.data.med_cate.cate_id
      this.editForm = res.data
      this.getCateList()
      this.editDialogVisible = true
    },
    async editMed () {
      const { data: res } = await this.$http.put(`medicines/${this.editForm.med_id}`, this.editForm)
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
      this.getMedicineList()
      this.editDialogVisible = false
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    async removeMed (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该条记录, 是否继续?',
        '删除此药品信息',
        {
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(`medicines/${id}`)
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
        this.MedicineList()
      }
    }
  },
  created () {
    this.getMedicineList()
  },
  updated () {
  }
}
</script>
<style lang="less" scoped>
</style>
