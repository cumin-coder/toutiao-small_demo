<template>
      <el-card class="box-card">
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
            <el-input v-model="article.title"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input type="textarea" v-model="article.content"></el-input>
          </el-form-item>
          <el-form-item label="封面">
            <el-radio-group v-model="article.cover.type">
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="1">单张</el-radio>
              <el-radio :label="3">三张</el-radio>
              <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道">
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
import { $addArticle, $getArticle, $editArticle } from '../../api/issue'
import { $getTextChannel } from '../../api/content'
export default {
  name: 'Issue',
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
        ]
      }, // 表单验证的规则
      article_id: this.$route.query.id // 编辑某一个文章的 ID
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
