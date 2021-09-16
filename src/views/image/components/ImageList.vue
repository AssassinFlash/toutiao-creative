<template>
  <div class="image-container">
    <div class="radioGroup">
      <a-radio-group
        v-model:value="imagesParams.collect"
        @change="handleRadioChange"
        button-style="solid"
        size="large"
        style="margin-bottom:20px">
        <a-radio-button :value="false">全部</a-radio-button>
        <a-radio-button :value="true">收藏</a-radio-button>
      </a-radio-group>
      <a-spin :spinning="spinning"></a-spin>
      <a-row>
        <a-col :lg="4" :md="6" :sm="12" :xs="24"
               class="image-display"
               v-for="(image,index) in imagesArr"
               :key="index"
        >
          <div class="image" @click="checked=index">
            <img :src="image.url" alt="">
            <div class="mask" v-show="checked===index">
              <CheckCircleTwoTone twoToneColor="#52c41a"/>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-pagination
        v-model:current="imagesParams.page"
        :total="totalCount"
        :show-total="total=>`总共 ${total} 张图片`"
        @change="handleChangePage"
        style="margin-top: 20px"/>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onBeforeMount } from 'vue'
import { getImages } from '@/api/image'
import { CheckCircleTwoTone } from '@ant-design/icons-vue'

export default {
  name: 'ImageList',
  components: {
    CheckCircleTwoTone
  },
  setup () {
    const checked = ref(null)
    const spinning = ref(false)
    // 图片请求参数
    const imagesParams = reactive({
      collect: false,
      page: 1,
      per_page: 10
    })
    // 总页数
    const totalCount = ref(null)
    // 每页结果数组
    const imagesArr = ref([])
    const loadImages = async function () {
      spinning.value = true
      const res = await getImages(imagesParams)
      imagesArr.value = res.data.data.results
      totalCount.value = res.data.data.total_count
      spinning.value = false
    }
    const handleChangePage = function () {
      loadImages()
    }
    const handleRadioChange = function () {
      loadImages()
    }
    onBeforeMount(() => {
      loadImages()
    })
    return {
      checked,
      spinning,
      totalCount,
      imagesArr,
      imagesParams,
      handleChangePage,
      handleRadioChange
    }
  }
}
</script>

<style lang="less" scoped>
.image {
  position: relative;
  height: 120px;

  img {
    width: 100%;
    height: 100%;
  }
}

.mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .5);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
}

.image-display {
  margin: 20px 20px 0 0;
}
</style>
