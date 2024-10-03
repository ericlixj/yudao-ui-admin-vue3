import request from '@/config/axios'

// 请购汇总 VO
export interface PurchaseReqOrderSummaryVO {
  id: number // pk
  reqPurchaseCode: string // 请购单编码
  prodCode: string // 产品编码
  summaryPlanCount: number // 汇总数量
}

// 请购汇总 API
export const PurchaseReqOrderSummaryApi = {
  // 查询请购汇总分页
  getPurchaseReqOrderSummaryPage: async (params: any) => {
    return await request.get({ url: `/cacerp/purchase/purchase-req-order-summary/page`, params })
  },
  //生成汇总数据并查询
  refreshAndGetPurchaseReqOrderSummaryPage: async (params: any) => {
    return await request.get({ url: `/cacerp/purchase/purchase-req-order-summary/refreshAndPage`, params })
  },

  // 查询请购汇总详情
  getPurchaseReqOrderSummary: async (id: number) => {
    return await request.get({ url: `/cacerp/purchase/purchase-req-order-summary/get?id=` + id })
  },

  // 新增请购汇总
  createPurchaseReqOrderSummary: async (data: PurchaseReqOrderSummaryVO) => {
    return await request.post({ url: `/cacerp/purchase/purchase-req-order-summary/create`, data })
  },

  // 修改请购汇总
  updatePurchaseReqOrderSummary: async (data: PurchaseReqOrderSummaryVO) => {
    return await request.put({ url: `/cacerp/purchase/purchase-req-order-summary/update`, data })
  },

  // 删除请购汇总
  deletePurchaseReqOrderSummary: async (id: number) => {
    return await request.delete({ url: `/cacerp/purchase/purchase-req-order-summary/delete?id=` + id })
  },

  // 导出请购汇总 Excel
  exportPurchaseReqOrderSummary: async (params) => {
    return await request.download({ url: `/cacerp/purchase/purchase-req-order-summary/export-excel`, params })
  }
}