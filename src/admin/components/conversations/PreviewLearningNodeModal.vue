<template>
  <modal name="learning-nodes.preview" class="objectiveModal" @before-open="beforeOpen"
    :scrollable="true" width="40%">
    <h4 class="mb-4">Preview Learning Node</h4>
    <div class="close" @click="close">
      X
    </div>
    <br/>
    <h5>
      Preview from desktop
    </h5>
    <div class="text-right">
      <button class="btn btn-success btn-md ml-2" @click="desktopPreview">
        View Now
      </button>
    </div>

    <h5>
      Get a link to check
    </h5>
    <div>
      Email to send the link
    </div>
    <div class="form-group">
      <input class="form-control" type="text"  v-model="email">
    </div>
    <div class="text-right">
      <span v-if="emailSent">Emailed the preview link</span>
      <button class="btn btn-success btn-md ml-2" @click="sendEmailPreview">
        send
      </button>
    </div>
    <Loading v-if="loading"/>
  </modal>
</template>

<script>
  import Loading from '../../../commons/Loading.vue'


  export default {
    props: ['learningNodeId'],
    components: {
      Loading
    },
    data() {
      return {
        loading: false,
        baseUrl: '',
        email: '',
        emailSent: false
      }
    },
    methods: {
      beforeOpen() {
        this.loading = true
        this.email = ''
        this.axios.get('/v5/config')
          .then((res) => {
            this.baseUrl = res.data.talk_app_url
            this.loading = false
          })
          .catch((res) => {
            this.loading = false
          })
      },
      desktopPreview() {
        window.open(`${this.baseUrl}/register/${this.learningNodeId}/?test_session=true`, '_blank')
      },
      sendEmailPreview() {
        this.loading = true        
        this.axios.post(`/v5/admin/learning_nodes/${this.learningNodeId}/share`, {
          email: this.email,
          for_testing: true
        }).then((res) => {
          this.loading = false
          this.emailSent = true
        })
        .catch((res) => {

        })
      },
      close() {
        this.$modal.hide('learning-nodes.preview')
      }
    }
}
</script>
