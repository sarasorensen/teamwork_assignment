<template>
  <tr >
    <td
      class="table-item__data"
      v-for="field in fields"
      :key="field.label"
      @click="rowClick(field.label)"
    >
      <span class="table-item__mobile-only" v-if="field.label !== 'Name'">{{
        field.label
      }}</span>

      <span
        class="table-item__mobile-only table-item__mobile-only--name"
        v-else
      >
        {{ field.value }}</span
      >

      <span
        :class="{
          'table-item__data--hover': field.label == 'Planet name',
          'table-item__desktop-only': field.label == 'Name',
        }"
      >
        {{ field.value }}</span
      >
    </td>
    <slot></slot>
  </tr>
</template>

<script>
export default {
  name: "TableItem",
  props: {
    fields: {
      type: Array,
      required: true,
    },
    rowClick: {
      type: Function,
      required: true,
    },
  },
};
</script>
