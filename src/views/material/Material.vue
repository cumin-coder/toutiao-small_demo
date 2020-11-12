<template>
    <div class="material-container">
      <el-card class="box-card">
        <div slot="header" class="header">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item to='/home'>首页</el-breadcrumb-item>
              <el-breadcrumb-item>素材管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="collection">
          <el-radio-group v-model="collection" size="mini" @change="onRadioChange">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <el-button type="success" size="mini" @click="onUploadMaterial">上传素材</el-button>
      </div>
        <el-row :gutter="20" v-loading="isLoading">
            <el-col
              :xs="12"
              :sm="6"
              :md="6"
              :lg="4"
              v-for="img in images"
              :key="img.id"
              class="col"
            >
            <el-image
              :src="img.url"
              fit="cover"
              :preview-src-list="previewArr"
            >
            </el-image>

            <div class="del2collect">
              <!--              收藏-->
              <span :class="{
                'el-icon-star-on' : img.is_collected,
                'el-icon-star-off' : !img.is_collected
              }"
                    @click="onClickStar(img)"
              />
              <!--              删除-->
              <span class="el-icon-delete-solid" @click="onClickDel(img.id)"></span>
            </div>

            </el-col>
          </el-row>
      </el-card>

<!--      分页-->
    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      @current-change="onCurrentPage"
      :page-size="currentCount"
      :current-page.sync="currentPage"
      :total="totalCount">
    </el-pagination>
<!--      上传-->
    <el-dialog title="上传图片素材" :visible.sync="dialogTableVisible" append-to-body center>
      <el-upload
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :on-success="onUploadSuccess"
        :on-error="onUploadError"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
    </div>
</template>

<script>
import { $getImages, $StarImage, $DelImage } from '../../api/material'
import _ from 'lodash'
export default {
  name: 'Material',
  data () {
    const token = localStorage.getItem('token')
    return {
      collection: false, // 默认显示全部图片
      dialogTableVisible: false, // 默认不显示弹窗
      images: [], // all picture the store
      uploadHeaders: {
        Authorization: `Bearer ${token}`
      },
      previewArr: [], // 图片预览
      currentPage: 1, // 当前页
      currentCount: 12, // 每页显示条目个数
      totalCount: 0, // 总条数
      collectSwitch: false,
      isLoading: false
    }
  },
  created () {
    // 发起请求获取全部图片素材
    this.getAllImage()
  },
  methods: {
    // 收藏
    onClickStar: _.throttle(function (img) {
      $StarImage(img.id, !img.is_collected).then((res) => {
        // 当没有已收藏时 跳转到全部区域 并 获取全部区域数据
        if (this.images.length === 1) {
          this.collection = false
          this.getAllImage(1)
        }
        img.is_collected = !img.is_collected
        this.getAllImage(1, this.collectSwitch)
      })
    }, 1000),
    // 删除
    async onClickDel (id) {
      await $DelImage(id)
      this.$message({
        type: 'success',
        message: '删除成功'
      })
      this.getAllImage(1)
    },
    onCurrentPage (currentPage) {
      this.getAllImage(currentPage, this.collection)
    },
    async getAllImage (page, collect = false) {
      // 开启Loading样式
      this.isLoading = true
      const result = await $getImages(collect, page, this.currentCount)
      const { results, total_count: totalCount } = result.data.data
      this.images = results
      this.totalCount = totalCount
      // 图片预览数组
      this.images.forEach((item) => {
        this.previewArr.push(item.url)
      })
      // 结束Loading样式
      this.isLoading = false
    },
    // 收藏于全部图片的切换
    onRadioChange (valid) {
      this.currentPage = 1
      this.getAllImage(1, valid)
      this.collectSwitch = valid
    },
    onUploadMaterial () {
      this.dialogTableVisible = true
    },
    // 上传成功的钩子
    onUploadSuccess (response, file, fileList) {
      this.$message({
        type: 'success',
        message: '上传成功'
      })
      this.getAllImage(1)
      this.dialogTableVisible = false
    },
    // 上传失败的 钩子(hook)
    onUploadError (err, file, fileList) {
      if (err) {
        this.$message({
          type: 'error',
          message: '上传失败'
        })
        this.getAllImage(1)
        this.dialogTableVisible = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.collection{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.col{
  position: relative;
  .el-image{
    width: 200px;
    height: 150px;
  }
  .del2collect{
    position: absolute;
    top: 121px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 200px;
    height: 30px;
    background: #28445557;
    color: #fff;
    font-size: 20px;
  }
}

.el-icon-star-on{
  color: red;
}

.pagination{
  margin-top: 10px;
}
</style>
