<template>
      <el-card class="box-card">
        <h1>我是和</h1>
        <!--        -first 面包屑导航-->
        <div slot="header">
          <div slot="header">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item to='/home'>首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{$route.query.id ? '编辑文章' : '发布文章'}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
        <!--        -last 面包屑导航-->
        <!--        表单-->
        <el-form ref="form" :model="article" :rules="rules" label-width="80px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="article.title" placeholder="请输入文章标题..."></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
<!--            <el-input type="textarea" v-model="article.content"></el-input>-->
            <el-tiptap v-model="article.content"
                       :extensions="extensions"
                       placeholder="请输入文章内容..."
                       lang="zh"
                       :height="500"
            />
          </el-form-item>
          <el-form-item label="封面">
            <el-radio-group v-model="article.cover.type">
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="1">单张</el-radio>
              <el-radio :label="3">三张</el-radio>
              <el-radio :label="-1">自动</el-radio>
            </el-radio-group>

<!--           Upload-->
            <UploadPicture></UploadPicture>

          </el-form-item>
          <el-form-item label="频道" prop="channel_id">
            <el-select v-model="article.channel_id" placeholder="请选择频道">
              <el-option
                v-for="channel in channels"
                :key="channel.id"
                :label="channel.name"
                :value="channel.id"
              ></el-option>
            </el-select>
          </el-form-item>
<!--          Button按钮-->
          <el-form-item>
            <el-button type="primary" @click="onArticle(false, 'form')" v-if="!$route.query.id">发布</el-button>
            <el-button @click="onArticle(true, 'form')" v-if="!$route.query.id">存入草稿</el-button>
            <el-button type="warning" @click="onEditArticle(false)" v-if="$route.query.id">编辑</el-button>
          </el-form-item>
        </el-form>
      </el-card>
</template>

<script>
import { $addArticle, $getArticle, $editArticle, $upLoadPicture } from '../../api/issue'
import { $getTextChannel } from '../../api/content'
import UploadPicture from '../../components/uploadPicture/UploadPicture'
import {
  ElementTiptap,
  // necessary extensions 必要的扩展
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TextColor,
  CodeView,
  Fullscreen,
  Image
} from 'element-tiptap'
// 富文本的样式
import 'element-tiptap/lib/index.css'
export default {
  name: 'Issue',
  components: {
    UploadPicture,
    'el-tiptap': ElementTiptap
  },
  data () {
    return {
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          type: 0, // 封面类型
          // 0-无图 1-单张 3-三张 -1-自动
          images: [] // 图片
        }, // 封面
        channel_id: null // 文章所属频道id
      }, // 发表内容存储的对象
      channels: [], // 频道大全
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入描述信息', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请输入频道 不能为空', trigger: 'blur' }
        ]
      }, // 表单验证的规则
      article_id: this.$route.query.id, // 编辑某一个文章的 ID
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 3 }),
        new Bold({ bubble: true }),
        new Underline({ bubble: true, menubar: false }),
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TextColor(),
        new CodeView(),
        new Fullscreen(),
        // 将 base64位 图片转换成 浏览器可识别的普通 url 地址
        new Image({
          // 默认图片会生成 base64
          async uploadRequest (file) {
            const fd = new FormData()
            fd.append('image', file)
            const result = await $upLoadPicture(fd)
            return result.data.data.url
          }
        })
      ] // 富文本的每一项，可按顺序排列
    }
  },
  methods: {
    onArticle (draft, formRef) {
      this.$refs[formRef].validate((valid) => {
        if (valid) {
          // 验证通过
          // 请求数据，发布新文章
          this.addArticleRequest(draft)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addArticleRequest (draft) {
      $addArticle(this.article, draft).then(result => {
        // 跳转到内容管理
        this.$router.push('/content')
        // 发布成功
        this.$message({
          type: 'success',
          message: '发布成功'
        })
      })
    },
    async getTextChannel () {
      const result = await $getTextChannel()
      const { channels } = result.data.data
      this.channels = channels
    },
    async getEditArticleContent () {
      // 如果参数没有 ID 表示是发表文章状态，所有不发起请求
      if (!this.article_id) return
      const result = await $getArticle(this.article_id)
      this.article = result.data.data
    },
    // 编辑文章（修改）
    async onEditArticle (draft) {
      const result = await $editArticle(this.article_id, draft, this.article)
      const message = result.data.message
      await this.$message({
        type: 'success',
        message: `修改成功 ${message}`
      })
      await this.$router.replace('/content')
    }
  },
  created () {
    // 请求数据，获取频道大全
    this.getTextChannel()
    // 请求数据，获取编辑内容
    this.getEditArticleContent()
  }
}
</script>

<style scoped>

</style>
