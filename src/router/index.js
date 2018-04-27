import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Index from '@/views/index/index'
import Manage from '@/views/manage/manage'
import GoodsList from '@/views/goods/goodsList'
import GoodsDetails from '@/views/goods/goodsDetails'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/GoodsList',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/GoodsDetails',
      name: 'GoodsDetails',
      component: GoodsDetails
    },
    {
      path: '/manage',
      name: 'Manage',
      component: Manage
    }
  ]
})
