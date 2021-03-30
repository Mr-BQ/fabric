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
        redirect:'/home'
      },
      {
        path:'/home',
        name:'home',
        component:() => import('@/views/Home')
      },
      {
        path:'/newtemplate',
        name:'NewTemplate',
        component:() => import('@/views/NewTemplate')
      },
      {
        path:'/upload',
        name:'upload',
        component:() => import('@/views/Upload')
      },
      {
        path:'/newinstance',
        name:'newinstance',
        component:()=>import('@/views/NewInstance')
      },
      {
        path:'/buildnetwork',
        name:'buildnetwork',
        component:()=>import('@/views/BuildNetwork')
      },
      {
        path:'/networks',
        name:'networks',
        component:()=>import('@/views/mynetwork/NetWorks')
      },
      {
        path:'/networks/:id',
        name:'containers',
        component:()=>import('@/views/mynetwork/Containers')
      },
      {
        path:'/explorer',
        name:'explorer',
        component:()=>import('@/views/explorer/Explorer'),
        children:[
          {
            path:'dashboard',
            name:'explorer_dashboard',
            component:()=>import('@/views/explorer/childrenComponents/Dashborad')
          },
          {
            path:'network',
            name:'explorer_network',
            component:()=>import('@/views/explorer/childrenComponents/Network')
          },
          {
            path:'block',
            name:'explorer_block',
            component:()=>import('@/views/explorer/childrenComponents/Block')
          },
          {
            path:'transaction',
            name:'explorer_transaction',
            component:()=>import('@/views/explorer/childrenComponents/Transaction')
          },
          {
            path:'chaincode',
            name:'explorer_chaincode',
            component:()=>import('@/views/explorer/childrenComponents/Chaincode')
          },
          {
            path:'channel',
            name:'explorer_channel',
            component:()=>import('@/views/explorer/childrenComponents/Channel')
          }

        ]
      }

    ],
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/Index')
  },
  {
    path: '/refresh',
    name:'refresh',
    component:()=>import('@/components/common/Refresh'),
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
