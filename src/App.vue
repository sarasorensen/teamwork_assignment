<template>
  <header>
    <h1>Star Wars</h1>
    <h2>Sara Sørensen</h2>
  </header>

  <div class="wrap">
    <search-bar />
    <table-row />
    <div v-if="peopleLoading" class="loader-wrap">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

//components
import SearchBar from "./components/SearchBar.vue";
import TableRow from "./components/TableRow.vue";
export default {
  name: "App",
  components: {
    SearchBar,
    TableRow,
  },
  computed: {
    ...mapState(["peopleLoading"]),
  },
};
</script>

<style>
@import "../styles/base.css";
</style>
