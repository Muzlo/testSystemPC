import Vue from 'vue'
import Vuex from 'vuex'
import dialogVisiblePublic from './public/dialogVisiblePublic'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        // 左侧菜单栏数据
        menuItems:[]
    },
    mutations: {
        setMenus(state, items) {
            state.menuItems = [...items]
        },
    },
    modules:{
        dialogVisiblePublic
    }
})

export default store