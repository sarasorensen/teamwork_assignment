<template>
  <section class="table-item__popup" @click="closePopUp">
    <div class="table-item__popup--content" @click.stop>
      <ul v-for="field in fields" :key="field.label">
        <h2 v-if="field.label == 'name'">{{ field.value }}</h2>
        <li v-else>
          <b>{{ field.label }}:</b> {{ field.value }}
        </li>
      </ul>

      <button @click="closePopUp">Close</button>
    </div>
  </section>
</template>

<script>
export default {
  name: "PopUp",
  props: {
    fields: {
      type: Array,
      required: true,
    },
  },
  methods: {
    closePopUp() {
      this.$emit("closePopUp", true);
    },
  },
};
</script>
