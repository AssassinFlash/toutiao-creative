<template>
  <div class="publish-container">
    <Suspense>
      <template #default>

        <a-card hoverable
                class="publish-title"
                :loading='loading'>
          <template #title>
            <a-breadcrumb separator=">">
              <a-breadcrumb-item>
                <router-link :to="{ path: '/' }">首页</router-link>
              </a-breadcrumb-item>
              <a-breadcrumb-item> {{ $route.params.id? '修改文章' : '发布文章' }} </a-breadcrumb-item>
            </a-breadcrumb>
          </template>
          <a-form :model="articleParams"
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol">
            <a-form-item label="标题">
              <a-input v-model:value='articleParams.title'
                       allow-clear />
            </a-form-item>
            <a-form-item label="内容">
              <!-- <a-textarea v-model:value='articleParams.content'
                          :auto-size="{ minRows: 4, maxRows: 8 }"
                          allow-clear
                          showCount></a-textarea> -->
            </a-form-item>
            <a-form-item label="封面">
              <a-radio-group name='articleImage'
                             v-model:value='articleParams.cover.type'>
                <a-radio :value="1">单图</a-radio>
                <a-radio :value="3">三图</a-radio>
                <a-radio :value="0">无图</a-radio>
                <a-radio :value="-1">自动</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="频道">
              <a-select style="width:300px"
                        placeholder="请选择频道"
                        v-model:value='articleParams.channel_id'
                        @change="articleParams.channel_id==='0'? articleParams.channel_id = null : articleParams.channel_id">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option v-for="option in channels"
                                 :value="option.id"
                                 :key="option.id">{{option.name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 14, offset: 1 }">
              <a-button type="primary"
                        @click="onPublish(false)">{{ $route.params.id? '修改' : '发表' }}</a-button>
              <a-button style="margin-left: 10px"
                        @click="onPublish(true)">存入草稿</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </template>
    </Suspense>
  </div>
</template>

<script>
import { ref, Suspense, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { getArticleChannels, addArticle, getArticle, updateArticle } from '@/api/article'
export default {
  name: 'PublishIndex',
  components: {
    Suspense
  },
  setup () {
    // 加载数据状态
    const loading = ref(false)
    // 获得修改按钮传来的数据
    const $route = useRoute()
    // 获得路由对象
    const $router = useRouter()

    // 加载文章频道
    const channels = ref([])
    const loadChannels = async function () {
      const res = await getArticleChannels()
      channels.value = res.data.data.channels
    }

    // 发布文章要求的数据
    const articleParams = ref({
      title: '', // 文章标题
      content: '', // 文章内容
      cover: { // 文章封面
        type: 0, // 封面类型 -1:自动，0:无图，1:1张，3:3张
        images: [] // 封面图片的地址
      },
      channel_id: null // 文章频道
    })
    // 发布文章的方法
    const onPublish = async function (draft = false) {
      loading.value = true
      // 如果是修改文章，则执行修改操作，否则执行添加操作
      if ($route.params.id) {
        await updateArticle($route.params.id, articleParams.value)
        message.success(`修改文章：${articleParams.value.title} 成功`)
      } else {
        await addArticle(articleParams.value, draft)
        message.success(`发布文章：${articleParams.value.title} 成功`, 3)
      }
      // 无论是修改文章还是发布文章，成功了之后都要跳转到内容管理页面
      $router.push({ name: 'Article' })
      loading.value = false
    }

    // 获得指定文章
    const loadArticle = async function (articleId) {
      loading.value = true
      const res = await getArticle(articleId)
      delete res.data.data.id
      articleParams.value = res.data.data
      loading.value = false
    }

    onBeforeMount(async () => {
      await loadChannels()
      // 由于发布和修改使用同一组件，
      // 要判断路由传参ID，则请求展示文章内容
      if ($route.params.id) {
        await loadArticle($route.params.id)
      }
    })
    return {
      labelCol: {
        style: {
          width: '50px'
        }
      },
      wrapperCol: {
        span: '14'
      },
      loading,
      articleParams,
      channels,
      onPublish
    }
  }
}
</script>

<style lang="less" scoped>
.publish-container {
  padding: 10px;
}
</style>
