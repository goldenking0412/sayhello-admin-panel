<template>
  <div>
    <div class="text-right mb-4">
      <button class="btn btn-sm btn-primary" @click.prevent="assignLearningNode()">
        Add Learning Nodes
      </button>
    </div>
    <div class="text-center" v-if="loading">
      <i class="fas fa-sync-alt fa-spin" style="font-size: 30px;"></i>
    </div>
    <div class="text-center" v-if="!loading && !learningNodes.length">
      <h4 class="text-warning">Learning Node has been created. Add Related LearningNodes.</h4>
      <p class="mt-4">
        For library conversations add the tag "library" to the group
        learning nodes and make sure to add learning nodes with tag
        level:beginner, level:intermediate, level:advance
      </p>
    </div>
    <div class="listConversations">
      <div class="row">
        <div class="col-sm-4 col-md-3" v-for="node in learningNodes" :key="node.id">
          <div class="border mb-3 p-2 rounded">
            <div class="mt-1 mb-2">
              <img :src="node.image" :alt="node.title" class="img-fluid border rounded">
            </div>
            <h5>
              <small>
              <router-link :to="{name: 'conversations.show', params: {id: node.id }}">
                {{ node.title }}
              </router-link>
              <span class="badge badge-primary mr-1" v-for="(tag, index) in node.tags" :key="index">{{ tag }}</span>
              </small>
            </h5>
            <!-- <p v-if="node.description">
              {{ node.description.en }}
            </p> -->
            <p>Duration: <strong>{{ node.duration }} mins</strong></p>
            <div class="text-right">
              <button class="btn btn-sm btn-danger" @click.prevent="removeLearningNode(node)">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AssignLearningNodeToGroupModal v-on:added-node="loadLearningNodes"/>
  </div>
</template>

<script>
  import AssignLearningNodeToGroupModal from './AssignLearningNodeToGroupModal.vue'

  export default {
    props: ['node'],
    components: {
      AssignLearningNodeToGroupModal
    },
    data() {
      return {
        learningNodes: [],
        loading: false
      }
    },
    mounted() {
      this.loadLearningNodes()
    },
    methods: {
      assignLearningNode() {
        this.$modal.show('learning-nodes.assign-group', this.node)
      },
      loadLearningNodes() {
        this.loading = true
        this.axios.get('/v5/admin/learning_nodes', {params: {per_page: 9999, group_id: this.node.id}})
          .then((res) => {
            this.loading = false
            this.learningNodes = res.data.data
          })
          .catch((error) => {
            this.loading = false
          })
      },
      removeLearningNode(node) {
        node.group_id = ""

        this.axios.post('/v5/admin/learning_nodes/' + node.id, {learning_node: node})
          .then((res) => {
            this.loadLearningNodes()
            this.$flash.notify('success', 'Node has been removed successfully')
          })
          .catch((res) => {

            let errors = res.response.data.errors;
            this.$flash.notify('danger', errors[0])
          })
      }
    }
  }
</script>