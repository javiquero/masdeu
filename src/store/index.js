// import * as Vue from 'vue'
// import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'
import { createStore } from 'vuex'


// Vue.use(Vuex)

// const store = new Vuex.Store({
const store = createStore({
    state: {
        userProfile: {},
        projects: [],
        contacts: [],
        reports: []
    },
    mutations: {
        setUserProfile(state, val) {
            state.userProfile = val
        },
        setPerformingRequest(state, val) {
            state.performingRequest = val
        },
        setPosts(state, val) {
            state.posts = val
        },
        setProjects(state, val) {
            state.projects = val
        },
        setContacts(state, val) {
            state.contacts = val
        },
        setReports(state, val) {
            state.reports = val
        }
    },
    actions: {
        CONTACTS_CONNECT: ({ commit }) => {
            if (fb.auth.currentUser) {
                fb.contactsCollection.where('userId', '==', fb.auth.currentUser.uid).onSnapshot(snapshot => {
                    let contactsArray = []
                    snapshot.forEach(doc => {
                        let contact = doc.data()
                        contact.id = doc.id
                        contactsArray.push(contact)
                    })
                    commit('setContacts', contactsArray)
                })
            }
        },
        PROJECTS_CONNECT: ({ commit }) => {
            if (fb.auth.currentUser) {
                fb.projectsCollection.where('userId', '==', fb.auth.currentUser.uid).onSnapshot(snapshot => {
                    let projectsArray = []
                    snapshot.forEach(doc => {
                        let project = doc.data()
                        project.id = doc.id
                        projectsArray.push(project)
                    })
                    commit('setProjects', projectsArray)
                })
            }
        },
        REPORTS_CONNECT: ({ commit }) => {
            if (fb.auth.currentUser) {
                fb.reportsCollection.where('userId', '==', fb.auth.currentUser.uid).onSnapshot(snapshot => {
                    let reportsArray = []
                    snapshot.forEach(doc => {
                        let report = doc.data()
                        report.id = doc.id
                        reportsArray.push(report)
                    })
                    commit('setReports', reportsArray)
                })
            }
        },

        async login({ dispatch }, form) {
            // sign user in
            const {
                user
            } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)
           
            dispatch('fetchUserProfile', user)
            dispatch('CONTACTS_CONNECT');
            dispatch('REPORTS_CONNECT');
            dispatch('PROJECTS_CONNECT')
        },
        async signup({ dispatch }, form) {
            // sign user up
            const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)

            // create user object in userCollections
            await fb.usersCollection.doc(user.uid).set({
                name: form.name,
                lang: 'en'
            })

            dispatch('fetchUserProfile', user)
        },
        async fetchUserProfile({ commit }, user) {
            const userProfile = await fb.usersCollection.doc(user.uid).get()
            // set user profile in state
            commit('setUserProfile', userProfile.data())

            // change route to dashboard
            if (router.currentRoute._value.path === '/login') {
                router.push('/')
            }
        },
        async logout({ commit }) {
            await fb.auth.signOut()

            commit('setUserProfile', {})
            commit('setContacts', [])
            commit('setProjects', [])
            commit('setReports', [])

            // redirect to login view
            router.push('/login')
        },
        async createContact({ state }, data) {
            // create contact in firebase
            await fb.contactsCollection.add({
                createdOn: new Date(),
                lastUpdateOn: new Date(),
                name: data.name,
                userId: fb.auth.currentUser.uid,
                userName: state.userProfile.name,
                address: data.address,
                comment: data.comment,
                phone1: data.phone1,
                phone2: data.phone2,
                email: data.email,
                type: data.type
            })
        },
        async saveContact({ state }, data) {		
            await fb.contactsCollection.doc(data.id).update({
                lastUpdateOn: new Date(),
                name: data.name,
                address: data.address,
                comment: data.comment,
                phone1: data.phone1,
                phone2: data.phone2,
                email: data.email,
                type: data.type
            })
            
        },
        async deleteContact({ state }, data) {		
            await fb.contactsCollection.doc(data.id).delete()            
        },
        async createProject({ state }, data) {
            await fb.projectsCollection.add({
                createdOn: new Date(),
                lastUpdateOn: new Date(),
                name: data.name,
                userId: fb.auth.currentUser.uid,
                userName: state.userProfile.name,
                address: data.address,
                clients: data.clients,
                experts: data.experts,
                providers: data.providers,
                status: data.status,
                comment: data.comment
            })
        },
        async saveProject({ state }, data) {
            await fb.projectsCollection.doc(data.id).update({
                lastUpdateOn: new Date(),
                name: data.name,
                address: data.address,
                clients: data.clients,
                experts: data.experts,
                providers: data.providers,
                status: data.status,
                comment: data.comment
            })
        },
        async deleteProject({ state }, data) {		
            await fb.projectsCollection.doc(data.id).delete()  
            
            const reportsDocs = await fb.reportsCollection.where('idProject', '==', data.id).get()
            reportsDocs.forEach(doc => {
                fb.reportsCollection.doc(doc.id).delete();
            })
            
        },
        async createReport({ state }, data) {
            await fb.reportsCollection.add({
                createdOn: new Date(),
                lastUpdateOn: new Date(),
                idProject: data.idProject,
                userId: fb.auth.currentUser.uid,
                userName: state.userProfile.name,
                comment: data.comment
            })
        },
        async saveReport({ state }, data) {		
            await fb.reportsCollection.doc(data.id).update({
                lastUpdateOn: new Date(),
                comment: data.comment
            })
        },
        async deleteReport({ state }, data) {		
            await fb.reportsCollection.doc(data.id).delete()            
        },
      
        async updateProfile({ dispatch }, user) {
            const userId = fb.auth.currentUser.uid
            // update user object
            const userRef = await fb.usersCollection.doc(userId).update({
                name: user.name,
                lang: user.lang
            })

            dispatch('fetchUserProfile', {
                uid: userId
            })

            const contactsDocs = await fb.contactsCollection.where('userId', '==', userId).get()
            contactsDocs.forEach(doc => {
                fb.contactsCollection.doc(doc.id).update({
                    userName: user.name
                })
            })

            const projectsDocs = await fb.projectsCollection.where('userId', '==', userId).get()
            projectsDocs.forEach(doc => {
                fb.projectsCollection.doc(doc.id).update({
                    userName: user.name
                })
            })
            
            const reportsDocs = await fb.reportsCollection.where('userId', '==', userId).get()
            reportsDocs.forEach(doc => {
                fb.reportsCollection.doc(doc.id).update({
                    userName: user.name
                })
            })

        }
    },
    getters: {
        getContactById: (state) => (id) => {
           return state.contacts.find(todo => todo.id === id)
        },
        contactInProject: (state) => async (id) => {
            let r = [];
            await Promise.all(state.projects.map(async p => { 
                await Promise.all(
                    p.clients.map(c => { if (c == id) if (!r.includes(p)) r.push(p) }),
                    p.experts.map(c => { if (c == id) if (!r.includes(p)) r.push(p) }),
                    p.providers.map(c => { if (c == id) if (!r.includes(p)) r.push(p) })
                )
            }))
            return r;
         },
    }
})

export default store
