export default {
  data() {
    return {
      autocompleteTags: [],
      isTagEmpty: false
    }
  },
  methods: {
    loadAutocompleTags() {
      this.axios.get('/v5/admin/tags')
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
      if (!this.autocompleteTags.length && !this.isTagEmpty) {
        this.loadAutocompleTags()
      }

      return this.autocompleteTags.filter(i => new RegExp(query, 'i').test(i.text))
    }
  },
}