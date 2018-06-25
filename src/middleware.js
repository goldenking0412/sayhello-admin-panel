import axios from 'axios'

export default function middleware (router) {
  router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('access_token')
    let requiredLogin = to.matched.some(record => record.meta.requiredLogin)
    let requiredPermission = []

    if (to.meta.requiredPermission) {
      requiredPermission = to.meta.requiredPermission;
    }

    if(token && !window.user) {
      axios.get('v5/me')
        .then((res) => {
          window.Bus.$emit('user.updated', res.data)
          if(!requiredLogin || requiredPermission.find(permission => permission === res.data.role)) {
            next()
          }else {
            next({
              path: '/'
            })
          }
        })
        .catch((err) => {
          localStorage.removeItem('access_token')
          next({
            path: '/'
          })
        })
    }else {
      if(requiredLogin) {
        if(window.user) {
          if(!requiredPermission.length || requiredPermission.find(permission => permission === window.user.role)) {
            next()
          }else {
            next({
              path: '/'
            })
          }
        }else {
          next({
            path: '/'
          })
        }
      }else {
        next()
      }
    }
  })
}