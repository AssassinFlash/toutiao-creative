<template>
  <div class="image-container">
    <Suspense>
      <template #default>
        <a-card hoverable>
          <template #title>
            <a-breadcrumb separator=">">
              <a-breadcrumb-item>
                <router-link :to="{ name: 'Home' }">首页</router-link>
              </a-breadcrumb-item>
              <a-breadcrumb-item>素材管理</a-breadcrumb-item>
            </a-breadcrumb>
          </template>
          <div class="radioGroup">
            <a-radio-group v-model:value="imagesParams.collect"
                           button-style="solid"
                           size="large"
                           style="margin-bottom:20px"
                           @change="onRadioChange">
              <a-radio-button :value="false">全部</a-radio-button>
              <a-radio-button :value="true">收藏</a-radio-button>
            </a-radio-group>
            <a-button style="margin-right:30px"
                      type="primary"
                      shape="round"
                      size="large"
                      @click="uploadVisible=true">
              <template #icon>
                <CloudUploadOutlined />
                添加上传
              </template>
            </a-button>
          </div>
          <a-spin :spinning="spinning">
            <a-row>
              <a-col :xs="24"
                     :sm="12"
                     :md="8"
                     :lg="6"
                     class="image-display"
                     v-for="image in imagesArr"
                     :key="image.id">
                <div class='image'>
                  <img :src="image.url"
                       alt="">
                  <p class="icon-placement">
                    <a-button shape="circle"
                              type="text"
                              style="font-size: 20px;line-height:20px">
                      <HeartTwoTone twoToneColor="#eb2f96" />
                    </a-button>
                    <a-button shape="circle"
                              type="text"
                              style="font-size: 20px;line-height:20px">
                      <DeleteOutlined />
                    </a-button>
                  </p>
                </div>
              </a-col>
            </a-row>
            <a-drawer title="上传图片"
                      :width="360"
                      :visible="uploadVisible"
                      :body-style="{ paddingBottom: '80px' }"
                      @close="uploadVisible=false">
              <!-- 上传组件：
                          name是传给接口的参数名，为image
                          action为向接口发送请求，method自动为post
                          headers为接口设置请求头
              -->
              <a-upload v-model:file-list="imageList"
                        name="image"
                        list-type="picture-card"
                        class="avatar-uploader"
                        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
                        :headers="uploadHeader"
                        @change="handleChange">
                <img v-if="imageUrl"
                     :src="imageUrl"
                     alt="image" />
                <div v-else>
                  <loading-outlined v-if="正在上传"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
            </a-drawer>
            <div class='pagination'>
              <a-pagination showQuickJumper
                            v-model:current="imagesParams.page"
                            :total="totalCount"
                            :show-total="total => `总共 ${total} 条结果`"
                            @change="loadImages(imagesParams)" />
            </div>
          </a-spin>
        </a-card>
      </template>
    </Suspense>
  </div>
</template>

<script>
import {
  HeartTwoTone,
  DeleteOutlined,
  CloudUploadOutlined,
  PlusOutlined,
  LoadingOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { Suspense, ref, reactive, onBeforeMount } from 'vue'
import { getImages } from '@/api/image'
export default {
  name: 'ImageIndex',
  components: {
    Suspense,
    HeartTwoTone,
    DeleteOutlined,
    CloudUploadOutlined,
    PlusOutlined,
    LoadingOutlined
  },
  setup () {
    // 加载状态
    const spinning = ref(false)
    // 单选框切换时触发的事件
    const onRadioChange = async function () {
      imagesParams.page = 1
      await loadImages(imagesParams)
    }

    // 上传组件显示
    const uploadVisible = ref(false)
    // 上传图片列表
    const imageList = ref([])
    // 设置请求头
    const uploadHeader = {
      Authorization: `Bearer ${window.localStorage.getItem('user')}`
    }
    // 上传状态改变时触发的方法
    const handleChange = async image => {
      if (image.file.status === 'done') {
        // console.log(image.file)
        message.success(`'上传 ${image.file.name} 完毕'`, 3)
        imagesParams.page = 1
        await loadImages(imagesParams)
        setTimeout(() => {
          uploadVisible.value = false
        }, 500)
      }
      if (image.file.status === 'error') {
        message.error(`上传 ${image.file.name} 失败，可能文件格式不对或文件大小太大`)
        imagesParams.page = 1
        await loadImages(imagesParams)
        setTimeout(() => {
          uploadVisible.value = false
        }, 500)
      }
    }

    // 展示用户素材列表参数
    const imagesParams = reactive({
      collect: false,
      page: 1,
      per_page: 8
    })
    // 总页数
    const totalCount = ref(null)
    // 每页结果数组
    const imagesArr = ref([])
    const loadImages = async params => {
      spinning.value = true
      const res = await getImages(params)
      totalCount.value = res.data.data.total_count
      imagesArr.value = res.data.data.results
      spinning.value = false
      // console.log(res.data)
    }

    onBeforeMount(async () => {
      await loadImages(imagesParams)
    })

    return {
      spinning,
      onRadioChange,
      uploadVisible,
      imageList,
      uploadHeader,
      handleChange,
      imagesParams,
      totalCount,
      imagesArr,
      loadImages
    }
  }
}
</script>

<style lang="less" scoped>
.image-container {
  padding: 10px;

  .radioGroup {
    display: flex;
    justify-content: space-between;
  }

  .image-display {
    padding: 15px 20px 30px;

    .image {
      position: relative;
      width: 100%;
      height: 200px;

      img {
        width: 100%;
        height: 100%;
      }

      .icon-placement {
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: -14px;
        width: 100%;
        background: rgba(235, 235, 250, 0.4);
      }
    }
  }
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
}
</style>
