import { baseURL } from "../common/js/ipConfig.js";
const addQPack=`${baseURL.ip1}/examAdmin/addQPack`
const addTest=`${baseURL.ip1}/examAdmin/addTest`
const delQPack=`${baseURL.ip1}/examAdmin/delQPack`
const delTest=`${baseURL.ip1}/examAdmin/delTest`
const findQuestionPack=`${baseURL.ip1}/examAdmin/findQuestionPack`
const findQUser=`${baseURL.ip1}/examAdmin/findQUser`
const findTest=`${baseURL.ip1}/examAdmin/findTest`
const findtestResult=`${baseURL.ip1}/examAdmin/findtestResult`
const importUser=`${baseURL.ip1}/examAdmin/importUser`
const updQPack=`${baseURL.ip1}/examAdmin/updQPack`
const login=`${baseURL.ip1}/login`
const delUser=`${baseURL.ip1}/examAdmin/delUser`
const uploadImages=`${baseURL.ip1}/examAdmin/uploadImages`

export {delUser,uploadImages,
    login,addQPack,addTest,delQPack,delTest,findQuestionPack,findQUser,findTest,findtestResult,importUser,updQPack,
}