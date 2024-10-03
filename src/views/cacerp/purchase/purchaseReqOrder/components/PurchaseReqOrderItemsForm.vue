<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="110px"
      v-loading="formLoading"
    >
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
        <el-select v-model="formData.prodForm" placeholder="请选择产品形式">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.PROD_FORM)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品规格数量" prop="prodBottleSize">
        <el-input v-model="formData.prodBottleSize" placeholder="请输入产品规格数量" />
      </el-form-item>
      <el-form-item label="计划数" prop="planCount">
        <el-input v-model="formData.planCount" placeholder="请输入计划数" />
      </el-form-item>
      <el-form-item label="来源" prop="sourceCode">
        <el-select v-model="formData.sourceCode" placeholder="请选择来源">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.PURCHASE_SOURCE_CODE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { PurchaseReqOrderApi } from '@/api/cacerp/purchase/purchaseReqOrder'
import { CommonStatusEnum } from '@/utils/constants'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  reqPurchaseCode: undefined,
  prodCode: undefined,
  prodName: undefined,
  prodDesc: undefined,
  prodForm: undefined,
  prodBottleSize: undefined,
  planCount: undefined,
  sourceCode: undefined
})
const formRules = reactive({
  reqPurchaseCode: [{ required: true, message: '请购单编码不能为空', trigger: 'blur' }],
  prodCode: [{ required: true, message: '产品编码不能为空', trigger: 'blur' }],
  prodName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
  prodDesc: [{ required: true, message: '产品描述不能为空', trigger: 'blur' }],
  prodForm: [{ required: true, message: '产品形式不能为空', trigger: 'change' }],
  prodBottleSize: [{ required: true, message: '产品规格数量不能为空', trigger: 'blur' }],
  planCount: [{ required: true, message: '计划数不能为空', trigger: 'blur' }],
  sourceCode: [{ required: true, message: '来源不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, reqPurchaseCode: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formData.value.reqPurchaseCode = reqPurchaseCode
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await PurchaseReqOrderApi.getPurchaseReqOrderItems(id)
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
      await PurchaseReqOrderApi.createPurchaseReqOrderItems(data)
      message.success(t('common.createSuccess'))
    } else {
      await PurchaseReqOrderApi.updatePurchaseReqOrderItems(data)
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
    prodCode: undefined,
    prodName: undefined,
    prodDesc: undefined,
    prodForm: undefined,
    prodBottleSize: undefined,
    planCount: undefined,
    sourceCode: undefined
  }
  formRef.value?.resetFields()
}
</script>