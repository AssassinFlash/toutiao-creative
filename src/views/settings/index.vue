<template>
  <div class="settings-container">
    <a-card>
      <template #title>
        <a-breadcrumb separator=">">
          <a-breadcrumb-item>
            <router-link :to="{name: 'Home'}">首页</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>个人设置</a-breadcrumb-item>
        </a-breadcrumb>
      </template>
      <Suspense>
        <template #default>
          <a-spin :spinning="spinning">
            <a-row>
              <a-col :span="16">
                <a-form ref="formCom"
                        :model="userProfile"
                        :rules="userFormRules"
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol">
                  <a-form-item label="用户编号">
                    <span>{{ userProfile.id }}</span>
                  </a-form-item>
                  <a-form-item label="手机">
                    {{ userProfile.mobile }}
                  </a-form-item>
                  <a-form-item name="name" label="用户名称">
                    <a-input v-model:value="userProfile.name" allow-clear>
                      <template #prefix>
                        <user-outlined type="user"/>
                      </template>
                    </a-input>
                  </a-form-item>
                  <a-form-item name="intro" label="用户简介">
                    <a-textarea v-model:value="userProfile.intro" allow-clear/>
                  </a-form-item>
                  <a-form-item name="email" label="邮箱">
                    <a-input v-model:value="userProfile.email" allow-clear/>
                  </a-form-item>
                  <a-form-item :wrapper-col="{ span: 16, offset: 4 }">
                    <a-button type="primary" @click="onUpdateUser"
                              :disabled="spinning">保存设置
                    </a-button>
                  </a-form-item>
                </a-form>
              </a-col>
              <a-col :span="8">
                <!--通过ref获得input手动调用input的点击事件-->
                <div class="avatar-image" @click="file.click()">
                  <a-avatar shape="square"
                            :size="{ xs: 80, sm: 120, md: 160, lg: 200, xl: 240, xxl: 280 }">
                    <template #icon>
                      <img :src="userProfile.photo" alt="">
                    </template>
                  </a-avatar>
                  <p class="avatar-desc">点击修改头像</p>
                  <input type="file"
                         hidden
                         ref="file"
                         @change="onFileChange(onDialogOpened)"
                  >
                  <a-modal
                    title="修改头像"
                    v-model:visible="visible"
                    :confirm-loading="confirmLoading"
                    okText="确定"
                    cancel-text="返回"
                    :afterClose="onDialogClosed"
                    @ok="handleOk"
                  >
                    <div class="preview-image">
                      <img :src="previewImage" alt="" ref="image">
                    </div>
                  </a-modal>
                </div>
              </a-col>
            </a-row>

          </a-spin>
        </template>
      </Suspense>
    </a-card>
  </div>
</template>

<script>
import { UserOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { getUserProfile, updateUserphoto, updateUser } from '@/api/user'
import { useFormRules } from '@/components/Settings/useSettingsValidate'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { Suspense, ref, onBeforeMount } from 'vue'

export default {
  name: 'SettingsIndex',
  components: {
    Suspense,
    UserOutlined
  },
  setup (props, context) {
    // 加载状态
    const spinning = ref(false)

    // 表单验证
    const userFormRules = useFormRules()

    // 获取表单组件
    const formCom = ref()

    // 获取上传头像组件
    const file = ref()
    // 点击上传时显示对话框
    const visible = ref(false)
    // 定义预览图片
    const previewImage = ref('')
    // 获取预览图片节点
    const image = ref()
    // 点击确认时状态
    const confirmLoading = ref(false)
    // 上传头像改变时触发
    const onFileChange = function (callback) {
      // 处理图片预览，获得选择的图片对象
      // 首先file.value获取ref对应的input元素，它是一个对象，然后获得files对象
      // 然后使用对象URL显示图片，URL.createObjectURL专门制造出url，这个url就是图片的url了
      // 比如说：这个url返回的是blob:http://xxxxxxx
      previewImage.value = window.URL.createObjectURL(file.value.files[0])
      // 解决选择相同头像不触发change事件的问题
      file.value.value = ''
      // 展示弹出层
      visible.value = true
      // 设置回调函数是因为预览图片要完全显示出来，裁切器的初始化才能正常运行
      // 这是因为打开对话框这一过程需要时间，这是一个动画加载的时间，此时预览图片未完全显示
      // 就会导致裁切器的初始化失败，导致程序报错
      callback()
    }
    // 对话框完全加载完时的事件
    // 定义裁切器
    let cropper
    const onDialogOpened = function () {
      // 设置定时器保证对话框动画加载完成后才开始初始化裁切器
      setTimeout(() => {
        // 又有新的问题：第一次初始化完以后，如果预览裁切的图片发生了变化，那么裁切器的图片不会更新
        // 需要使用裁切器.replace方法，或者销毁裁切器，重新初始化
        // 初始化裁切器
        cropper = new Cropper(image.value, {
          // 裁切器比例
          aspectRatio: 1,
          // 限制裁切器移出图片
          viewMode: 1,
          // 限制可移动预览图片
          dragMode: 'none',
          // 取消裁切器本身背景
          background: false,
          // 取消裁切器的大小设置
          cropBoxResizable: false
        })
      }, 500)
    }
    // 对话框关闭时触发的事件
    const onDialogClosed = function () {
      // 销毁裁切器
      cropper.destroy()
    }
    // 确认上传时触发
    const handleOk = async function () {
      confirmLoading.value = true
      // 获取裁切的图片对象
      cropper.getCroppedCanvas().toBlob(file => {
        // 接口要求传formData对象
        const fd = new FormData()
        // 接口要求字段名为photo
        fd.append('photo', file)
        // 请求更新用户头像
        updateUserphoto(fd).then(res => {
          if (res.status === 201) {
            message.success('修改用户头像成功')
          } else {
            message.error('修改用户头像失败')
          }
          confirmLoading.value = false
          visible.value = false
          loadUserProfile()
          // 子路由向父路由通信，为了修改完成后更新视图时把顶部的用户头像也一并更新
          context.emit('updateUserProfile')
        })
      })
    }

    // 获取用户资料
    const userProfile = ref({})
    const loadUserProfile = async () => {
      spinning.value = true
      const res = await getUserProfile(window.localStorage.getItem('user'))
      userProfile.value = res.data.data
      spinning.value = false
    }

    // 更新用户资料
    const patchUser = async function () {
      spinning.value = true
      const {
        name,
        intro,
        email
      } = userProfile.value
      await updateUser({
        name,
        intro,
        email
      })
      spinning.value = false
    }

    // 保存按钮点击事件
    const onUpdateUser = async function () {
      // 手动触发表单验证
      formCom.value.validate().then(() => {
        console.log('表单验证成功')
        patchUser()
        // 同样的，需要子路由向父路由通信，表示一并更新
        context.emit('updateUserProfile')
      }).catch(error => {
        console.log(`表单验证失败 ${error}`)
      })
    }
    onBeforeMount(async () => {
      await loadUserProfile()
    })
    return {
      labelCol: {
        style: {
          width: '100px'
        }
      },
      wrapperCol: {
        span: 16
      },
      spinning,
      file,
      visible,
      confirmLoading,
      previewImage,
      image,
      onDialogOpened,
      onDialogClosed,
      onFileChange,
      handleOk,
      formCom,
      userFormRules,
      userProfile,
      onUpdateUser
    }
  }
}
</script>

<style lang="less" scoped>
.settings-container {
  padding: 10px;

  .avatar-image {
    cursor: pointer;

    .avatar-desc {
      margin-top: 20px;
      text-indent: 60px;
    }
  }

}

.preview-image {
  img {
    display: block;
    max-width: 100%;
    height: 250px
  }
}
</style>
