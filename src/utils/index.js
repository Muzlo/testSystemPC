import { resetRouter } from '@/router'

export function resetTokenAndClearUser() {
    // 退出登陆 清除用户资料
//    localStorage.clear();
    localStorage.removeItem('token')
    // 重设路由
    resetRouter();
}

export const defaultDocumentTitle = '试卷管理系统'
export function getDocumentTitle(pageTitle) {
    if (pageTitle) return `${defaultDocumentTitle} - ${pageTitle}`
    return `${defaultDocumentTitle}`
}