import Conversation from './Conversation.vue'
import Conversations from './Conversations.vue'

const routes = [
    {
        path: '/conversations',
        name: 'conversations.index',
        component: Conversations
    },
    {
        path: '/conversations/:id',
        name: 'conversations.show',
        component: Conversation
    }]

export default routes