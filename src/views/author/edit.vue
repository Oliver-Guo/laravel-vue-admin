<template>
  <div class="app-container">
    <loading :active.sync="loading"></loading>
    <el-form data-vv-scope="form-1" label-width="120px">
      <el-form-item label="*作者名稱" :class="{'is-error':errors.has('form-1.name')}">
        <el-input type="text" v-model="form.name" name="name"  data-vv-as="標題" v-validate="'required'" class="form-control" ></el-input>
        <span v-show="errors.has('form-1.name')" class="el-form-item__error">{{ errors.first('form-1.name') }}</span>
      </el-form-item>
      <el-form-item label="是否顯示">
        <el-switch v-model="form.is_online"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item label="外部連結" :class="{'is-error':errors.has('form-1.outsite_url')}">
        <el-input  v-model="form.outsite_url" name="outsite_url" data-vv-as="外部連結" v-validate="'url'" class="form-control"></el-input>
        <span v-show="errors.has('form-1.outsite_url')" class="el-form-item__error">{{ errors.first('form-1.outsite_url') }}</span>
      </el-form-item>
      <el-form-item prop="fb_share" label="fb分享">
        <el-input v-model="form.fb_share"></el-input>
      </el-form-item>
      <el-form-item label="google分享">
        <el-input v-model="form.google_share"></el-input>
      </el-form-item>
      <el-form-item label="twitter分享">
        <el-input v-model="form.twitter_share"></el-input>
      </el-form-item>
      <el-form-item label="*作者簡述" :class="{'is-error':errors.has('form-1.description')}">
        <el-input type="textarea" v-model="form.description" name="description" data-vv-as="作者簡述" v-validate="'required'" class="form-control"></el-input>
        <span v-show="errors.has('form-1.description')" class="el-form-item__error">{{ errors.first('form-1.description') }}</span>
      </el-form-item>
      <el-form-item  label="作者圖片">
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
      <el-form-item>
        <el-button type="primary" style="width:10%;" @click.native.prevent="checkForm('form-1','draft')">儲存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getAuthor, putAuthor } from '@/api/author'
import FileUpload from 'vue-upload-component'
export default {
  data() {
    return {
      loading: false,
      authorId: this.$route.params.id,
      form: {},
      files: [],
      image: ''
    }
  },
  components: {
    FileUpload
  },
  created() {
    this.fetchAuthor()
  },
  methods: {
    fetchAuthor() {
      this.loading = true

      getAuthor(this.authorId).then(response => {
        const respData = response.data

        this.form = respData.author

        this.form.is_online = !!(respData.author.is_online)

        this.image = respData.author.photo.file_url

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    checkForm(scope, type) {
      this.$validator.validateAll(scope).then((result) => {
        if (result) {
          this.loading = true

          delete this.form.photo

          const resData = { author: Object.assign({}, this.form) }
          resData.author.is_online = (resData.author.is_online) ? 1 : 0

          const resFile = (this.files[0]) ? this.files[0].file : false

          putAuthor(this.authorId, resData, resFile).then(response => {
            const respData = response.data
            this.loading = false
            if (respData === '') {
              this.fetchAuthor()
              this.files = []
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
      this.form.del_photo = true
    }
  }
}
</script>

