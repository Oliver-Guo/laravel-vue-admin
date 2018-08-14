import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import zh_TW from 'vee-validate/dist/locale/zh_TW'
import VeeValidate, { Validator } from 'vee-validate'

import VueSweetalert2 from 'vue-sweetalert2'

// Import component
import Loading from 'vue-loading-overlay'
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.min.css'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, { locale })

Validator.localize('zh_TW', zh_TW)
const veeConfig = {
  fieldsBagName: 'vvfields'
}
Vue.use(VeeValidate, veeConfig)

Vue.use(VueSweetalert2)

Vue.use(Loading)
Vue.component('Loading', Loading)

Vue.config.productionTip = false

// Object.defineProperty(Vue.prototype, '$BaseImgUrl', { value: BaseImgUrl })
Vue.prototype.$BaseImgUrl = BaseImgUrl

import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import regular from '@fortawesome/fontawesome-free-regular'
import brands from '@fortawesome/fontawesome-free-brands'

fontawesome.library.add(solid)
fontawesome.library.add(regular)
fontawesome.library.add(brands)

Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

