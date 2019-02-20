import Vue from 'vue'
import App from './App'
import play from './components/play.vue'
import unibar from './components/uni-nav-bar.vue'
Vue.component('play',play)
Vue.component('unibar',unibar)   
Vue.config.productionTip = false
// 公共接口
Vue.prototype.$serverUrl = 'http://tingapi.ting.baidu.com/v1/restserver/ting/?format=json&calback=&from=webapp_music&method=';
							
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
