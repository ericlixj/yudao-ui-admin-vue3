<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-input v-model="formData.supplierId" placeholder="请输入供应商" />
      </el-form-item>
      <el-form-item label="产品编码" prop="prodCode">
        <el-input v-model="formData.prodCode" placeholder="请输入产品编码" />
      </el-form-item>
      <el-form-item label="产品描述" prop="prodDescs">
        <el-input v-model="formData.prodDescs" type="textarea" placeholder="请输入产品描述" />
      </el-form-item>
      <el-form-item label="形式" prop="form">
        <el-input v-model="formData.form" placeholder="请输入形式" />
      </el-form-item>
      <el-form-item label="数量" prop="count">
        <el-input v-model="formData.count" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="采购价格" prop="purchasePrice">
        <el-input v-model="formData.purchasePrice" placeholder="请输入采购价格" />
      </el-form-item>
      <el-form-item label="销售价格" prop="salePrice">
        <el-input v-model="formData.salePrice" placeholder="请输入销售价格" />
      </el-form-item>
      <el-form-item label="最低价格" prop="minPrice">
        <el-input v-model="formData.minPrice" placeholder="请输入最低价" />
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
import { ProductApi, ProductVO } from '@/api/cacerp/purchase/product'

/** 产品管理 表单 */
defineOptions({ name: 'ProductForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: undefined,
  supplierId: undefined,
  prodCode: undefined,
  prodDescs: undefined,
  form: undefined,
  count: undefined,
  status: undefined,
  remark: undefined,
  purchasePrice: undefined,
  salePrice: undefined,
  minPrice: undefined
})
const formRules = reactive({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  prodCode: [{ required: true, message: '产品编码不能为空', trigger: 'blur' }],
  prodDescs: [{ required: true, message: '产品描述不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
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
      formData.value = await ProductApi.getProduct(id)
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
    const data = formData.value as unknown as ProductVO
    if (formType.value === 'create') {
      await ProductApi.createProduct(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProductApi.updateProduct(data)
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
    name: undefined,
    supplierId: undefined,
    prodCode: undefined,
    prodDescs: undefined,
    form: undefined,
    count: undefined,
    status: undefined,
    remark: undefined,
    purchasePrice: undefined,
    salePrice: undefined,
    minPrice: undefined
  }
  formRef.value?.resetFields()
}
</script>