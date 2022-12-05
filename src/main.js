import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/scss/app.scss'
import { auth } from './firebase'
import { createI18n } from 'vue-i18n'
import messages from './i18n'

const i18n = createI18n({
	locale: 'ca', // set locale
	messages, // set locale messages
})

const app = createApp(App)
// console.log(app)
app.use(store)
app.use(router)
app.use(i18n)
auth.onAuthStateChanged(user => {
	if (user) store.dispatch('fetchUserProfile', user)   

	store.dispatch('CONTACTS_CONNECT');
	store.dispatch('REPORTS_CONNECT');
	store.dispatch('PROJECTS_CONNECT');

    app.mount('#app')
//     console.log("----- MOUNTED -----")
//     console.log(app)
})