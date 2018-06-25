import Conversation from './Conversation.vue'
import Conversations from './Conversations.vue'

const routes = [
    {
        path: 'conversations',
        name: 'conversations.index',
        component: Conversations,
        meta: {
            requiredPermission: ['Admin']
        }
    },
    {
        path: 'conversations/:id',
        name: 'conversations.show',
        component: Conversation,
        meta: {
            requiredPermission: ['Admin']
        }
    }]

export default routes