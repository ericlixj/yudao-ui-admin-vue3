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
            <el-select
              v-model="formData.reqPurchaseCode"
              clearable
              filterable
              placeholder="请选择请购单编码"
              class="!w-1/1"
            >
              <el-option
                v-for="item in reqPurchaseCodeList"
                :key="item.reqPurchaseCode"
                :label="item.reqPurchaseCode"
                :value="item.reqPurchaseCode"
              />
            </el-select>
      </el-form-item>
      <el-form-item label="采购单编码" prop="poNum">
        <el-input v-model="formData.poNum" placeholder="请输入采购单编码" />
      </el-form-item>
      <el-form-item label="请购单状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :value="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预期运输时间" prop="shipmentDate">
        <el-date-picker
          v-model="formData.shipmentDate"
          type="date"
          value-format="x"
          placeholder="选择预期运输时间"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { PurchaseOrderApi, PurchaseOrderVO } from '@/api/cacerp/purchase/purchaseOrder'
import {PurchaseReqOrderApi} from '@/api/cacerp/purchase/purchaseReqOrder'
import { CommonStatusEnum } from '@/utils/constants'

/** 采购单管理NEW 表单 */
defineOptions({ name: 'PurchaseOrderForm' })

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
  status: CommonStatusEnum.ENABLE,
  shipmentDate: undefined
})
const formRules = reactive({
  reqPurchaseCode: [{ required: true, message: '请购单编码不能为空', trigger: 'blur' }],
  poNum: [{ required: true, message: '采购单编码不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '请购单状态不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 请购单下拉框 */
const reqPurchaseCodeList = ref<PurchaseReqOrderVO[]>([]) // 请购单列表

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await PurchaseOrderApi.getPurchaseOrder(id)
    } finally {
      formLoading.value = false
    }
  }

  reqPurchaseCodeList.value = await PurchaseReqOrderApi.getPurchaseReqOrderSimpleList()
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
    const data = formData.value as unknown as PurchaseOrderVO
    if (formType.value === 'create') {
      await PurchaseOrderApi.createPurchaseOrder(data)
      message.success(t('common.createSuccess'))
    } else {
      await PurchaseOrderApi.updatePurchaseOrder(data)
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
    status: CommonStatusEnum.ENABLE,
    shipmentDate: undefined
  }
  formRef.value?.resetFields()
}
</script>