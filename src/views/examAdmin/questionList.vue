<template>
  <div>
    <div class="clearfix">
      <el-button class="fr" type="success" size="mini" @click="addQuestion">新增题目</el-button>
    </div>

    <el-form ref="searchForm" :inline="true" size="mini" :model="searchForm" label-width="100px" :rules="searchFormRules">
      <el-form-item label="题目类型" prop="qType">
        <el-select v-model="searchForm.qType" placeholder="请选择" filterable clearable class="w100">
          <el-option label="单选题" value="1"></el-option>
          <el-option label="多选题" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目内容">
        <el-input v-model.trim="searchForm.qContent"></el-input>
      </el-form-item>
      <el-button size="small" type="primary" @click="getTableData(1)">查询</el-button>
    </el-form>


    <el-table border :data="tableList" style="width: 100%">
      <el-table-column label="题目ID" prop="id" width="100" align="center"></el-table-column>
      <el-table-column label="题目类型" width="150" align="center">
        <template v-slot="scope">
          <span v-if="scope.row.questionType==1">单选题</span>
          <span v-if="scope.row.questionType==2">多选题</span>
        </template>
      </el-table-column>
      <el-table-column label="题目内容" prop="questionContent" width="400" align="center"></el-table-column>
      <el-table-column label="正确答案" prop="answerTrue" width="100" align="center"></el-table-column>
      <el-table-column label="问题分值" prop="questionBonus" width="100" align="center"></el-table-column>

      <el-table-column align="right" width="200" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="keySearch" size="mini" placeholder="输入题目内容搜索" />
        </template>
        <template slot-scope="scope">
          <el-tooltip content="修改题目" placement="top">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="updQuestion(scope.row,scope.$index)"
            ></el-button>
          </el-tooltip>

          <el-tooltip content="删除题目" placement="top">
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
        <el-form-item label="题型" prop="qType">
          <el-select
            class="w100"
            v-model="typeForm.qType"
            placeholder="请选择题型"
            filterable
            clearable
            @clear="clearPackSetsFn('qType')"
          >
            <el-option label="单选题" :value=1></el-option>
            <el-option label="多选题" :value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分值" prop="qBonus">
          <el-input :disabled="otherInfo=='1'" v-model.trim.number="typeForm.qBonus" placeholder="题目的分值"></el-input>
        </el-form-item>
        <el-form-item label="题目" prop="qContent">
          <el-input placeholder="题目内容" type="textarea" rows="3" v-model.trim="typeForm.qContent"></el-input>
        </el-form-item>

        <el-form-item label="选项A" prop="answerA">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-input v-model.trim="typeForm.answerA"></el-input>
              <el-input v-model.trim="typeForm.aFile" v-if="false"></el-input>
            </el-col>
            <el-col :span="6">
              <el-upload
                ref="upload"
                action="#"
                accept="image/*"
                :file-list="fileList"
                :show-file-list="false"
                :http-request="httpRequest1"
              >
                <el-button type="success" size="mini">上传图片</el-button>
              </el-upload>
            </el-col>
          </el-row>
          
          <el-avatar class="mt-15 ml-15" v-show="aFileName" shape="square" :size="50" :src="aFileName"></el-avatar>
        </el-form-item>
        <!-- <el-form-item label="选项B" prop="answerB">
          <el-input v-model.trim="typeForm.answerB"></el-input>
          <el-input v-model.trim="typeForm.bFile" v-if="false"></el-input>
          <el-avatar v-show="bFileName" shape="square" :size="50" :src="bFileName"></el-avatar>
          <el-upload
            ref="upload"
            action="#"
            accept="image/*"
            :file-list="fileList"
            :show-file-list="false"
            :http-request="httpRequest2"
          >
            <el-button type="success" size="mini">上传图片</el-button>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="选项B" prop="answerB">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-input v-model.trim="typeForm.answerB"></el-input>
              <el-input v-model.trim="typeForm.bFile" v-if="false"></el-input>
            </el-col>
            <el-col :span="6">
              <el-upload
                ref="upload"
                action="#"
                accept="image/*"
                :file-list="fileList"
                :show-file-list="false"
                :http-request="httpRequest2"
              >
                <el-button type="success" size="mini">上传图片</el-button>
              </el-upload>
            </el-col>
          </el-row>
          
          <el-avatar class="mt-15 ml-15" v-show="bFileName" shape="square" :size="50" :src="bFileName"></el-avatar>
        </el-form-item>


        <el-form-item label="选项C">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-input v-model.trim="typeForm.answerC"></el-input>
              <el-input v-model.trim="typeForm.cFile" v-if="false"></el-input>
            </el-col>
            <el-col :span="6">
              <el-upload
                ref="upload"
                action="#"
                accept="image/*"
                :file-list="fileList"
                :show-file-list="false"
                :http-request="httpRequest3"
              >
                <el-button type="success" size="mini">上传图片</el-button>
              </el-upload>
            </el-col>
          </el-row>
          
          <el-avatar class="mt-15 ml-15" v-show="cFileName" shape="square" :size="50" :src="cFileName"></el-avatar>
        </el-form-item>
        <!-- <el-form-item label="选项C">
          <el-input v-model.trim="typeForm.answerC"></el-input>
          <el-input v-model.trim="typeForm.cFile" v-if="false"></el-input>
          <el-avatar v-show="cFileName" shape="square" :size="50" :src="cFileName"></el-avatar>
          <el-upload
            ref="upload"
            action="#"
            accept="image/*"
            :file-list="fileList"
            :show-file-list="false"
            :http-request="httpRequest3"
          >
            <el-button type="success" size="mini">上传图片</el-button>
          </el-upload>
        </el-form-item> -->
        <!-- <el-form-item label="选项D">
          <el-input v-model.trim="typeForm.answerD"></el-input>
          <el-input v-model.trim="typeForm.dFile" v-if="false"></el-input>
          <el-avatar v-show="dFileName" shape="square" :size="50" :src="dFileName"></el-avatar>
          <el-upload
            ref="upload"
            action="#"
            accept="image/*"
            :file-list="fileList"
            :show-file-list="false"
            :http-request="httpRequest4"
          >
            <el-button type="success" size="mini">上传图片</el-button>
          </el-upload>
        </el-form-item> -->

        <el-form-item label="选项D">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-input v-model.trim="typeForm.answerD"></el-input>
              <el-input v-model.trim="typeForm.dFile" v-if="false"></el-input>
            </el-col>
            <el-col :span="6">
              <el-upload
                ref="upload"
                action="#"
                accept="image/*"
                :file-list="fileList"
                :show-file-list="false"
                :http-request="httpRequest4"
              >
                <el-button type="success" size="mini">上传图片</el-button>
              </el-upload>
            </el-col>
          </el-row>
          
          <el-avatar class="mt-15 ml-15" v-show="dFileName" shape="square" :size="50" :src="dFileName"></el-avatar>
        </el-form-item>

        <!-- <el-form-item label="选项E">
          <el-input v-model.trim="typeForm.answerE"></el-input>
          <el-input v-model.trim="typeForm.eFile" v-if="false"></el-input>
          <el-avatar v-show="eFileName" shape="square" :size="50" :src="eFileName"></el-avatar>
          <el-upload
            ref="upload"
            action="#"
            accept="image/*"
            :file-list="fileList"
            :show-file-list="false"
            :http-request="httpRequest5"
          >
            <el-button type="success" size="mini">上传图片</el-button>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="选项E">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-input v-model.trim="typeForm.answerE"></el-input>
              <el-input v-model.trim="typeForm.eFile" v-if="false"></el-input>
            </el-col>
            <el-col :span="6">
              <el-upload
                ref="upload"
                action="#"
                accept="image/*"
                :file-list="fileList"
                :show-file-list="false"
                :http-request="httpRequest5"
              >
                <el-button type="success" size="mini">上传图片</el-button>
              </el-upload>
            </el-col>
          </el-row>
          
          <el-avatar class="mt-15 ml-15" v-show="eFileName" shape="square" :size="50" :src="eFileName"></el-avatar>
        </el-form-item>

        <!-- <el-form-item label="选项F">
          <el-input v-model.trim="typeForm.answerF"></el-input>
          <el-input v-model.trim="typeForm.fFile" v-if="false"></el-input>
          <el-avatar v-show="fFileName" shape="square" :size="50" :src="fFileName"></el-avatar>
          <el-upload
            ref="upload"
            action="#"
            accept="image/*"
            :file-list="fileList"
            :show-file-list="false"
            :http-request="httpRequest6"
          >
            <el-button type="success" size="mini">上传图片</el-button>
          </el-upload>
        </el-form-item> -->

        <el-form-item label="选项F">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-input v-model.trim="typeForm.answerF"></el-input>
              <el-input v-model.trim="typeForm.fFile" v-if="false"></el-input>
            </el-col>
            <el-col :span="6">
              <el-upload
                ref="upload"
                action="#"
                accept="image/*"
                :file-list="fileList"
                :show-file-list="false"
                :http-request="httpRequest6"
              >
                <el-button type="success" size="mini">上传图片</el-button>
              </el-upload>
            </el-col>
          </el-row>
          
          <el-avatar class="mt-15 ml-15" v-show="fFileName" shape="square" :size="50" :src="fFileName"></el-avatar>
        </el-form-item>

        <el-form-item label="正确答案" prop="answerTrue">
          <el-input v-model.trim="typeForm.answerTrue"></el-input>
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
  findQuestionPack,uploadImages,
  addQPack,
  delQPack,
  updQPack,
} from "../../api/api.js";
import { baseURL } from "../../common/js/ipConfig";
export default {
  name: "questionList",
  data() {
    return {
      searchForm: {},
      searchFormRules: {
        qType: [{ required: true, message: "必选项", trigger: "blur" }],
      },
      otherInfo: -1,
      formTitle: "新增题目",
      labelWidth: "100px",
      formWidth: "440px",
      //接口地址
      url: {
        addUrl: addQPack,
        updUrl: updQPack,
      },
      tableData: [],
      keySearch: "",
      typeForm: {
      },
      typeFormRules: {
        qType: [{ required: true, message: "此项必填", trigger: "blur" }],
        qBonus: [{ required: true, message: "此项必填", trigger: "blur" }],
        qContent: [{ required: true, message: "此项必填", trigger: "blur" }],
        answerTrue: [{ required: true, message: "此项必填", trigger: "blur" }],
        answerA: [{ required: true, message: "此项必填", trigger: "blur" }],
        answerB: [{ required: true, message: "此项必填", trigger: "blur" }],
      },

      currentPage: 1, //当前选中页
      pageSize: 30, //默认每页显示条数
      pageSizes: [30, 50, 100], //更改每页显示数据条数
      totalElements: null,
      tableIndex: 0, //获取该数据在表格的第几个位置（新增unshift、修改splice
      fileList:[],
      aFileName:'',
      bFileName:'',
      cFileName:'',
      dFileName:'',
      eFileName:'',
      fFileName:'',
    };
  },
  components: { pagination, publicForm },
  computed: {
    tableList() {
      return this.tableData.filter((item) => {
        if (item.questionContent.includes(this.keySearch)) {
          return item;
        }
        this.currentPage = 1;
      });
    },
  },
  mounted() {
  },
  methods: {
    httpRequest1(param) {
      let fileObj = param.file; // 相当于input里取得的files
      let fd = new window.FormData(); // FormData 对象
      fd.append("files", fileObj); // 文件对象
      var options = {
        url: uploadImages,
        data: fd,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      this.$axios(options).then((res) => {
        this.typeForm.aFile=res.data;
        if(this.otherInfo=='1'){
          this.aFileName=baseURL.ip1+'/upload/'+res.data;
        }
      }).catch((err) => {
        this.$message.error("上传失败！");
      });
    },
    httpRequest2(param) {
      let fileObj = param.file; // 相当于input里取得的files
      let fd = new window.FormData(); // FormData 对象
      fd.append("files", fileObj); // 文件对象
      var options = {
        url: uploadImages,
        data: fd,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      this.$axios(options).then((res) => {
        this.typeForm.bFile=res.data;
        if(this.otherInfo=='1'){
          this.bFileName=baseURL.ip1+'/upload/'+res.data;
        }
      }).catch((err) => {
        this.$message.error("上传失败！");
      });
    },
    httpRequest3(param) {
      let fileObj = param.file; // 相当于input里取得的files
      let fd = new window.FormData(); // FormData 对象
      fd.append("files", fileObj); // 文件对象
      var options = {
        url: uploadImages,
        data: fd,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      this.$axios(options).then((res) => {
        this.typeForm.cFile=res.data;
        if(this.otherInfo=='1'){
          this.cFileName=baseURL.ip1+'/upload/'+res.data;
        }
      }).catch((err) => {
        this.$message.error("上传失败！");
      });
    },
    httpRequest4(param) {
      let fileObj = param.file; // 相当于input里取得的files
      let fd = new window.FormData(); // FormData 对象
      fd.append("files", fileObj); // 文件对象
      var options = {
        url: uploadImages,
        data: fd,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      this.$axios(options).then((res) => {
        this.typeForm.dFile=res.data;
        if(this.otherInfo=='1'){
          this.dFileName=baseURL.ip1+'/upload/'+res.data;
        }
      }).catch((err) => {
        this.$message.error("上传失败！");
      });
    },
    httpRequest5(param) {
      let fileObj = param.file; // 相当于input里取得的files
      let fd = new window.FormData(); // FormData 对象
      fd.append("files", fileObj); // 文件对象
      var options = {
        url: uploadImages,
        data: fd,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      this.$axios(options).then((res) => {
        this.typeForm.eFile=res.data;
        if(this.otherInfo=='1'){
          this.eFileName=baseURL.ip1+'/upload/'+res.data;
        }
      }).catch((err) => {
        this.$message.error("上传失败！");
      });
    },
    httpRequest6(param) {
      let fileObj = param.file; // 相当于input里取得的files
      let fd = new window.FormData(); // FormData 对象
      fd.append("files", fileObj); // 文件对象
      var options = {
        url: uploadImages,
        data: fd,
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      this.$axios(options).then((res) => {
        this.typeForm.fFile=res.data;
        if(this.otherInfo=='1'){
          this.fFileName=baseURL.ip1+'/upload/'+res.data;
        }
      }).catch((err) => {
        this.$message.error("上传失败！");
      });
    },
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
      let formOtherInfo = {};
      this.typeForm = { ...formOtherInfo, ...data };
      this.aFileName=null;
      this.bFileName=null;
      this.cFileName=null;
      this.dFileName=null;
      this.eFileName=null;
      this.fFileName=null;
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
              findQuestionPack,
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
      this.formTitle = "新增题目";
      this.otherInfo = "0";
      this.$store.commit("dialogVisiblePublic/dialogVisibleMutations", true);
    },
    updQuestion(data, index) {
 
      if(data.aFileName){
        this.aFileName=baseURL.ip1+'/upload/'+data.aFileName;
      }
      if(data.bFileName){
        this.bFileName=baseURL.ip1+'/upload/'+data.bFileName;
      }
      if(data.cFileName){
        this.cFileName=baseURL.ip1+'/upload/'+data.cFileName;
      }
      if(data.dFileName){
        this.dFileName=baseURL.ip1+'/upload/'+data.dFileName;
      }
      if(data.eFileName){
        this.eFileName=baseURL.ip1+'/upload/'+data.eFileName;
      }
      if(data.fFileName){
        this.fFileName=baseURL.ip1+'/upload/'+data.fFileName;
      }

      let str = data.simClassCode;
      this.tableIndex = index;
      this.otherInfo = "1";
      this.formTitle = "修改题目";
      this.$store.commit("dialogVisiblePublic/dialogVisibleMutations", true);
      this.typeForm = {
          id: data.id,
          answerA:data.answerA,
          answerB:data.answerB,
          answerC:data.answerC,
          answerD:data.answerD,
          answerE:data.answerE,
          answerF:data.answerF,
          answerTrue:data.answerTrue,
          qBonus:data.questionBonus,
          qContent:data.questionContent,
          qType:data.questionType,
          aFile:data.aFileName,
          bFile:data.bFileName,
          cFile:data.cFileName,
          dFile:data.dFileName,
          eFile:data.eFileName,
          fFile:data.fFileName,
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
            delQPack,
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