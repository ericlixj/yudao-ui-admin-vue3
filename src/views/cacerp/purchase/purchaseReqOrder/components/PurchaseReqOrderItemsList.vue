<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-button
      type="primary"
      plain
      @click="openForm('create')"
      v-hasPermi="['cacerp:purchase-req-order:create']"
    >
      <Icon icon="ep:plus" class="mr-5px" /> 新增
    </el-button>
    <el-button
      type="warning"
      plain
      @click="handleImport"
      v-hasPermi="['cacerp:purchase-req-order:import']"
    >
      <Icon icon="ep:upload" /> 导入
    </el-button>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="id" align="center" prop="id" />
       <el-table-column label="产品编码" align="center" prop="prodCode" />
      <el-table-column label="产品名称" align="center" prop="prodName" />
      <el-table-column label="产品描述" align="center" prop="prodDesc" />
      <el-table-column label="产品形式" align="center" prop="prodForm">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PROD_FORM" :value="scope.row.prodForm" />
        </template>
      </el-table-column>
      <el-table-column label="产品规格数量" align="center" prop="prodBottleSize" />
      <el-table-column label="计划数" align="center" prop="planCount" />
      <el-table-column label="来源" align="center" prop="sourceCode">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PURCHASE_SOURCE_CODE" :value="scope.row.sourceCode" />
        </template>
      </el-table-column>
      <el-table-column
        label="create_time"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['cacerp:purchase-req-order:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['cacerp:purchase-req-order:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
    <!-- 表单弹窗：添加/修改 -->
    <PurchaseReqOrderItemsForm ref="formRef" @success="getList" />
    <!-- 用户导入对话框 -->
    <PurchaseReqOrderItemsImportForm ref="importFormRef"
    @success="getList"
    :req-purchase-code="queryParams.reqPurchaseCode"/>
</template>
<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { PurchaseReqOrderApi } from '@/api/cacerp/purchase/purchaseReqOrder'
import PurchaseReqOrderItemsForm from './PurchaseReqOrderItemsForm.vue'
import PurchaseReqOrderItemsImportForm from './PurchaseReqOrderItemsImportForm.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  reqPurchaseCode?: string // 请购单编码（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  reqPurchaseCode: ''
})

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.reqPurchaseCode,
  (val: number) => {
    if (!val) {
      return
    }
    queryParams.reqPurchaseCode = val
    handleQuery()
  },
    { immediate: true, deep: true }
)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PurchaseReqOrderApi.getPurchaseReqOrderItemsPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  if (!props.reqPurchaseCode) {
    message.error('请选择一个请购单')
    return
  }
  formRef.value.open(type, id, props.reqPurchaseCode)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await PurchaseReqOrderApi.deletePurchaseReqOrderItems(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}
/** 用户导入 */
const importFormRef = ref()
const handleImport = () => {
  if (!props.reqPurchaseCode) {
    message.error('请选择一个请购单')
    return
  }
  importFormRef.value.open()
}




</script>