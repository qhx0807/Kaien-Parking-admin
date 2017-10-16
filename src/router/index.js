import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'
import CarList from '@/components/CarList'
import Review from '@/components/Review'
import Account from '@/components/Account'
import Log from '@/components/Log'



Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/hello',
			name: 'Hello',
			component: HelloWorld
		},
		{
			path: '/',
			name: 'Login',
			component: Login
		},
		{
			path: '/home',
			component: Home,
			children:[
				{
					path:'',
					name:'CarList',
					component:CarList
				},
				{
					path:'review',
					name:'Review',
					component:Review
				},
				{
					path:'account',
					name:'Account',
					component:Account
				},
				{
					path:'log',
					name:'Log',
					component:Log
				},
			]
		}
	]
})
