<template>
  <div class="movieadd">
    <template>
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'Movie' }">卖品管理</el-breadcrumb-item>
          <el-breadcrumb-item>新增卖品</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="movieaddform">
        <el-form ref="form"
                 :model="form"
                 label-width="80px"
                 :rules="rules"
                 style="width:70%;margin:50px auto;">
          <el-form-item label="影院名称">

            <el-cascader :options="citys"
                         @active-item-change="selectCity"
                         v-model="form.cinema"
                         :props="props"
                         style="width:100%;"></el-cascader>
          </el-form-item>
          <el-form-item label="卖品类别">
            <el-select v-model="
                        form.salertype"
                       filterable
                       placeholder="请选择"
                       style="
                       width:100%">
              <!-- 循环渲染权限列表 -->
              <template v-for="item in selectData">
                <!-- 如果是顶级节点则禁用 -->
                <el-option :label="item.salertype"
                           :value="item._id"
                           :key="item.id"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="卖品"
                        prop="salertitle">
            <el-input v-model="form.salertitle"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.salerdes"></el-input>
          </el-form-item>
          <el-form-item label="单价"
                        prop="salerrpice">
            <el-input v-model.number="form.salerrpice"></el-input>
          </el-form-item>
          <!-- 文件上传 -->
          <el-form-item style="text-align:left;">
            <el-upload action="/api/admin/movie/fileupload"
                       list-type="picture-card"
                       accept=".jpg,.png,.gif"
                       :limit="1"
                       :on-preview="handlePictureCardPreview"
                       :on-remove="handleRemove"
                       :on-success="handleSuccess">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible"
                       size="tiny">
              <img width="100%"
                   :src="dialogImageUrl"
                   alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item style="text-align:left;">
            <el-button type="primary"
                       @click="onSubmit">立即创建</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </div>
</template>
<script>
import Http from '@/ajax/http.js'
export default {
  data() {
    var checkPrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('单价不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value < 0) {
            callback(new Error('单价必须大于0元'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    return {
      id: '',
      dialogImageUrl: '',
      dialogVisible: false,
      form: {
        cinema: '',
        salertype: '',
        salertitle: '',
        salerdes: '',
        salerimg: '',
        salerrpice: 0
      },
      citys: [],
      props: {
        value: 'id',
        children: 'cinemas'
      },
      //   列出所有的类别
      selectData: [],

      rules: {
        salertitle: [
          { required: true, message: '请输入卖品名称', trigger: 'blur' }
        ],
        salerrpice: [{ validator: checkPrice, trigger: 'blur' }]
      }
    }
  },
  created() {
    // 初始化城市列表
    this.getCityList()
    //   初始化类别列表下拉框
    this.getSalerTypeList()
  },
  mounted() {},
  methods: {
    getCityList() {
      Http.city_info()
        .then(rst => {
          // 把获取到的城市列表按照级联选择的方式组织数据
          let citys = rst.result
          this.citys = citys.map(city => {
            let { city_name: label, _id: id } = city
            return { label, id, cinemas: [] }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选择城市后加载当前城市对应的电影院
    selectCity(val) {
      // 判断次级数据是否已经加载过，如果已经加载过则return返回
      let cinemaData = []
      this.citys.forEach(city => {
        if (city.id == val[0]) {
          cinemaData = city.cinemas
        }
      })
      if (cinemaData.length > 0) return
      // 根据当前城市id请求城市对应的电影院，并把电影院信息加入到级联选择器的cinemas数组中
      Http.cinema_byid(val)
        .then(rst => {
          //   let { _id, cinema_name } = rst.result
          let currCity = this.citys.filter(city => {
            return city.id == val[0]
          })
          rst.result.forEach(cinema => {
            let { cinema_name: label, _id: id } = cinema
            currCity[0]['cinemas'].push({ label, id })
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSuccess(response) {
      this.form.salerimg = response.data.url
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //   获取城市列表
    getSalerTypeList() {
      Http.salerType_add_alllist()
        .then(rst => {
          this.selectData = rst.result
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 提交表单
    addSaler() {
      if (this.form.cinema == '') {
        this.$message.error('请选择影院')
        return
      }
      this.form.cinema = this.form.cinema[1]
      console.log(this.form)
      if (this.form.salertype == '') {
        this.$message.error('请选择类别')
        return
      }
      Http.saler_add(this.form)
        .then(rst => {
          // element-ui 的Message消息提示
          this.$message({
            message: '恭喜你，创建成功',
            type: 'success'
          })
          this.$router.go(-1)
          console.log(rst)
        })
        .catch(err => {
          this.$message.error('错了哦，这是一条错误消息')
          console.log(err)
        })
    },
    // 验证表单
    onSubmit() {
      this.$refs['form'].validate(valid => {
        //   表单验证成功则提交数据
        if (valid) {
          this.addSaler()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="less">
.movieadd {
  .breadcrumb {
    height: 50px;
    display: flex;
    align-items: center;
  }
}
</style>