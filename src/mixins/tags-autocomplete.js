export default {
  data() {
    return {
      autocompleteTags: []
    }
  },
  methods: {
    loadAutocompleTags() {
      this.axios.get('/v5/admin/tags')
        .then((res) => {
          this.autocompleteTags = res.data.tags.map(tag => {return {text: tag } })
        })
        .catch((res) => {
        })
    },
    getAutocompleteTags(query) {
      if (!this.autocompleteTags.length) {
        this.loadAutocompleTags()
      }

      return this.autocompleteTags.filter(i => new RegExp(query, 'i').test(i.text))
    }
  },
}