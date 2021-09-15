<template>
  <div class="article-container">
    <!-- 数据筛选、分页的核心思路都是绑定filterArticle的属性 -->
    <!-- 在点击不同的数据进行筛选或者点击不同的页面，都会更新filterArticle -->
    <!-- 然后用filterArticle作为参数向接口请求数据，这样子返回的数据就都不一样 -->
    <Suspense>
      <template #default>

        <a-card hoverable
                class="filter-card">
          <!--在卡片标题中写下面包屑导航-->
          <template #title>
            <a-breadcrumb separator=">">
              <a-breadcrumb-item>
                <router-link :to="{name:'Home'}">首页</router-link>
              </a-breadcrumb-item>
              <a-breadcrumb-item>
                内容管理
              </a-breadcrumb-item>
            </a-breadcrumb>
          </template>

          <!--在卡片内容行写下数据筛选表单-->
          <a-form :label-col="labelCol"
                  :wrapper-col="wrapperCol">
            <a-form-item label="状态">
              <a-radio-group v-model:value="filterArticle.status">
                <a-radio>全部</a-radio>
                <a-radio value="0">草稿</a-radio>
                <a-radio value="1">待审核</a-radio>
                <a-radio value="2">审核通过</a-radio>
                <a-radio value="3">审核失败</a-radio>
                <a-radio value="4">已删除</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="频道"
                         style="width:400px">
              <a-select placeholder="请选择频道"
                        v-model:value="filterArticle.channel_id"
                        @change="filterArticle.channel_id==='0'?filterArticle.channel_id=null:filterArticle.channel_id">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option v-for="option in channels"
                                 :key="option.id"
                                 :value="option.id">
                  {{ option.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="日期">
              <a-range-picker :locale="locale"
                              format="YYYY-MM-DD"
                              @change="onChangeDate"></a-range-picker>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
              <a-button type="primary"
                        @click="loadArticles(filterArticle)"
                        :disabled="loading">
                查询
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </template>
    </Suspense>

    <Suspense>
      <template #default>

        <a-card hoverable>
          <template #title>
            <div>根据筛选条件共查询到 {{ totalCount }} 条结果：</div>
          </template>
          <!--数据列表-->
          <!--
                1.把需要展示的数组列表数据绑定给table组件的data-source属性
                注意：不需要v-for遍历，table组件自己会遍历
                -->
          <a-table class="ant-table-striped"
                   size="middle"
                   :loading="loading"
                   :pagination=false
                   :scroll="{y:400}"
                   :columns="columns"
                   :data-source="articles">
            <!--通过{record}获得当前遍历项的数据，record名字随便起-->
            <!--#image表示封面这一列-->
            <template #image="{ record }">
              <img :src="record.cover.images[0]"
                   alt=""
                   class="article-image"
                   v-show="record.cover.images[0]">
              <img src="@/assets/superman.svg"
                   alt=""
                   v-show="!record.cover.images[0]"
                   class="article-image">
            </template>
            <!--#status表示状态栏这一列-->
            <template #status="{ record }">
              <a-tag :color="articlesStatus[record.status].type">
                {{ articlesStatus[record.status].text }}
              </a-tag>
            </template>
            <!--#action表示操作这一列-->
            <template #action="{ record }">
              <span>
                <a-button type="text"
                          shape="circle"
                          @click="toPublishPage(record.key)">
                  <template #icon>
                    <icon-font type="icon-gai-copy"></icon-font>
                  </template>
                </a-button>
                <a-divider type="vertical"/>
                <a-popconfirm title="确定要删除该文章吗？"
                              ok-text="确定"
                              cancel-text="返回"
                              :disabled="record.statusDisabled"
                              @confirm="onConfirmDelete(record)">
                  <template #icon>
                    <icon-font type="icon-shanchu"></icon-font>
                  </template>
                  <DeleteOutlined/>
                </a-popconfirm>
              </span>
            </template>
          </a-table>
          <div class="pagination">
            <!-- 绑定当前页为filterArticle.page -->
            <!-- 然后当改变页面时，先改变当前页，然后把当前页提交到filterArticle参数 -->
            <!-- 这样子就能每次改变页面都能对新的页面做一次接口请求，返回新页的数据展示 -->
            <a-pagination show-quick-jumper
                          v-model:current="filterArticle.page"
                          :total="totalCount"
                          :disabled="loading"
                          :show-total="total => `总共 ${total} 条结果`"
                          @change="loadArticles(filterArticle)"/>
          </div>
        </a-card>
      </template>
    </Suspense>
  </div>
</template>

<script>
import { createFromIconfontCN, DeleteOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import { ref, reactive, onBeforeMount, Suspense } from 'vue'
import { useRouter } from 'vue-router'
import {
  useArticleChannels,
  useTableColumns,
  useTableData,
  useArticleStatus
} from '@/components/Home/useTable'
import { deleteArticle } from '@/api/article'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2758474_a0gbql4hd8u.js'
})
export default {
  name: 'ArticleIndex',
  components: {
    IconFont,
    DeleteOutlined,
    Suspense
  },
  setup () {
    // 文章载入状态
    const loading = ref(false)

    // 获取文章频道
    let resChannels = reactive({})
    const channels = ref([])
    // 获取文章频道的方法
    const loadArticleChannels = async function () {
      resChannels = await useArticleChannels()
      channels.value = resChannels.data.channels
    }

    // 查询文章
    const filterArticle = reactive({
      page: 1,
      status: null, // 文章状态
      channel_id: null // 文章频道
    })

    // 文章日期
    const articleDate = ref([])
    // 日期方法
    const onChangeDate = (value, dataString) => {
      articleDate.value = dataString
      filterArticle.begin_pubdate = articleDate.value[0]
      filterArticle.end_pubdate = articleDate.value[1]
    }

    // 获取table标题
    const columns = useTableColumns()

    // 获取文章
    let resArticle = reactive({})
    const totalCount = ref(null)
    const articles = ref([])
    // 获取文章的方法
    const loadArticles = async function (params) {
      loading.value = true
      resArticle = await useTableData(params)
      loading.value = false
      totalCount.value = resArticle.data.total_count
      articles.value = resArticle.data.results.map((x, index) => {
        return {
          key: x.id.toString(),
          cover: x.cover,
          title: x.title,
          status: x.status,
          pubdate: x.pubdate
        }
      })
    }
    // 修改文章的方法
    const $router = useRouter()
    const toPublishPage = function (articleID) {
      $router.push({
        name: 'Publish',
        params: { id: articleID }
      })
    }

    // 删除文章的方法
    let resDelete = reactive({})
    const onConfirmDelete = async (article) => {
      try {
        loading.value = true
        article.statusDisabled = true
        resDelete = await deleteArticle(article.key)
        if (resDelete.status === 204) {
          message.success(`删除：${article.title} 成功`, 3)
          await loadArticles(filterArticle)
          article.statusDisabled = false
        } else {
          message.error(`删除：${article.title} 失败，${resDelete.status}`)
          loading.value = false
          article.statusDisabled = false
        }
      } catch (error) {
        message.error(`删除：${article.title} 失败，${error}`)
        loading.value = false
        article.statusDisabled = false
      }
    }

    // 在挂载前先执行一次获取文章频道和获取文章
    onBeforeMount(async () => {
      await loadArticleChannels()
      await loadArticles()
    })

    // 获取文章状态
    const articlesStatus = useArticleStatus()

    // 设置label宽度
    const labelCol = reactive({
      style: {
        width: '40px'
      }
    })
    const wrapperCol = reactive({
      span: 14
    })

    return {
      locale,
      loading, // table的loading状态
      labelCol, // 筛选条件的label的宽
      wrapperCol,
      channels, // 所有的文章频道
      filterArticle, // 筛选文章条件
      loadArticles, // 获取文章方法
      toPublishPage, // 修改文章方法
      onConfirmDelete, // 确认删除方法
      totalCount, // 所有文章数
      columns, // table的标题
      articles, // table的文章数据
      articlesStatus, // 所有文章状态
      onChangeDate // 改变日期方法
    }
  }
}
</script>

<style lang="less" scoped>
.article-container {
  padding: 10px;
}

.filter-card {
  margin-bottom: 10px;
}

.article-image {
  width: 100px;
  height: 100px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px 0 10px;
}
</style>
