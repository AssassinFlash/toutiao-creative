<template>
  <div class="comment-container">
    <a-card>
      <template #title>
        <a-breadcrumb separator=">">
          <a-breadcrumb-item>
            <router-link :to="{name: 'Home'}">首页</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>评论管理</a-breadcrumb-item>
        </a-breadcrumb>
      </template>
      <Suspense>
        <template #default>
          <a-spin :spinning="spinning">
            <a-table style="margin-bottom:30px"
                     :columns="columns"
                     :data-source="articles"
                     size='middle'
                     :scroll="{ y:400 }"
                     :pagination="false">
              <template #status="{record}">
                <a-tag color="success"
                       v-show="record.comment_status">
                  <template #icon>
                    <check-circle-outlined/>
                  </template>
                  正常评论
                </a-tag>
                <a-tag color="error"
                       v-show="!record.comment_status">
                  <template #icon>
                    <close-circle-outlined/>
                  </template>
                  不能评论
                </a-tag>
              </template>
              <template #action="{record}">
                <a-popconfirm title="确认关闭该文章评论吗？"
                              ok-text="确认关闭"
                              cancel-text="返回"
                              @confirm="onConfirmClose(record)">
                  <a-button :danger="record.comment_status"
                            :disabled="record.statusDisabled"
                            type="primary"
                            size="middle">
                    {{ record.comment_status ? '关闭评论' : '打开评论' }}
                  </a-button>
                </a-popconfirm>
              </template>
            </a-table>
            <div class="pagination">
              <a-pagination :locale="locale"
                            v-model:current="articlesParams.page"
                            v-model:pageSize="articlesParams.per_page"
                            :total="totalCount"
                            show-size-changer
                            @showSizeChange="loadArticles(articlesParams)"
                            showQuickJumper
                            :defaultPageSize="articlesParams.per_page"
                            :show-total="total => `总共 ${total} 条结果`"
                            @change="loadArticles(articlesParams)"/>
            </div>
          </a-spin>
        </template>
      </Suspense>
    </a-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'
import { useTableColumns } from '@/components/Comment/useMenu'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import { Suspense, ref, reactive, onBeforeMount } from 'vue'

export default {
  name: 'CommentIndex',
  components: {
    Suspense,
    CheckCircleOutlined,
    CloseCircleOutlined
  },
  setup () {
    // 加载状态
    const spinning = ref(false)

    // 表格标题
    const columns = useTableColumns()

    // 获取文章的接口参数
    const articlesParams = reactive({
      page: 1,
      per_page: 20,
      response_type: 'comment'
    })
    // 文章数组
    const articles = ref([])
    // 文章总数
    const totalCount = ref(0)
    // 加载文章的方法
    const loadArticles = async function (params) {
      spinning.value = true
      const res = await getArticles(params)
      totalCount.value = res.data.data.total_count
      articles.value = res.data.data.results.map(article => {
        return {
          key: article.id.toString(),
          title: article.title,
          total_comment_count: article.total_comment_count,
          fans_comment_count: article.fans_comment_count,
          comment_status: article.comment_status
        }
      })
      spinning.value = false
    }

    // 开关评论的方法
    const onConfirmClose = async function (article) {
      article.statusDisabled = true
      spinning.value = true
      await updateCommentStatus(article.key, !article.comment_status)
      message.success(`${article.comment_status ? '关闭' : '开启'} ${article.title} 评论状态成功`)
      await loadArticles(articlesParams)
      article.statusDisabled = false
    }

    onBeforeMount(async () => {
      await loadArticles(articlesParams)
    })
    return {
      locale,
      spinning,
      columns,
      articles,
      articlesParams,
      totalCount,
      loadArticles,
      onConfirmClose
    }
  }
}
</script>

<style lang="less" scoped>
.comment-container {
  padding: 10px;

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
