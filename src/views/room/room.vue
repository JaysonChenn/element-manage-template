<template>
  <div id="room">
    <div class="havebind-container" v-if="playerId == 0">
      <el-steps :active="step" simple>
        <el-step title="用户信息" icon="el-icon-search"></el-step>
        <el-step title="绑定用户" icon="el-icon-upload"></el-step>
        <el-step title="完成" icon="el-icon-check"></el-step>
      </el-steps>
      <div class="inside-content">
        <div class="step-one" v-show="step === 1">
          <p class="title">
            <i class="el-icon-search"></i>
            查询用户信息
          </p>
          <el-form :model="searchForm" :rules="searchRules" ref="searchForm" class="search-form">
            <el-form-item prop="id">
              <el-input v-model="searchForm.id" placeholder="请填写游戏ID"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="searchUserInfo()">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="step-two" v-show="step === 2">
          <el-form>
            <el-form-item>
              <img class="avatar" :src="playerInfo.avatar" alt="">
            </el-form-item>
            <el-form-item>
              {{playerInfo.nickname}}(ID：{{playerInfo.id}})
            </el-form-item>
            <el-form-item>
              当前钻石({{playerInfo.account_now}})
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="bindUser()">绑定</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="step-three" v-show="step === 3">
          <i class="el-icon-success"></i>
          <P>绑定成功</P>
          <p class="back" @click="backPage()">
            <i class="el-icon-back"></i>查看列表
          </p>
        </div>
      </div>
    </div>

    <div class="nobind-container" v-else>
      <el-row class="head">
        <img class="avatar" :src="playerInfo.avatar" alt="">
        <div class="info">
          <p class="name">姓名：{{playerInfo.nickname}}</p>
          <P class="id">ID：{{playerInfo.id}}</P>
        </div>
        <el-button type="primary" size="mini" @click="unbindUser()"><i class="iconfont iconjiebang"></i>解绑</el-button>
      </el-row>
      <el-row class="body">
        <el-table
          :data="roomTableData"
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="room_id"
            label="房间ID">
          </el-table-column>
          <el-table-column
            prop="created_time"
            label="创建时间">
            <template slot-scope="slot">
              {{PublicMethod.formatDate(slot.row.created_time)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="ended_time"
            label="结束时间">
            <template slot-scope="slot">
              {{PublicMethod.formatDate(slot.row.ended_time)}}
            </template>
          </el-table-column>
          <el-table-column
            label="玩家">
            <template slot-scope="slot">
              {{slot.row.players.length}}/{{slot.row.player_limit}}
            </template>
          </el-table-column>
          <el-table-column
            prop="end_status"
            label="开房状态">
            <template slot-scope="slot">
              {{slot.row.end_status == 0 ? '进行中' :
                slot.row.end_status == 1 ? '正常结束' :
                slot.row.end_status == 2 ? '房主解散' :
                slot.row.end_status == 3 ? '申请解散' :'空闲超时解散'}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="slot">
              <el-button type="primary" size="mini" @click="roomPlayerInfo = slot.row.players; palyerTableVisible = true">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="tool-bottom-bar">
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoom()">删除</el-button>
      </el-row>
    </div>

    <el-dialog title="房间玩家" :visible.sync="palyerTableVisible">
      <el-table :data="roomPlayerInfo">
        <el-table-column property="date" label="头像" >
          <template slot-scope="slot">
            <img class="roomPlayerAvatar" :src="slot.row.avatar" alt="">
          </template>
        </el-table-column>
        <el-table-column property="nickname" label="昵称"></el-table-column>
        <el-table-column property="user_id" label="ID"></el-table-column>
        <el-table-column property="scores" label="积分"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  PlayerInfoApi
} from '@/api/diamon'
import {
  BindUserApi,
  RoomListApi,
  UnbindUserApi,
  DeleteRoomApi
} from '@/api/room'

export default {
  data () {
    const valiId = (rule, val, callback) => {
      if (val === '') {
        callback(new Error('游戏ID不能为空'))
      } else {
        callback()
      }
    }
    return {
      playerId: JSON.parse(sessionStorage.userinfo).player_id,
      step: 1,
      playerInfo: {},
      searchForm: {
        id: ''
      },
      searchRules: {
        id: [{
          required: true,
          trigger: 'blur',
          validator: valiId
        }]
      },
      roomTableData: [],
      roomPlayerInfo: [],
      multipleSelection: [],
      palyerTableVisible: false
    }
  },
  methods: {
    /**
     * @description 初始化页面
     * @description 当用户ID不为0时获取玩家(PlayerInfo)信息
     */
    async initPage () {
      if (this.playerId && this.playerId !== 0) {
        let playerId = await PlayerInfoApi(this.playerId)
          .then(res => {
            this.playerInfo = res.data.data
            return res.data.data.id
          })
        let param = {
          player_id: playerId
        }
        await RoomListApi(param)
          .then(res => {
            this.roomTableData = res.data.data.rooms
          })
      }
    },
    /**
     * @description 查询用户信息
     */
    searchUserInfo () {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          PlayerInfoApi(this.searchForm.id)
            .then(res => {
              if (res.data.code === 0) {
                this.playerInfo = res.data.data
                this.step = 2
              }
            })
        }
      })
    },
    /**
     * @description 绑定用户
     */
    bindUser () {
      this.$confirm('确认绑定用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          player_id: this.playerInfo.id
        }
        BindUserApi(param)
          .then(res => {
            if (res.data.code === 0) {
              sessionStorage.setItem('userinfo', JSON.stringify(res.data.data))
              this.step = 3
            }
          })
      }).catch(() => {})
    },
    /**
     * @description 解绑用户
     */
    unbindUser () {
      this.$confirm('确认解绑用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          player_id: 0
        }
        UnbindUserApi(param)
          .then(res => {
            if (res.data.code === 0) {
              sessionStorage.setItem('userinfo', JSON.stringify(res.data.data))
              this.playerId = JSON.parse(sessionStorage.userinfo).player_id
              this.step = 1
            }
          })
      }).catch(() => {})
    },
    /**
     * @description 删除房间
     */
    deleteRoom (row) {
      this.$confirm('确认删除房间吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          player_id: this.playerInfo.id,
          room_ids: ''
        }
        for (let val in this.multipleSelection) {
          param.room_ids += this.multipleSelection[val].room_id + ','
        }
        param.room_ids = param.room_ids.slice(0, -1)
        DeleteRoomApi(param)
          .then(res => {
            if (res.data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.initPage()
            }
          })
      }).catch(() => {})
    },
    /**
     * @description table表格默认勾选事件
     */
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    /**
     * @description 返回
     */
    backPage () {
      this.$refs['searchForm'].resetFields()
      this.playerId = JSON.parse(sessionStorage.userinfo).player_id
      this.initPage()
    }
  },
  mounted () {
    this.initPage()
  }
}
</script>

<style lang="scss" scoped>
// mixin scss
@import '@/style/mixin.scss';

#room {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

  .havebind-container {
    @include flex-box(column, unset, unset, nowrap);
    flex: 1;
    padding: 16px;

    .inside-content{
      @include flex-box(column, flex-start, center, nowrap);
      flex: 1;
      .step-one{
        text-align: center;
        margin-top: 30px;
        .title{
          padding: 30px;
          color: gray;
        }
        .search-form{
          @include flex-box(column, center, center, nowrap);
        }
      }
      .step-two{
        margin-top: 30px;
        text-align: center;
        .avatar{
          width: 80px;
          margin: 0 auto;
          display: block;
          border-radius: 50%;
        }
      }
      .step-three{
        flex: 1;
        @include flex-box(column, center, center, nowrap);
        margin-top: 30px;
        .el-icon-success{
          font-size: 40px;
          color: #67C23A;
        }
        p{
          margin: 10px;
        }
        .back{
          font-size: 12px;
          cursor: pointer;
        }
      }
    }

    .el-steps--simple{
      padding: 6px 8px;
    }
  }

  .nobind-container{

    .head{
      @include flex-box(row, center, center, nowrap);
      border-bottom: 1px solid #eef3f7;
      padding: 16px;
      .avatar{
        width: 40px;
        display: block;
      }
      .info{
        flex: 1;
        align-self: stretch;
        .name{
          font-size: 14px;
          padding-left: 10px;
        }
        .id{
          font-size: 14px;
          padding-left: 10px;
          color: rgba(0, 0, 0, 0.45);
        }
      }
      .iconjiebang{
        font-size: 12px;
        margin-right: 1px;
      }
    }

    .body{
      padding: 10px;
    }

    .tool-bottom-bar{
      padding: 10px 16px;
    }
  }

  .roomPlayerAvatar{
    width: 40px;
    height: 40px;
    display: flex;
  }
}
</style>
