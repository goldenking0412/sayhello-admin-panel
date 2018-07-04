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
    <hr>
    <h4>Search</h4>
    <div class="row">
      <div class="col-sm-5">
        <div class="form-group">
          <label for="">Status:</label>
          <v-select multiple v-model="search.statuses" :options="['active', 'draft', 'archived']"></v-select>
        </div>
      </div>
      <div class="col-sm-5">
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
      <div class="col-sm-2">
        <label style="width: 100%;">&nbsp;</label>
        <button class="btn btn-primary" @click.prevent="searchLearningNodes()">Search</button>
      </div>
    </div>
    <div class="mt-2">
      <paginate
        ref="paginateTop"
        :page-count="totalPages"
        :click-handler="changePage"
        :force-page="search.page - 1"
        :container-class="'pagination justify-content-end'"
        :page-class="'page-item'"
        :page-link-class="'page-link'"
        :prev-class="'page-item'"
        :prev-link-class="'page-link'"
        :next-class="'page-item'"
        :next-link-class="'page-link'">
      </paginate>
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
              <span class="badge badge-primary mr-1" v-for="(tag, index) in node.tags" :key="index">{{ tag }}</span>
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
    <paginate
      ref="paginateBot"
      :page-count="totalPages"
      :click-handler="changePage"
      :force-page="search.page - 1"
      :container-class="'pagination justify-content-end'"
      :page-class="'page-item'"
      :page-link-class="'page-link'"
      :prev-class="'page-item'"
      :prev-link-class="'page-link'"
      :next-class="'page-item'"
      :next-link-class="'page-link'">
    </paginate>
    <AddLearningNodeModal />
    <PreviewLearningNodeModal :learningNodeId="activeNode"/>
  </div>
</template>
<script>
  import Paginate from 'vuejs-paginate'
  import AddLearningNodeModal from './AddLearningNodeModal.vue'
  import PreviewLearningNodeModal from './PreviewLearningNodeModal.vue'
  import TagsAucompleteMixin from '../../../mixins/tags-autocomplete'
  import VueTagsInput from '@johmun/vue-tags-input'

  export default {
    mixins: [TagsAucompleteMixin],
    components: {
      Paginate, AddLearningNodeModal, PreviewLearningNodeModal, VueTagsInput
    },
    data() {
      return {
        learningNodes: [],
        totalPages: 0,
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
            this.totalPages = Math.ceil(res.data.total / res.data.per_page)
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
        this.$refs.paginateTop.selected = this.search.page
        this.$refs.paginateBot.selected = this.search.page
      },
      addLearningNode() {
        this.$modal.show('learning-nodes.create')
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
    position: absolute;
    right: 20px;
    top: 0px;
    text-transform: capitalize;
    font-weight: 500;
    font-size: 15px;
    color: #4CAF50;
  }
</style>
