import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

import UIcomponents from '@/components/UI'

const app = createApp(App)

// UI Components
UIcomponents.forEach(component => {
    app.component(component.name, component)
})

app
    .use(store)
    .mount('#app')
