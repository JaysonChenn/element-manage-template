<template>
  <div id="notify">
    <el-row class="toolbar">
      <el-select
      v-model="activeName"
      placeholder="请选择"
      size="small"
      class="w-150"
      clearable
      @change="selectType">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-row>
    <el-row
    class="inside-container"
    :gutter="6">
      <el-col
      :sm="24"
      :md="12"
      v-for="(item, index) in data"
      :key="index">
        <el-card class="box-card">
          <p>标题: {{item.notice_title}} <el-tag type="danger" size="mini" v-if="item.notice_state === 0">未读</el-tag><el-tag type="success" size="mini" v-else>已读</el-tag></p>
          <p>时间: {{PublicMethod.formatDate(item.generate_time)}}</p>
          <p>
            <el-button icon="el-icon-search" size="mini" circle @click="checkCardContent(item)"></el-button>
          </p>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      :title="cardContent.notice_title"
      :visible.sync="dialogVisible">
      <span>{{cardContent.notice_content}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button
        type="primary"
        @click="dialogVisible = false"
        size="mini">确 定</el-button>
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
      activeName: 1,
      options: [{
        value: 1,
        label: '全部'
      },
      {
        value: 2,
        label: '未读'
      },
      {
        value: 3,
        label: '已读'
      }],
      data: []
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
        .then(() => {
          this.selectType()
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
    },
    /**
     * @description Select选中事件
     */
    selectType () {
      if (!this.activeName) {
        this.activeName = 1
      }
      switch (this.activeName) {
        case 1:
          this.data = this.mesInfo.allArr
          break
        case 2:
          this.data = this.mesInfo.unreadArr
          break
        case 3:
          this.data = this.mesInfo.havereadArr
          break
      }
    }
  },
  mounted () {
    if (this.$route.query.type) {
      this.$route.query.type === 'unread' ? this.activeName = 2 : this.activeName = 3
    }
    this.getDefaultInfo()
  }
}
</script>

<style lang="scss" scoped>
// mixin scss
@import '@/style/mixin.scss';

#notify{
  @include flex-box(column, flex-start, none);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  background: #fff;
  width: 100%;
  height: 100%;

  .toolbar{
    padding: 16px;
    border-bottom: 1px solid #eef3f7;
  }

  .inside-container{
    padding: 10px;
    flex: 1;
    overflow: auto;

    .box-card{
      font-size: 13px;
      p:last-child{
        text-align: right
      }
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
  }
}
</style>
