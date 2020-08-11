<template>
    <el-dialog @close="closeFn" :close-on-click-modal='false' :fullscreen="fullscreen" :title="formTitle" :visible.sync="dialogVisibleFn" :width="width">
      <el-form
        size="mini"
        ref="apiUserForm"
        :rules="formRules"
        :model="form"
        :label-width="labelWidth"
        :inline="inline"
      >
        <slot name="formContent"></slot>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleHidden">取 消</el-button>
        <el-button type="primary" @click="formSubmitFn('apiUserForm');">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { baseURL } from "../../common/js/ipConfig.js";
export default {
  name:"publicForm",
  props:{
    formTitle:{},
    formRules:{},
    form:{},
    otherInfo:{},
    url:{},
    fullscreen:{},
    width:{},
    labelWidth:{},
    inline:{}
  },
  data(){
    return {

    }
  },
  computed: {

    dialogVisibleFn: {
      get: function() {
        return this.$store.state.dialogVisiblePublic.dialogVisible
      },
      set: function() {
        this.$store.commit('dialogVisiblePublic/dialogVisibleMutations',false)
      }
    }


  },
  methods:{
      closeFn(){
        this.$emit("resetFormEmit",{})
      },
      dialogVisibleHidden(){
        this.$store.commit('dialogVisiblePublic/dialogVisibleMutations',false)
      },
      //表单确定
      formSubmitFn(formName){
          this.$refs[formName].validate((valid) => {
              if (valid) {
                  this.formSubmit();
              } else {
                  return false;
              }
          });
      },
      //表单提交
      formSubmit() {
          if(this.otherInfo=="1"){ //修改
              this.publicHandle(this.url.updUrl,'post');
          }else if(this.otherInfo=="0"){ //新增
              this.publicHandle(this.url.addUrl,'post');
          }
      },
      //新增 更新 公共函数
      async publicHandle(url,method){
        console.log(this.form)
        try {
              const data = await this.$axios[method](url,
              this._qs.stringify(this.form)
              );
              if(data.status==0){
                this.$emit("resultDataEmitFn",data.data);
                this.$message.success(data.msg);
              }else{
                this.$message.error(data.msg);
              }
          } catch (err) {
              this.$message.error("服务器异常，请稍后再试！");
          }
          this.$store.commit('dialogVisiblePublic/dialogVisibleMutations',false)
      },
      
  }
}
</script>

<style>
.v-modal{
  z-index: 100 !important;
}
</style>