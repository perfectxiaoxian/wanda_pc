<template>
  <div class="memberadd">
    <template>
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'ListMember' }">会员管理</el-breadcrumb-item>
          <el-breadcrumb-item>注册会员</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="limitaddform">
        <el-form ref="form"
                 :model="form"
                 :rules="rules"
                 label-width="80px"
                 style="width:70%;margin:50px auto;">
          <el-form-item label="手机号"
                        prop="mobile">
            <el-input v-model="form.mobile"></el-input>
          </el-form-item>

          <el-form-item label="密码"
                        prop="password">
            <el-input v-model="form.password"></el-input>
          </el-form-item>

          <el-form-item style="text-align:right;">
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
  methods: {
    // 提交表单
    addMember() {
      Http.member_add(this.form)
        .then(rst => {
          // element-ui 的Message消息提示
          this.$message({
            message: '恭喜你，创建成功',
            type: 'success'
          })
          this.$router.replace({name:'ListMember'})
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
          // 判断id如果为空则当前提交为新增
          this.addMember()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      let regMobile = /^1[3578]\d{9}$/
      if (!regMobile.test(value)) {
        return callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      form: {
        mobile: '', //手机号
        password: '' //密码
      },
      rules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        mobile: [{ validator: checkMobile, trigger: 'blur' }]
      }
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="less">
.memberadd {
  .breadcrumb {
    height: 50px;
    display: flex;
    align-items: center;
  }
}
</style>