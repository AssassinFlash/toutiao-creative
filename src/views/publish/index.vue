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
              <a-breadcrumb-item> {{ $route.params.id ? '修改文章' : '发布文章' }}</a-breadcrumb-item>
            </a-breadcrumb>
          </template>
          <a-form ref="publishForm"
                  :model="articleParams"
                  :rules='formRules'
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol">
            <a-form-item label="标题"
                         name="title">
              <a-input v-model:value='articleParams.title'
                       allow-clear/>
            </a-form-item>
            <a-form-item label="内容"
                         name="content" style="min-height: 200px">
              <!--              <a-textarea v-model:value='articleParams.content'-->
              <!--                          :auto-size="{ minRows: 4, maxRows: 8 }"-->
              <!--                          allow-clear-->
              <!--                          showCount></a-textarea>-->
              <QuillEditor style="min-height: 200px;max-height: 300px;overflow: auto"
                           v-model:content='articleParams.content'
                           theme="snow"
                           :toolbar="toolbarOptions"
                           :option="editorOption"
                           placeholder="请输入文章内容"
                           contentType="html"
              >
              </QuillEditor>
            </a-form-item>
            <a-form-item label="封面">
              <a-radio-group name='articleImage'
                             v-model:value='articleParams.cover.type'
              >
                <a-radio :value="1" @click="passValue(1)">单图</a-radio>
                <a-radio :value="3" @click="passValue(3)">三图</a-radio>
                <a-radio :value="0">无图</a-radio>
                <!--<a-radio :value="-1">自动</a-radio>-->
              </a-radio-group>
              <div style="display: flex">
                <UploadCover :originCoverImage="articleParams.cover.images[index]"
                             :selfKey="index"
                             v-for="(cover,index) in articleParams.cover.type"
                             :key="cover">
                </UploadCover>
              </div>
            </a-form-item>
            <a-form-item label="频道"
                         name='channel_id'>
              <a-select style="width:300px"
                        placeholder="请选择频道"
                        v-model:value='articleParams.channel_id'
                        @change="articleParams.channel_id==='0'? articleParams.channel_id = null : articleParams.channel_id">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option v-for="option in channels"
                                 :value="option.id"
                                 :key="option.id">{{ option.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 14, offset: 1 }">
              <a-button type="primary"
                        @click="onValidate()">{{ $route.params.id ? '修改' : '发表' }}
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </template>
    </Suspense>
  </div>
</template>

<script>
import { ref, Suspense, onBeforeMount, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { getArticleChannels, addArticle, getArticle, updateArticle } from '@/api/article'
import { useFormRules } from '@/components/Home/usePublish'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import UploadCover from '@/views/publish/components/upload-cover'
import emitter from '@/utils/eventBus'

export default {
  name: 'PublishIndex',
  components: {
    Suspense,
    QuillEditor,
    UploadCover
  },
  data: function () {
    return {
      editorOption: {
        modules: {
          toolbar: {
            container: this.toolbarOptions, // 工具栏
            handlers: {
              image: function () {
                console.log('点击了图片')
              }
            }
          }
        }
      }
    }
  },
  setup () {
    const store = useStore()
    // 工具栏配置
    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'] // remove formatting button
    ]
    // 加载表单验证对象
    const formRules = useFormRules()
    // 获取表单元素
    const publishForm = ref()

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
      content: '<em>这是斜体</em><p>这是段落</p>', // 文章内容，富文本编译器是HTML内容
      cover: { // 文章封面
        type: 0, // 封面类型 -1:自动，0:无图，1:1张，3:3张
        images: [] // 封面图片的地址
      },
      channel_id: null // 文章频道
    })
    // 发布文章的方法
    const onPublish = async function (draft = false) {
      // 如果是修改文章，则执行修改操作，否则执行添加操作
      if ($route.params.id) {
        await updateArticle($route.params.id, articleParams.value)
        message.success(`修改文章：${articleParams.value.title} 成功`)
      } else {
        await addArticle(articleParams.value, draft)
        message.success(`发布文章：${articleParams.value.title} 成功`, 3)
      }
      // 无论是修改文章还是发布文章，成功了之后都要跳转到内容管理页面
      await $router.push({ name: 'Article' })
      loading.value = false
    }

    // 手动触发表单验证
    const onValidate = function () {
      publishForm.value.validate().then(() => {
        onPublish(false)
      }).catch(err => {
        message.error(`表单验证失败${err}`, 3)
      })
    }

    // 获得指定文章
    const loadArticle = async function (articleId) {
      loading.value = true
      const res = await getArticle(articleId)
      delete res.data.data.id
      articleParams.value = res.data.data
      loading.value = false
    }

    // 传递单图还是三图参数
    const passValue = function (value) {
      store.commit('setCoverIndex', value)
    }

    onBeforeMount(async () => {
      await loadChannels()
      // 由于发布和修改使用同一组件，
      // 要判断路由传参ID，则请求展示文章内容
      if ($route.params.id) {
        await loadArticle($route.params.id)
      }
    })
    onMounted(() => {
      // const imgBtn = document.querySelector('#app > section > section > main > div > div > div.ant-card-body > form > div:nth-child(2) > div.ant-col.ant-col-20.ant-form-item-control > div > div > div.ql-toolbar.ql-snow > span:nth-child(11) > button.ql-image')
      // imgBtn.addEventListener('click', function () {
      //   console.log(1)
      // })
      emitter.on('updateCover', (data) => {
        console.log(data)
        articleParams.value.cover.images[data.index] = data.url
      })
    })
    return {
      toolbarOptions,
      labelCol: {
        style: {
          width: '50px'
        }
      },
      wrapperCol: {
        span: '20'
      },
      formRules,
      publishForm,
      loading,
      articleParams,
      channels,
      onValidate,
      passValue
    }
  }
}
</script>

<style lang="less" scoped>
.publish-container {
  padding: 10px;
}
</style>
