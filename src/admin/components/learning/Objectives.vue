<template>
  <div>
    <h2>Learning Objectives</h2>
    <div class="row">
      <div class="col-sm-4">
        <div class="form-group">
          <label>Title</label>
          <input type="text" class="form-control" v-model="search.title">
        </div>
      </div>
      <div class="col-sm-6">
        <label>Tags</label>
         <vue-tags-input
            v-model="search.tags"
            :tags="tags"
            @tags-changed="newTags => tags = newTags"
          />
      </div>
      <div class="col-sm-2">
        <label style="width: 100%;">&nbsp;</label>
        <button class="btn btn-primary" @click.prevent="loadLearnings()">
          Search
        </button>
      </div>
    </div>
    <section class="section">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Tags</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="object in learnings" :key="object.id">
              <td>{{ object.title }}</td>
              <td>
                <span class="badge badge-secondary" v-for="tag in object.tags" :key="tag"
                  style="margin-right: 5px;">
                  {{ tag }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-primary" @click.prevent="showObjective(object)">
                  View
                </button>
              </td>
            </tr>
            <tr v-if="!learnings.length">
              <td colspan="5">
                Not found any learning objectives
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <ObjectiveModal/>
  </div>
</template>
<script>
  import VueTagsInput from '@johmun/vue-tags-input';
  import ObjectiveModal from './ObjectiveModal.vue'

  export default {
    components: {
      VueTagsInput, ObjectiveModal
    },
    data() {
      return {
        learnings: [],
        tags: [],
        search: {
          limit: 50,
          page: 1,
          title: '',
          tags: ''
        }
      }
    },
    methods: {
      showObjective(objective) {
        this.$modal.show('objective.show', objective)
      },
      loadLearnings() {
        let params = {}
        Object.assign(params, this.search)
        params.tags = this.tags.map(tag => tag.text)

        this.axios.get('/v5/admin/learning_objectives', {params: params})
        .then((res) => {
          this.learnings = res.data.data
        })
        .catch((err) => {

        })
      }
    },
    mounted() {
      this.loadLearnings()
    }
  }
</script>
