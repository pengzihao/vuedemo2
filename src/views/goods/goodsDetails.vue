<template>
<div>
  <p>商品详情页</p>
  <p>商品id: {{goodsId}}</p>

</div>
</template>

<script>
    export default {
        data(){
          return {
            goodsId: ''
          }
        },
        created() {
          this.goodsId = this.$route.params.goodsId
          console.log(this.goodsId)
        }
    }
</script>

<style scoped>

</style>
