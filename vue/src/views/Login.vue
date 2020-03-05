<template>
  <el-row class="login-wrapper">
    <nav-brand>
      <slot><span>登录</span></slot>
    </nav-brand>
    <el-row class="login">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="60px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model.number="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </el-row>
</template>

<script>
import NavBrand from "../components/NavBrand"; // 头部条
const LOGIN_OK = 1; // 登录成功
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      }
      setTimeout(() => {
        callback();
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      let reg = /^\s*$/;
      if (reg.test(value)) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        name: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        name: [{ validator: checkName, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios({
            method: "get",
            url: "/login",
            params: {
              userName: this.ruleForm.name,
              passWord: this.ruleForm.pass
            }
          })
            .then(res => {
              if (res.data.isLogin === LOGIN_OK) {
                this.$message.success("登录成功！");
                // vuex 增加用户信息
                this.$store.commit("setUserInfo", res.data);
                // 把 商品的总数给vuex
                this.$store.commit("setCount", res.data.num);
                this.$router.push({ name: "homeLink" });
              } else {
                this.$message.error("用户名或密码错误！");
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$message.error("用户名或密码错误！");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  components: {
    NavBrand
  },
  //   监听用户是否登录，登录之后不能进入登录界面
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$store.getters.getUserInfo.isLogin === "true") {
        vm.$router.go(-1);
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.login {
  margin: 2rem auto;
  width: 30%;
  @media screen and (max-width: 900px) {
    left: 0;
    width: 90%;
  }
}
</style>
