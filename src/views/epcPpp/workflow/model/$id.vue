<template>
  <Bpmn :id="$route.params.id" v-bind="$props" />
</template>

<script>
import Bpmn from '../components/Bpmn'
export default {
  name: 'Item',
  components: { Bpmn }
}
</script>
