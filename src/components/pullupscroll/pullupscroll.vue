<template lang="html">
  <div class="yo-scroll"
       :class="{'down':(state===0),'up':(state==1),refresh:(state===2),touch:touching}"
       @touchstart="touchStart($event)"
       @touchmove="touchMove($event)"
       @touchend="touchEnd($event)"
       @scroll="(onInfinite || infiniteLoading) ? onScroll($event) : undefined">
    <section class="inner" :style="{ transform: 'translate3d(0, ' + top + 'px, 0)' }">
      <header class="pull-refresh">
        <slot name="pull-refresh">
          <span class="down-tip">下拉更新</span>
          <span class="up-tip">松开更新</span>
          <span class="refresh-tip">更新中</span>
        </slot>
      </header>
      <slot></slot>
      <footer class="load-more">
        <slot name="load-more">
          <span>加载中……</span>
        </slot>
      </footer>
      <div class="no-more">
          <span>没有更多了</span>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    props: {
      offset: {
        type: Number,
        default: 40
      },
      enableInfinite: {
        type: Boolean,
        default: true
      },
      enableRefresh: {
        type: Boolean,
        default: true
      },
      onRefresh: {
        type: Function,
        default: undefined,
        required: false
      },
      onInfinite: {
        type: Function,
        default: undefined,
        require: false
      }
    },
    data() {
      return {
        top: 0,
        state: 0,
        startY: 0,
        touching: false,
        infiniteLoading: false
      }
    },
    methods: {
      touchStart(e) {
        this.startY = e.targetTouches[0].pageY
        this.startScroll = this.$el.scrollTop || 0
        this.touching = true
      },
      touchMove(e) {
        if (!this.enableRefresh || this.$el.scrollTop > 0 || !this.touching) {
          return
        }
        let diff = e.targetTouches[0].pageY - this.startY - this.startScroll
        if (diff > 0) e.preventDefault()
        this.top = Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0)

        if (this.state === 2) { // in refreshing
          return
        }
        if (this.top >= this.offset) {
          this.state = 1
        } else {
          this.state = 0
        }
      },
      touchEnd(e) {
        if (!this.enableRefresh) return
        this.touching = false
        if (this.state === 2) { // in refreshing
          this.state = 2
          this.top = this.offset
          return
        }
        if (this.top >= this.offset) { // do refresh
          //下拉到一定高度执行下拉函数
          this.refresh()
        } else { // cancel refresh
          this.state = 0
          this.top = 0
        }
      },
      //下拉后事件
      refresh() {
        this.state = 2
        this.top = this.offset
        this.onRefresh(this.refreshDone)
      },
      //下拉完成后返回顶部
      refreshDone() {
        this.state = 0
        this.top = 0
      },
      //上拉完成后执行
      infinite() {
        this.infiniteLoading = true
        this.onInfinite(this.infiniteDone)
      },
      //数据请求完成后回调（防止重复加载）
      infiniteDone() {
        this.infiniteLoading = false
      },
      //上拉事件
      onScroll(e) {
        //this.enableInfinite （是否开启上拉加载事件）
        //this.infiniteLoading （阻止重复加载请求数据）
        if (!this.enableInfinite || this.infiniteLoading) {
          return
        }
        let outerHeight = this.$el.clientHeight
        let innerHeight = this.$el.querySelector('.inner').clientHeight
        let scrollTop = this.$el.scrollTop
        let ptrHeight = this.onRefresh ? this.$el.querySelector('.pull-refresh').clientHeight : 0
        let infiniteHeight = this.$el.querySelector('.load-more').clientHeight
        let bottom = innerHeight - outerHeight - scrollTop - ptrHeight
        if (bottom < infiniteHeight) this.infinite() //上拉加载更多
      }
    }
  }
</script>
<style>
  .yo-scroll {
    position: absolute;
    top: 3rem;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    /*ios滑动回弹（大坑）*/
    /*-webkit-overflow-scrolling: touch;*/
    /*ios普通滑动*/
    /*-webkit-overflow-scrolling: auto;*/
  }
  .yo-scroll .inner {
    position: absolute;
    top: -2rem;
    width: 100%;
    transition-duration: 300ms;
  }
  .yo-scroll .pull-refresh {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .yo-scroll.touch .inner {
    transition-duration: 0ms;
  }
  .yo-scroll.down .down-tip {
    display: block;
  }
  .yo-scroll.up .up-tip {
    display: block;
  }
  .yo-scroll.refresh .refresh-tip {
    display: block;
  }
  .yo-scroll .down-tip,
  .yo-scroll .refresh-tip,
  .yo-scroll .up-tip {
    display: none;
  }
  .yo-scroll .load-more {
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .yo-scroll .no-more {
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    display: none;
  }
</style>
