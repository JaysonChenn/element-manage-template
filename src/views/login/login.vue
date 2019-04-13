<template>
  <div id="login">
    <!-- pc -->
    <canvas id="canvas" class="canvas" v-if="isPc"></canvas>
    <section class="form" v-if="isPc">
      <p class="form-head">代理后台</p>
      <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      class="demo-ruleForm">
        <el-form-item prop="agent_phone">
          <el-input
          prefix-icon="iconfont iconusername"
          placeholder="请输入用户名"
          v-model="loginForm.agent_phone"
          size="medium"
          type="text">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
          prefix-icon="iconfont iconmima"
          placeholder="请输入密码"
          v-model="loginForm.password"
          size="medium"
          type="password">
          </el-input>
        </el-form-item>
        <el-button
        type="primary"
        size="small"
        @click="submitLogin" :loading="btnLoading">登录</el-button>
        <p class="tips">请输入用户名密码登陆</p>
      </el-form>
    </section>
    <!-- mobile -->
    <section class="form form-mobile" v-if="!isPc">
      <p class="form-head">代理后台登录</p>
      <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      class="demo-ruleForm">
        <el-form-item prop="agent_phone">
          <el-input
          prefix-icon="iconfont iconusername"
          placeholder="请输入用户名"
          v-model="loginForm.agent_phone"
          size="medium"
          type="text">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
          prefix-icon="iconfont iconmima"
          placeholder="请输入密码"
          v-model="loginForm.password"
          size="medium"
          type="password">
          </el-input>
        </el-form-item>
        <el-button
        type="primary"
        size="small"
        @click="submitLogin" :loading="btnLoading">登录</el-button>
        <p class="tips">请输入用户名密码登陆</p>
      </el-form>
    </section>
  </div>
</template>

<script>
import {
  mapMutations
} from 'vuex'
import {
  LoginApi
} from '@/api/login'
import {
  NotifyMesApi
} from '@/api/notify'

export default {
  data () {
    const valiPhone = (rule, val, callback) => {
      if (val === '') {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const valiPassword = (rule, val, callback) => {
      if (val === '') {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      btnLoading: false,
      isPc: true,
      loginForm: {
        agent_phone: '',
        password: ''
      },
      rules: {
        agent_phone: [{
          required: true,
          trigger: 'blur',
          validator: valiPhone
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: valiPassword
        }]
      }
    }
  },
  methods: {
    ...mapMutations(['setMesInfo', 'setUserInfo']),
    /**
     * @description 登录
     */
    submitLogin () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          LoginApi(this.loginForm)
            .then(res => {
              this.btnLoading = false
              if (res.data.code === 0) {
                sessionStorage.setItem('userinfo', JSON.stringify(res.data.data))
                this.setUserInfo(res.data.data)
              }
            })
            .then(() => {
              let param = {
                order: 'desc'
              }
              NotifyMesApi(param)
                .then(res => {
                  let obj = {}
                  obj.allArr = res.data.data.data
                  obj.unreadArr = res.data.data.data.filter(item => { return item.notice_state === 0 })
                  obj.havereadArr = res.data.data.data.filter(item => { return item.notice_state !== 0 })
                  this.setMesInfo(obj)
                  this.$router.push('/userinfo')
                })
            })
            .catch(() => {
              this.btnLoading = false
              this.$refs['loginForm'].resetFields()
            })
        }
      })
    },
    /**
     * @desctiption 初始化canvas
     */
    initCanvas () {
      // eslint-disable-next-line one-var
      var canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctx.lineWidth = 0.3
      ctx.strokeStyle = (new Color(150)).style
      var mousePosition = {
        x: canvas.width - 100,
        y: canvas.height - 60
      }
      var dots = {
        nb: 250,
        distance: 100,
        d_radius: 150,
        array: []
      }
      function colorValue (min) {
        return Math.floor(Math.random() * 255 + min)
      }
      function createColorStyle (r, g, b) {
        return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)'
      }
      function mixComponents (comp1, weight1, comp2, weight2) {
        return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2)
      }
      function averageColorStyles (dot1, dot2) {
        var color1 = dot1.color
        var color2 = dot2.color
        var r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius)
        var g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius)
        var b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius)
        return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b))
      }
      function Color (min) {
        min = min || 0
        this.r = colorValue(min)
        this.g = colorValue(min)
        this.b = colorValue(min)
        this.style = createColorStyle(this.r, this.g, this.b)
      }
      function Dot () {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = -0.5 + Math.random()
        this.vy = -0.5 + Math.random()
        this.radius = Math.random() * 2
        this.color = new Color()
      }
      Dot.prototype = {
        draw: function () {
          ctx.beginPath()
          ctx.fillStyle = this.color.style
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
          ctx.fill()
        }
      }
      function createDots () {
        for (var i = 0; i < dots.nb; i++) {
          dots.array.push(new Dot())
        }
      }
      function moveDots () {
        for (var i = 0; i < dots.nb; i++) {
          var dot = dots.array[i]
          if (dot.y < 0 || dot.y > canvas.height) {
            dot.vx = dot.vx
            dot.vy = -dot.vy
          } else if (dot.x < 0 || dot.x > canvas.width) {
            dot.vx = -dot.vx
            dot.vy = dot.vy
          }
          dot.x += dot.vx
          dot.y += dot.vy
        }
      }
      function connectDots () {
        for (var i = 0; i < dots.nb; i++) {
          for (var j = 0; j < dots.nb; j++) {
            var iDot = dots.array[i]
            var jDot = dots.array[j]
            if ((iDot.x - jDot.x) < dots.distance && (iDot.y - jDot.y) < dots.distance && (iDot.x - jDot.x) > -dots.distance && (iDot.y - jDot.y) > -dots.distance) {
              if ((iDot.x - mousePosition.x) < dots.d_radius && (iDot.y - mousePosition.y) < dots.d_radius && (iDot.x -
                mousePosition.x) > -dots.d_radius && (iDot.y - mousePosition.y) > -dots.d_radius) {
                ctx.beginPath()
                ctx.strokeStyle = averageColorStyles(iDot, jDot)
                ctx.moveTo(iDot.x, iDot.y)
                ctx.lineTo(jDot.x, jDot.y)
                ctx.stroke()
                ctx.closePath()
              }
            }
          }
        }
      }
      function drawDots () {
        for (var i = 0; i < dots.nb; i++) {
          var dot = dots.array[i]
          dot.draw()
        }
      }
      function animateDots () {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        moveDots()
        connectDots()
        drawDots()
        requestAnimationFrame(animateDots)
      }
      document.getElementById('login').addEventListener('mousemove', function (e) {
        mousePosition.x = e.pageX
        mousePosition.y = e.pageY
      })
      document.getElementById('login').addEventListener('mouseleave', function (e) {
        mousePosition.x = canvas.width / 2
        mousePosition.y = canvas.height / 2
      })
      createDots()
      requestAnimationFrame(animateDots)
    }
  },
  mounted () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.isPc = false
      console.log(1)
    } else {
      this.isPc = true
      this.initCanvas()
    }
  }
}
</script>

<style lang="scss" scoped>
// mixin scss
@import '@/style/mixin.scss';

#login {
  @include flex-box(column, center, center, nowrap);
  background: #121223;

  .form {
    position: fixed;
    top: 50%;
    left: 50%;
    @include translate(-50%, -50%);
    width: 305px;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;

    .form-head {
      border-bottom: 1px solid #e8eaec;
      padding: 14px 16px;
      line-height: 1;
      margin: 0;
      font-size: 14px;
      color: #17233d;
      font-weight: 700;
      overflow: hidden;
    }

    .el-form {
      @include flex-box(column, center, inherit, nowrap);
      padding: 28px 16px 12px 16px;

      .tips {
        padding-top: 15px;
        font-size: 10px;
        text-align: center;
        color: #c3c3c3;
      }
    }
  }

  .form-mobile{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .form-head{
      border: none;
      padding: 48px 22px 0 22px;
    }
    .demo-ruleForm{
      flex: 1;
      justify-content: flex-start;
      padding: 38px 22px 22px 22px;
    }
  }
}
</style>
