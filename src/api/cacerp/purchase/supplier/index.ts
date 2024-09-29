import request from '@/config/axios'

// 供应商 VO
export interface CacErpSupplierVO {
  id: number // pk
  name: string // 名称
  contact: string // 联系人
  mobile: string // 手机号
  telephone: string // 电话号码
  email: string // 邮件
  fax: string // 传真
  remark: string // 备注
  status: number // 状态
  sort: number // 排序号
  taxNo: string // 税务编号
  taxPercent: number // 税率
  bankName: string // 银行名称
  bankAccount: string // 银行账户
  bankAddress: string // 银行地址
}

// 供应商 API
export const CacErpSupplierApi = {
  // 查询供应商分页
  getCacErpSupplierPage: async (params: any) => {
    return await request.get({ url: `/cacerp/purchase/supplier/page`, params })
  },

  // 查询供应商详情
  getCacErpSupplier: async (id: number) => {
    return await request.get({ url: `/cacerp/purchase/supplier/get?id=` + id })
  },

  // 新增供应商
  createCacErpSupplier: async (data: CacErpSupplierVO) => {
    return await request.post({ url: `/cacerp/purchase/supplier/create`, data })
  },

  // 修改供应商
  updateCacErpSupplier: async (data: CacErpSupplierVO) => {
    return await request.put({ url: `/cacerp/purchase/supplier/update`, data })
  },

  // 删除供应商
  deleteCacErpSupplier: async (id: number) => {
    return await request.delete({ url: `/cacerp/purchase/supplier/delete?id=` + id })
  },

  // 导出供应商 Excel
  exportCacErpSupplier: async (params) => {
    return await request.download({ url: `/cacerp/purchase/supplier/export-excel`, params })
  }
}