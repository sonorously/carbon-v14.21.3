/*
* 项目接口api
* */

import request from '@/components/public/request.js';
export const url='carbon-check';

/* 标准文件库 */
//--- 列表查询 ---
export function queryStandardFilePage(queryData) {
    return request({
        url: `${url}/standardFile/queryStandardFilePage`,
        method: "post",
        data: queryData,
    });
}
// 下载
export function getStandardFile(queryData) {
    return request({
        url: `${url}/standardFile/getStandardFile`,
        method: "post",
        data: queryData,
        responseType: "blob"
    });
}
// 上传文件
export function saveStandardFileAdd(queryData) {
    return request({
        url: `${url}/standardFile/saveStandardFileAdd`,
        method: "post",
        data: queryData,
        headers:{
            'Content-type':'multipart/form-data'
        }
    });
}
//--- 删除文件 ---
export function saveStandardFileDel(queryData) {
    return request({
        url: `${url}/standardFile/saveStandardFileDel`,
        method: "post",
        data: queryData,
    });
}
/* 碳排核算 */
// 产品类型下拉
export function getProductCategoryComboBox(queryData) {
    return request({
        url: `${url}/productInfo/getProductCategoryComboBox`,
        method: "post",
        data: queryData,
    });
}
export function getStandardFileComboBox(queryData) {
  return request({
    url: `${url}/standardFile/getStandardFileComboBox`,
    method: "post",
    data: queryData,
  });
}

// 分步骤列表获取
export function getTypeModelByProduct(queryData) {
    return request({
        url: `${url}/productCategoryInfo/getTypeModelByProdect`,
        method: "post",
        data: queryData,
    });
}
// 上传文件
export function analysisUploadExcel(queryData) {
    return request({
        url: `${url}/productCategoryInfo/analysisUploadExcel`,
        method: "post",
        data: queryData,
        headers:{
            'Content-type':'multipart/form-data'
        }
    });
}
// 保存
export function saveCarbonDataAdd(queryData) {
    return request({
        url: `${url}/productCategoryInfo/saveCarbonDataAdd`,
        method: "post",
        data: queryData,
    });
}

/* 产品信息库 */
//--- 查询产品信息 ---
export function queryProductInfoPage(queryData) {
    return request({
        url: `${url}/productInfo/queryProductInfoPage`,
        method: "post",
        data: queryData,
    });
}
//--- 新增产品信息 ---
export function saveProductInfoAdd(queryData) {
    return request({
        url: `${url}/productInfo/saveProductInfoAdd`,
        method: "post",
        data: queryData,
    });
}

/* 碳排报告 */
//--- 查询碳排报告 ---
export function queryCarbonReportPage(queryData) {
    return request({
        url: `${url}/carbonReport/queryCarbonReportPage`,
        method: "post",
        data: queryData,
    });
}
//--- 生成碳排报告 ---
export function creatCarbonReport(queryData) {
    return request({
        url: `${url}/carbonReport/creatCarbonReport`,
        method: "post",
        data: queryData,
    });
}
//--- 下载报告 ---
export function getCarbonReportFile(queryData) {
    return request({
        url: `${url}/carbonReport/getCarbonReportFile`,
        method: "post",
        data: queryData,
        responseType: "blob"
    });
}

/* 碳排模型 */
//--- 查询模型类型下拉 ---
export function getModelTypeComboBox(queryData) {
    return request({
        url: `${url}/carbonModelInfo/getModelTypeComboBox`,
        method: "post",
        data: queryData,
    });
}
//--- 查询碳排模型 ---
export function queryCarbonModelPage(queryData) {
    return request({
        url: `${url}/carbonModelInfo/queryCarbonModelPage`,
        method: "post",
        data: queryData,
    });
}
//--- 新增碳排模型 ---
export function saveCarbonModelAdd(queryData) {
    return request({
        url: `${url}/carbonModelInfo/saveCarbonModelAdd`,
        method: "post",
        data: queryData,
    });
}
//--- 启动停用碳排模型 ---
export function saveCarbonModelModify(queryData) {
    return request({
        url: `${url}/carbonModelInfo/saveCarbonModelModify`,
        method: "post",
        data: queryData,
    });
}
//--- 下载碳排模型 ---
export function getCarbonModelFile(queryData) {
    return request({
        url: `${url}/carbonModelInfo/getCarbonModelFile`,
        method: "post",
        data: queryData,
    });
}

/* 碳排因子库 */
//--- 查询碳排因子类型下拉 ---
export function getCarbonFactorCategoryComboBox(queryData) {
    return request({
        url: `${url}/carbonFactor/getCarbonFactorCategoryComboBox`,
        method: "post",
        data: queryData,
    });
}
//--- 新增碳排因子 ---
export function saveCarbonFactorAdd(queryData) {
    return request({
        url: `${url}/carbonFactor/saveCarbonFactorAdd`,
        method: "post",
        data: queryData,
    });
}
//--- 查询碳排因子 ---
export function queryCarbonFactorPage(queryData) {
    return request({
        url: `${url}/carbonFactor/queryCarbonFactorPage`,
        method: "post",
        data: queryData,
    });
}
//--- 编辑碳排因子 ---
export function saveCarbonFactorModify(queryData) {
    return request({
        url: `${url}/carbonFactor/saveCarbonFactorModify`,
        method: "post",
        data: queryData,
    });
}
//--- 删除碳排因子 ---
export function saveCarbonFactorDel(queryData) {
    return request({
        url: `${url}/carbonFactor/saveCarbonFactorDel`,
        method: "post",
        data: queryData,
    });
}

/* 碳排核算 */
//--- 查询碳排核算任务 ---
export function queryCarbonAccountInfoPage(queryData) {
    return request({
        url: `${url}/carbonAccountInfo/queryCarbonAccountInfoPage`,
        method: "post",
        data: queryData,
    });
}
export function queryCarbonAccountReport(queryData) {
    return request({
        url: `${url}/carbonAccountInfo/queryCarbonAccountReport`,
        method: "post",
        data: queryData,
    });
}

/* 概览页 */
//--- 查询碳排核算概览 ---
export function queryCarbonAccountCollect(queryData) {
    return request({
        url: `${url}/carbonOverview/queryCarbonAccountCollect`,
        method: "post",
        data: queryData,
    });
}
//--- 查询碳排核算概览 ---
export function queryCarbonOverview(queryData) {
    return request({
        url: `${url}/carbonOverview/queryCarbonOverview`,
        method: "post",
        data: queryData,
    });
}
//--- 查询碳排核算概览 ---
export function queryCarbonDigest(queryData) {
    return request({
        url: `${url}/carbonOverview/queryCarbonDigest`,
        method: "post",
        data: queryData,
    });
}
