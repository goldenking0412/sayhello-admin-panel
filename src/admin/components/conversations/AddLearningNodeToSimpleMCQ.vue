<template>
  <modal name="learning-nodes.set-diff-node" class="objectiveModal" @before-open="beforeOpen">
    <h4 class="text-center mb-4">Add Learning Node</h4>
    <div class="row">
      <div class="col-sm-6">
        <div class="form-group">
          <label>Title:</label>
          <input type="text" class="form-control" v-model="search.title">
        </div>
      </div>
      <div class="col-sm-6">
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
    </div>
    <div class="text-right">
      <button class="btn btn-primary btn-md" @click.prevent="loadLearningNodes()">
        Search
      </button>
    </div>
    <hr>
    <form @submit.prevent="validateBeforeSubmit">
      <div class="form-group">
        <label>Learning Node:</label>
        <select name="learning_node" class="form-control" :class="{'is-invalid': errors.has('learning_node') }"
          v-validate="'required'" v-model="learningNode">
            <option value="">-- Select --</option>
            <option v-for="node in learningNodes" :value="node" :key="node.id" 
              :disabled="node.id == currentNodeID">
              {{ node.title }}
            </option>
        </select>
        <div class="invalid-feedback" v-if="errors.has('learning_node')">
          {{ errors.first('learning_node') }}
        </div>
      </div>
      <hr>
      <div class="text-right mt-4">
        <button class="btn btn-default btn-md" @click.prevent="close()">Close</button>
        <button class="btn btn-primary btn-md ml-2">
          Add
        </button>
      </div>
    </form>
    <Loading v-if="loading"/>
  </modal>
</template>

<script>
  import Loading from '../../../commons/Loading.vue'
  import TagsAucompleteMixin from '../../../mixins/tags-autocomplete'
  import VueTagsInput from '@johmun/vue-tags-input'

  export default {
    mixins: [TagsAucompleteMixin],
    components: {
      Loading, VueTagsInput
    },
    data() {
      return {
        learningNode: null,
        learningNodes: [],
        currentNodeID: null,
        loading: false,
        tag: '',
        tags: [],
        search: {
          title: '',
          tags: []
        }
      }
    },
    mounted() {
    },
    methods: {
      beforeOpen(event) {
        this.loading = true
        this.currentNodeID = event.params.nodeID
        this.loadLearningNodes()
      },
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.addNode()
            return
          }
        });
      },
      loadLearningNodes() {
        this.search.tags = this.tags.map(tag => tag.text)
        this.axios.get('/v5/admin/learning_nodes', {params: this.search})
          .then((res) => {
            this.loading = false
            this.learningNodes = res.data.data;
          })
          .catch((err) => {
            this.loading = false
          })
      },
      addNode() {
        this.loading = true
        this.$emit('set-learningNode', this.learningNode)
        this.loading = false
        this.$modal.hide('learning-nodes.set-diff-node');

      },
      close() {
        this.$modal.hide('learning-nodes.set-diff-node');
      }
    }
  }
</script>
