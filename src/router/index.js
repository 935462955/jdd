import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/User/Users.vue'
import Rights from '../components/Power/Rights.vue'
import Roles from '../components/Power/Roles.vue'



Vue.use(VueRouter)

const routes = [
	{
		path:'/login',component: Login
	},
	{
		path:'/',redirect:'/login'
	},
	{
		path:'/home',component:Home,redirect:'/welcome',children:[
			{
				path:'/welcome',component:Welcome
			},
			{
				path:'/users',component:Users
			},
			{
				path:'/rights',component:Rights
			},
			{
				path:'/roles',component:Roles
			}
		]
	}
]

const router = new VueRouter({
  routes
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
	if(to.path === '/login' )  
	return next()
	const token = window.sessionStorage.getItem('token')
	if(!token) return next('/login')
	next()
})

export default router
