import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Contacts from '../views/Contacts.vue'
import Projects from '../views/Projects.vue'
import {
    auth
} from '../firebase'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Projects',
        component: Dashboard,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/contacts',
        name: 'Contacts',
        component: Contacts,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/projects',
        name: 'Projects',
        component: Projects,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('../views/Settings.vue'),
        meta: {
            requiresAuth: true
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

    if (requiresAuth && !auth.currentUser) {
        next('/login')
    } else {
        next()
    }
})

export default router
