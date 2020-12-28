import Vue from 'vue'
import App from './App.vue'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Page from './views/Page.vue'
import Vuerouter from './route/index,js'
import './style.less'
Vue.use(Vuerouter)
Vue.config.productionTip = false
const routes = [
  {
    path: '/',
    name: 'Home',
    components: Home
  },
  {
    path: '/about',
    name: 'about',
    components: About
  },
  {
    path: '/page',
    name: 'page',
    components: Page
  }
];
const router = new Vuerouter({routes});

new Vue({
  // 注册
  router,
  render: h => h(App),
}).$mount('#app')
