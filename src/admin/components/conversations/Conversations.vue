<template>
  <div>
    <div class="row">
      <div class="col-6">
        <h3>Learning Nodes</h3>
      </div>
      <div class="col-6 text-right">
        <button class="btn btn-success" @click.prevent="addLearningNode()">New Conversation</button>
      </div>
    </div>
    <div class="listConversations mt-4">
      <div class="border mb-3 p-2 rounded" v-for="node in learningNodes" :key="node.id">
        <div class="row">
          <div class="col-sm-3">
            <img :src="node.image" :alt="node.title" class="img-fluid rounded">
          </div>
          <div class="col-sm-9">
            <div class="status">
              <span style="color: #4CAF50" v-if="node.status == 'published' ">{{ node.status }}</span>
              <span style="color: #f44336" v-else>{{ node.status }}</span>
            </div>
            <h5>
              <router-link :to="{name: 'conversations.show', params: {id: node.id }}">
                {{ node.title }}
              </router-link>
            </h5>
            <p v-if="node.description">
              {{ node.description.en }}
            </p>
            <p>Duration: <strong>{{ node.duration }} mins</strong></p>
            <div class="text-right">
              <button class="btn btn-sm btn-primary">
                Duplicate
              </button>
              <router-link class="btn btn-sm btn-info ml-1" :to="{name: 'conversations.show', params: {id: node.id }}">
                Edit
              </router-link>
              <button class="btn btn-sm btn-success ml-1">
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <paginate
      :page-count="totalPages"
      :click-handler="changePage"
      :container-class="'pagination justify-content-end'"
      :page-class="'page-item'"
      :page-link-class="'page-link'"
      :prev-class="'page-item'"
      :prev-link-class="'page-link'"
      :next-class="'page-item'"
      :next-link-class="'page-link'">
    </paginate>
    <AddLearningNodeModal v-on:created-learning-node="loadLearningNodes()"/>
  </div>
</template>
<script>
  import Paginate from 'vuejs-paginate'
  import AddLearningNodeModal from './AddLearningNodeModal.vue'

  export default {
    components: {
      Paginate, AddLearningNodeModal
    },
    data() {
      return {
        learningNodes: [],
        totalPages: 0,
        currentPage: 1
      }
    },
    mounted() {
      this.loadLearningNodes()
    },
    methods: {
      loadLearningNodes() {
        this.axios.get('/v5/admin/learning_nodes', {params: {page: this.currentPage}})
          .then((res) => {
            this.learningNodes = res.data.data
            this.totalPages = Math.ceil(res.data.total / res.data.per_page)
          })
          .catch((res) => {

          })
      },
      changePage(page) {
        if(page != this.currentPage) {
          this.currentPage = page
          this.loadLearningNodes()
        }
      },
      addLearningNode() {
        this.$modal.show('learning-nodes.create')
      }
    }
  }
</script>

<style scoped>
  .status {
    position: absolute;
    right: 20px;
    top: 0px;
    text-transform: capitalize;
    font-weight: 500;
    font-size: 15px;
    color: #4CAF50;
  }
</style>
