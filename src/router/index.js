import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const commonRoutes = [
    {
        path: '/login',
        name: 'login',
        meta: { title: '登录' },
        component: () => import('../components/Login.vue'),
    },
    {
        path: '/404',
        name: '404',
        meta: { title: '404' },
        component: () => import('../components/404.vue'),
    },
    { path: '/', redirect: '/questionList' },
    
]

// 本地所有的页面 需要配合后台返回的数据生成页面
export const asyncRoutes = {
    questionList: {
        path: 'questionList',
        name: 'questionList',
        meta: { title: '题库列表' },
        component: () => import('../views/examAdmin/questionList.vue'),
    },
    testPaperList: {
        path: 'testPaperList',
        name: 'testPaperList',
        meta: { title: '试卷列表' },
        component: () => import('../views/examAdmin/testPaperList.vue'),
    },
    userList: {
        path: 'userList',
        name: 'userList',
        meta: { title: '用户列表' },
        component: () => import('../views/examAdmin/userList.vue'),
    },
    testResult: {
        path: 'testResult',
        name: 'testResult',
        meta: { title:'查询答卷'},
        component: () => import('../views/examAdmin/testResult.vue'),
    },
    msg: {
        path: 'msg',
        name: 'msg',
        meta: { title:'测试'},
        component: () => import('../views/examAdmin/msg.vue'),
    },
}

const createRouter = () => new Router({
    routes: commonRoutes,
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export default router