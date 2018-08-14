<template>
  <div class="app-container">
    <loading :active.sync="loading"></loading>
    <el-form data-vv-scope="form-1" label-width="120px">
      <el-form-item label="*專題名稱" :class="{'is-error':errors.has('form-1.title')}">
        <el-input type="text" v-model="form.title" name="title"  data-vv-as="專題名稱" v-validate="'required'" class="form-control" ></el-input>
        <span v-show="errors.has('form-1.title')" class="el-form-item__error">{{ errors.first('form-1.title') }}</span>
      </el-form-item>
      <el-form-item label="*分類" :class="{'is-error':errors.has('form-1.topic_category_id')}">
        <el-select v-model="form.topic_category_id" placeholder="請選擇" name="topic_category_id" data-vv-as="分類" v-validate="'required'">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id">
          </el-option>
        </el-select>
        <span v-show="errors.has('form-1.topic_category_id')" class="el-form-item__error">{{ errors.first('form-1.topic_category_id') }}</span>
      </el-form-item>
      <el-form-item label="*作者" :class="{'is-error':errors.has('form-1.author_id')}">

        <el-select filterable v-model="form.author_id" placeholder="請選擇" name="author_id" data-vv-as="作者" v-validate="'required'">
          <el-option
            v-for="author in authors"
            :key="author.id"
            :label="author.name"
            :value="author.id">
          </el-option>
        </el-select>
        <span v-show="errors.has('form-1.author_id')" class="el-form-item__error">{{ errors.first('form-1.author_id') }}</span>
      </el-form-item>
      <el-form-item label="是否顯示">
        <el-switch v-model="form.is_online"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item label="*簡述" :class="{'is-error':errors.has('form-1.description')}">
        <el-input type="textarea" v-model="form.description" name="description" data-vv-as="簡述" v-validate="'required'" class="form-control"></el-input>
        <span v-show="errors.has('form-1.description')" class="el-form-item__error">{{ errors.first('form-1.description') }}</span>
      </el-form-item>
      <el-form-item  label="專題圖片">
        <div v-if="!image">
          <file-upload
            class="el-button"
            extensions="jpg,gif,png"
            accept="image/*"
            v-model="files"
            @input-file="inputFile"
            ref="upload">
            <i class="el-icon-picture"></i>選擇圖檔
          </file-upload>
        </div>
        <div v-else>
          <div class="imageListGroup">
            <div class="ct">
              <img :src="image" width="200"/>
              <el-button type="info" icon="el-icon-delete" @click.prevent="removeImage"></el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item  label="關聯文章">
        <div>
          <el-select
            @change="funClickArticle"
            v-model="articleKeyword"
            size="'medium'"
            filterable
            remote
            reserve-keyword
            placeholder="請輸入文章ID或標題"
            :remote-method="fetchRsSearchArticle"
            :loading="loading">
            <el-option
              v-for="item in articleOptions"
              :key="item.id"
              :label="item.title"
              :value="item">
            </el-option>
          </el-select>
          <ul>
            <li v-for="(article, index)  in articles" :key="article.id">
              {{ article.id }}-{{ article.title }}
              <el-button type="danger" icon="el-icon-delete" circle  @click="funDelArticle(index)"></el-button>
            </li>
          </ul>
        </div>
      </el-form-item>
      <el-form-item  label="標籤">
        <div>
          <vue-tags-input
            style="max-width: 100%"
            v-model="tag"
            :tags="tags"
            :autocomplete-items="autocompleteItems"
            @tags-changed="funTag">
          </vue-tags-input>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:10%;" @click.native.prevent="checkForm('form-1')">儲存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getTopicCategoryList, getTopic, putTopic } from '@/api/topic'
import { getRsSearchTag } from '@/api/tag'
import { getRsSearchArticle } from '@/api/article'
import { getAllAuthor } from '@/api/author'
import FileUpload from 'vue-upload-component'
import VueTagsInput from '@johmun/vue-tags-input'
export default {
  data() {
    return {
      loading: false,
      topicId: this.$route.params.id,
      categories: [],
      authors: [],
      form: { },
      files: [],
      image: '',
      tag: '',
      tags: [],
      autocompleteItems: [],
      debounce: null,
      articleOptions: [],
      articleKeyword: '',
      articles: []
    }
  },
  components: {
    FileUpload, VueTagsInput
  },
  watch: {
    'tag': 'fetchRsSearchTag'
  },
  created() {
    this.fetchTopicCategoryList()
    this.fetchAuthorList()
    this.fetchTopic()
  },
  computed: {
    articleIds() {
      return this.articles.map(item => {
        return item.id
      })
    }
  },
  methods: {
    fetchTopic() {
      this.loading = true

      getTopic(this.topicId).then(response => {
        const respData = response.data

        this.form = respData.topic

        this.form.is_online = !!(respData.topic.is_online)

        this.articles = this.form.article.map(item => {
          return { 'id': item.id, 'title': item.title }
        })

        this.tags = this.form.tag.map(item => {
          return { 'text': item.name, 'tiClasses': ['valid'] }
        })

        this.image = respData.topic.photo.file_url

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    fetchTopicCategoryList() {
      this.loading = true
      getTopicCategoryList({ is_online: 1 }).then(response => {
        const respData = response.data

        this.categories = respData.topic_categories

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    fetchAuthorList() {
      this.loading = true
      getAllAuthor().then(response => {
        const respData = response.data
        this.authors = respData.authors
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    funTag(newTags) {
      this.autocompleteItems = []
      this.tags = newTags
    },
    fetchRsSearchTag() {
      if (this.tag.length === 0) return
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        if (this.tag.length === 0) return
        getRsSearchTag(this.tag).then(response => {
          const respData = response.data

          if (respData.length < 1) {
            this.autocompleteItems = []
          } else {
            this.autocompleteItems = respData.tags.map(item => {
              return { text: item.name }
            })
          }
        })
      }, 600)
    },
    fetchRsSearchArticle(query) {
      if (query !== '') {
        clearTimeout(this.debounce)
        this.debounce = setTimeout(() => {
          getRsSearchArticle(query).then(response => {
            const respData = response.data
            if (respData.length < 1) {
              this.articleOptions = []
            } else {
              this.articleOptions = respData.articles
            }
          })
        }, 200)
      } else {
        this.articleOptions = []
      }
    },
    funClickArticle(article) {
      if (!this.articleIds.includes(article.id)) {
        this.articles.push(article)
      }
      this.articleOptions = []
      this.articleKeyword = ''
    },
    funDelArticle(index) {
      this.articles.splice(index, 1)
    },
    checkForm(scope) {
      this.$validator.validateAll(scope).then((result) => {
        if (result) {
          this.loading = true

          const resData = { topic: Object.assign({}, this.form) }
          resData.topic.is_online = (resData.topic.is_online) ? 1 : 0

          const resFile = (this.files[0]) ? this.files[0].file : false

          resData.tag_names = this.tags.map(item => {
            return item.text
          })

          resData.article_ids = this.articleIds

          putTopic(this.topicId, resData, resFile).then(response => {
            const respData = response.data

            this.loading = false
            if (respData === '') {
              this.$router.push({ name: 'TopicList' })
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    inputFile(newFile, oldFile) {
      // auto upload
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (!this.$refs.upload.active) {
          this.createImage(this.files[0].file)
        }
      }
    },
    createImage(file) {
      var reader = new FileReader()

      reader.onload = (e) => {
        this.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeImage: function() {
      this.image = ''
      this.files = []
    }
  }
}
</script>

