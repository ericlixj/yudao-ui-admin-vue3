import request from '@/config/axios'

// 请购单 VO
export interface PurchaseReqOrderVO {
  id: number // id
  reqPurchaseCode: string // 请购单编码
  status: number // 请购单状态
  expectDeliveryTime: Date // 预期交付时间
  remark: string // 备注
}

// 请购单 API
export const PurchaseReqOrderApi = {
  // 查询请购单分页
  getPurchaseReqOrderPage: async (params: any) => {
    return await request.get({ url: `/cacerp/purchase/purchase-req-order/page`, params })
  },

  // 查询请购单详情
  getPurchaseReqOrder: async (id: number) => {
    return await request.get({ url: `/cacerp/purchase/purchase-req-order/get?id=` + id })
  },

  // 新增请购单
  createPurchaseReqOrder: async (data: PurchaseReqOrderVO) => {
    return await request.post({ url: `/cacerp/purchase/purchase-req-order/create`, data })
  },

  // 修改请购单
  updatePurchaseReqOrder: async (data: PurchaseReqOrderVO) => {
    return await request.put({ url: `/cacerp/purchase/purchase-req-order/update`, data })
  },

  // 删除请购单
  deletePurchaseReqOrder: async (id: number) => {
    return await request.delete({ url: `/cacerp/purchase/purchase-req-order/delete?id=` + id })
  },

  // 导出请购单 Excel
  exportPurchaseReqOrder: async (params) => {
    return await request.download({ url: `/cacerp/purchase/purchase-req-order/export-excel`, params })
  },

  // 请购单编码下拉使用
  getPurchaseReqOrderSimpleList: async () => {
    return await request.get({ url: `/cacerp/purchase/purchase-req-order/getPurchaseReqOrderSimpleList`})
  },


// ==================== 子表（请购单产品明细） ====================

  // 获得请购单产品明细分页
  getPurchaseReqOrderItemsPage: async (params) => {
    return await request.get({ url: `/cacerp/purchase/purchase-req-order/purchase-req-order-items/page`, params })
  },
  // 新增请购单产品明细
  createPurchaseReqOrderItems: async (data) => {
    return await request.post({ url: `/cacerp/purchase/purchase-req-order/purchase-req-order-items/create`, data })
  },

  // 修改请购单产品明细
  updatePurchaseReqOrderItems: async (data) => {
    return await request.put({ url: `/cacerp/purchase/purchase-req-order/purchase-req-order-items/update`, data })
  },

  // 删除请购单产品明细
  deletePurchaseReqOrderItems: async (id: number) => {
    return await request.delete({ url: `/cacerp/purchase/purchase-req-order/purchase-req-order-items/delete?id=` + id })
  },

  // 获得请购单产品明细
  getPurchaseReqOrderItems: async (id: number) => {
    return await request.get({ url: `/cacerp/purchase/purchase-req-order/purchase-req-order-items/get?id=` + id })
  },

  // 验证请购单编码唯一性
  checkReqPurchaseCodeUnique: async (reqPurchaseCode: string) => {
    return await request.get({ url: `/cacerp/purchase/purchase-req-order/checkReqPurchaseCodeUnique?reqPurchaseCode=` + reqPurchaseCode })
  },
  importPurchaseReqOrderItemsTemplate : () => {
    return request.download({ url: '/cacerp/purchase/purchase-req-order/get-import-items-template' })
  },
}
