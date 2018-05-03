<template>
   <div>
     <div class="logoImg">
       <img src="../../assets/logo.png">
     </div>
     <div class="titleText">
       欢迎来到人员管理系统
     </div>

     <router-link to="/goodsList">
       <div class="goodsListText">商品列表</div>
     </router-link>

     <footer-nav v-bind:class="{'isIndex':isNowPage}"></footer-nav>
   </div>
</template>

<script>
  import FooterNav from '../../components/footer.vue'

  export default {
    components: {
      FooterNav
    },
    data() {
      return {isNowPage: true}
    },
    methods: {
      getTextData() {

      }
    },
    created() {
      this.getTextData()
    }
  }
</script>

<style scoped>
 .goodsListText {
   margin: 150px auto;
   background-color: green;
   width: 200px;
   height: 40px;
   line-height: 40px;
   color: #fff;
   border-radius: 5px;
 }

</style>
