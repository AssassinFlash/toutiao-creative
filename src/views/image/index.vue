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
                    <a-button :disabled="image.statusDisabled"
                              shape="circle"
                              type="text"
                              @click="onCollect(image)"
                              style="font-size: 20px;line-height:20px">
                              <!-- @click="onCollect(image.id,image.is_collected)"> -->
                      <HeartOutlined :style="{color:'#eb2f96'}"
                                     v-show="!image.is_collected" />
                      <HeartFilled :style="{color: '#F20077'}"
                                   v-show="image.is_collected" />
                    </a-button>
                    <a-popconfirm title="确定要删除该图片吗？"
                                  ok-text="确认删除"
                                  cancel-text="返回"
                                  @confirm="onDelete(image.id)">
                      <DeleteOutlined class='delete-image' />
                    </a-popconfirm>
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
                        :multiple="false"
                        list-type="picture-card"
                        class="avatar-uploader"
                        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
                        :headers="uploadHeader"
                        @change="handleChange">
                <div>
                  <loading-outlined v-if="spinning">正在上传</loading-outlined>
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
  HeartOutlined,
  HeartFilled,
  DeleteOutlined,
  CloudUploadOutlined,
  PlusOutlined,
  LoadingOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { Suspense, ref, reactive, onBeforeMount } from 'vue'
import { getImages, collectImage, deleteImage } from '@/api/image'
export default {
  name: 'ImageIndex',
  components: {
    Suspense,
    HeartOutlined,
    HeartFilled,
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
      console.log(res.data)
    }

    // 点击收藏事件
    const onCollect = async function (image) {
      // 已收藏，则取消收藏
      // 未收藏，则添加收藏
      image.statusDisabled = true
      spinning.value = true
      const res = await collectImage(image.id, !image.is_collected)
      console.log(res.data)
      if (res.data.data.collect) {
        message.success('收藏图片成功')
      } else {
        message.success('取消收藏图片成功')
      }
      await loadImages(imagesParams)
      image.statusDisabled = false
    }

    // 删除图片事件
    const onDelete = async function (imageID) {
      const res = await deleteImage(imageID)
      if (res.status === 204) {
        message.success('删除图片成功')
        await loadImages(imagesParams)
      } else {
        message.error('删除图片失败')
      }
    }

    onBeforeMount(async () => {
      await loadImages(imagesParams)
    })

    return {
      spinning, // 加载页面状态
      onRadioChange, // 全部还是收藏单选框
      uploadVisible, // 上传抽屉组件是否显示
      imageList, // 上传图片列表
      uploadHeader, // 上传请求头
      handleChange, // 上传完成与失败时的方法
      imagesParams, // 接口要求的图片参数
      totalCount, // 接口返回的图片总数
      imagesArr, // 接口返回的当前页图片数组
      loadImages, // 向接口请求返回图片的方法
      onCollect,
      onDelete
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
.delete-image {
  font-size: 20px;
  line-height: 20px;
  padding: 4px 0 0 20px;
}
</style>
