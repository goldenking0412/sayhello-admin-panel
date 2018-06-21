<template>
  <div>
    <h2>
      Students
      <span v-if="student && student.status == 'active'" class="badge badge-success">Active</span>
      <span v-if="student && student.status == 'suspended'" class="badge badge-danger">Suspended</span>
    </h2>
    <hr>
    <section class="section" v-if="student">
      <div class="row">
        <div class="col-sm-6">
          <h3>
            {{ student.name }}
            <span class="badge badge-primary mr-1" v-for="(tag, index) in student.tags" :key="index">{{ tag }}</span>
          </h3>
          <p>
            <strong>Email:</strong> {{ student.email }} <br>
            <strong>Phone:</strong> {{ student.phone }} <br>
            <strong>Since:</strong> {{ student.created_at | moment("DD/MM/YYYY") }}
          </p>
        </div>
        <div class="col-sm-6 text-right">
          <button class="btn btn-success btn-sm" @click.prevent="editStudent()">
            Edit
          </button>
          <div class="divider mb-2"></div>
          <button class="btn btn-primary btn-sm" @click.prevent="assignEvaluator()">
            Assign to Evaluator
          </button>
          <div v-if="student.evaluator" class="text-secondary mt-3">
            Assigned to: {{ student.evaluator.name }}
          </div>
        </div>
      </div>
      <hr>

      <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" data-toggle="tab" href="#learning-tab" role="tab">
            Ad Hoc Learning
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-toggle="tab" href="#path-tab" role="tab">
            Path
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-toggle="tab" href="#notes-tab" role="tab" >
            Notes
          </a>
        </li>
      </ul>

      <div class="tab-content" style="margin-top: 20px;">
        <div class="tab-pane active" id="learning-tab" role="tabpanel">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Learning Node</th>
                <th>Status</th>
                <th>Registered Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="node in learningNodes" :key="node.id">
                <td>{{ node.learning_node.title }}</td>
                <td>{{ node.status }}</td>
                <td>{{ node.created_at | moment('DD/MM/YYYY') }}</td>
                <td>
                  <button class="btn btn-sm btn-primary" @click.prevent="showSession(node)">
                    View
                  </button>
                </td>
              </tr>
              <tr v-if="!learningNodes.length">
                <td colspan="4">Not found any learning nodes</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="tab-pane" id="path-tab" role="tabpanel">
          <div class="text-right mb-4">
            <button class="btn btn-sm btn-success" @click.prevent="addLearningNode()">
              Add Learning Node
            </button>
          </div>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Learning Node</th>
                <th>Status</th>
                <th>Registered Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="node in paths" :key="node.id">
                <td>{{ node.learning_node.title }}</td>
                <td>{{ node.status }}</td>
                <td>{{ node.created_at | moment('DD/MM/YYYY') }}</td>
                <td>
                  <button class="btn btn-sm btn-primary" @click.prevent="showSession(node)">
                    View
                  </button>
                </td>
              </tr>
              <tr v-if="!paths.length">
                <td colspan="4">Not found any paths</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="tab-pane" id="notes-tab" role="tabpanel">
          <div class="text-right">
            <button class="btn btn-sm btn-success" @click.prevent="addNote()">
              Add note
            </button>
          </div>
          <div class="text-center" v-if="!student.notes || student.notes && !student.notes.length">
            You don't have any notes
          </div>
          <div class="mt-2" v-if="student.notes">
            <div class="border mb-2 p-2 rounded" v-for="note in student.notes" :key="note._id.$oid">
              {{ note.note }}
              <div class="text-right mt-1 text-secondary">
                By {{ note.owner.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <AddNoteModal v-on:added-note="this.addedNote"/>
    <AddLearningNodeModal v-on:added-learning-node="this.addedLearningNode"/>
    <AssignEvaluatorModal v-on:assigned-evaluator="this.assignedEvaluator" />
    <SessionModal />
    <EditStudentModal v-on:user-updated="this.userUpdated"/>
  </div>
</template>
<script>
  import Pagination from '../../../commons/Pagination.vue'
  import AddNoteModal from './AddNoteModal.vue'
  import AddLearningNodeModal from './AddLearningNodeModal.vue'
  import AssignEvaluatorModal from './AssignEvaluatorModal.vue'
  import SessionModal from './SessionModal.vue'
  import EditStudentModal from './EditStudentModal.vue'

  export default {
    components: {
      Pagination, AddNoteModal, AddLearningNodeModal, AssignEvaluatorModal,
      SessionModal, EditStudentModal
    },
    data() {
      return {
        student: null,
        learningNodes: [],
        paths: []
      }
    },
    methods: {
      showObjective(objective) {
        this.$modal.show('objective.show', objective)
      },
      loadStudent() {
        this.axios.get('/v5/admin/students/' + this.$route.params.id)
          .then((res) => {
            this.student = res.data.data
          })
          .catch((err) => {

          })
      },
      loadLearningNodes() {
        this.axios.get('/v5/admin/students/' + this.$route.params.id + '/learning_nodes?type=ondemand')
          .then((res) => {
            this.learningNodes = res.data.data
          })
          .catch((err) => {

          })
      },
      loadPaths() {
        this.axios.get('/v5/admin/students/' + this.$route.params.id + '/learning_nodes?type=path')
          .then((res) => {
            this.paths = res.data.data
          })
          .catch((err) => {

          })
      },
      editStudent() {
        this.$modal.show('students.edit', this.student)
      },
      userUpdated(student) {
        this.student = student
      },
      showSession(node) {
        this.$modal.show('students.session', node)
      },
      assignEvaluator() {
        this.$modal.show('students.assign-evaluator', this.student)
      },
      assignedEvaluator() {
        this.loadStudent()
      },
      addNote() {
        this.$modal.show('students.addNote', this.student)
      },
      addLearningNode() {
        this.$modal.show('students.add-learning-node', this.student)
      },
      addedNote(student) {
        this.loadStudent()
      },
      addedLearningNode(student) {
        this.loadLearningNodes()
      }
    },
    mounted() {
      this.loadStudent()
      this.loadLearningNodes()
      this.loadPaths()
    }
  }
</script>

<style scoped>
  .badge {
    font-size: 14px;
    vertical-align: middle;
  }
</style>