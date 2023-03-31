<template>
  <div>
    <form class="search-form">
      <input
        type="search"
        v-model="keyWord"
        placeholder="Search by name"
        class="search-input"
      />
      <i class="fa fa-search input-icon" v-if="keyWord == ''"></i>
      <i
        class="fa fa-close input-icon input-icon--clear"
        v-else
        @click="clearSearch"
      ></i>
    </form>

    <section class="message" v-if="query !== '' && queryResult == 0">
      <i class="fa fa-search message__icon"></i>
      <h2>Sorry! No results found.</h2>
      <p>
        We're sorry we couldn't find what you were looking for. Please try
        something else.
      </p>
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "SearchBar",
  data() {
    return {
      keyWord: "",
    };
  },
  computed: {
    ...mapState(["query", "queryResult"]),
  },
  methods: {
    ...mapMutations({
      setQuery: "SET_SEARCH_QUERY",
    }),
    clearSearch() {
      this.keyWord = "";
    },
  },
  created() {
    this.clearSearch();
  },
  watch: {
    keyWord() {
      this.setQuery(this.keyWord);
    },
  },
};
</script>
