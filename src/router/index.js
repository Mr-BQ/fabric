import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:"/index"
  },
  {
    path: '/index',
    name: 'Index',
    children:[
      {
        path:'/' ,
        redirect:"/newtemplate"
      },
      {
        path:'/newtemplate',
        name:'NewTemplate',
        component:() => import('@/views/template/NewTemplate')
      }
    ],
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/Index')
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
