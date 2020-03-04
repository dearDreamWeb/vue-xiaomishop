<template>
  <el-row class="order">
    <nav-brand>
      <slot>订单</slot>
    </nav-brand>
    <v-step :step="step"></v-step>
    <el-row class="main">
        
    </el-row>
  </el-row>
</template>

<script>
import NavBrand from "../components/NavBrand"; // 头部条
import Step from "../components/Step"; //步骤条
export default {
  data() {
    return {
      step: 1
    };
  },
  components: {
    NavBrand,
    vStep: Step
  }
};
</script>

<style></style>
