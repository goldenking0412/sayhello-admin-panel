<template>
  <modal name="precheck.reject" class="commonModal" @before-open="beforeOpen">
    <div class="p-4">
      <h4 class="text-center mb-4">Reject session</h4>
      <form @submit.prevent="validateBeforeSubmit">
        <div class="form-group">
          <label>Reason:</label>
          <select name="reason" v-validate="'required'" class="form-control" v-model="params.reason"
            :class="{'is-invalid': errors.has('reason') }">
            <option value="" selected>-- Select reason --</option>
            <option :value="reason" v-for="(reason, index) in reasons" :key="index">{{ reason }}</option>
          </select>
          <div class="invalid-feedback" v-if="errors.has('reason')">
            {{ errors.first('reason') }}
          </div>
        </div>
        <hr>
        <div class="text-right mt-4">
          <button class="btn btn-default btn-md" @click.prevent="close()">Close</button>
          <button class="btn btn-success btn-md ml-2">
            Reject
          </button>
        </div>
      </form>
      <loading v-if="loading"/>
    </div>
  </modal>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        reasons: [],
        sessionId: null,
        params: {
          reason: '',
          precheck_status: false
        },
      }
    },
    mounted() {
      this.load
    },
    methods: {
      beforeOpen(event) {
        Object.assign(this.$data, this.$options.data())
        this.sessionId = event.params

        this.loading = true
        this.loadReasons()
      },
      loadReasons() {
        this.axios.get('/v5/common/session_reject_resons')
          .then((res) => {
            this.reasons = res.data.reasons
            this.loading = false
          })
          .catch((res) => {
            this.$flash.notify('danger', 'Can\'t load reasons. Please try again')
            this.loading = false
          })
      },
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.rejectSession()
            return
          }
        })
      },
      rejectSession() {
        this.loading = true
        this.axios.post('/v5/students/learning_nodes/' + this.sessionId + '/precheck', this.params)
          .then((res) => {
            this.loading = false
            this.close()
            this.$flash.notify('success', 'Session has been rejected successfully')
            this.$emit('session-rejected')
          })
          .catch((res) => {
            this.$flash.notify('success', 'Can\'t reject session. Please try again')
            this.loading = false
          })
      },
      close() {
        this.$modal.hide('precheck.reject');
      }
    }
  }
</script>