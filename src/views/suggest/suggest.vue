<template>
  <div id="suggest">
    <el-form ref="form" :model="form" label-width="80px" class="form">
      <el-form-item label="选择类型">
        <el-radio-group v-model="form.resource">
          <el-radio label="投诉"></el-radio>
          <el-radio label="建议"></el-radio>
          <el-radio label="举报"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="微信号">
        <el-input v-model="form.name" size="small"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        name: '',
        type: [],
        resource: '',
        desc: ''
      }
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
