<template>
  <div class="app-container">
    <loading :active.sync="loading"></loading>
    <el-form data-vv-scope="form-1" label-width="120px">
      <el-form-item label="*使用者帳號" :class="{'is-error':errors.has('form-1.email')}">
        <el-input type="text" v-model="form.email" name="email"  data-vv-as="使用者帳號" v-validate="'required|email'" class="form-control" ></el-input>
        <span v-show="errors.has('form-1.email')" class="el-form-item__error">{{ errors.first('form-1.email') }}</span>
      </el-form-item>
      <el-form-item label="*使用者名稱" :class="{'is-error':errors.has('form-1.name')}">
        <el-input type="text" v-model="form.name" name="name"  data-vv-as="使用者名稱" v-validate="'required'" class="form-control" ></el-input>
        <span v-show="errors.has('form-1.name')" class="el-form-item__error">{{ errors.first('form-1.name') }}</span>
      </el-form-item>
      <el-form-item label="*密碼" :class="{'is-error':errors.has('form-1.password')}">
        <el-input type="password" v-model="form.password" name="password"  data-vv-as="密碼" v-validate="'required|min:6|max:12'" class="form-control" ></el-input>
        <span v-show="errors.has('form-1.password')" class="el-form-item__error">{{ errors.first('form-1.password') }}</span>
      </el-form-item>
      <el-form-item label="*再次確認密碼" :class="{'is-error':errors.has('form-1.password_confirmation')}">
        <el-input type="password" v-model="form.password_confirmation" name="password_confirmation"  data-vv-as="再次確認密碼" v-validate="'required'" class="form-control" ></el-input>
        <span v-show="errors.has('form-1.password_confirmation')" class="el-form-item__error">{{ errors.first('form-1.password_confirmation') }}</span>
      </el-form-item>

      <el-form-item label="群組權限">
        <div v-for="role in roleList" :key="role.id">
          <label><input type="checkbox" v-model.number="userRoles" :value="role.id"> {{role.display_name}}</label>
        </div>
        <!-- <el-checkbox-group v-model="userRoles">
          <el-checkbox v-for="role in roleList" :label="role.id" :key="role.id">{{role.display_name}}</el-checkbox>
        </el-checkbox-group> -->
      </el-form-item>
      <el-form-item>
          <el-button type="primary" style="width:10%; margin-top: 20px;" @click.native.prevent="checkForm('form-1')">儲存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getRoleList, postUser } from '@/api/permission'

export default {
  data() {
    return {
      loading: false,
      roleList: null,
      userRoles: [],
      form: {}
    }
  },
  created() {
    this.fetchRole()
  },
  methods: {
    fetchRole() {
      this.loading = true
      getRoleList().then(response => {
        const respData = response.data
        this.roleList = respData.roles

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    checkForm(scope) {
      this.$validator.validateAll(scope).then((result) => {
        if (result) {
          if (this.form.password !== this.form.password_confirmation) {
            this.$swal({
              type: 'error',
              title: '兩次密碼輸入不一致',
              showConfirmButton: false
            })
            return
          }

          this.loading = true

          const resData = { user: Object.assign({}, this.form), role_ids: this.userRoles }

          postUser(resData).then(response => {
            const respData = response.data

            this.loading = false
            if (respData === '') {
              this.$router.push({ name: 'PermissionUserList' })
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
