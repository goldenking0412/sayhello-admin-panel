export default {
  data() {
    return {
      learningObjectives: [],
      learningObjectiveOptions: []
    }
  },
  mounted() {
  },
  methods: {
    loadLearningObjectives() {
      this.axios.get('/v5/admin/learning_objectives', { params: { per_page: 9999} })
          .then((res) => {
            this.learningObjectiveOptions = res.data.data

            this.learningObjectives = this.learningObjectives.map(id => {
              return this.learningObjectiveOptions.find((obj) => {
                return id == obj.id
              })
            })
          })
          .catch((err) => {
          })
    }
  }

}