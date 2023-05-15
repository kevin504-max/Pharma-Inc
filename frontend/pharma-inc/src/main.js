import { createApp } from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Vuelidate from 'vuelidate'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import vuetify from './plugins/vuetify';
import UsersPage from './UsersPage.vue'

const app = createApp(UsersPage)
app.config.productionTip = false
app.use(BootstrapVue)
app.use(BootstrapVueIcons)
app.use(Vuelidate)
app.use(VueToast)
app.use(vuetify)

app.mount('#app')
