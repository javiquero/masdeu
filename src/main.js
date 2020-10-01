import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from './firebase'
import './assets/scss/app.scss'
import VueI18n from 'vue-i18n'

import messages from './i18n'

Vue.use(VueI18n)
const i18n = new VueI18n({
	locale: 'ca', // set locale
	messages, // set locale messages
  })


import { VueTags } from 'vue-tags-component';
Vue.component('vue-tags', VueTags);

Vue.config.productionTip = false

let app
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
		render: h => h(App),
		beforeCreate() {
			store.dispatch('CONTACTS_CONNECT');
			store.dispatch('REPORTS_CONNECT');
			store.dispatch('PROJECTS_CONNECT')
			
		},
		i18n,
    }).$mount('#app')
  }

  if (user) {
    store.dispatch('fetchUserProfile', user)
  }
})
