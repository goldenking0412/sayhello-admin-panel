<template>
  <modal name="learning-nodes.assign-group" class="objectiveModal" @before-open="beforeOpen">
    <h4 class="text-center mb-4"><span v-if="group">{{ group.title }} - </span> Add Learning Node</h4>
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
              :disabled="node.group && node.group.id == group.id">
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
        group: null,
        learningNode: null,
        learningNodes: [],
        loading: false,
        tag: '',
        tags: [],
        search: {
          per_page: 99999
        }
      }
    },
    mounted() {
    },
    methods: {
      beforeOpen(event) {
        this.group = event.params
        this.loading = true
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
        this.learningNode.group_id = this.group.id

        this.axios.post('/v5/admin/learning_nodes/' + this.learningNode.id,
            {learning_node: this.learningNode})
          .then((res) => {
            this.loading = false
            this.$flash.notify('success', 'Node has been added successfully')
            this.$modal.hide('learning-nodes.assign-group')
            this.$emit('added-node', res.data)
          })
          .catch((res) => {
            this.loading = false

            let errors = res.response.data.errors;
            this.$flash.notify('danger', errors[0])
          })
      },
      close() {
        this.$modal.hide('learning-nodes.assign-group');
      }
    }
  }
</script>
