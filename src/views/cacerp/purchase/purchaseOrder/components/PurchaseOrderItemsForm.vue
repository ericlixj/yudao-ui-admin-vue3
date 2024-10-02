<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="产品规格数量" prop="prodBottleSize">
        <el-input v-model="formData.prodBottleSize" placeholder="请输入产品规格数量" />
      </el-form-item>
      <el-form-item label="单价" prop="unitPrice">
        <el-input v-model="formData.unitPrice" placeholder="请输入单价" />
      </el-form-item>
      <el-form-item label="req_purchase_code" prop="reqPurchaseCode">
        <el-input v-model="formData.reqPurchaseCode" placeholder="请输入req_purchase_code" />
      </el-form-item>
       <el-form-item label="产品编码" prop="prodCode">
        <el-input v-model="formData.prodCode" placeholder="请输入产品编码" />
      </el-form-item>
      <el-form-item label="产品名称" prop="prodName">
        <el-input v-model="formData.prodName" placeholder="请输入产品名称" />
      </el-form-item>
      <el-form-item label="产品描述" prop="prodDesc">
        <el-input v-model="formData.prodDesc" type="textarea" placeholder="请输入产品描述" />
      </el-form-item>
      <el-form-item label="产品形式" prop="prodForm">
        <el-input v-model="formData.prodForm" placeholder="请输入产品形式" />
      </el-form-item>
      <el-form-item label="采购数量" prop="purchaseQuantity">
        <el-input v-model="formData.purchaseQuantity" placeholder="请输入采购数量" />
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

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  prodBottleSize: undefined,
  unitPrice: undefined,
  reqPurchaseCode: undefined,
  poNum: undefined,
  prodCode: undefined,
  prodName: undefined,
  prodDesc: undefined,
  prodForm: undefined,
  purchaseQuantity: undefined
})
const formRules = reactive({
  prodBottleSize: [{ required: true, message: '产品规格数量不能为空', trigger: 'blur' }],
  unitPrice: [{ required: true, message: '单价不能为空', trigger: 'blur' }],
  reqPurchaseCode: [{ required: true, message: 'req_purchase_code不能为空', trigger: 'blur' }],
  poNum: [{ required: true, message: '采购单编码不能为空', trigger: 'blur' }],
  prodCode: [{ required: true, message: '产品编码不能为空', trigger: 'blur' }],
  prodName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
  prodForm: [{ required: true, message: '产品形式不能为空', trigger: 'blur' }],
  purchaseQuantity: [{ required: true, message: '采购数量不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, poNum: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
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
    prodBottleSize: undefined,
    unitPrice: undefined,
    reqPurchaseCode: undefined,
    poNum: undefined,
    prodCode: undefined,
    prodName: undefined,
    prodDesc: undefined,
    prodForm: undefined,
    purchaseQuantity: undefined
  }
  formRef.value?.resetFields()
}
</script>