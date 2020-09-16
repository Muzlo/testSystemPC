<template>
  <div>
       <div class="clearfix">
        <el-button class="fr" type="success" size="mini" @click="addQuestion">新增试卷类别</el-button>
      </div>
      <el-form ref="searchForm" :inline="true" size="mini" :model="searchForm" label-width="100px">
        <el-form-item label="试卷类别">
          <el-input v-model.trim="searchForm.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="getTableData(1)">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table border :data="tableData" style="width: 100%">
        <el-table-column label="ID" prop="id" width="100" align="center"></el-table-column>
        <el-table-column label="试卷类别" prop="testTitle" width="300" align="center"></el-table-column>
        <el-table-column label="单选题出题数" prop="testCount1" align="center"></el-table-column>
        <el-table-column label="多选题出题数" prop="testCount2" align="center"></el-table-column>
        <el-table-column label="判断题出题数" prop="testCount3" align="center"></el-table-column>


        <el-table-column align="right" width="200" fixed="right">

          <template slot-scope="scope">
            <el-tooltip content="修改试卷类别" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="updQuestion(scope.row,scope.$index)"
              ></el-button>
            </el-tooltip>

            <el-tooltip content="删除试卷" placement="top">
              <el-button
                type="primary"
                icon="el-icon-delete"
                size="mini"
                @click="delQuestion(scope.row,scope.$index)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>


      </el-table>

    <publicForm
      :otherInfo="otherInfo"
      :width="formWidth"
      :labelWidth="labelWidth"
      :formTitle="formTitle"
      :form="typeForm"
      :formRules="typeFormRules"
      :inline="false"
      :url="url"
      @resetFormEmit="resetForm"
      @resultDataEmitFn="resultDataFn"
    >
      <div slot="formContent">
        <el-form-item label="试卷分类名称" prop="title">
          <el-input v-model.trim="typeForm.title"></el-input>
        </el-form-item>
        <el-form-item label="单选题出题数" prop="testCount1">
          <el-row :gutter="24">
            <el-col :span="14" style="margin-left:-12px;padding-right:0;">
              <el-input v-model.trim.number="typeForm.testCount1"></el-input>    
            </el-col>
            <el-col :span="10" style="margin-right:-12px;margin-top:1px;">
              <el-input v-model.trim.number="typeForm.testBonus1">
                <template slot="append">分</template>
              </el-input>
            </el-col>
          </el-row>
          
        </el-form-item>
        <el-form-item label="多选题出题数" prop="testCount2">
          <el-row :gutter="24">
            <el-col :span="14" style="margin-left:-12px;padding-right:0;">
              <el-input v-model.trim.number="typeForm.testCount2"></el-input>    
            </el-col>
            <el-col :span="10" style="margin-right:-12px;margin-top:1px;">
              <el-input v-model.trim.number="typeForm.testBonus2">
                <template slot="append">分</template>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="判断题出题数" prop="testCount3">
          <el-row :gutter="24">
            <el-col :span="14" style="margin-left:-12px;padding-right:0;">
              <el-input v-model.trim.number="typeForm.testCount3"></el-input>    
            </el-col>
            <el-col :span="10" style="margin-right:-12px;margin-top:1px;">
              <el-input v-model.trim.number="typeForm.testBonus3">
                <template slot="append">分</template>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="总分合计">
          <el-input v-model.trim.number="typeForm.testCountBonus" :disabled="true">
            <template slot="append">分</template>
          </el-input>    
        </el-form-item>
        <el-form-item label="及格分数">
          <el-input v-model.trim.number="typeForm.testPassBonus">
            <template slot="append">分</template>
          </el-input>    
        </el-form-item>
        <el-form-item label="考试时间">
          <el-input v-model.trim.number="typeForm.testTime">
            <template slot="append">分钟</template>
          </el-input>    
        </el-form-item>
      </div>
    </publicForm>
    <pagination
      @handleSizeChangeEmit="handleSizeChange"
      @handleCurrentChangeEmit="handleCurrentChange"
      :total="totalElements"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
    />

  </div>
</template>

<script>
import pagination from "../../components/cardManage/pagination.vue";
import publicForm from "../../components/cardManage/publicForm.vue";
import {
addTest,delTest,findTest,updTest
} from "../../api/api.js";
import { baseURL } from "../../common/js/ipConfig";
export default {
  name: "testType",
  data() {
    return {
      searchForm: {},
      typeFormRules: {
        title: [{ required: true, message: "必选项", trigger: "blur" }],
        testCount1: [{ required: true, message: "必选项", trigger: "blur" }],
        testCount2: [{ required: true, message: "必选项", trigger: "blur" }],
        testCount3: [{ required: true, message: "必选项", trigger: "blur" }],
      },
      otherInfo: -1,
      formTitle: "新增试卷类别",
      labelWidth: "120px",
      formWidth: "440px",
      //接口地址
      url: {
        addUrl: addTest,
        updUrl: updTest,
      },
      tableData: [],
      typeForm: {
        testBonus1:0,
        testBonus2:0,
        testBonus3:0
      },
      currentPage: 1, //当前选中页
      pageSize: 30, //默认每页显示条数
      pageSizes: [30, 50, 100], //更改每页显示数据条数
      totalElements: null,
      tableIndex: 0, //获取该数据在表格的第几个位置（新增unshift、修改splice

    };
  },
  components: { pagination, publicForm },
  computed: {
    testCountBonus(){
      return (Number(this.typeForm.testBonus1)*this.typeForm.testCount1+Number(this.typeForm.testBonus2)*this.typeForm.testCount2+Number(this.typeForm.testBonus3)*this.typeForm.testCount3)
    }
  },
  mounted() {
  },
  methods: {

    clearPackSetsFn(params) {
      delete this.typeForm[params];
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getTableData(1);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData(val);
    },
    resetForm(data) {
      let formOtherInfo = {
        testBonus1:0,
        testBonus2:0,
        testBonus3:0
      };
      this.typeForm = { ...formOtherInfo, ...data };

    },
    resultDataFn(res) {
      if (res) {
        switch (this.otherInfo) {
          case "0":
            this.tableData.splice(this.tableIndex, 0, res);
            this.currentPage = 1;
            break;
          case "1":
            this.tableData.splice(this.tableIndex, 1, res);
            break;
        }
      }
    },
    getTableData(pageNum, cb) {
      this.$refs["searchForm"].validate(async (valid) => {
        if (valid) {
          this.currentPage = pageNum;
          var paramsObj = {
            pageNo: pageNum,
            pageSize: this.pageSize,
            ...this.searchForm,
          };
          try {
            let data = await this.$axios.post(
              findTest,
              this._qs.stringify(paramsObj)
            );
            if (data.status == 0) {
              this.tableData = data.data.content;
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
        } else {
          return false;
        }
      });
    },

    addQuestion() {
      this.formTitle = "新增试卷分类";
      this.otherInfo = "0";
      this.$store.commit("dialogVisiblePublic/dialogVisibleMutations", true);
    },
    updQuestion(data, index) {
      this.tableIndex = index;
      this.otherInfo = "1";
      this.formTitle = "修改试卷分类";
      this.$store.commit("dialogVisiblePublic/dialogVisibleMutations", true);
      this.typeForm = {
          id: data.id,
          testCount1:data.testCount1,
          testCount2:data.testCount2,
          testCount3:data.testCount3,
          title:data.testTitle,
          testBonus1:data.testBonus1,
          testBonus2:data.testBonus2,
          testBonus3:data.testBonus3,
          testCountBonus:data.testCountBonus,
          testPassBonus:data.testPassBonus,
          testTime:data.testTime

      };
    },
    delQuestion(data, index) {
      this.tableIndex = index;
      var paramsObj = {
        id: data.id,
      };
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let data = await this.$axios.post(
            delTest,
            this._qs.stringify(paramsObj)
          );
          if (data.status == 0) {
            this.tableData.splice(this.tableIndex, 1);
            this.$message({
              type: "success",
              message: data.msg,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  watch:{
    testCountBonus(val) {
      this.typeForm.testCountBonus = this.testCountBonus;
    }
  }
};
</script>

<style scoped>
.beizhu {
  width: 100%;
  display: flex;
}
.beizhu >>> .el-form-item__content {
  flex: 1;
  padding-right: 30px;
}
.w90 {
  width: 178px;
}
</style>