import router from './router'
import store from './store'
import createRoutes from '@/utils/createRoutes'
import { getDocumentTitle, resetTokenAndClearUser } from './utils'

import {baseURL} from '@/common/js/ipConfig';
import instance from '@/common/js/http';

// 是否有菜单数据
let hasMenus = false
router.beforeEach( async(to, from, next) => {
    document.title = getDocumentTitle(to.meta.title)
    if (localStorage.getItem('token')) {
            if (to.path === '/login') {
                next({ path: '/' })
            } else if (hasMenus) {
                next()
            } else {
                try {
                    // 这里可以用 await 配合请求后台数据来生成路由
                    // const data = await axios.get('xxx')
                    // const routes = createRoutes(data)
                    /////////
                    //const data = await instance.post(`${baseURL.ip1}/sms/getAppsList`)
                    const data={
                        status:0
                    }
                    if(data.status==0){
                        const menuArr= [
                            {
                                text: '题库',
                                children: [
                                    {
                                        name: 'questionList',
                                        text: '题库列表',
                                    },
                                ],
                            },
                            {
                                text: '试卷',
                                children: [
                                    {
                                        name: 'testPaperList',
                                        text: '试卷列表',
                                    }
                                ],
                            },
                            {
                                text: '用户',
                                children: [
                                    {
                                        name: 'userList',
                                        text: '用户查询',
                                    },
                                    // {
                                    //     name: 'testResult',
                                    //     text: '查询答卷',
                                    // },
                                    // {
                                    //     name: 'msg',
                                    //     text: '测试',
                                    // }
                                ],
                            }
                            
                        ];

                        menuArr.forEach((item)=>{
                            item.icon="el-icon-s-grid"
                        })
                        store.commit("setMenus",menuArr)
                        const routes = createRoutes(menuArr)
                        router.addRoutes(routes)
                        hasMenus = true
                        next({ path: to.path || '/' })
                    }
                    
                } catch (error) {
                    resetTokenAndClearUser()
                    next(`/login?redirect=${to.path}`)
                }
            }
    } else {
        hasMenus = false
        if (to.path === '/login') {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
})

router.afterEach(() => {
})