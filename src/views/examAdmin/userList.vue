<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="用户导入" name="first">
        <div class="clearfix">
          <el-form :inline="true" size="mini" label-width="100px">
            <el-form-item label="试卷类别">
              <el-select filterable v-model="testId" placeholder="请选择试卷类别">
                <el-option
                  v-for="item in getTestArr"
                  :key="item.id"
                  :label="item.testTitle"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-upload
                ref="upload"
                action="#"
                accept=".xls, .xlsx"
                :file-list="fileList"
                :show-file-list="false"
                :beforeUpload="beforeAvatarUpload"
                :http-request="httpRequest"
              >
                <el-button type="success" size="mini">导入用户</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <el-tab-pane label="用户查询" name="second">
        <el-form :inline="true" size="mini" :model="searchForm" label-width="100px">
          <!-- <el-form-item label="登陆ID">
            <el-input v-model.trim="searchForm.loginId"></el-input>
          </el-form-item> -->
          <el-form-item label="试卷类别">

            <el-select filterable clearable v-model="searchForm.testId" placeholder="请选择试卷">
              <el-option
                v-for="item in getTestArr"
                :key="item.id"
                :label="item.testTitle"
                :value="item.id">
              </el-option>
            </el-select>
            
          </el-form-item>
          <el-form-item label="用户姓名">
            <el-input v-model.trim="searchForm.userName"></el-input>
          </el-form-item>

          <el-form-item label="提交日期">
            <el-date-picker
              v-model="searchForm.updDate"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>

          <el-button size="mini" type="primary" @click="getTableData(1)">查询</el-button>
          <el-button size="mini" type="primary" @click="importUserFn">导出用户</el-button>
        </el-form>
        <el-divider content-position="center"><h2 class="mb-15">查询结果</h2></el-divider>
    <el-table border :data="tableData" style="width: 100%">
      <el-table-column label="ID" width="50" prop="id" align="center"></el-table-column>
      <!-- <el-table-column label="登录ID" width="50" prop="loginId" align="center"></el-table-column> -->
      <el-table-column label="用户类型" align="center">
        <template v-slot="scoped">
            <span v-if="scoped.row.userType=='00'">管理员</span>
            <span v-if="scoped.row.userType=='01'">答题者</span>
        </template>
      </el-table-column>
      <el-table-column label="用户姓名" prop="userName" align="center"></el-table-column>
      <el-table-column label="试卷" prop="tTest.testTitle" align="center"></el-table-column>
      <el-table-column label="用户分数" prop="userBonus" align="center"></el-table-column>
      <el-table-column label="更新时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.updDate | formatTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="right" width="200" fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="查看答卷" placement="top">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="testDetailFn(scope.row)"
            ></el-button>
          </el-tooltip>

          <el-tooltip content="删除用户" placement="top">
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(scope.row,scope.$index)"
            ></el-button>
          </el-tooltip>

        </template>
      </el-table-column>





    </el-table>

    <pagination
      @handleSizeChangeEmit="handleSizeChange"
      @handleCurrentChangeEmit="handleCurrentChange"
      :total="totalElements"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
    />


      </el-tab-pane>
    </el-tabs>


    <el-dialog
      :title="testTitle"
      :visible.sync="dialogVisible"
      :fullscreen="true">

      <ul v-if="testContent.length" class="testContent">
        <div class="subTitle">{{subTitle}}</div>
        <li class="mb-15" v-for="(item,index) of testContent" :key="index">
          <p class="mb-15 p p1">{{item.qPack.tQuestionType.questionTypeName}}：{{item.qPack.questionContent}} <span class="ml-15">此题{{item.questionBonus}}分</span> </p>
          <p class="mb-15 p p5"> 
            <span class="mr-15" v-if="!item.qPack.answerA==''"><b>A：{{item.qPack.answerA}}</b> <img v-if="item.qPack.aFileName" :src=baseURL+item.qPack.aFileName /> </span>
            <span class="mr-15" v-if="!item.qPack.answerB==''"><b>B：{{item.qPack.answerB}}</b> <img v-if="item.qPack.bFileName" :src=baseURL+item.qPack.bFileName /> </span>
            <span class="mr-15" v-if="!item.qPack.answerC==''"><b>C：{{item.qPack.answerC}}</b> <img v-if="item.qPack.cFileName" :src=baseURL+item.qPack.cFileName /></span>
            <span class="mr-15" v-if="!item.qPack.answerD==''"><b>D：{{item.qPack.answerD}}</b> <img v-if="item.qPack.dFileName" :src=baseURL+item.qPack.dFileName /></span>
            <span class="mr-15" v-if="!item.qPack.answerE==''"><b>E：{{item.qPack.answerE}}</b> <img v-if="item.qPack.eFileName" :src=baseURL+item.qPack.eFileName /></span>
            <span class="mr-15" v-if="!item.qPack.answerF==''"><b>F：{{item.qPack.answerF}}</b> <img v-if="item.qPack.fFileName" :src=baseURL+item.qPack.fFileName /></span>
          </p>
          <p class="mb-15 p p2">正确答案：{{item.answerTrue}}</p>
          <p class="mb-15 p p3">你的答案：{{item.userAnswer}}</p>
          <p class="mb-15 p p4">此题得分：{{item.userBonus}}</p>
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
import { delUser,findQUser, importUser, findTest ,findtestResult,exportUser} from "../../api/api.js";
import { baseURL } from "../../common/js/ipConfig";
export default {
  name: "userList",
  data() {
    return {
      baseURL:baseURL.ip1+"/upload/",
      activeName: "second",
      searchForm: {},
      tableData: [],
      keySearch: "",
      currentPage: 1, //当前选中页
      pageSize: 30, //默认每页显示条数
      pageSizes: [30, 50, 100], //更改每页显示数据条数
      totalElements: null,
      totalElements2:null,
      fileList: [],
      getTestArr: [],
      testId: null,
      testContent:[],
      dialogVisible:false,
      testTitle:"",
      testTitleSup:'',
      subTitle:''
    };
  },
  components: { pagination, publicForm },
  computed: {},
  mounted() {
    this.getAllTest2();
  },
  filters:{
    formatTime(value) {
      if (!value) return ''
      return value.substring(0,10)
    }
  },
  methods: {
    async importUserFn(){
      var paramsObj = {
        ...this.searchForm,
        loginId:JSON.parse(localStorage.getItem('userLoginInfo')).loginId
      };

      try {
        let data = await this.$axios.post(
          exportUser,
          this._qs.stringify(paramsObj)
        );
        if (data.status == 0) {
          window.location.href=baseURL.ip1+'/download/'+data.data;
    
        } else {
          this.$message.error(data.msg);
        }
      } catch (err) {
        this.$message.error("网络异常，请稍后再试");
      }




    },
    async testDetailFn(res){
      if(res.userBonus>=res.tTest.testPassBonus){
        this.testTitleSup='  试卷总分'+res.tTest.testCountBonus+'  及格得分'+res.tTest.testPassBonus+'  用户得分'+res.userBonus+' 成绩合格';
      }else{
        this.testTitleSup='  试卷总分'+res.tTest.testCountBonus+'  及格得分'+res.tTest.testPassBonus+'  用户得分'+res.userBonus+' 成绩不合格';
      }
      

      this.dialogVisible = true;
      this.testTitle='这是'+res.userName+'的考卷'+this.testTitleSup;
      let paramsObj={
        testId:res.testId,
        userId:res.id
      }
      let data = await this.$axios.post(
        findtestResult,
        this._qs.stringify(paramsObj)
      ); 
      if (data.status == 0) {
        this.testContent=data.data;
        this.subTitle=`此答卷共${data.data.length}题`
      }else{
        this.$message.error(data.msg);
      }

    },
    async getAllTest(cb){
      var paramsObj = {
        pageNo: 1,
        pageSize: this.pageSize
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
    getAllTest2(){
      var _this=this;
      let getTotalElements= async function(){
        var obj={};
        var currentPage={pageNo:1};
        var pageSize={pageSize:_this.totalElements2};
        obj={...currentPage,...pageSize};

        try {
          const data = await _this.$axios.post(
            findTest,
            _this._qs.stringify(obj)
          );
          _this.getTestArr=data.data.content;
        } catch (err) {
          _this.$message.error("服务器异常，请稍后再试22！");
        }
      }
      _this.getAllTest(getTotalElements);

    },
    beforeAvatarUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      if (!extension && !extension2) {
        this.$message({
          message: "上传文件只能是 xls、xlsx格式!",
          type: "warning",
        });
      }
      return extension || extension2;
    },
    httpRequest(param) {
      if( this.testId ){
        let fileObj = param.file; // 相当于input里取得的files
        let fd = new window.FormData(); // FormData 对象
        fd.append("files", fileObj); // 文件对象
        fd.append("testId", this.testId); // 文件对象
        var options = {
          url: importUser,
          data: fd,
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        this.$axios(options)
          .then((res) => {
            this.$message.success(res.msg);
          })
          .catch((err) => {
            this.$message.error("上传失败！");
          });
      }else{
        this.$message.warning('请选择试卷');
      }
      
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
    },
    delUser(data, index) {
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
            delUser,
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
    async getTableData(pageNum, cb) {
      this.currentPage = pageNum;
      var paramsObj = {
        pageNo: pageNum,
        pageSize: this.pageSize,
        ...this.searchForm,
      };
      try {
        let data = await this.$axios.post(
          findQUser,
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
.testContent li .p img{
  margin-left: 15px;
  max-width:200px;
  max-height:200px;
  border-radius: 4px;
}
.subTitle{font-size: 18px;margin-bottom:15px;color: #333;margin-top: -20px;}
</style>