import Vue from 'vue'
import App from './App.vue'
// 樣式
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// 時間轉換
import timestampFilter from './assets/filter/timestamp';
// Loading 效果
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
// firebase
import { firestorePlugin } from 'vuefire'

Vue.use(BootstrapVue)

Vue.filter('timestamp', timestampFilter);

// 全域方式載入元件
Vue.component('Loading', Loading)

Vue.use(firestorePlugin)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
