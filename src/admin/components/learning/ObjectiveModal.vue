<template>
  <modal name="objective.show" class="objectiveModal" @before-open="beforeOpen">
    <h4 class="text-center">Learning Objective</h4>
    <pre v-html="syntaxHighlight()" class="jsonHighlight">
    </pre>
    <div class="text-right">
      <button class="btn btn-primary btn-sm" @click.prevent="close()">Close</button>
    </div>
  </modal>
</template>

<script>
  export default {
    data() {
      return {
        objective: null
      }
    },
    methods: {
      beforeOpen(event) {
        this.objective = event.params
      },
      close() {
        this.$modal.hide('objective.show');
      },
      syntaxHighlight() {
        let json = JSON.stringify(this.objective, undefined, 4)

        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
      }
    }
  }
</script>
