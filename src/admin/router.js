import Admin from './components/Admin.vue'
import SessionSearch from './components/sessions/Search.vue'
import Evaluate from './components/evaluation/Evaluate.vue'

const routes = [{
    path: '/admin',
    component: Admin,
    children: [
        {
            path: 'evaluators/evaluate',
            name: 'evaluation.evaluate',
            component: Evaluate
        },
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