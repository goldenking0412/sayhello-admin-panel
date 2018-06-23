export default {
  data() {
    return {
      autocompleteTags: [],
      lastSearchTag: ''

    }
  },
  methods: {
    loadAutocompleTags() {
      this.axios.get('/v5/admin/tags', { params: {seach: this.lastSearchTag} })
        .then((res) => {
          if (res.data.tags.length == 0) {
            this.isTagEmpty = true
          }
          this.autocompleteTags = res.data.tags.map(tag => {return {text: tag } })

        })
        .catch((res) => {
        })
    },
    getAutocompleteTags(query) {
      if (query && query != this.lastSearchTag) {
        this.lastSearchTag = query
        this.loadAutocompleTags()
      }

      return this.autocompleteTags
    }
  },
}