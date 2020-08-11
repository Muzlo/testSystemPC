<template>
  <el-dialog
      title="选择题目"
      :visible.sync="reduceGoodsVisible"
      width="1000px">
      <div class="TransferBox">
        <!--左边待选择-->
        <div class="SourceBox">
          <!--筛选-->
          <div>
            <el-input placeholder="请输入内容" v-model="searchKey"></el-input>
          </div>
          <el-table
            :border="true"
            height="400"
            ref="multipleTable"
            :data="shopOptions"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="46">
            </el-table-column>
            <el-table-column
              prop="title"
              label="商品"
              width="200">
            </el-table-column>
            <el-table-column
              prop="spec_text"
              label="规格">
            </el-table-column>
          </el-table>
        </div>
        <!--按钮-->
        <div class="buttonCentenr">
          <div class="posiBox">
            <p><el-button  @click="deleteGoodesLeft"><i class="el-icon-arrow-left"></i></el-button></p>
            <p><el-button type="primary" @click="AddGoodesRight"><i class="el-icon-arrow-right" ></i></el-button></p>
          </div>

        </div>
        <!--右边已选择-->
        <div class="TargetBox">
          <div class="titletableBox">
            <p>已选择</p>
          </div>
          <el-table
            :border="true"
            height="400"
            :data="TargetShopOptions"
            tooltip-effect="dark"
            @selection-change="deleteChange"
            style="width: 100%">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="title"
              label="商品"
              width="200">
            </el-table-column>
            <el-table-column
              prop="spec_text"
              label="规格">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reduceGoodsVisible = false">取 消</el-button>
        <el-button type="primary" @click="yesshopName">确 定</el-button>
      </span>
    </el-dialog>

</template>

<script>
export default {
  name: "agentsJkRoyaltySet",
  data() {
    return {
        searchKey:"",
        reduceGoodsVisible:true,
        multipleSelection: [],//全部商品多选选中
        TargetShopOptions:[],//已选择商品数据
        TargetMultipleSelection: [],//已选商品多选选中
        shopOptions:[
            {title:"11111",spec_text:"规格1"},
            {title:"22222",spec_text:"规格2"},
            {title:"33333",spec_text:"规格3"},
            {title:"44444",spec_text:"规格4"},
            {title:"55555",spec_text:"规格5"},
            {title:"66666",spec_text:"规格6"},
            {title:"77777",spec_text:"规格7"},
            {title:"88888",spec_text:"规格8"},
            {title:"99999",spec_text:"规格9"},
            {title:"101010",spec_text:"规格10"},
        ]
    };
  },
  methods: {
      /*穿梭到左边*/
      deleteGoodesLeft(){
        let TargetShopOptions=this.TargetShopOptions;//右边已选择表格数据
        let TargetMultipleSelection=this.TargetMultipleSelection;//已选商品多选选中change数据
        let deleteArry=[];//相同id的数据
        TargetShopOptions.forEach(function (value, index, array) {
          TargetMultipleSelection.forEach(function (item, itemindex, itemarray) {
            if(value.id==item.id){
              deleteArry.push(item.id);
            }
          })
        });
        let deletemultipleSelection=this.multipleSelection;//右边已选择change数据
        /*返回去掉已经选中的右边数据*/
        deletemultipleSelection = deletemultipleSelection.filter(function(item){
          return deleteArry.indexOf(item.id) == -1;
        });
        this.TargetShopOptions=deletemultipleSelection;//右边已选择重新赋值
        this.toggleSelection(TargetMultipleSelection)//调用取消左边选中函数事件，将数据传输过去即可，调用ele的toggleRowSelection函数
      },
       /*穿梭框到右边*/
      AddGoodesRight(){
          this.TargetShopOptions=this.multipleSelection;
      },
       /*左边全部商品数据选中监听*/
      handleSelectionChange(val) {
          console.log(val)
        this.multipleSelection = val;
      },
      /*右边商品数据选中监听*/
      deleteChange(val){
        this.TargetMultipleSelection=val;
      },
      /*弹框确定赋值到页面输入框*/
      yesshopName(){
        this.goodsName='';
        this.addgoodsListArr=this.TargetShopOptions;
        let self=this;
        this.addgoodsListArr.forEach(function (value, index, array) {
          self.goodsName+=value.title+'、';
        });
        self.reduceGoodsVisible=false;
      },
       /*取消商品已选择函数*/
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
  },
  created() {},
  computed: {}
};
</script>

<style scoped>
  .titletableBox{
    height:40px;
    background-color: rgba(24, 144, 255, 1);
    color: #ffffff;
    line-height: 40px;
    text-align: center;
  }
  .TransferBox{
    display: flex;
  }
  .SourceBox{
    width: 400px;
  }
  .buttonCentenr{
    position: relative;
    width: 150px;
  }
  .posiBox{
    position: absolute;
    top: 100px;
    left: 50px;
  }
  .posiBox p{
    margin-top: 50px;
  }
  .TargetBox{
    width: 400px;
  }
  #reduce_settings{
    height: 100%;
  }
  .markingInfobox{
    background-color: #ffffff;
    position: fixed;
    top: 90px;
    left: 180px;
    bottom: 80px;
    right: 10px;
    overflow-y: auto;
    padding: 30px 50px;
  }
  .titleP{
    position: relative;
  }
  .titleinfoP{
    height:20px;
    line-height: 20px;
    margin-right: 5px;
    color:rgba(21,168,253,1);
    font-size: 18px;
    display: inline-block;
  }
  .bluespan{
    display: inline-block;
    width:3px;
    height:20px;
    background:rgba(21,168,253,1);
    position: absolute;
  }
  .formBox p{
    margin-top: 25px;
    font-size: 16px;
    color: #333333;
  }
  .submitmarking{
    margin-top: 40px;
  }
  .redspan{
    color: red;
    display: inline-block;
    width: 20px;
    text-align: center;
  }
  .timecenter{
    font-size: 14px;
    display: inline-block;
    width: 20px;
    text-align: center;
  }

  #reduce_settings .formBox .el-input__inner{
    background-color:rgba(245,247,253,1)!important;
  }
</style>