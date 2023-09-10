import type { Menu, User } from '~/types'
import { APP_MENU } from '~/config'
import defaultAvatar from '~/assets/default-avatar.jpg'

// 用户登陆状态
export const useAuthStore = defineStore(
  'authStore',
  () => {
    const user = ref<User>()
    const hasLogin = ref(false)
    const menus = ref<Menu[]>([])

    const fetchUser = () => {}
    const updateUser = (data: User) => {
      if (!data.avatar) data.avatar = defaultAvatar
      user.value = data
    }
    const removeUser = () => user.value = undefined

    const fetchMenus = () => {
      menus.value = APP_MENU.source === 'front'
        ? [...APP_MENU.defaultMenus]
        : []
    }
    const removeMenus = () => menus.value = []

    return {
      user,
      fetchUser,   // 切换新的用户对象
      updateUser,   // 不同的用户显示不同的头像
      removeUser,  // 用户对象清空
      hasLogin,  // 验证是否登陆成功
      menus,
      fetchMenus,   // 切换菜单
      removeMenus,  // 移除菜单
      login(data: User) {
        return new Promise((resolve) => {
          hasLogin.value = true
          updateUser(data)   // 拿到用户信息后根据不同的用户去获取不同的头像,没设置则使用默认头像
          ;[fetchUser, fetchMenus].forEach(fn => fn())  // 不同的用户有不同的菜单栏
          resolve(user)   // 然后返回用户信息,显示用户提示信息：xxx 登陆成功
        })
      },
      logout() {
        return new Promise((resolve) => {
          hasLogin.value = false
          const tabStore = useTabStore()   // 退出登陆会清理用户访问过的缓存页面
          ;[removeUser, removeMenus, tabStore.removeAllTabs].forEach(fn => fn())
          resolve(menus)
        })
      },
    }
  },
  { persist: { enabled: true } },
)

// 使用 acceptHMRUpdate 方法来处理热更新，以便在开发模式下在组件状态或 store 模块发生更改时保持状态的一致性
// meta.hot为 Vite 的热模块替换（HMR）功能
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
