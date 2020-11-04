<template>
  <div class="container">
    <el-upload
      action="#"
      list-type="picture-card"
      :limit="3"
      :file-list="fileList"
      :on-progress="handlePictureCardProgress"
      :on-success="handlePictureCardSuccess"
      >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { $upLoadPicture } from '../../api/issue'
export default {
  name: 'UploadPicture',
  data () {
    return {
      dialogImageUrl: '',
      token: localStorage.getItem('token'),
      fileList: []
    }
  },
  methods: {
    async handlePictureCardProgress (event, file, fileList) {
      const formData = new FormData()
      formData.append('image', file.raw)
      const result = await $upLoadPicture(formData)
      const { url, id } = result.data.data
      this.fileList.push({
        name: id,
        url
      })
    },
    handlePictureCardSuccess (file) {
      console.log(file)
    }
  }
}
</script>

<style scoped>

</style>
