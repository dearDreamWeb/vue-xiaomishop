<template>
  <el-row class="cart">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="productImageUrl" label="商品图片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.productImageUrl" class="images" />
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" align="center"> </el-table-column>
      <el-table-column prop="price" label="商品价格" align="center">
        <template slot-scope="scope"> ￥{{ scope.row.price }} </template>
      </el-table-column>
      <el-table-column prop="count" label="商品数量" align="center" width="140">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.count"
            :min="1"
            :max="99"
            size="small"
            @change="changeCount(scope.row.count, scope.row)"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品总价" align="center">
        <template slot-scope="scope">
          ￥{{ scope.row.price * scope.row.count }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <el-button @click="toggleSelection()" type="primary" plain
        >取消选择</el-button
      >
      <el-row class="result">
        <span class="text">合计:￥{{ result }}</span>
        <el-button type="success">结算</el-button>
      </el-row>
    </div>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      multipleSelection: []
    };
  },

  methods: {
    //   取消已选中的商品
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 被选中的行的数据信息被添加到数组中，最后赋值给multipleSelection
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除商品
    handleDelete(index, row) {
      console.log(index, row);
      this.tableData.splice(index, 1);
      this.$axios({
        method: "delete",
        url: "/deleteCartList",
        params: {
          cartId: row.cartId
        }
      })
        .then(res => {
          if (res.data.status === 1) {
            this.$message.success("删除成功");
          } else {
            this.$message.error("删除失败！");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 更改商品数量
    changeCount(val, row) {
      this.$axios({
        method: "put",
        url: "/changeCount",
        params: {
          count: val,
          cartId: row.cartId
        }
      })
        .then(res => {
          // 把新增的购物车商品数量更新
          this.$store.commit("setCount", res.data.num);
        })
        .catch(err => {
          console.log(err);
        });
    },
    initCart() {
      this.$axios({
        method: "get",
        url: "/getCart"
      })
        .then(res => {
          if (res.data.status == 1) {
            this.tableData = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    //   选中的结算的商品价格
    result() {
      let totalPrice = 0;
      this.multipleSelection.forEach(item => {
        totalPrice += item.price * item.count;
      });
      return totalPrice;
    }
  },
  created() {
    this.$nextTick(() => {
      this.initCart();
    });
  }
};
</script>

<style lang="scss" scoped>
.cart {
  .images {
    width: 120px;
    @media screen and (max-width: 931px) {
      width: 60px;
    }
  }
  .footer {
    position: relative;
    margin-top: 20px;
    padding: 10px;
    background: #fff;
    .result {
      position: absolute;
      display: inline-block;
      right: 160px;
      @media screen and (max-width: 931px) {
        right: 10px;
      }
      .text {
        padding-right: 10px;
        font-size: 1.2rem;
        line-height: 1.2rem;
      }
    }
  }
}
</style>
