import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../views/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../views/Login.vue')
// import Home from '../views/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../views/Home.vue')
// import Welcome from '../views/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../views/Welcome.vue')

// import Users from '../views/user/Users.vue'
const Users = () => import(/* webpackChunkName: "users" */ '../views/user/Users.vue')

// import Source from '../views/source/Source.vue'
const Source = () => import(/* webpackChunkName: "source" */ '../views/source/Source.vue')

// import CateList from '../views/medicine/CateList.vue'
const CateList = () => import(/* webpackChunkName: "catelist" */ '../views/medicine/CateList.vue')

// import MedicineAdd from '../views/medicine/MedicineAdd.vue'
const MedicineAdd = () => import(/* webpackChunkName: "medicineadd_medicinelist" */ '../views/medicine/MedicineAdd.vue')
// import MedicineList from '../views/medicine/MedicineList.vue'
const MedicineList = () => import(/* webpackChunkName: "medicineadd_medicinelist" */ '../views/medicine/MedicineList.vue')

// import ImportAdd from '../views/record/ImportAdd.vue'
const ImportAdd = () => import(/* webpackChunkName: "importadd" */ '../views/record/ImportAdd.vue')

// import ExportAdd from '../views/record/ExportAdd.vue'
const ExportAdd = () => import(/* webpackChunkName: "exportadd" */ '../views/record/ExportAdd.vue')
// import ExportList from '../views/record/ExportList.vue'
const ExportList = () => import(/* webpackChunkName: "exportadd" */ '../views/record/ExportList.vue')

// import Storage from '../views/storage/Storage.vue'
const Storage = () => import(/* webpackChunkName: "storage" */ '../views/storage/Storage.vue')
// import OverDue from '../views/storage/OverDue.vue'
const OverDue = () => import(/* webpackChunkName: "storage" */ '../views/storage/OverDue.vue')
// import OverFloor from '../views/storage/OverFloor.vue'
const OverFloor = () => import(/* webpackChunkName: "storage" */ '../views/storage/OverFloor.vue')

// import EditPWD from '../views/EditPWD.vue'
const EditPWD = () => import(/* webpackChunkName: "editpwd" */ '../views/EditPWD.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/catelist', component: CateList },
      { path: '/source', component: Source },
      { path: '/medicineadd', component: MedicineAdd },
      { path: '/medicinelist', component: MedicineList },
      { path: '/importadd', component: ImportAdd },
      { path: '/exportadd', component: ExportAdd },
      { path: '/storage', component: Storage },
      { path: '/overdue', component: OverDue },
      { path: '/overfloor', component: OverFloor },
      { path: '/exportlist', component: ExportList },
      { path: '/editpwd', component: EditPWD }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
