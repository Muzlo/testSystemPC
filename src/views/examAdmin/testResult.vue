<template>
  <div>
    <el-form :rules="rules" ref="ruleForm" :inline="true" size="mini" :model="searchForm" label-width="100px">
      <el-form-item label="试卷" prop="testId">
        <el-select filterable clearable v-model="searchForm.testId" placeholder="请选择试卷">
          <el-option
            v-for="item in getTestArr"
            :key="item.id"
            :label="item.testTitle"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户" prop="userId">
        <el-select filterable clearable v-model="searchForm.userId" placeholder="请选择用户">
          <el-option
            v-for="item in getUserArr"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>

      </el-form-item>
      <el-button size="mini" type="primary" @click="getTestResult('ruleForm')">查询</el-button>
    </el-form>

    <el-divider content-position="center"><h2>答卷内容</h2></el-divider>

    <ul v-if="testContent.length" class="testContent">
      <li class="mb-15" v-for="(item,index) of testContent" :key="index">
        <p class="mb-15 p p1">题目：{{item.questionId}} <span class="ml-15">此题{{item.questionBonus}}分</span> </p>
        <p class="mb-15 p p2">正确答案：{{item.answerTrue}}</p>
        <p class="mb-15 p p3">你的答案：{{item.userAnswer}}</p>
        <p class="mb-15 p p4">此题得分：{{item.userBonus}}</p>
      </li>
    </ul>

  </div>
</template>

<script>
import { findtestResult, findTest, findQUser } from "../../api/api.js";
export default {
  name: "testResult",
  data() {
    return {
      searchForm: {},
      rules:{
        userId: [
          { required: true, message: '必选项', trigger: 'blur' },
        ],
        testId: [
          { required: true, message: '必选项', trigger: 'blur' },
        ],
      },
      getTestArr: [],
      getUserArr: [],
      totalElements2: null,
      totalElements: null,
      testContent:[],
    };
  },
  components: {},
  computed: {},
  mounted() {
    this.getAllTest2();
    this.getAllUser2();
  },
  methods: {
    async getAllTest(cb) {
      var paramsObj = {
        pageNo: 1,
        pageSize: 30,
      };
      try {
        let data = await this.$axios.post(
          findTest,
          this._qs.stringify(paramsObj)
        );
        if (data.status == 0) {
          this.totalElements2 = data.data.totalElements;
          if (cb) {
            cb();
          }
        } else {
          this.$message.error(data.msg);
        }
      } catch (err) {
        this.$message.error("网络异常，请稍后再试");
      }
    },
    getAllTest2() {
      var _this = this;
      let getTotalElements = async function () {
        var obj = {};
        var currentPage = { pageNo: 1 };
        var pageSize = { pageSize: _this.totalElements2 };
        obj = { ...currentPage, ...pageSize };

        try {
          const data = await _this.$axios.post(
            findTest,
            _this._qs.stringify(obj)
          );
          _this.getTestArr = data.data.content;
        } catch (err) {
          _this.$message.error("服务器异常，请稍后再试22！");
        }
      };
      _this.getAllTest(getTotalElements);
    },
    async getAllUser(cb) {
      var paramsObj = {
        pageNo: 1,
        pageSize: 30,
      };
      try {
        let data = await this.$axios.post(
          findQUser,
          this._qs.stringify(paramsObj)
        );
        if (data.status == 0) {
          this.totalElements = data.data.totalElements;
          if (cb) {
            cb();
          }
        } else {
          this.$message.error(data.msg);
        }
      } catch (err) {
        this.$message.error("网络异常，请稍后再试");
      }
    },
    getAllUser2() {
      var _this = this;
      let getTotalElements = async function () {
        var obj = {};
        var currentPage = { pageNo: 1 };
        var pageSize = { pageSize: _this.totalElements};
        obj = { ...currentPage, ...pageSize };
        try {
          const data = await _this.$axios.post(
            findQUser,
            _this._qs.stringify(obj)
          );
          _this.getUserArr = data.data.content;
        } catch (err) {
          _this.$message.error("服务器异常，请稍后再试22！");
        }
      };
      _this.getAllUser(getTotalElements);
    },
    getTestResult(formName){

      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let paramsObj=this.searchForm;
          let data = await this.$axios.post(
            findtestResult,
            this._qs.stringify(paramsObj)
          ); 
          if (data.status == 0) {
            this.testContent=data.data
          }else{
            this.$message.error(data.msg);
          }
          
        } else {
          return false;
        }
      });


    }
  },
};
</script>

<style scoped>
.testContent,.testContent li{
  padding:15px;
}
.testContent li{
  border:1px solid #eee;
}
.testContent li .p1{
  font-size:20px;
  font-weight: 700;
  color: #000;
}
.testContent li .p1 span{
  font-size: 16px;
}
.testContent li .p2,.testContent li .p3,.testContent li .p4{
  font-size:18px;
}
.testContent li .p2{
  color: #333;
}
.testContent li .p3,.testContent li .p4{
  color:red;
}
</style>