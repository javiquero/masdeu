import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from './firebase'
import './assets/scss/app.scss'

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
    }).$mount('#app')
  }

  if (user) {
    store.dispatch('fetchUserProfile', user)
  }
})
