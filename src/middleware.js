import axios from 'axios'

export default function middleware (router) {
  router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('access_token')
    let requiredLogin = to.matched.some(record => record.meta.requiredLogin)
    let requiredPermission = to.matched.map(record => record.meta.requiredPermission)[0]

    if(token && !window.user) {
      axios.get('v3/me')
        .then((res) => {
          window.Bus.$emit('user.updated', res.data.user)
          if(!requiredLogin || res.data.user.role == requiredPermission) {
            next()
          }else {
            next({
              path: '/'
            })
          }
        })
        .catch((err) => {
          next({
            path: '/'
          })
        })
    }else {
      if(requiredLogin) {
        if(window.user) {
          if(window.user.role == requiredPermission) {
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