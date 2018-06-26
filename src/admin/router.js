import Admin from './components/Admin.vue'
import SessionSearch from './components/sessions/Search.vue'
import Evaluate from './components/evaluation/Evaluate.vue'
import Precheck from './components/evaluation/Precheck.vue'
import LearningObjectives from './components/learning/Objectives.vue'
import Students from './components/students/Students.vue'
import Student from './components/students/Student.vue'

import conversations from './components/conversations/router'

const routes = [{
    path: '/admin',
    component: Admin,
    children: [
        {
            path: 'evaluators/evaluate',
            name: 'evaluation.evaluate',
            component: Evaluate,
            meta: {
                requiredPermission: ['Admin', 'Evaluator']
            }
        },
        {
            path: 'evaluators/precheck',
            name: 'evaluation.precheck',
            component: Precheck,
            meta: {
                requiredPermission: ['Admin']
            }
        },
        {
            path: 'sessions/searches',
            name: 'sessions.searches',
            component: SessionSearch,
            meta: {
                requiredPermission: ['Admin']
            }
        },
        {
            path: 'learning/objectives',
            name: 'learning.objectives',
            component: LearningObjectives,
            meta: {
                requiredPermission: ['Admin']
            }
        },
        {
            path: 'students',
            name: 'students.index',
            component: Students,
            meta: {
                requiredPermission: ['Admin', 'Evaluator']
            }
        },
        {
            path: '/students/:id',
            name: 'students.show',
            component: Student,
            meta: {
                requiredPermission: ['Admin', 'Evaluator']
            }
        },
        ...conversations
    ],
    meta: {
        requiredLogin: true
    },
}]

export default routes