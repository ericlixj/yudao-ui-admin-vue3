<template>
<Dialog :title="dialogTitle" v-model="dialogVisible" :width="'60%'">
  <!-- 列表 -->
  <ContentWrap>
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
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
 </Dialog>
</template>
<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { PurchaseReqOrderApi } from '@/api/cacerp/purchase/purchaseReqOrder'

const dialogVisible = ref(false)
const dialogTitle = ref('') // 弹窗的标题
const reqPurchaseCode = ref('')
const prodCode = ref('')

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  reqPurchaseCode: '',
  prodCode: ''
})

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



/** 打开弹窗，传入请购单编码 */
const open = (reqPurchaseCode , prodCode) => {
  dialogVisible.value = true
  dialogTitle.value = '渠道明细';
  queryParams.reqPurchaseCode = reqPurchaseCode
  queryParams.prodCode = prodCode
  getList()
}
// 暴露 open 方法给父组件调用
defineExpose({ open })



</script>