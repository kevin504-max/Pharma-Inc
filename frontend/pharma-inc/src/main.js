import Vue from 'vue'
import App from './App.vue'
import bootstrap from 'bootstrap'

Vue.config.productionTip = false
Vue.use(bootstrap)

new Vue({
    el: '#app',
    render: h => h(App),
})