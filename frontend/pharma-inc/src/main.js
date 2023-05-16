import Vue from 'vue'
import Vuelidate from 'vuelidate'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import UsersPage from './UsersPage.vue'

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.use(VueToast)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

new Vue({
  el: '#app',
  render: h => h(UsersPage),
})
