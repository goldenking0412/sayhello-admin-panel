import Admin from './components/Admin.vue'
import SessionSearch from './components/sessions/Search.vue'
import Evaluate from './components/evaluation/Evaluate.vue'
import Precheck from './components/evaluation/Precheck.vue'
import LearningObjectives from './components/learning/Objectives.vue'

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
            path: 'evaluators/precheck',
            name: 'evaluation.precheck',
            component: Precheck
        },
        {
            path: 'sessions/searches',
            name: 'sessions.searches',
            component: SessionSearch
        },
        {
            path: 'learning/objectives',
            name: 'learning.objectives',
            component: LearningObjectives
        }
    ],
    meta: {
        requiredLogin: true,
        requiredPermission: 'Admin'
    },
}]

export default routes