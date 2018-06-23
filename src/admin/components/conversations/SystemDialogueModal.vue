<template>
  <modal name="learning-nodes.system-dialogue" class="objectiveModal" @before-open="beforeOpen"
    :scrollable="true">
    <h4 class="text-center mb-4">New System Dialogue</h4>
    <p>Available merge fields: {name} {date} {time} {greetings_time}</p>
    <form @submit.prevent="validateBeforeSubmit">
      <div class="form-group">
        <label>Character</label>
        <select name="character" class="form-control" v-model="block.character.name">
          <option value="">-- Select --</option>
          <option :value="name" v-for="(name, index) in characters" :key="index">{{ name }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>Text to Speak</label>
        <input type="text" class="form-control" v-model="block.en.text" name="text">
      </div>
      <div class="form-group">
        <label>Sinhala Meaning</label>
        <input type="text" class="form-control" v-model="block.sin.text" name="meaning">
      </div>
      <h5>Instructions</h5>
      <div class="form-group">
        <input type="text" class="form-control" v-model="block.instructions.audio" v-validate="'url'" name="audio"
          placeholder="Audio URL">
        <div class="invalid-feedback" v-if="errors.has('audio')" style="display: block;">
          {{ errors.first('audio') }}
        </div>
      </div>
      <h5>Other options</h5>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="block.options.automatic_next">
          Automatic next
        </label>
      </div>
      <div class="text-right">
        <button class="btn btn-default btn-md" @click.prevent="close()">Close</button>
        <button class="btn btn-success btn-md ml-2">
          {{ isNewObject ? 'Create' : 'Update' }}
        </button>
      </div>
    </form>
    <Loading v-if="loading"/>
  </modal>
</template>

<script>
  import Loading from '../../../commons/Loading.vue'

  export default {
    components: {
      Loading
    },
    data() {
      return {
        characters: [],
        note: '',
        loading: false,
        isNewObject: true,
        node: {
          options: {},
          type: 'lesson',
          description: {
          }
        },
        block: {
          type: 'SystemDialogue',
          character: {},
          en: {},
          sin: {},
          instructions: {},
          options: {}
        }
      }
    },
    mounted() {
    },
    methods: {
      beforeOpen(event) {
        Object.assign(this.node, event.params.node)
        this.block = this.$options.data().block
        if (event.params.block) {
          this.block = JSON.parse(JSON.stringify(event.params.block))
          this.isNewObject = false
        }
        
        if (!this.block.character.name) {
          this.block.character.name = this.node.options.preffered_character
        }

        this.loadCharacters()
      },
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.addBlock()
            return
          }
        });
      },
      addBlock() {
        this.loading = true

        let blocks = this.node.blocks

        if (this.isNewObject) {
          blocks.push(this.block)  
        } else {
          for (const [index, block] of blocks.entries()) {
            if (block.id == this.block.id) {
              blocks[index] = this.block
              break
            }
          }
        }

        for (let block of blocks) {
          block._id = null
        }

        this.axios.post('/v5/admin/learning_nodes/' + this.node.id + '/blocks', {blocks: blocks})
          .then((res) => {
            this.loading = false
            this.$modal.hide('learning-nodes.system-dialogue')
            this.$flash.notify('success', "Block has been added successfully")
            this.$emit('added-block', res.data)
          })
          .catch((err) => {
            this.loading = false
          })
      },
      loadCharacters() {
        this.axios.get('/v5/admin/common/available_characters')
          .then((res) => {
            this.characters = res.data
          })
          .catch((err) => {

          })
      },
      close() {
        this.$modal.hide('learning-nodes.system-dialogue');
      }
    }
  }
</script>

<style>
  .objectiveModal .v--modal {
    top: 50px !important
  }
</style