import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './components/Home.vue'
import lista from './components/ListaSalidas.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/salidas',
    name: 'lista',
    component: lista
  }
]

const router = new VueRouter({
  routes
})

export default router
