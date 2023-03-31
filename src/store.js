import axios from "axios";
import { createStore } from "vuex";

export const MUTATIONS = {
  SET_PEOPLE: "SET_PEOPLE",
  SET_PLANET: "SET_PLANET",
  SET_SEARCH_QUERY: "SET_SEARCH_QUERY",
  SET_QUERY_RESULT: "SET_QUERY_RESULT",
};
export const ACTIONS = {
  LOAD_PEOPLE: "LOAD_PEOPLE",
};

export default createStore({
  state: {
    people: [],
    peopleLoading: false,
    query: "",
    queryResult: 0,
  },
  mutations: {
    [MUTATIONS.SET_PEOPLE](state, people) {
      state.people = people;
      state.peopleLoading = true;
    },
    [MUTATIONS.SET_SEARCH_QUERY](state, query) {
      state.query = query;
    },
    [MUTATIONS.SET_QUERY_RESULT](state, queryResult) {
      state.queryResult = queryResult;
    },
  },
  actions: {
    async [ACTIONS.LOAD_PEOPLE]({ commit, state }) {
      state.peopleLoading = true;
      try {
        let newHomeworld = "";
        let response = "";
        let url = "https://swapi.dev/api/people";
        let config = {
          headers: {
            "Content-Type": "application/json",
          },
          data: {},
        };

        response = await axios.get(url, config);

        commit(MUTATIONS.SET_PEOPLE, response.data.results);

        if (state.people.length !== 0) {
          await state.people.forEach(async (el) => {
            newHomeworld = await axios.get(el.homeworld, config);
            el.homeworld = newHomeworld.data;
          });
        }

        commit(MUTATIONS.SET_PEOPLE, state.people);
        return response;
      } catch (error) {
        console.error("Failed to get people list", error);
      } finally {
        state.peopleLoading = false;
      }
    },
  },
});
