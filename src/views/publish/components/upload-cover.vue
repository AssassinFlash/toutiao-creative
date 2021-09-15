<template>
  <div class="upload-cover" @click="visible=true">
    <div class="cover-wrap">
      <img ref="coverImage" class="cover-image" :src="originCoverImage?originCoverImage:''" alt="">
    </div>
    <a-modal v-model:visible="visible" @ok="handleOk">
      <template #footer>
        <a-button key="back" @click="visible=false">返回</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
      </template>
      <a-tabs type="card" v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="素材库">素材库</a-tab-pane>
        <a-tab-pane key="2" tab="上传图片">
          <!--          监听图片上传-->
          <div style="margin-bottom: 10px">
            <label for="fileIpt">
              <input id="fileIpt" ref="fileIpt" type="file" @change="onFileChange">
            </label>
          </div>
          <img ref="previewImg" src="" width="100" alt="">
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<script>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { uploadImage } from '@/api/image'
import emitter from '@/utils/eventBus'

export default {
  name: 'upload-cover',
  props: ['selfKey', 'originCoverImage'],
  setup (props) {
    const visible = ref(false)
    const activeKey = ref('1')
    const loading = ref(false)

    const fileIpt = ref()
    const previewImg = ref()
    const coverImage = ref()
    const onFileChange = function () {
      // 获取文件对象
      const file = fileIpt.value.files[0]
      // 把文件对象处理生成图片链接
      previewImg.value.src = window.URL.createObjectURL(file)
    }
    const handleOk = async function () {
      loading.value = true
      // 判断tab是上传图片，且已经选择了图片，才能上传
      if (activeKey.value === '2') {
        if (!fileIpt.value.files[0]) {
          message.info('请先选择图片', 3)
        } else {
          // 调用uploadImg接口，要传FormData对象
          console.log(fileIpt.value.files[0])
          const fd = new FormData()
          fd.append('image', fileIpt.value.files[0])
          const res = await uploadImage(fd)
          coverImage.value.src = res.data.data.url
          // 通知父组件，把图片地址发送到父组件中
          emitter.emit('updateCover', {
            url: res.data.data.url,
            index: props.selfKey
          })
          // 关闭弹出层
          visible.value = false
          message.success('上传图片成功', 3)
          // 如果同一个文件就不会触发change事件，所以要清空
          fileIpt.value = ''
          previewImg.value.src = ''
        }
      }
      loading.value = false
    }
    return {
      visible,
      activeKey,
      loading,
      fileIpt,
      previewImg,
      coverImage,
      onFileChange,
      handleOk
    }
  }
}
</script>

<style lang="less" scoped>
.cover-wrap {
  width: 180px;
  height: 180px;
  border: 1px dashed #000;
  margin-right: 20px;
  margin-top: 10px;
  display: inline-block;

  .cover-image {
    width: 100%;
    height: 100%;
  }
}
</style>
