<template>
  <div>
    <div class="clearfix">
      <el-button class="fr" type="success" size="mini" @click="addTestFn">新增试卷</el-button>
    </div>

    <el-form :inline="true" size="mini" :model="searchForm" label-width="100px">

      <el-form-item label="试卷名称">
        <el-input v-model.trim="searchForm.title"></el-input>
      </el-form-item>
      <el-button size="mini" type="primary" @click="getTableData(1)">查询</el-button>
    </el-form>

    <el-table border :data="tableList" style="width: 100%">

      <el-table-column label="ID" width="100" prop="id" align="center"></el-table-column>
      <el-table-column label="试卷名称" prop="testTitle" align="center"></el-table-column>

      <el-table-column align="right" width="200" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="keySearch" size="mini" placeholder="输入试卷名称搜索" />
        </template>
        <template slot-scope="scope">

          <el-tooltip content="试卷详情" placement="top">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="testDetailFn(scope.row)"
            ></el-button>
          </el-tooltip>


          <el-tooltip content="删除试卷" placement="top">
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="mini"
              @click="delTestFn(scope.row,scope.$index)"
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
      :fullscreen="true"
      @resetFormEmit="resetForm"
      @resultDataEmitFn="resultDataFn"
    >
      <div slot="formContent">
        
        <el-form-item label="试卷标题" prop="title">
          <el-input v-model.trim="typeForm.title"></el-input>
        </el-form-item>


        <el-form-item label="试卷制作">


        <el-select v-model="qType" placeholder="请选择题目类型" @change="getQFn" filterable clearable class="w100 mb-15">
          <el-option label="单选题" value="1"></el-option>
          <el-option label="多选题" value="2"></el-option>
        </el-select>


        <el-transfer :button-texts="['到左边', '到右边']" filterable v-model="yesData" :props="{key: 'id',label: 'questionContent'}" :titles="['题海', '选中的题目']" @change="handleChange" :data="noData"
    ></el-transfer>
        

        </el-form-item> 
        <el-form-item label="题目ID">
          <el-input disabled placeholder="题目ID(多题用英文逗号分隔)" type="textarea" rows="6" v-model.trim="typeForm.qId"></el-input>
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



    <el-dialog
      :title="testTitle"
      :visible.sync="dialogVisible"
      :fullscreen="true">
      
      <ul class="testContent">
        <li v-for="(item,index) of testContent" :key="index">
          <h3>第{{index+1}}题：{{item.tQuestionPack.questionContent}} <span class="ml-15">({{item.tQuestionPack.questionBonus}}分)</span></h3>
          <p v-if="item.tQuestionPack.answerA">A:{{item.tQuestionPack.answerA}}</p>
          <p v-if="item.tQuestionPack.answerB">B:{{item.tQuestionPack.answerB}}</p>
          <p v-if="item.tQuestionPack.answerC">C:{{item.tQuestionPack.answerC}}</p>
          <p v-if="item.tQuestionPack.answerD">D:{{item.tQuestionPack.answerD}}</p>
          <p v-if="item.tQuestionPack.answerE">E:{{item.tQuestionPack.answerE}}</p>
          <p v-if="item.tQuestionPack.answerF">F:{{item.tQuestionPack.answerF}}</p>
          <h4>答案：{{item.tQuestionPack.answerTrue}}</h4>

        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import pagination from "../../components/cardManage/pagination.vue";
import publicForm from "../../components/cardManage/publicForm.vue";
import {
  addTest,delTest,findTest,findQuestionPack
} from "../../api/api.js";
import { baseURL } from "../../common/js/ipConfig";
export default {
  name: "testPaperList",
  data() {
    return {
      searchForm: {},
      otherInfo: -1,
      formTitle: "新增试卷",
      labelWidth: "100px",
      formWidth: "440px",
      //接口地址
      url: {
        addUrl: addTest,
        // updUrl: ,
      },
      tableData: [],
      keySearch: "",
      typeForm: {},
      typeFormRules: {
        title: [{ required: true, message: "此项必填", trigger: "blur" }],
        qId: [{ required: true, message: "此项必填", trigger: "blur" }]
      },
      currentPage: 1, //当前选中页
      pageSize: 30, //默认每页显示条数
      pageSizes: [30, 50, 100], //更改每页显示数据条数
      totalElements: null,
      tableIndex: 0, //获取该数据在表格的第几个位置（新增unshift、修改splice
      dialogVisible: false,
      testTitle:'',
      testContent:[],
      noData: [],
      yesData: [],
      qType:null
    };
  },
  components: { pagination, publicForm },
  computed: {
    tableList() {
      return this.tableData.filter((item) => {
        if (item.testTitle.includes(this.keySearch)) {
          return item;
        }
        this.currentPage = 1;
      });
    },
  },
  mounted() {},
  methods: {
    async getQFn(v){
      try {
        let paramsObj={
          pageNo:1,
          pageSize:10000,
          qType:v
        }
        let data = await this.$axios.post(
          findQuestionPack,
          this._qs.stringify(paramsObj)
        );
        if (data.status == 0) {
           this.noData = data.data.content;
        } else {
          this.$message.error(data.msg);
        }
      } catch (err) {
        this.$message.error("网络异常，请稍后再试");
      }
    },
    handleChange(value, direction, movedKeys) {
      this.typeForm.qId=value.join(',')
    },
    testDetailFn(data){
      this.dialogVisible = true;
      this.testContent=data.listTestDetail;
      this.testTitle=data.testTitle
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
      let formOtherInfo = {};
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
      this.getTableData(1);
    },
    async getTableData(pageNum, cb) {
        
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
    },

    addTestFn() {
      this.formTitle = "新增试卷";
      this.otherInfo = "0";
      this.$store.commit("dialogVisiblePublic/dialogVisibleMutations", true);
    },
    delTestFn(data, index) {
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
};
</script>

<style scoped>

.testContent li{
  border:1px solid #ddd;
  margin-bottom: 10px;
  padding:0 15px;
}
.testContent li p{
  padding: 4px;
}
/deep/.el-transfer-panel{width: 35%;}
</style>