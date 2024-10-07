<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="请购单编码" prop="reqPurchaseCode">
        <el-input v-model="formData.reqPurchaseCode" placeholder="请输入请购单编码" disabled/>
      </el-form-item>
       <el-form-item label="产品编码" prop="prodCode">
        <el-select
          v-model="formData.prodCode"
          clearable
          filterable
          placeholder="请选择产品"
          class="!w-1/1"
          @change="onProdCodeChange"
        >
          <el-option
            v-for="item in prodList"
            :key="item.prodCode"
            :label="item.prodCode"
            :value="item.prodCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称" prop="prodName">
        <el-input v-model="formData.prodName" placeholder="请输入产品名称" disabled/>
      </el-form-item>
      <el-form-item label="采购数量" prop="purchaseQuantity">
        <el-input v-model="formData.purchaseQuantity" placeholder="请输入采购数量" disabled/>
      </el-form-item>
      <el-form-item label="采购单价" prop="unitPrice">
        <el-input v-model="formData.unitPrice" placeholder="请输入采购单价" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { PurchaseOrderApi } from '@/api/cacerp/purchase/purchaseOrder'
import { ProductApi, ProductVO } from '@/api/cacerp/purchase/product'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  reqPurchaseCode: undefined,
  poNum: undefined,
  prodCode: undefined,
  purchaseQuantity: undefined,
  unitPrice: undefined
})
const formRules = reactive({
  reqPurchaseCode: [{ required: true, message: '请购单编码不能为空', trigger: 'blur' }],
  poNum: [{ required: true, message: '采购单编码不能为空', trigger: 'blur' }],
  prodCode: [{ required: true, message: '产品编码不能为空', trigger: 'blur' }],
  purchaseQuantity: [{ required: true, message: '采购数量不能为空', trigger: 'blur' }],
  unitPrice: [{ required: true, message: '采购单价不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const prodList = ref<ProductVO[]>([]) // 供应商列表
/** 打开弹窗 */
const open = async (type: string, id?: number, poNum: string, supplierId: string, reqPurchaseCode: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formData.value.reqPurchaseCode = reqPurchaseCode
  formData.value.poNum = poNum
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await PurchaseOrderApi.getPurchaseOrderItems(id)
    } finally {
      formLoading.value = false
    }
  }
  prodList.value = await ProductApi.getProdList({
    reqPurchaseCode: reqPurchaseCode,
    supplierId: supplierId,


  })
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value
    if (formType.value === 'create') {
      await PurchaseOrderApi.createPurchaseOrderItems(data)
      message.success(t('common.createSuccess'))
    } else {
      await PurchaseOrderApi.updatePurchaseOrderItems(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    reqPurchaseCode: undefined,
    poNum: undefined,
    prodCode: undefined,
    purchaseQuantity: undefined,
    unitPrice: undefined
  }
  formRef.value?.resetFields()
}

/** 当产品编码变化时，更新产品相关信息 */
const onProdCodeChange = (prodCode: string) => {
  const selectedProduct = prodList.value.find(product => product.prodCode === prodCode)
  if (selectedProduct) {
    formData.value.prodName = selectedProduct.name       // 自动带出产品名称
    formData.value.purchaseQuantity = selectedProduct.summaryPlanCount // 假设有默认数量字段
    formData.value.unitPrice = selectedProduct.purchasePrice // 自动带出采购价格
  }
}

</script>