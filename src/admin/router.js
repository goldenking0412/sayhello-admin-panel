import Admin from './components/Admin.vue'
import SessionSearch from './components/sessions/Search.vue'

const routes = [{
  path: '/admin',
  component: Admin,
  children: [
    {
      path: 'sessions/searches',
      name: 'sessions.searches',
      component: SessionSearch
    }
  ],
  meta: {
    requiredLogin: true,
    requiredPermission: 'Admin'
  },
}]

export default routes