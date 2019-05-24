<template>
  <div v-if="node">
    <div class="border mb-3 p-2 rounded">
      <div class="row">
        <div class="col-sm-3">
          <img :src="node.image" :alt="node.title" class="img-fluid rounded">
        </div>
        <div class="col-sm-9">
          <div class="status">
            <span style="color: #f44336" v-if="node.status == 'draft' ">{{ node.status }}</span>
            <span style="color: #4CAF50" v-else>{{ node.status }}</span>
          </div>
          <h5>
            <div>
              {{ node.title }}
              <span class="badge badge-primary mr-1" v-for="(tag, index) in node.tags" :key="index">{{ tag }}</span>
            </div>
          </h5>
          <p v-if="node.description">
            {{ node.description.en }}
          </p>
          <p>Duration: <strong>{{ node.duration }} mins</strong></p>
          <div class="text-right">
            <button class="btn btn-sm btn-primary" @click.prevent="duplicateLearningNode()">
              <i v-if="loading" class="fas fa-sync-alt fa-spin"></i>
              <span v-if="!loading">Duplicate</span>
            </button>
            <button class="btn btn-sm btn-info ml-1" @click.prevent="editNode()">
              Edit
            </button>
            <button class="btn btn-sm btn-danger ml-1" v-if="node.status != 'draft'" @click.prevent="updateStatus('draft')">
              Unpublish
            </button>
            <button class="btn btn-sm btn-success ml-1" v-else  @click.prevent="updateStatus('active')">
              Publish
            </button>
            <button class="btn btn-sm btn-success ml-1" @click="showPreviewModal">
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div v-if="node && node.type == 'lesson'">
      <div class="dropdown text-right">
        <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Add Block
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a class="dropdown-item" href="#" @click.prevent="addBlock('system-dialogue')">SystemDialogue</a>
          <a class="dropdown-item" href="#" @click.prevent="addBlock('user-dialogue')">UserDialogue</a>
          <a class="dropdown-item" href="#" @click.prevent="addBlock('simplemcq-dialogue')">SimpleMCQDialogue</a>
          <a class="dropdown-item" href="#" @click.prevent="addBlock('mcqsummarysimple-dialogue')">MCQ Summary Simple</a>
          <a class="dropdown-item" href="#" @click.prevent="addBlock('content')">Content</a>
          <a class="dropdown-item" href="#" @click.prevent="addBlock('web-page')">WebPage</a>
        </div>
      </div>

      <div class="listBlocks mt-2" v-if="node" @end="updateBlocks">
        <draggable v-model="node.blocks" :options="{draggable:'.item'}">
          <div class="border item rounded mb-3 p-4" v-for="(block, index) in node.blocks" :key="block.id">
            <div class="text-right">
              <button class="btn btn-warning btn-sm" v-if="block.type == 'SystemDialogue'">System</button>
              <button class="btn btn-primary btn-sm" v-else-if="block.type == 'UserDialogue'">User</button>
              <button class="btn btn-light btn-sm" v-else-if="block.type == 'SimpleMCQ'">Multiple Choice Question</button>
              <button class="btn btn-light btn-sm" v-else-if="block.type == 'MCQSummarySimple'">MCQ Summary Simple</button>
              <button class="btn btn-danger btn-sm" v-else-if="block.type == 'WebPage'">WebPage</button>
              <button class="btn btn-secondary btn-sm" v-else>Content</button>
            </div>
            <h5 v-if="block.type == 'SimpleMCQ'">{{ block.title }}</h5>
            <h5 v-else>{{ block.en ? block.en.text : block.title}}</h5>
            <div v-if="block.type == 'Content'" v-html="block.content"></div>
            <div v-if="block.type == 'WebPage'" v-html="block.url"></div>
            <div v-else>{{ block.sin ? block.sin.text : ''}}</div>
            <div class="mt-4" v-if="block.instructions && block.instructions.audio">
              <audio controls style="width: 100%;">
                <source :src="block.instructions.audio" type="audio/ogg">
                  Your browser does not support the audio element.
              </audio>
            </div>
            <div class="mt-2 text-right">
              <button class="btn btn-success btn-sm" @click.prevent="editBlock(block)">
                <i class="far fa-edit"></i>
              </button>
              <button class="btn btn-danger btn-sm ml-2" @click.prevent="removeBlock(index)">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </draggable>
      </div>
    </div>
    <ConversationGroup :node="node" v-if="node && node.type == 'group'"/>

    <SystemDialogueModal v-on:added-block="addedBlock"/>
    <ContentModal v-on:added-block="addedBlock"/>
    <SimpleMCQDialogueModal v-on:added-block="addedBlock" ref="simplemcqdialogue"/>
    <MCQSummarySimple v-on:added-block="addedBlock"/>
    <WebPageModal v-on:added-block="addedBlock"/>
    <UserDialogueModal v-on:added-block="addedBlock"/>
    <AddLearningNodeModal v-on:updated-node="addedBlock"/>
    <AddAnswerModal v-on:add-answer="addAnswerToSimpleMCQ"/>
    <AddGroup />
    <AssignLearningNodeToGroupModal />
    <AddLearningNodeToSimpleMCQ v-on:set-learningNode="setLearningNodeToSimpleMCQ"/>
    <PreviewLearningNodeModal :learningNodeId="node.id"/>
  </div>
</template>

<script>
  import SystemDialogueModal from './SystemDialogueModal.vue'
  import AddLearningNodeModal from './AddLearningNodeModal.vue'
  import SimpleMCQDialogueModal from './SimpleMCQDialogueModal.vue'
  import MCQSummarySimple from './MCQSummarySimpleModal.vue'
  import AddAnswerModal from './AddAnswerModal.vue'
  import ContentModal from './ContentModal.vue'
  import AddGroup from './AddGroup.vue'
  import WebPageModal from './WebPageModal.vue'
  import UserDialogueModal from './UserDialogueModal.vue'
  import PreviewLearningNodeModal from './PreviewLearningNodeModal.vue'
  import draggable from 'vuedraggable'
  import ConversationGroup from './ConversationGroup.vue'
  import AssignLearningNodeToGroupModal from './AssignLearningNodeToGroupModal.vue'
  import AddLearningNodeToSimpleMCQ from './AddLearningNodeToSimpleMCQ.vue'

  export default {
    components: {
      SystemDialogueModal, ContentModal, UserDialogueModal, draggable, AddLearningNodeModal,
      WebPageModal, PreviewLearningNodeModal, AddGroup, ConversationGroup, SimpleMCQDialogueModal, AddAnswerModal, AssignLearningNodeToGroupModal, AddLearningNodeToSimpleMCQ, MCQSummarySimple
    },
    data() {
      return {
        node: null,
        loading: false
      }
    },
    mounted() {
      this.loadNode()
    },
    methods: {
      loadNode() {
        this.axios.get('/v5/admin/learning_nodes/' + this.$route.params.id)
          .then((res) => {
            this.node = res.data
          })
          .catch((res) => {

          })
      },
      addBlock(type) {
        this.$modal.show('learning-nodes.' + type, {node: this.node })
      },
      addedBlock(node) {
        this.node = node
      },
      editNode() {
        if (this.node.type == 'group') {
          this.$modal.show('learning-nodes.create-group', this.node)
        } else {
          this.$modal.show('learning-nodes.create', this.node)
        }
      },
      editBlock(block) {
        let type = 'system-dialogue'

        switch (block.type) {
          case 'UserDialogue':
            type = 'user-dialogue'
            break;
          case 'Content':
            type = 'content'
            break;
          case 'SimpleMCQ':
            type = 'simplemcq-dialogue'
            break;
          case 'WebPage':
            type = 'web-page'
            break;
          case 'MCQSummarySimple':
            type = 'mcqsummarysimple-dialogue'
            break;
          default:
            break;
        }

        this.$modal.show('learning-nodes.' + type, {node: this.node, block: block})
      },
      removeBlock(index) {
        this.node.blocks.splice(index, 1)
        this.updateBlocks()
      },
      duplicateLearningNode() {
        this.loading = true
        this.axios.post('/v5/admin/learning_nodes/' + this.node.id + '/duplicate')
          .then((res) => {
            this.loading = false
            this.$flash.notify('success', "Node has been duplicated successfully")
            this.$router.push({ name: 'conversations.show', params: {id: res.data.id}})
          })
          .catch((err) => {
            this.loading = false
            this.$flash.notify('success', "Can't duplicate node. Please try again")
          })
      },
      addAnswerToSimpleMCQ(answer) {
        this.$refs.simplemcqdialogue.addAnswer(answer)
      },
      setLearningNodeToSimpleMCQ(learningNode) {
        this.$refs.simplemcqdialogue.setLearningNode(learningNode)
      },
      updateBlocks() {
        let blocks = this.node.blocks
        for (let block of blocks) {
          block._id = null
        }

        this.axios.post('/v5/admin/learning_nodes/' + this.node.id + '/blocks', {blocks: blocks})
          .then((res) => {
            this.$flash.notify('success', "Blocks have been updated successfully")
            this.node = res.data
          })
          .catch((err) => {
          })
      },
      showPreviewModal() {
        this.$modal.show('learning-nodes.preview')
      },
      updateStatus(status) {
        if (confirm("Are you sure about updating status to " + status)) {
          this.node.status = status;

          this.axios.post('/v5/admin/learning_nodes/' + this.node.id, { learning_node: this.node })
            .then((res) => {
              this.node = res.data;
            })
            .catch((err) => {
            })
        }
        
      }
    }
  }
</script>

<style scoped>
  .status {
    position: absolute;
    right: 20px;
    top: 0px;
    text-transform: capitalize;
    font-weight: 500;
    font-size: 15px;
    color: #4CAF50;
  }
  .listBlocks .item {
    background: #FFF;
    cursor: move;
  }
</style>
