import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login.vue'

import Home from '../views/Home.vue'
// 权限管理
import Limit from '../views/Limit.vue'
import LimitAdd from '../views/LimitAdd.vue'
// 角色管理
import Role from '../views/Role.vue'
import RoleAdd from '../views/RoleAdd.vue'
// 用户管理
import User from '../views/User.vue'
import UserAdd from '../views/UserAdd.vue'
// 影院管理
import Cinema from '../views/Cinema.vue'
import CinemaAdd from '../views/CinemaAdd.vue'
// 影片管理
import Movie from '../views/Movie.vue'
import MovieAdd from '../views/MovieAdd.vue'
// 卖品分类
import SalerType from '../views/SalerType.vue'
import SalerTypeAdd from '../views/SalerTypeAdd.vue'
// 卖品管理
import Saler from '../views/Saler.vue'
import SalerAdd from '../views/SalerAdd.vue'
// 会员管理
// 卖品管理
import RegMember from '../views/RegMember.vue'
import ListMember from '../views/ListMember.vue'
import ResetPass from '../views/ResetPass.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      // 权限管理
      // 权限列表
      {
        path: 'limit',
        name: 'Limit',
        component: Limit
      },
      // 新增权限
      {
        path: 'limitadd',
        name: 'LimitAdd',
        component: LimitAdd
      },
      // 角色列表
      {
        path: 'role',
        name: 'Role',
        component: Role
      },
      // 新增角色
      {
        path: 'roleadd',
        name: 'RoleAdd',
        component: RoleAdd
      },
      // 用户列表
      {
        path: 'user',
        name: 'User',
        component: User
      },
      // 新增用户
      {
        path: 'useradd',
        name: 'UserAdd',
        component: UserAdd
      },
      {
        path: 'cinema',
        name: 'Cinema',
        component: Cinema
      },
      {
        path: 'cinemaadd',
        name: 'CinemaAdd',
        component: CinemaAdd
      },
      {
        path: 'movie',
        name: 'Movie',
        component: Movie
      },
      {
        path: 'movieadd',
        name: 'MovieAdd',
        component: MovieAdd
      },
      {
        path: 'salertype',
        name: 'SalerType',
        component: SalerType
      },
      {
        path: 'salertypeadd',
        name: 'SalerTypeAdd',
        component: SalerTypeAdd
      },
      {
        path: 'saler',
        name: 'Saler',
        component: Saler
      },
      {
        path: 'saleradd',
        name: 'SalerAdd',
        component: SalerAdd
      },
      {
        path: 'regmember',
        name: 'RegMember',
        component: RegMember
      },
      {
        path: 'listmember',
        name: 'ListMember',
        component: ListMember
      },
      {
        path: 'resetpass',
        name: 'ResetPass',
        component: ResetPass
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 登录拦截
router.beforeEach((to, from, next) => {
  // 判断localStorage中是否有token，如果有则继续后面的页面请求，否则没有，没有的话，访问的是登录页面则继续访问，如果既没有token且访问的也不是登录页面，则拦截，跳转到登录页面
  let token = Vue.localStorage.get('token')
  if (token) {
    next()
  } else if (to.path != '/login') {
    next({ name: 'Login' })
  } else {
    next()
  }
})
export default router
