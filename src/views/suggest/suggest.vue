<template>
  <div id="suggest">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="form">
      <el-form-item label="选择类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio label="1">投诉</el-radio>
          <el-radio label="2">建议</el-radio>
          <el-radio label="3">举报</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="微信号" prop="wechat">
        <el-input v-model="form.wechat" size="small"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input type="textarea" v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload
          :auto-upload="false"
          :limit="1"
          :on-change="beforePicUpload"
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :show-file-list="true">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm()">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import {
  OsspolicyApi,
  CreateSuggestApi
} from '@/api/suggest'
import {
  mapState
} from 'vuex'

export default {
  inject: ['reload'],
  data () {
    const valiType = (rule, val, callback) => {
      if (val === '') {
        callback(new Error('类型不能为空'))
      } else {
        callback()
      }
    }
    const valiWechat = (rule, val, callback) => {
      if (val === '') {
        callback(new Error('微信号不能为空'))
      } else {
        callback()
      }
    }
    const valiContent = (rule, val, callback) => {
      if (val === '') {
        callback(new Error('内容不能为空'))
      } else {
        callback()
      }
    }
    return {
      form: {
        type: '',
        wechat: '',
        content: ''
      },
      rules: {
        type: [{
          required: true,
          trigger: 'blur',
          validator: valiType
        }],
        wechat: [{
          required: true,
          trigger: 'blur',
          validator: valiWechat
        }],
        content: [{
          required: true,
          trigger: 'blur',
          validator: valiContent
        }]
      },
      filename: '',
      file: null,
      picUrl: ''
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    /**
     * @description 上传图片
     */
    beforePicUpload (val) {
      this.file = val
    },
    /**
     * @description 原始方法
     */
    getSufffix (filename) {
      let pos = filename.lastIndexOf('.')
      let suffix = ''
      if (pos !== -1) {
        suffix = filename.substring(pos)
      }
      return suffix
    },
    /**
     * @description 原始方法
     */
    randomString (len) {
      len = len || 32
      let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      let maxPos = chars.length
      let pwd = ''
      for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    },
    /**
     * @description 原始方法
     */
    calculateObjName (filename) {
      var suffix = this.getSufffix(filename)
      var ossFileNmae = this.randomString(10) + suffix
      return ossFileNmae
    },
    /**
     * 提交表单
     */
    submitForm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.file !== null) {
            this.filename = this.calculateObjName(this.file.name)
            OsspolicyApi()
              .then(res => {
                if (res.data.code === 0) {
                  let resp = res.data.data
                  let accessid = resp.accessid
                  let host = resp.host
                  // let expire = resp.expire
                  let signature = resp.signature
                  let policy = resp.policy
                  let dir = resp.dir
                  let ossData = new FormData()
                  ossData.append('OSSAccessKeyId', accessid)
                  ossData.append('policy', policy)
                  ossData.append('Signature', signature)
                  ossData.append('key', dir + this.filename)
                  ossData.append('success_action_status', 201)
                  ossData.append('file', this.file[0])
                  axios({
                    method: 'post',
                    url: host,
                    data: ossData,
                    dataType: 'xml',
                    entype: 'multipart/form-data'
                  })
                    .then(res => {
                      this.picUrl = host + '/' + dir + this.filename
                      this.submitSuggest()
                    })
                    .catch(err => {
                      console.log(err)
                    })
                }
              })
          } else {
            this.submitSuggest()
          }
        }
      })
    },
    /**
     * @description 提交投诉建议
     */
    submitSuggest () {
      let params = {
        fb_type: this.form.type,
        agent_id: this.userInfo.user_id,
        agent_name: this.userInfo.agent_name,
        agent_phone: this.userInfo.agent_phone,
        fb_state: 0,
        fb_content: this.form.content,
        group_id: this.userInfo.agent_group,
        fb_image_url: this.picUrl,
        wechat: this.form.wechat
      }
      CreateSuggestApi(params)
        .then(res => {
          if (res.data.code === 0) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.reload()
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
// mixin scss
@import '@/style/mixin.scss';

#suggest{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  background: #fff;
  width: 100%;
  height: 100%;
  overflow: auto;
  .form{
    padding: 30px 20px;
  }
}
</style>
