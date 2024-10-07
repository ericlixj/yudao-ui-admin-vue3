import request from '@/config/axios'

// 产品管理 VO
export interface ProductVO {
  id: number // pk
  name: string // name
  supplierId: number // supplier_id
  prodCode: string // prod_code
  prodDescs: string // prod_descs
  form: string // form
  count: number // count
  status: number // status
  remark: string // remark
  purchasePrice: number // purchase_price
  salePrice: number // sale_price
  minPrice: number // min_price
}

// 产品管理 API
export const ProductApi = {
  // 查询产品管理分页
  getProductPage: async (params: any) => {
    return await request.get({ url: `/cacerp/purchase/product/page`, params })
  },
  getProdList: async (params: any) => {
    return await request.get({ url: `/cacerp/purchase/product/getProdList`, params })
  },

  // 查询产品管理详情
  getProduct: async (id: number) => {
    return await request.get({ url: `/cacerp/purchase/product/get?id=` + id })
  },

  // 新增产品管理
  createProduct: async (data: ProductVO) => {
    return await request.post({ url: `/cacerp/purchase/product/create`, data })
  },

  // 修改产品管理
  updateProduct: async (data: ProductVO) => {
    return await request.put({ url: `/cacerp/purchase/product/update`, data })
  },

  // 删除产品管理
  deleteProduct: async (id: number) => {
    return await request.delete({ url: `/cacerp/purchase/product/delete?id=` + id })
  },

  // 导出产品管理 Excel
  exportProduct: async (params) => {
    return await request.download({ url: `/cacerp/purchase/product/export-excel`, params })
  }
}