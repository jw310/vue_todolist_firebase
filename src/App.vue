<template>
  <div id="app">
    <!-- Loading 效果-->
    <loading :active.sync="isLoading">
      <template slot="before">Please wait</template>
      <template slot="after">loading</template>
    </loading>

    <Navbar />
    <!-- todolist -->
    <div class="wrap">
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" id="basic-addon1">待辦事項</span>
        </div>
        <!-- 輸入新事項-->
        <input
          type="text"
          class="form-control"
          placeholder="請輸入"
          v-model="newtodo"
          @keyup.enter="addTodo"
        />
        <div class="input-group-append">
          <button class="btn btn-primary" type="button" @click="addTodo">新增</button>
        </div>
      </div>
      <!-- 顯示 list -->
      <div class="card text-center">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
              <!-- 頁面切換功能-->
              <a
                class="nav-link"
                :class="{'active': visibility == 'all'}"
                @click="visibility = 'all'"
                href="#"
              >全部</a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{'active': visibility == 'active'}"
                @click="visibility = 'active'"
                href="#"
              >進行中</a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{'active': visibility == 'completed'}"
                @click="visibility = 'completed'"
                href="#"
              >已完成</a>
            </li>
          </ul>
        </div>
        <ul class="list-group list-group-flush text-left">
          <!--呈現 data 資料-->
          <li
            class="list-group-item"
            v-for="(item, key) in filterTodos"
            :key="key"
            @dblclick="editTodo(item)"
          >
            <div class="d-flex" v-if="item.id !== cacheTodo.id">
              <div class="form-check">
                <!--綁定 checkbox-->
                <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="item.completed"
                  @change="mark(item)"
                  :id="item.id"
                />
                <!--勾選後，加上樣式-->
                <label
                  class="form-check-label"
                  :class="{'completed': item.completed}"
                  :for="item.id"
                >{{item.content}}</label>
              </div>
              <span class="ml-1">建立時間：{{item.time | timestamp}}</span>
              <button
                type="button"
                class="close ml-auto"
                @click="removeTodo(item)"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <!-- 顯示被點選修改的 todo-->
            <input
              type="text"
              class="form-control"
              v-model="cacheContent"
              @keyup.esc="cancelEdit(item)"
              @keyup.enter="doneEdit(item)"
              v-if="item.id === cacheTodo.id"
            />
          </li>
        </ul>
        <div class="card-footer d-flex justify-content-between">
          <!--利用 JS.filter() 將todos帶入，return 內容為物件.completed為false的陣列，然後計算長度-->
          <span>還有 {{this.todos.filter((item) => { return !item.completed }).length}} 筆任務未完成</span>
        </div>
      </div>
      <div class="mt-2 text-left">
        <p>
          小提醒：點擊待辦事項兩次後，點選內容後即可進行修改。
          <br />小提醒：若要取消內容修改，請使用 esc 退出。
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase_db.js'
import Navbar from '@/components/Navbar'

export default {
  name: 'App',
  components: {
    Navbar
  },
  data: () => ({
    newtodo: '',
    todos: [],
    // 修改 todo 暫存
    cacheTodo: {},
    cacheContent: '',
    // todo 狀態
    visibility: 'all',
    completed: false,
    // loading 效果
    isLoading: false
  }),
  // // 資料連結
  // firestore: {
  //   todos: db.collection('todos')
  // },
  methods: {
    async addTodo() {
      this.isLoading = true
      // 取得 <iuput> 輸入的值 trim 去除空白
      let value = this.newtodo.trim()
      // 取得整數時間戳記
      let timestamp = Math.floor(Date.now())
      // console.log(value, timestamp)
      // 沒輸入事項，程式中斷
      if (!value) {
        return
      }
      const temp = {
        time: timestamp,
        content: value,
        completed: false
      }
      try {
        await db.collection('todos').add(temp)
      } catch (error) {
        console.log(error)
      }
      // 清空輸入格
      this.newtodo = ''
      this.isLoading = false
    },
    async editTodo(item) {
      let timestamp = Math.floor(Date.now())
      // 傳入被點選的事項 todo 進行修改
      // 修改後資料存到暫放區
      this.cacheTodo = item
      this.cacheContent = item.content
      const temp = {
        time: timestamp,
        content: this.cacheContent,
        completed: false
      }
      try {
        await db
          .collection('todos')
          .doc(item.id)
          .update(temp)
      } catch (error) {
        console.log(error)
      }
    },
    async mark(item) {
      let timestamp = Math.floor(Date.now())
      this.completed = item.completed
      const temp = {
        time: timestamp,
        content: this.cacheContent,
        completed: this.completed
      }
      try {
        await db
          .collection('todos')
          .doc(item.id)
          .update(temp)
      } catch (error) {
        console.log(error)
      }
      // console.log(this.completed)
      this.cacheTodo = {}
    },
    async removeTodo(todo) {
      this.isLoading = true
      // console.log(todo.id)
      try {
        await db
          .collection('todos')
          .doc(todo.id)
          .delete()
      } catch (error) {
        console.log(error)
      }
      // 用 findIndex 去找相同 id 的物件，若找到相同 id 回傳此 id
      let newindex = this.todos.findIndex(function(item) {
        return todo.id === item.id
      })
      // 刪除物件陣列裡相同 id 的事項
      this.todos.splice(newindex, 1)
      this.isLoading = false
    },
    cancelEdit() {
      // 消除修改
      this.cacheTodo = {}
    },
    // 修改內容處理
    doneEdit(item) {
      item.content = this.cacheContent
      this.cacheContent = ''
      this.editTodo(item)
      this.cacheTodo = {}
    },
    // 取得遠端資料
    fetchTodos() {
      this.todos = []
      db.collection('todos').onSnapshot(res => {
        // console.log(res.docChanges())
        const changes = res.docChanges()
        changes.forEach(element => {
          if (element.type === 'added') {
            // 取得資料欄位內容
            // console.log(element.doc.data())
            this.todos.push({
              ...element.doc.data(),
              id: element.doc.id
            })
          }
        })
      })
    }
  },
  // 任務分類切換處理
  computed: {
    filterTodos() {
      // 用 visibility 屬性值來判斷資料的狀態
      if (this.visibility == 'active') {
        return this.todos.filter(el => !el.completed)
      } else if (this.visibility == 'completed') {
        return this.todos.filter(el => el.completed)
      }
      return this.todos
    }
  },
  mounted() {
    this.fetchTodos()
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}

.wrap {
  width: 85%;
  margin: 0 auto;
  .input-group-text {
    background-color: #88dba3;
  }
  // list 外框
  .card {
    background-color: #ede574;
  }
  // list
  .list-group-item {
    color: #ce6d39;
    // 基數的 list 顏色
    &:nth-child(odd) {
      color: #383a3f;
    }
    &:hover {
      background-color: #d7fff1;
    }
  }
  // 任務完成
  .completed {
    text-decoration: line-through;
  }
}
</style>
