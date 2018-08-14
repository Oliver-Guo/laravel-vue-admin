<template>
  <div class="app-container">
    <loading :active.sync="loading"></loading>
    <el-form data-vv-scope="form-1" label-width="120px">
      <el-form-item label="*作者名稱" :class="{'is-error':errors.has('form-1.name')}">
        <el-input type="text" v-model="form.name" name="name"  data-vv-as="作者名稱" v-validate="'required'" class="form-control" ></el-input>
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
      <el-form-item label="fb分享" :class="{'is-error':errors.has('form-1.fb_share')}">
        <el-input  v-model="form.fb_share" name="fb_share" data-vv-as="FB分享連結" v-validate="'url'" class="form-control"></el-input>
        <span v-show="errors.has('form-1.fb_share')" class="el-form-item__error">{{ errors.first('form-1.fb_share') }}</span>
      </el-form-item>

      <el-form-item label="google分享" :class="{'is-error':errors.has('form-1.google_share')}">
        <el-input  v-model="form.google_share" name="google_share" data-vv-as="google分享連結" v-validate="'url'" class="form-control"></el-input>
        <span v-show="errors.has('form-1.google_share')" class="el-form-item__error">{{ errors.first('form-1.google_share') }}</span>
      </el-form-item>

      <el-form-item label="twitter分享" :class="{'is-error':errors.has('form-1.twitter_share')}">
        <el-input  v-model="form.twitter_share" name="twitter_share" data-vv-as="twitter分享連結" v-validate="'url'" class="form-control"></el-input>
        <span v-show="errors.has('form-1.twitter_share')" class="el-form-item__error">{{ errors.first('form-1.twitter_share') }}</span>
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
        <el-button type="primary" style="width:10%;" @click.native.prevent="checkForm('form-1')">儲存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { postAuthor } from '@/api/author'
import FileUpload from 'vue-upload-component'
export default {
  data() {
    return {
      loading: false,
      form: {
        name: '',
        is_online: false,
        resource: '',
        outsite_url: '',
        fb_share: '',
        google_share: '',
        twitter_share: '',
        description: ''
      },
      files: [],
      image: ''
    }
  },
  components: {
    FileUpload
  },
  methods: {
    checkForm(scope) {
      this.$validator.validateAll(scope).then((result) => {
        if (result) {
          this.loading = true

          const resData = { author: Object.assign({}, this.form) }
          resData.author.is_online = (resData.author.is_online) ? 1 : 0

          const resFile = (this.files[0]) ? this.files[0].file : false

          postAuthor(resData, resFile).then(response => {
            const respData = response.data

            this.loading = false
            if (respData === '') {
              this.$router.push({ name: 'AuthorList' })
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
      if (newFile && !oldFile) {
        // console.log('add', newFile)
      }
      if (newFile && oldFile) {
        // update
        // console.log('update', newFile)
      }
      if (!newFile && oldFile) {
        // remove
        // console.log('remove', oldFile)
      }

      // auto upload
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (!this.$refs.upload.active) {
          // this.image = this.files[0].name
          this.createImage(this.files[0].file)
          // this.$refs.upload.active = true
        }
      }
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) { return }
      this.image = files[0]
      this.createImage(files[0])
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

