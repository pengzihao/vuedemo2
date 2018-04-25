<template>
  <div class="manage tc">
    <div class="logoImg">
      <img src="../../assets/logo.png">
    </div>
    <button class="addBtn" @click="add">新增</button>
    <div class="input-area" v-show="showAdd">
      <input type="text" placeholder="请输入人员姓名" v-model="nameValue">
      <button class="confirmBtn" @click="addName">确定</button>
    </div>
    <table>
      <tr>
        <td>姓名</td>
        <td>操作</td>
      </tr>
      <tr v-for="(item,index) in peoples">
        <td>{{item.name}}</td>
        <td :id="index">
          <span @click="edit">编辑</span>
          <span @click="del">删除</span>
        </td>
      </tr>
    </table>
    <div class="editBox" v-show="showEdit">
      <div class="content">
        <input type="text" placeholder="请输入新人员姓名" v-model="newName">
        <button @click="editName">确实</button>
        <button @click="cancel">取消</button>
      </div>
    </div>
    <footer-nav :class="{'isManage':isNowPage}"></footer-nav>
  </div>
</template>

<script>
  import FooterNav from '../../components/footer.vue'

  export default {
    components: {
      FooterNav
    },
    data(){
      return {
        isNowPage: true,
        showAdd: false,
        showEdit: false,
        peoples: [{'name': 'Jack'}, {'name': 'Joe'}],
        nameValue: '',
        newName: '',
        editNameId: 0
      }
    },
    methods: {
      getData() {
        this.$axios.get('/banner',).then(res => {
          if(res.status == '200'){
            console.log(res.data.data)
          }
        }).catch(function () {

        });
      },
      add() {
        this.showAdd = true
      },
      addName() {
        var v = this.nameValue;
        if (v.trim() == '') {
          alert('请输入新增人员姓名')
        } else {
          var data = {};
          data.name = v;
          this.peoples.push(data)
        }
      },
      del(e) {
        var id = e.target.offsetParent.id;
        this.peoples.splice(id, 1)
      },
      edit(e) {
        this.showEdit = true;
        var id = e.target.offsetParent.id;
        this.editNameId = id
        this.newName = this.peoples[id].name
      },
      editName() {
        var v = this.newName
        if(v.trim() == ''){
          alert("请输入姓名")
        }else{
          this.peoples[this.editNameId].name = this.newName;
          this.showEdit = false;
        }
      },
      cancel() {
        this.showEdit = false;
      }
    },
    created() {
      this.getData();
    }
  }
</script>

<style scoped>
  .addBtn {
    width: 100px;
    height: 40px;
    text-align: center;
    margin: 15px auto;
    line-height: 40px;
    border: 0;
    background-color: #42b983;
    color: #ffffff;
  }
  .input-area input {
    height: 30px;
    padding-left: 8px;
  }
  .input-area button {
    height: 32px;
    margin-left: 20px;
    background-color: #42b983;
    border: none;
    width: 50px;
    color: #fff;
  }
  table {
    width: 100%;
  }
  table tr {
    margin-top: 15px;
    width: 100%;
    display: flex;
    align-items: center;
  }
  table tr td{
    flex: 1;
  }
  tr td span:first-child {
    display: inline-block;
    width: 60px;
    height: 30px;
    line-height: 30px;
    background-color: blue;
    color: #fff;
    border-radius: 5px;
  }
  tr td span:last-child {
    display: inline-block;
    width: 60px;
    height: 30px;
    line-height: 30px;
    background-color: red;
    color: #fff;
    margin-left: 10px;
    border-radius: 5px;
  }
  .editBox {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
    z-index: 1000;
  }
  .content {
    width: 80%;
    height: 30%;
    margin: 55% auto;
    background-color: #ffffff;
    overflow: hidden;
  }
  .content input {
    display: block;
    width: 80%;
    height: 30px;
    margin: 50px auto 10px;
    padding-left: 8px;
  }
  .content button {
    display: inline-block;
    margin: 10px 20px;
    width: 60px;
    height: 30px;
    border: none;
    color: #fff;
    border-radius: 5px;
  }
  .content button {
    background-color: blue;
  }
  .content button:last-child {
    background-color: green;
  }
</style>
