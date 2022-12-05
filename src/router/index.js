import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Contacts from '../views/Contacts.vue'
import Projects from '../views/Projects.vue'
import {
    auth
} from '../firebase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/',
        name: 'Main',
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
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
    if (auth.currentUser && to.path == '/login') return next('/')
    if (requiresAuth && !auth.currentUser) {
        next('/login')
    } else {
        next()
    }
})

export default router
