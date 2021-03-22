import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:"/index"
  },
  {
    path:'/login',
    component: () => import('@/views/Login')
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
      },
      {
        path:'/upload',
        name:'upload',
        component:() => import('@/views/template/Upload')
      },
      {
        path:'/newinstance',
        name:'newinstance',
        component:()=>import('@/views/template/NewInstance')
      },
      {
        path:'/buildnetwork',
        name:'buildnetwork',
        component:()=>import('@/views/template/BuildNetwork')
      },
      {
        path:'/networks',
        name:'networks',
        component:()=>import('@/views/template/mynetwork/NetWorks')
      },
      {
        path:'/networks/:id',
        name:'containers',
        component:()=>import('@/views/template/mynetwork/Containers')
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
