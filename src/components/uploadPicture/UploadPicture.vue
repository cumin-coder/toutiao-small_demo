<template>
  <div class="container">
    <el-upload
      v-if="typeCover > 0"
      action="#"
      :show-file-list="false"
      :limit="typeCover"
      :on-progress="handlePictureCardProgress"
      :on-success="handlePictureCardSuccess"
      >
      <img v-if="url.length > 0" :src="url" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { $upLoadPicture } from '../../api/issue'
export default {
  name: 'UploadPicture',
  data () {
    return {
      url: ''
    }
  },
  props: {
    typeCover: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  methods: {
    async handlePictureCardProgress (event, file, fileList) {
      const formData = new FormData()
      formData.append('image', file.raw)
      const result = await $upLoadPicture(formData)
      const { url } = result.data.data
      this.url = url
      this.$emit('onPushImage', url)
    },
    handlePictureCardSuccess (file) {
      console.log(file)
    }
  }
}
</script>

<style scoped>

</style>
