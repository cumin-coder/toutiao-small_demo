<template>
      <el-card class="box-card">
        <div slot="header" class="header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to='/home'>首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人设置</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-row :gutter="24">
          <el-col :span="16">
            <el-form ref="form" :model="settings" :rules='rules' label-width="80px">
              <el-form-item label="编号">
                <el-input v-model="settings.id" disabled></el-input>
              </el-form-item>
              <el-form-item label="手机">
                <el-input v-model="settings.mobile" disabled></el-input>
              </el-form-item>
              <el-form-item label="媒体名称" prop="name">
                <el-input v-model="settings.name" ></el-input>
              </el-form-item>
              <el-form-item label="媒体介绍" prop="intro">
                <el-input type="textarea" v-model="settings.intro"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="settings.email"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSaveUserInfo">保存</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :offset="2" :span="6" class="col">
            <!--        头像-->
            <el-avatar v-loading='isLoading' shape="square" :size="180" fit="cover" :src="settings.photo"/>
            <el-button type="warning" icon="el-icon-edit" class="btn" @click="$refs.fileRef.click()" circle :disabled="btnDisabled"></el-button>
            <input type="file" ref="fileRef" @change="onInputData($event)" hidden/>
          </el-col>
        </el-row>
        <el-dialog
          title="剪裁图片"
          :visible.sync="dialogVisible"
          width="50%"
          append-to-body
          @opened="onOpenDialogHandler"
        >
          <div class="container_preview_image">
            <el-image
              id="preview_image"
              style="width: 300px; height: 200px"
              :src="editURL"
              fit="cover"
              ref="imageRef"
            />
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onAffirm">确 定</el-button>
          </span>
        </el-dialog>
      </el-card>
</template>

<script>
import { $getUserInfo, $editUserInfo, $editUserHead } from '../../api/setting'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import $globalBus from '../../utils/global-bus'
export default {
  name: 'Settings',
  data () {
    return {
      settings: {
        id: null, // 用户 ID
        name: '', // 用户名
        intro: '', // 简介
        photo: '', // 头像
        email: '', // 邮箱
        mobile: '' // 手机号
      },
      dialogVisible: false,
      editURL: '',
      cropper: null,
      isLoading: false,
      btnDisabled: false, // 上传图片按钮是否禁用
      rules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 1, max: 7, message: '长度在 1 到 7 个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '媒体介绍', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 在 Dialog 打开动画结束时的回调
    onOpenDialogHandler () {
      const image = document.getElementById('preview_image')
      // eslint-disable-next-line no-unused-vars
      // eslint-disable-next-line no-unused-vars,no-new
      this.cropper = new Cropper(image, {
        aspectRatio: 1, // 定义裁剪框的固定长宽比。默认情况下，裁剪框为自由比例。
        viewMode: 1,
        /**
         viewMode选项：
         0：没有限制
         1：限制裁切框不要超过画布的大小。
         2：限制最小画布大小以适合容器。如果画布和容器的比例不同，则最小画布将在其中一个维度中被多余的空间包围。
         3：限制最小画布尺寸以适合容器。如果画布和容器的比例不同，则容器将无法以一个尺寸容纳整个画布。
         */
        dragMode: 'none',
        /**
          dragMode选项：
         'crop'：创建一个新的裁剪框
         'move'：移动画布
         'none'：没做什么
         */
        /**
         * shirley comes form my word
         */
        cropBoxResizable: false // 启用以通过拖动来调整裁剪框的大小。
      })
    },
    onAffirm () {
      // 显示 Loading效果
      this.isLoading = true
      // 关闭 Dialog 窗口
      this.dialogVisible = false
      // 发起请求 更换头像
      this.editUserHead()
    },
    editUserHead () {
      // 上传中 禁用上传按钮
      this.btnDisabled = true
      /**
       * 图片剪裁
       */
      this.cropper.getCroppedCanvas().toBlob(async file => {
        const fd = new FormData()
        fd.append('photo', file)
        // 调用修改图片的接口请求
        const result = await $editUserHead(fd)
        const image = result.data.data.photo

        // 上传完成 开启上传按钮
        this.btnDisabled = false
        // 上传完成 结束 Loading 效果
        this.isLoading = false
        // 更新头像
        this.settings.photo = image

        // 全局事件总线
        $globalBus.$emit('user-info', this.settings)
      })
    },
    onInputData (e) {
      // 获取到选中图片的 URL
      const file = e.target.files[0]
      this.file = file
      this.editURL = window.URL.createObjectURL(file)
      // 弹出编辑图片框
      this.dialogVisible = true
      // 解决获取相同数据时不调用的情况
      this.$refs.fileRef.value = ''
    },
    onSaveUserInfo () {
      const { name, intro, email } = this.settings
      $editUserInfo({ name, intro, email }).then(result => {
        console.log(result)
        // 全局事件总线
        $globalBus.$emit('user-info', this.settings)
      })
    },
    async getUserInfo () {
      const result = await $getUserInfo()
      this.settings = result.data.data
      console.log(result)
    }
  },
  created () {
    // 获取用户信息
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>
  .col{
    position: relative;
    #preview_image{
      /* Ensure the size of the image fit the container perfectly */
        display: block;

        /* This rule is very important, please don't ignore this */
        max-width: 100%;
    }
    .btn{
      position: absolute;
      left: -5px;
      bottom: -10px;
    }
  }
</style>
