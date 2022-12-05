import  firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

// firebase init
const firebaseConfig = {
	apiKey: import.meta.env.VITE_APP_APIKEY,
    authDomain: import.meta.env.VITE_APP_AUTHDOMAIN,
    databaseURL: import.meta.env.VITE_APP_DATABASEURL,
    projectId: import.meta.env.VITE_APP_PROJECTID,
    storageBucket: import.meta.env.VITE_APP_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_APP_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_APP_APPID,
    measurementId: import.meta.env.VITE_APP_MEASUREMENTID
}
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const usersCollection = db.collection('users')
const contactsCollection = db.collection('contacts')
const projectsCollection = db.collection('projects')
const reportsCollection = db.collection('reports')

// export utils/refs
export {
    db,
    auth,
	usersCollection,
	contactsCollection,
	projectsCollection,
	reportsCollection
}
