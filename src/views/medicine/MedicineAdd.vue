<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>药品信息</el-breadcrumb-item>
      <el-breadcrumb-item>药品信息添加</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="50">
        <el-col :span="14">
          <div>{{addForm.product_date}}</div>
          <el-divider content-position="center">
            <i class="el-icon-circle-plus-outline"></i>
          </el-divider>
          <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="85px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="药品名称:" prop="med_name">
                  <el-input v-model="addForm.med_name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="批准文号:" prop="med_id">
                  <el-input v-model="addForm.med_id"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="所属分类:" prop="med_cate">
                  <el-select v-model="addForm.med_cate" placeholder="请选择所属分类">
                    <el-option
                      v-for="item in cateList"
                      :label="item.cate_name"
                      :value="item.cate_id"
                      :key="item.cate_id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否OTC:" prop="otc">
                  <el-radio-group v-model="addForm.otc">
                    <el-radio :label="true" size="medium" border="">非处方药</el-radio>
                    <el-radio :label="false" size="medium" border="">处方药</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="药品剂型:" prop="dosage_form">
                  <el-input v-model="addForm.dosage_form"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="药品规格:" prop="specification">
                  <el-input v-model="addForm.specification"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="常用单位:" prop="unit">
                  <el-input v-model="addForm.unit"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="最小单位:" prop="min_unit">
                  <el-input v-model="addForm.min_unit"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="库存上限:" prop="inventory_up">
                  <el-input-number
                    v-model="addForm.inventory_up"
                    :min="0"
                    size="medium"
                    label="描述文字"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="库存下限:" prop="inventory_floor">
                  <el-input-number
                    v-model="addForm.inventory_floor"
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
                  <el-input v-model="addForm.source_name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="厂家地址:" prop="source_place">
                  <el-input v-model="addForm.source_place"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="进价(元):" prop="import_price">
                  <el-input-number
                    v-model="addForm.import_price"
                    :min="0"
                    size="medium"
                    :controls="false"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="零售价(元):" prop="export_price">
                  <el-input-number
                    v-model="addForm.export_price"
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
                  <el-input type="textarea" v-model="addForm.remark" resize="none"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item>
                  <el-button type="primary" size="medium" @click="addMedicine">提交</el-button>
                  <el-button size="medium" @click="resetForm">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="10">
          <el-divider content-position="center">
            <i class="el-icon-warning-outline"></i>
          </el-divider>
          <div class="otc-policy">
            <p>我国政府在1996年正式提出药品分类管理，同年由卫生部牵头，七部委共同成立非处方药（OTC）办公室。</p>
            <p>1998年国家药品监督管理局成立后，OTC管理工作由药品监督管理局安全监管司负责。</p>
            <p>1999年7月22日，我国正式出台《处方药与非处方药分类管理办法（试行）》，公布了第一批国家非处方药目录（西药部分和中成药部分），该《管理办法》于2000年1月1日起施行。</p>
          </div>
          <div class="otc-detail">
            <h5>OTC有以下特点：</h5>
            <p>一、不需医生处方，不在医生指导监督下使用。</p>
            <p>二、适应症是患者能自我判断的病症，药品疗效确切，使用方便安全，起效快速。</p>
            <p>三、一般能起到减轻病人不适之感，能减轻小疾病初始症状或防止其恶化，也能减轻已确诊的症状或延缓症情的发展。</p>
            <p>四、不含有毒或成瘾成分，不易在体内蓄积，不致产生耐药性，不良反应发生率低。</p>
            <p>五、在一般条件下储存，质量稳定。</p>
            <p>六、不同使用对象的非处方药品规格不同，说明文字通俗易懂，可在标签、说明书的指导下正确使用。</p>
            <p>七、otc药品的特点：安全，有效，方便，经济。otc药品投放市场前，都已经过多年的临床检验，并得到消费者的广泛认可。</p>
            <p></p>
          </div>
          <div class="otc-footer">
            <p>目前我国公布的 OTC 类药品化学类一共有 1139 种，中药类有 4376 种(截止到 2008 年 4 月 15 日)，全部信息可以在国家食品药品监督管理局的网站上查询： OTC 化学药品说明书范本、 OTC 中药说明书范本。</p>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'medicineadd',
  data () {
    return {
      cateList: [],
      addForm: {
        med_id: '',
        med_name: '',
        med_cate: '', // 这里向服务器发送的是 分类文档 的 cate_id
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
      addFormRules: {
        med_id: [{ required: true, message: '请填写药品批准文号', trigger: 'blur' }],
        med_name: [{ required: true, message: '请填写药品名称', trigger: 'blur' }],
        med_cate: [{ required: true, message: '请选择药品分类', trigger: 'blur' }],
        otc: [{ required: true, message: '请选择药品类型', trigger: 'blur' }],
        dosage_form: [{ required: true, message: '请填写药品剂型', trigger: 'blur' }],
        specification: [{ required: true, message: '请填写药品规格', trigger: 'blur' }],
        unit: [{ required: true, message: '请填写药品单位', trigger: 'blur' }],
        min_unit: [{ required: true, message: '请填写药品最小单位', trigger: 'blur' }],
        inventory_up: [{ type: 'integer', message: '药品库存上限须为整数', trigger: 'change' }],
        inventory_floor: [{ type: 'integer', message: '药品库存下限须为整数', trigger: 'change' }]
      }
    }
  },
  methods: {
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
    addMedicine () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return undefined
        const { data: res } = await this.$http.post('medicines', this.addForm)
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
        this.resetForm()
      })
    },
    resetForm () {
      this.$refs.addFormRef.resetFields()
    }
  },
  created () {
    this.getCateList()
  },
  activated () {
    console.log('组件激活')
  },
  deactivated () {
    console.log('组件失活')
  }
}
</script>
<style lang="less" scoped>
.el-divider__text {
  font-size: 30px;
}
.otc-policy {
  font-size: 14px;
  text-indent: 28px;
}
.otc-detail p {
  font-size: 14px;
}
.otc-footer {
  font-size: 15px;
  margin-top: 30px;
}
</style>
