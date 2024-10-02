import request from '@/config/axios'

// 采购单 VO
export interface PurchaseOrderVO {
  id: number // id
  reqPurchaseCode: string // 请购单编码
  poNum: string // 采购单编码
  status: number // 请购单状态
  extInfo: string // 扩展信息
  shipmentDate: Date // 运输日期
}

// 采购单 API
export const PurchaseOrderApi = {
  // 查询采购单分页
  getPurchaseOrderPage: async (params: any) => {
    return await request.get({ url: `/cacerp/purchase/purchase-order/page`, params })
  },

  // 查询采购单详情
  getPurchaseOrder: async (id: number) => {
    return await request.get({ url: `/cacerp/purchase/purchase-order/get?id=` + id })
  },

  // 新增采购单
  createPurchaseOrder: async (data: PurchaseOrderVO) => {
    return await request.post({ url: `/cacerp/purchase/purchase-order/create`, data })
  },

  // 修改采购单
  updatePurchaseOrder: async (data: PurchaseOrderVO) => {
    return await request.put({ url: `/cacerp/purchase/purchase-order/update`, data })
  },

  // 删除采购单
  deletePurchaseOrder: async (id: number) => {
    return await request.delete({ url: `/cacerp/purchase/purchase-order/delete?id=` + id })
  },

  // 导出采购单 Excel
  exportPurchaseOrder: async (params) => {
    return await request.download({ url: `/cacerp/purchase/purchase-order/export-excel`, params })
  },

// ==================== 子表（采购单产品明细） ====================

  // 获得采购单产品明细分页
  getPurchaseOrderItemsPage: async (params) => {
    return await request.get({ url: `/cacerp/purchase/purchase-order/purchase-order-items/page`, params })
  },
  // 新增采购单产品明细
  createPurchaseOrderItems: async (data) => {
    return await request.post({ url: `/cacerp/purchase/purchase-order/purchase-order-items/create`, data })
  },

  // 修改采购单产品明细
  updatePurchaseOrderItems: async (data) => {
    return await request.put({ url: `/cacerp/purchase/purchase-order/purchase-order-items/update`, data })
  },

  // 删除采购单产品明细
  deletePurchaseOrderItems: async (id: number) => {
    return await request.delete({ url: `/cacerp/purchase/purchase-order/purchase-order-items/delete?id=` + id })
  },

  // 获得采购单产品明细
  getPurchaseOrderItems: async (id: number) => {
    return await request.get({ url: `/cacerp/purchase/purchase-order/purchase-order-items/get?id=` + id })
  }
}