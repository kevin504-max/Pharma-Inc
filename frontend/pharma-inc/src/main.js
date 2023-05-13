import { createApp } from 'vue'
import UsersPage from './UsersPage.vue'
import bootstrap from './bootstrap'

const app = createApp(UsersPage)
app.config.productionTip = false
app.use(bootstrap)

app.mount('#app')