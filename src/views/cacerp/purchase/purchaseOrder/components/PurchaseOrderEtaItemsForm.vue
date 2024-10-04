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
        <el-input v-model="formData.reqPurchaseCode" placeholder="请输入请购单编码" />
      </el-form-item>
       <el-form-item label="产品编码" prop="prodCode">
        <el-input v-model="formData.prodCode" placeholder="请输入产品编码" />
      </el-form-item>
      <el-form-item label="预期交付数量" prop="exceptQuantity">
        <el-input v-model="formData.exceptQuantity" placeholder="请输入预期交付数量" />
      </el-form-item>
      <el-form-item label="预期交付时间" prop="exceptDate">
        <el-date-picker
          v-model="formData.exceptDate"
          type="date"
          value-format="x"
          placeholder="选择预期交付时间"
        />
      </el-form-item>
      <el-form-item label="来源编码" prop="sourceCode">
        <el-select v-model="formData.sourceCode" placeholder="请选择来源编码">
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
import { PurchaseOrderApi } from '@/api/cacerp/purchase/purchaseOrder'

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
  exceptQuantity: undefined,
  exceptDate: undefined,
  sourceCode: undefined
})
const formRules = reactive({
  reqPurchaseCode: [{ required: true, message: '请购单编码不能为空', trigger: 'blur' }],
  poNum: [{ required: true, message: '采购单编码不能为空', trigger: 'blur' }],
  prodCode: [{ required: true, message: '产品编码不能为空', trigger: 'blur' }],
  exceptQuantity: [{ required: true, message: '预期交付数量不能为空', trigger: 'blur' }],
  exceptDate: [{ required: true, message: '预期交付时间不能为空', trigger: 'blur' }],
  sourceCode: [{ required: true, message: '来源编码不能为空', trigger: 'change' }]
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
      formData.value = await PurchaseOrderApi.getPurchaseOrderEtaItems(id)
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
      await PurchaseOrderApi.createPurchaseOrderEtaItems(data)
      message.success(t('common.createSuccess'))
    } else {
      await PurchaseOrderApi.updatePurchaseOrderEtaItems(data)
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
    exceptQuantity: undefined,
    exceptDate: undefined,
    sourceCode: undefined
  }
  formRef.value?.resetFields()
}
</script>