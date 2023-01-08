import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import { Amplify } from "@aws-amplify/core";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

import Login from './components/Login.vue'
import Classes from './components/Classes.vue'
  
const routes = [
    { 
        path: '/', 
        name: 'login',
        component: Login 
    },
    { 
        path: '/classes',
        name: 'classes', 
        component: Classes 
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

const app = createApp(App)
app.config.globalProperties.$userData = {}
app.use(router)

app.mount('#app')
