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
    <PullUp-Scroll :on-refresh="onRefresh" :on-infinite="onInfinite">
      <div class="goodsBox" v-for="item in downdata.data">
        <div class="goodsImg">
          <img :src="item.courseBackgroundImg" alt="">
        </div>
        <div class="goodsText">
          <p>{{item.courseName}}</p>
          <p>{{item.typeName}}</p>
          <p>{{item.courseAllPrice}}</p>
        </div>
      </div>
    </PullUp-Scroll>

  </div>

</template>

<script>

  import PullUpScroll from '../../components/pullupscroll/pullupscroll.vue'

  export default {
    components: {
      PullUpScroll
    },

    data() {
      return {
        largeAreaBox: false, //大区弹框显示
        largeAreaList: [],
        areaText: '', //场馆地址
        venueId: '', //场馆ID
        counter: 2, //默认已经显示出15条数据 count等于一是让从16条开始加载
        num: 10,  // 一次显示多少条
        pageStart: 0, // 开始页数
        pageEnd: 0, // 结束页数
        listdata: [], // 下拉更新数据存放数组
        downdata: [],  // 上拉更多的数据存放数组
        infiniteLoading: true
      }
    },

    methods: {
      //控制选择大区弹框显示
      showLargeArea() {
        this.largeAreaBox = true
      },
      //获取场馆大区
      largeAreaData() {
        this.$axios.get('/course/queryteachingVenue').then( (res) => {
          if (res.data.code == '200') {
            this.largeAreaList = res.data.data;
          }
        }).catch((err) => {
          console.log('error');
        })
      },
      //点击选中场馆加载相应的数据
      selectArea(e) {
        var areaId = e.target.id;
        if (areaId) {
          //显示选中的城区
          this.areaText = e.target.innerText
          this.venueId = areaId
          this.goodsListData()
          this.largeAreaBox = false
        }
        this.infiniteLoading = true
      },
      //进入默认获取第一页信息
      goodsListData() { //获取商品信息
        this.$axios.get('/course/courseList', {
          params: {
            page: 1,
            size: 10,
            teachingVenueId: this.venueId
          }
        }).then( (res) => {
          if (res.data.code == '200') {
            var obj = res.data.data
            this.downdata = obj
            //存储用户选中的课程城区和id
            window.localStorage.setItem('areaText', this.areaText)
            window.localStorage.setItem('teachingVenueId', this.venueId)
          }

          if(obj.pages-this.counter <= 0){
            this.$el.querySelector('.load-more').style.display = 'none';
          }
        }).catch((err) => {
          console.log('error');
        })
      },
      //选择大区弹框关闭
      closeBtn() {
        //关闭为没有选中，传0返回所有
        this.areaText = '未选择课程城区'
        this.venueId = 0
        this.goodsListData()
        this.largeAreaBox = false
      },
      //下拉刷新
      onRefresh(done) {
        console.log(done)
        this.counter = 1
        this.$axios.get('/course/courseList',{
          params: {
            page: this.counter,
            size: this.num,
            teachingVenueId: this.venueId
          }
        }).then((res) => {
          if(res.data.code == '200'){
            var obj = res.data.data
            this.downdata.data = obj.data
          }

        }).catch( (err) => {
          console.log('error');
        });

        console.log(this.downdata.data)
        done() // call done
      },
      //上拉加载更多
      onInfinite(done) {
        console.log(done)
        this.$axios.get('/course/courseList',{
          params: {
            page: this.counter,
            size: this.num,
            teachingVenueId: this.venueId
          }
        }).then((res) => {
          if(res.data.code == '200'){
            var dataList = this.downdata.data
            var obj = res.data.data
            this.downdata.data = dataList.concat(obj.data)
            done() // call done
             if(obj.pages-this.counter <= 0){
               this.$el.querySelector('.load-more').style.display = 'none';
             }
          }
          this.counter++;
          console.log(this.downdata.data)

        }).catch( (err) => {
          console.log('error');
        });
      }
    },
    //初始化页面
    created() {
      //判断用户有没有选中课程城区，有就获取显示
      var venueId = window.localStorage.getItem('teachingVenueId')
      if (venueId == undefined || venueId == '' || venueId == null) {
        this.largeAreaBox = true
        this.venueId = 0
        this.goodsListData()
      } else {
        this.areaText = window.localStorage.getItem('areaText')
        this.venueId = venueId
        this.goodsListData()
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
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
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
    display: flex;
    flex-flow: row nowrap;
    width: 90%;
    margin: 10px auto;
  }

  .goodsBox .goodsImg {
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
  }

  .goodsImg img {
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
