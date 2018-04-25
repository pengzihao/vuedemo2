<template>
  <div class="container">
    <div class="choiceAreaBtn" @click="showLargeArea">
      课程城区: <input type="text" v-model="areaText" readonly="readonly" value="">
    </div>
    <div v-if="largeAreaBox" class="largeAreaPopup">
      <div class="areaPopupCont">
        <div class="choiceTip">
          请选择课程城区
        </div>
        <div class="btn-x" @click="closeBtn">x</div>
        <div class="largeAreaText" @click="selectArea" :id="item.id" v-for="item in largeAreaList">
          {{item.name}}
        </div>
      </div>
    </div>
    <PullUp-Scroll :on-refresh="onRefresh" :on-infinite="onInfinite"></PullUp-Scroll>
      <div class="goodsBox" v-for="item in goodsList.data">
        <div class="goodsImg">
          <img :src="item.courseBackgroundImg" alt="">
        </div>
        <div class="goodsText">
           <p>{{item.courseName}}</p>
           <p>{{item.typeName}}</p>
           <p>{{item.courseAllPrice}}</p>
        </div>
      </div>
  </div>

</template>

<script>

  import PullUpScroll from '../../components/pullupscroll/pullupscroll.vue'

  export default {
    components:{
       PullUpScroll
    },
    data() {
      return {
        largeAreaBox: false,
        largeAreaList: [],
        goodsList: [],
        areaText: ''
      }
    },
    methods: {
      showLargeArea() {
        this.largeAreaBox = true
      },
      largeAreaData() { //获取场馆大区
        this.$axios.get('/course/queryteachingVenue').then(res => {
           if(res.data.code == '200'){
             console.log(res.data.data);
             this.largeAreaList = res.data.data;
           }
        }).catch(err => {

        })
      },
      selectArea(e) { //点击选中场馆执行函数
        var areaId = e.target.id;
        if(areaId){
          //显示选中的城区
          this.areaText = e.target.innerText
          this.goodsListData(areaId)
          this.largeAreaBox = false
        }
      },
      goodsListData(venueId){ //获取商品信息
        this.$axios.get('/course/courseList',{
          params:{
            page: 1,
            size: 10,
            teachingVenueId: venueId
          }
        }).then(res =>{
          if(res.data.code == '200'){
            console.log(res.data.data);
            this.goodsList = res.data.data
            //存储用户选中的课程城区和id
            window.localStorage.setItem('areaText',this.areaText)
            window.localStorage.setItem('teachingVenueId',venueId)
          }
        }).catch(err =>{

        })
      },
      closeBtn() {
        //关闭为没有选中，传0返回所有
        this.areaText = '未选择课程城区'
        this.goodsListData(0)
        this.largeAreaBox = false
      }
    },
    created() { //初始化页面
      //判断用户有没有选中课程城区，有就获取显示
      var venueId = window.localStorage.getItem('teachingVenueId')
      console.log(venueId)
      if(venueId == undefined || venueId == '' || venueId == null){
        this.largeAreaBox = true
        this.goodsListData(0)
      }else{
        this.areaText = window.localStorage.getItem('areaText')
        this.goodsListData(venueId)
      }
      //获取场馆大区
      this.largeAreaData()
    }
  }
</script>

<style scoped>
 .container {
   margin: 10px;
   background-color: #f7f9fa;
   text-align: left;
 }
 .choiceAreaBtn {
   background-color: red;
   width: 100%;
   height: 35px;
   text-align: center;
   line-height: 35px;
   color: #fff;
   margin: 10px auto;
   border-radius: 5px;
 }
 .choiceAreaBtn input {
   border: none;
   background-color: red;
   color: #ffffff;
   font-size: 16px;
   width: 60%;
 }
 .largeAreaPopup {
   position: fixed;
   left: 0;
   top: 0;
   width: 100%;
   height: 100%;
   background-color: rgba(0,0,0,0.5);
 }
 .largeAreaPopup .areaPopupCont {
   width: 90%;
   height: 80%;
   margin: 15% auto;
   background-color: #fff;
   border-radius: 5px;
   overflow: auto;
   position: relative;
 }
 .areaPopupCont .btn-x {
   position: absolute;
   top: 5px;
   right: 5px;
   font-size: 40px;
   color: red;
   width: 30px;
   height: 30px;
   line-height: 30px;
   text-align: center;
 }
 .areaPopupCont .choiceTip {
   width: 50%;
   text-align: center;
   margin: 15px auto;
   height: 40px;
   line-height: 40px;
   border-radius: 5px;
   color: #000000;
   font-size: 18px;
 }
 .areaPopupCont .largeAreaText {
   width: 80%;
   height: 40px;
   margin: 10px auto;
   background-color: #ccc;
   border-radius: 5px;
   text-align: center;
   line-height: 40px;
 }
 .goodsBox {
   margin-top: 10px;
   display: flex;
   flex-flow: row nowrap;
 }
 .goodsBox .goodsImg {
   width: 100px;
   height: 100px;
   border: 1px solid #ccc;
 }
 .goodsImg img{
   width: 100%;
   height: 100%;
 }
 .goodsBox .goodsText {
   margin-left: 15px;
 }
 .goodsText p {
   margin-top: 10px;
 }
</style>
