import Admin from './components/Admin.vue'
import SessionSearch from './components/sessions/Search.vue'
import Evaluate from './components/evaluation/Evaluate.vue'
import Precheck from './components/evaluation/Precheck.vue'
import LearningObjectives from './components/learning/Objectives.vue'
import Students from './components/students/Students.vue'
import Student from './components/students/Student.vue'
import Conversations from './components/conversations/Conversations.vue'

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
        },
        {
            path: 'students',
            name: 'students.index',
            component: Students
        },
        {
            path: '/students/:id',
            name: 'students.show',
            component: Student
        },
        {
            path: '/conversations',
            name: 'conversations.index',
            component: Conversations
        }
    ],
    meta: {
        requiredLogin: true,
        requiredPermission: 'Admin'
    },
}]

export default routes