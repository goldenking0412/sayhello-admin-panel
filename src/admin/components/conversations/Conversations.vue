<template>
  <div>
    <div class="row">
      <div class="col-6">
        <h3>Learning Nodes</h3>
      </div>
      <div class="col-6 text-right">
        <div class="dropdown text-right">
          <button class="btn btn-success btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Add Learning Node
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" href="#" @click.prevent="addLearningNode()">Lesson</a>
            <a class="dropdown-item" href="#" @click.prevent="addGroup()">Group</a>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <h4>Search</h4>
    <div class="row">
      <div class="col-sm-5">
        <div class="form-group">
          <label>Title:</label>
          <input type="text" class="form-control" v-model="search.title">
        </div>
      </div>
      <div class="col-sm-4">
        <div class="form-group">
          <label>Tags:</label>
          <vue-tags-input
              v-model="tag"
              :tags="tags"
              @tags-changed="newTags => tags = newTags"
              :autocomplete-items="getAutocompleteTags(tag)"
            />
        </div>
      </div>
      <div class="col-sm-3">
        <div class="form-group">
          <label for="">Status:</label>
          <v-select multiple v-model="search.statuses" :options="['active', 'draft', 'archived']"></v-select>
        </div>
      </div>
      <div class="col-sm-12 text-right">
        <button class="btn btn-primary" @click.prevent="searchLearningNodes()">Search</button>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-6">
        Results: <strong>{{ total }}</strong>
      </div>
      <div class="col-6">
        <v-pagination :pages="totalPages" v-on:page-changed="changePage"
              ref="paginateTop"></v-pagination>
      </div>
    </div>
    <div class="listConversations">
      <div class="row">
        <div class="col-sm-4 col-md-3" v-for="node in learningNodes" :key="node.id">
          <div class="border mb-3 p-2 rounded">
            <div class="text-right status">
              <span style="color: #4CAF50" v-if="node.status == 'published' ">{{ node.status }}</span>
              <span style="color: #f44336" v-else>{{ node.status }}</span>
            </div>
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
            <div class="text-center">
              <router-link class="btn btn-sm btn-primary ml-1" :to="{name: 'conversations.show', params: {id: node.id }}">
                Edit
              </router-link>
              <button class="btn btn-sm btn-success ml-1" @click="openPreviewModal(node)">
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="emptyList" v-if="!learningNodes.length">
      Not found any Learning Nodes
    </div>
    <v-pagination :pages="totalPages" v-on:page-changed="changePage"
              ref="paginateBot"></v-pagination>
    <AddLearningNodeModal />
    <AddGroup />
    <PreviewLearningNodeModal :learningNodeId="activeNode"/>
  </div>
</template>
<script>
  import Paginate from 'vuejs-paginate'
  import AddLearningNodeModal from './AddLearningNodeModal.vue'
  import PreviewLearningNodeModal from './PreviewLearningNodeModal.vue'
  import TagsAucompleteMixin from '../../../mixins/tags-autocomplete'
  import VueTagsInput from '@johmun/vue-tags-input'
  import AddGroup from './AddGroup.vue'

  export default {
    mixins: [TagsAucompleteMixin],
    components: {
      Paginate, AddLearningNodeModal, PreviewLearningNodeModal, VueTagsInput,
      AddGroup
    },
    data() {
      return {
        learningNodes: [],
        totalPages: 0,
        total: 0,
        activeNode: '',
        tag: '',
        tags: [],
        search: {
          page: 1
        },
        tags: []
      }
    },
    mounted() {
      this.loadLearningNodes()
    },
    methods: {
      searchLearningNodes() {
        this.search.page = 1
        this.loadLearningNodes()
        this.setPaginationCurrentPage()
      },
      loadLearningNodes() {
        this.search.tags = this.tags.map(tag => tag.text)
        this.axios.get('/v5/admin/learning_nodes', {params: this.search})
          .then((res) => {
            this.learningNodes = res.data.data
            this.totalPages = res.data.meta.pagination.total_pages
            this.total = res.data.meta.pagination.total
          })
          .catch((res) => {

          })
      },
      changePage(page) {
        if(page != this.search.page) {
          this.search.page = page
          this.setPaginationCurrentPage()
          this.loadLearningNodes()
        }
      },
      setPaginationCurrentPage() {
        this.$refs.paginateTop.setCurrentPage(this.search.page)
        this.$refs.paginateBot.setCurrentPage(this.search.page)
      },
      addLearningNode() {
        this.$modal.show('learning-nodes.create')
      },
      addGroup() {
        this.$modal.show('learning-nodes.create-group')
      },
      openPreviewModal(node) {
        this.activeNode = node.id
        this.$modal.show('learning-nodes.preview')
      }
    }
  }
</script>

<style scoped>
  .status {
    text-transform: capitalize;
    font-weight: 500;
    color: #4CAF50;
  }
</style>
