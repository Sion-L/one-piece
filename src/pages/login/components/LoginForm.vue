<template>
  <a-card direction="vertical">
    <div text="32px center" font-bold>
      {{ APP_META.name }}
    </div>
    <div id="lottie" h150px />
    <a-form :model="formModel" layout="vertical" size="large" @submit="submit">
      <a-form-item field="username" label="账号" hide-asterisk feedback :validate-trigger="validateTrigger">
        <a-input v-model="formModel.username" placeholder="请输入你的账号..." allow-clear>
          <template #prefix>
            <IconUser />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="password" label="密码" hide-asterisk feedback :rules="[
        { required: true, message: '密码是必须的' },
        { minLength: 6, message: '长度必须大于6' },
      ]" :validate-trigger="validateTrigger">
        <a-input-password v-model="formModel.password" placeholder="请输入你的密码..." allow-clear>
          <template #prefix>
            <IconLock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-button long type="primary" html-type="submit" :loading="loading" font-bold>
          登录
        </a-button>
      </a-form-item>
    </a-form>
    <div flex-center>
      <DarkToggle />
      <span ml-5 op-50 text-xl> {{ APP_META.author }} </span>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { IconLock, IconUser } from '@arco-design/web-vue/es/icon'
import type { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import { APP_META } from '~/config'
import { findFirstRouteInPermission } from '~/utils'

const router = useRouter()
const authStore = useAuthStore()
const { loading, startLoading, endLoading } = useLoading()

interface ModelType {
  username?: string
  password?: string
}

const formModel = reactive<ModelType>({
  username: '',
  password: '',
})

const validateTrigger = ref<('change' | 'input' | 'focus' | 'blur')[]>(['change', 'input'])

function submit({
  errors,
  values,
}: {
  errors: Record<string, ValidatedError> | undefined
  values: Record<string, any>
}) {
  if (errors) return
  startLoading()
  const data = {
    id: 1,
    username: 'admin',
    name: 'admin',
    roleId: 1,
    phone: '6666666666',
    email: 'dasb@qq.com',
    createTime: new Date(),
  }

  // ● then：用于处理 Promise 成功状态的回调函数。
  // ● catch：用于处理 Promise 失败状态的回调函数。
  // ● finally：无论 Promise 是成功还是失败，都会执行的回调函数。

  // axios传递参数请求后端login接口,登录成功后，跳转至首页
  R.axios.post('http://192.168.137.44:8888/api/v1/auth/login', { username: formModel.username, password: formModel.password }).then(res => {
    if (res.data === "登陆成功") {

      authStore
        .login(data)
        .then(() => {
          useTimeoutFn(() => {
            router.push(findFirstRouteInPermission())
            ANotification.success({
              title: '登录成功',
              content: `你好，${values.username}。欢迎回来！`,
            })
          }, 1000)
        })
        .finally(() => useTimeoutFn(endLoading, 1000))
    } else {
      useTimeoutFn(endLoading, 1000)
      authStore.logout().
        then(() => {
          endLoading
          ANotification.error({
            title: '用户名或密码错误',
            content: '',
          })
        })
    }
  })
}

onMounted(() => useTimeoutFn(() => useLottie({
  containerId: '#lottie',
  //path: 'https://assets2.lottiefiles.com/packages/lf20_iVPQC8jyX2.json',
  //path: 'https://assets4.lottiefiles.com/packages/lf20_x62chJ.json',  // 飞机
  path: 'https://lottie.host/9f5a2482-bb89-4335-99a9-85f5ad933d5e/ChiQt51fh0.json', // 山地车
  //path: 'https://lottie.host/568dc44e-923a-4a04-9d2d-b18cd1294ef7/uUmRfy4dfg.json'  // devops
}), 50))
</script>
