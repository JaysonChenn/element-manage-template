<template>
  <div id="recordsale">
    <el-container class="container">
      <el-main class="inside-main" v-html="documentText">
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  AgentAgreementApi
} from '@/api/agreement'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'

export default {
  components: {
    Breadcrumb
  },
  data () {
    return {
      documentText: ''
    }
  },
  methods: {
    /**
     * @description 获取默认信息
     */
    getDefaultInfo () {
      AgentAgreementApi()
        .then(res => {
          if (res.data.code === 0) {
            this.documentText = res.data.data.agent_agreement
          }
        })
    }
  },
  mounted () {
    this.getDefaultInfo()
  }
}
</script>

<style lang="scss" scoped>
#recordsale {
  height: 100%;
  overflow: auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

  .container{
    display: flex;
    flex-direction: column;
    background: #fff;

    .toolbar {
      padding: 16px;
      border-bottom: 1px solid #eef3f7;

      .el-button+.el-button {
        margin: 0;
      }

      .arrow {
        color: #C0C4CC;
      }
    }

    .inside-main{
      color: #606266;
      padding: 30px 40px;
      line-height: 28px;
      .avatar{
        width: 30px;
      }
    }

  }
}
</style>
