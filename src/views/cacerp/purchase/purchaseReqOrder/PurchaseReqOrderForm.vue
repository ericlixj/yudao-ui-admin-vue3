<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="预期交付时间" prop="expectDeliveryTime">
        <el-date-picker
          v-model="formData.expectDeliveryTime"
          type="date"
          value-format="x"
          placeholder="选择预期交付时间"
          @change="generateReqPurchaseCode"
        />
      </el-form-item>
      <el-form-item label="请购单编码" prop="reqPurchaseCode">
        <el-input v-model="formData.reqPurchaseCode" placeholder="请输入请购单编码" disabled/>
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

      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
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
import { PurchaseReqOrderApi, PurchaseReqOrderVO } from '@/api/cacerp/purchase/purchaseReqOrder'
import { CommonStatusEnum } from '@/utils/constants'

/** 请购单 表单 */
defineOptions({ name: 'PurchaseReqOrderForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  reqPurchaseCode: undefined,
  status: CommonStatusEnum.ENABLE,
  expectDeliveryTime: undefined,
  remark: undefined
})
const formRules = reactive({
  reqPurchaseCode: [{ required: true, message: '请购单编码不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '请购单状态不能为空', trigger: 'blur' }],
  expectDeliveryTime: [{ required: true, message: '预期交付时间不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

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
      formData.value = await PurchaseReqOrderApi.getPurchaseReqOrder(id)
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
    const data = formData.value as unknown as PurchaseReqOrderVO
    if (formType.value === 'create') {
    //reqPurchaseCode唯一性验证
      const isUnique = await checkReqPurchaseCodeIsUnique()
      if (!isUnique) {
        message.error('请购单编码【'+ formData.value.reqPurchaseCode +'】已存在，请重新生成!')
        return
      }

      await PurchaseReqOrderApi.createPurchaseReqOrder(data)
      message.success(t('common.createSuccess'))
    } else {
      await PurchaseReqOrderApi.updatePurchaseReqOrder(data)
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
    status: CommonStatusEnum.ENABLE,
    expectDeliveryTime: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}

/** 生成请购单编码 */
const generateReqPurchaseCode = () => {
  const currentDate = new Date();
  // 获取当前年份后两位
  const year = currentDate.getFullYear().toString().slice(-2);
  // 获取当前日期（格式：MMDD）
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  // 获取 expectDeliveryTime 的年份（后两位）和日期（格式：MMDD）
  if (formData.value.expectDeliveryTime) {
    const expectDate = new Date(formData.value.expectDeliveryTime);
    const expectYear = expectDate.getFullYear().toString().slice(-2);
    const expectMonth = String(expectDate.getMonth() + 1).padStart(2, '0');
    const expectDay = String(expectDate.getDate()).padStart(2, '0');

    // 生成 reqPurchaseCode 格式
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 生成随机的4位数字
    formData.value.reqPurchaseCode = `rp${year}${month}${day}${expectYear}${expectMonth}${expectDay}${randomNum}`;
  }
}

/** 验证 reqPurchaseCode 的唯一性 */
const checkReqPurchaseCodeIsUnique = async () => {
  try {
    const response = await PurchaseReqOrderApi.checkReqPurchaseCodeUnique(formData.value.reqPurchaseCode)
    return response
  } catch (error) {
    message.error('验证请购单编码唯一性时出错')
    return false
  }
}







</script>