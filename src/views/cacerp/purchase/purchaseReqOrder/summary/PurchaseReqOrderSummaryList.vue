<template>
<Dialog :title="dialogTitle" v-model="dialogVisible" :width="'60%'">
  <ContentWrap >
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >

      <el-form-item label="产品编码" prop="prodCode">
        <el-input
          v-model="queryParams.prodCode"
          placeholder="请输入产品编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">

      <el-table-column label="产品编码" align="center" prop="prodCode" />
      <el-table-column label="汇总数量" align="center" prop="summaryPlanCount" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm(scope.row.prodCode)"
            v-hasPermi="['cacerp:purchase-req-order-summary:update']"
          >
            查看渠道数据
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="refreshAndList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <PurchaseReqOrderItemsList4Source ref="sourceListRef" @success="refreshAndList" />
</Dialog>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { PurchaseReqOrderSummaryApi, PurchaseReqOrderSummaryVO } from '@/api/cacerp/purchase/purchaseReqOrder/summary'
import PurchaseReqOrderItemsList4Source from './PurchaseReqOrderItemsList4Source.vue'
import { ref } from 'vue'

const dialogVisible = ref(false)
const dialogTitle = ref('') // 弹窗的标题
const reqPurchaseCode = ref('')

/** keep it */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<PurchaseReqOrderSummaryVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数


const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  reqPurchaseCode: '',
  needCreate: false,
  prodCode: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 打开弹窗，传入请购单编码 */
const open = (reqPurchaseCodePara) => {
  reqPurchaseCode.value = reqPurchaseCodePara
  queryParams.reqPurchaseCode = reqPurchaseCodePara
  dialogTitle.value = "求购单明细汇总-" + reqPurchaseCodePara
  ElMessageBox.confirm('如果您修改了请购单产品明细数据，请点击【确定】；<br>否则，请点击【取消】。<br>是否需要刷新汇总数据?', '请购单汇总', {
    dangerouslyUseHTMLString: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    refreshAndList(true)
    dialogVisible.value = true
  })
  .catch(() => {
    refreshAndList()
    dialogVisible.value = true
  })

}
// 暴露 open 方法给父组件调用
defineExpose({ open })

/** 查询列表 */
const refreshAndList = async (needCreate = false) => {
  loading.value = true
  try {
    queryParams.needCreate = needCreate
    const data = await PurchaseReqOrderSummaryApi.refreshAndGetPurchaseReqOrderSummaryPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  refreshAndList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const sourceListRef = ref()
const openForm = (prodCode: string) => {
//  alert(prodCode+"||||"+queryParams.reqPurchaseCode)
  sourceListRef.value.open(reqPurchaseCode, prodCode)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await PurchaseReqOrderSummaryApi.deletePurchaseReqOrderSummary(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await refreshAndList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await PurchaseReqOrderSummaryApi.exportPurchaseReqOrderSummary(queryParams)
    download.excel(data, '请购汇总.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
//  refreshAndList()
})



</script>