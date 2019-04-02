<template>
  <div id="notify">
    <el-row class="tabs" :gutter="12">
      <el-tabs v-model="activeName">
        <el-tab-pane label="全部" name="first">
          <el-col :sm="24" :md="12" v-for="(item, index) in mesInfo.allArr" :key="index">
            <el-card class="box-card">
              <p>标题: {{item.notice_title}} <el-tag type="danger" size="mini" v-if="item.notice_state === 0">未读</el-tag><el-tag type="success" size="mini" v-else>已读</el-tag></p>
              <p>时间: {{PublicMethod.formatDate(item.generate_time)}}</p>
              <p>
                <el-button icon="el-icon-search" size="mini" circle @click="checkCardContent(item)"></el-button>
              </p>
            </el-card>
          </el-col>
        </el-tab-pane>
        <el-tab-pane name="second">
          <span slot="label">未读</span>
          <el-col :sm="24" :md="12" v-for="(item, index) in mesInfo.unreadArr" :key="index">
            <el-card class="box-card">
              <p>标题: {{item.notice_title}} <el-tag type="danger" size="mini" v-if="item.notice_state === 0">未读</el-tag><el-tag type="success" size="mini" v-else>已读</el-tag></p>
              <p>时间: {{PublicMethod.formatDate(item.generate_time)}}</p>
              <p>
                <el-button icon="el-icon-search" size="mini" circle @click="checkCardContent(item)"></el-button>
              </p>
            </el-card>
          </el-col>
        </el-tab-pane>
        <el-tab-pane name="third">
          <span slot="label">已读</span>
          <el-col :sm="24" :md="12" v-for="(item, index) in mesInfo.havereadArr" :key="index">
            <el-card class="box-card">
              <p>标题: {{item.notice_title}} <el-tag type="danger" size="mini" v-if="item.notice_state === 0">未读</el-tag><el-tag type="success" size="mini" v-else>已读</el-tag></p>
              <p>时间: {{PublicMethod.formatDate(item.generate_time)}}</p>
              <p>
                <el-button icon="el-icon-search" size="mini" circle @click="checkCardContent(item)"></el-button>
              </p>
            </el-card>
          </el-col>
        </el-tab-pane>
      </el-tabs>
    </el-row>

    <el-dialog
      :title="cardContent.notice_title"
      :visible.sync="dialogVisible">
      <span>{{cardContent.notice_content}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  NotifyMesApi,
  CheckMesApi
} from '@/api/notify'
import {
  mapMutations,
  mapState
} from 'vuex'

export default {
  inject: ['reload'],
  data () {
    return {
      dialogVisible: false,
      cardContent: {},
      activeName: 'first'
    }
  },
  computed: {
    ...mapState(['mesInfo'])
  },
  methods: {
    ...mapMutations(['setMesInfo']),
    /**
     * @description 获取默认信息
     */
    getDefaultInfo () {
      NotifyMesApi()
        .then(res => {
          if (res.data.code === 0) {
            let obj = {}
            obj.allArr = res.data.data.data
            obj.unreadArr = res.data.data.data.filter(item => { return item.notice_state === 0 })
            obj.havereadArr = res.data.data.data.filter(item => { return item.notice_state !== 0 })
            this.setMesInfo(obj)
          }
        })
    },
    /**
     * @description 查看卡片信息
     */
    checkCardContent (val) {
      this.dialogVisible = true
      this.cardContent = val
      if (val.notice_state === 0) {
        let param = {
          notice_state: 1
        }
        CheckMesApi(val.id, param)
          .then(res => {
            if (res.data.code === 0) {
              this.getDefaultInfo()
            }
          })
      }
    }
  },
  mounted () {
    if (this.$route.query.type) {
      this.$route.query.type === 'unread' ? this.activeName = 'second' : this.activeName = 'third'
    }
    this.getDefaultInfo()
  }
}
</script>

<style lang="scss" scoped>
// mixin scss
@import '@/style/mixin.scss';

#notify{
  height: 100%;
  background: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  .tabs{
    padding: 16px;
  }
  .box-card{
    font-size: 13px;
    p:last-child{
      text-align: right
    }
  }
  .box-card:nth-of-type(2n+1){
    margin: 5px 0
  }
  .el-badge__content:nth-of-type(1){
    background: gray!important
  }
}
</style>
