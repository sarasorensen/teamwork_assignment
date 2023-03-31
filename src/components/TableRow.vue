<template>
  <section
    class="table-item"
    v-if="!peopleLoading && filteredPeople.length !== 0"
    tabindex="0"
    @keydown.esc="closePopUp"
  >
    <table>
      <thead>
        <tr class="table-item__columns">
          <th
            v-for="column in columns"
            :key="column"
            @click="sort(column)"
            :class="{
              'table-item__columns--active': sortColumn === column,
            }"
          >
            {{ column }}

            <i
              v-if="sortColumn === column"
              class="fa fa-arrow-up"
              :class="{
                'table-item__columns--active': sortColumn === column,
                'table-item__columns--triangle-asc':
                  sortOrder === 'asc' && sortColumn === column,
              }"
            ></i>
          </th>
        </tr>
      </thead>

      <tbody>
        <table-item
          v-for="person in filteredPeople"
          :key="person.name"
          :fields="getFields(person)"
          :rowClick="(field) => displayPopUp(person.name, field)"
          :activeWindow="activeWindow"
        >
          <pop-up
            v-if="activeWindow && activeRow == person.name"
            @closePopUp="closePopUp()"
            :fields="getPopUpFields(person)"
          />
        </table-item>
      </tbody>
    </table>
  </section>
</template>

<script>
import { ACTIONS } from "@/store";
import { mapActions, mapState, mapMutations } from "vuex";
import moment from "moment";
import _ from "lodash";

//components
import TableItem from "./TableItem.vue";
import PopUp from "./PopUp.vue";
export default {
  name: "TableRow",
  components: {
    TableItem,
    PopUp,
  },
  data() {
    return {
      columns: ["name", "height", "mass", "created", "edited", "planet name"],
      sortColumn: "name",
      sortOrder: "asc",
      activeWindow: false,
      activeRow: "",
    };
  },
  computed: {
    ...mapState(["people", "peopleLoading", "query"]),
    filteredPeople() {
      if (!this.people) {
        return [];
      }

      let that = this;

      return _.orderBy(
        this.people.filter((d) => {
          const words = this.query.split(" ");
          let hits = 0;

          for (let w of words) {
            w = w.toLowerCase();

            if (
              _.get(d, 'name').toLowerCase().indexOf(w) !== -1 ||
              _.get(d, 'mass').toLowerCase().indexOf(w) !== -1 ||
              _.get(d, 'height').toString().toLowerCase().indexOf(w) !== -1 ||
              _.get(d, 'homeworld').toString().toLowerCase().indexOf(w) !== -1 ||
              _.get(d, 'created').toLowerCase().indexOf(w) !== -1 ||
              _.get(d, 'edited').toString().indexOf(w) !== -1
            ) {
              hits++;
            }
          }
          return hits === words.length || this.query.trim() === "";
        }),
        function (element) {
          switch (that.getSortKey(that.sortColumn)) {
            case "name": {
              let name = _.get(element, "name", "");
              if (name == null || name == "undefined" || !name) {
                name = "";
              }
              return name.trim().toLowerCase();
            }
            case "height": {
              let height = _.get(element, "height", 0);
              height = parseInt(height);

              if (height == null || !height) {
                height = 0;
              }
              return height;
            }

            case "mass": {
              let mass = _.get(element, "mass", 0);
              mass = parseInt(mass);

              if (mass == null || !mass) {
                mass = 0;
              }
              return mass;
            }
            default:
              return _.get(element, that.getSortKey(that.sortColumn), "");
          }
        },
        [this.sortOrder]
      );
    },
  },
  methods: {
    ...mapActions({
      LOAD_PEOPLE: ACTIONS.LOAD_PEOPLE,
    }),
    ...mapMutations({
      SET_QUERY_RESULT: "SET_QUERY_RESULT",
    }),
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY hh:mm");
    },
    getFields(person) {
      let fields = [
        {
          label: "Name",
          value: _.get(person, "name", "loading"),
        },
        {
          label: "Height",
          value: `${_.get(person, "height", "Loading..")} cm`,
        },
        {
          label: "Mass",
          value: _.get(person, "mass", "Loading.."),
        },
        {
          label: "Created",
          value: this.formatDate(_.get(person, "created", "Loading..")),
        },
        {
          label: "Edited",
          value: this.formatDate(_.get(person, "edited"), "Loading.."),
        },
        {
          label: "Planet name",
          value: _.get(person, "homeworld.name", "Loading.."),
        },
      ];

      return fields;
    },
    getSortKey(key) {
      const keys = {
        name: "name",
        height: "height",
        mass: "mass",
        created: "created",
        edited: "edited",
        "planet name": "homeworld.name",
      };

      return keys[key];
    },
    sort(column) {
      if (this.sortColumn === column) {
        if (this.sortOrder === "asc") {
          this.sortOrder = "desc";
        } else {
          this.sortOrder = "asc";
        }
      } else {
        this.sortColumn = column;
        this.sortOrder = "asc";
      }
    },
    getPopUpFields(person) {
      let fields = [
        {
          label: "name",
          value: _.get(person, "homeworld.name", "Loading.."),
        },
        {
          label: "diameter",
          value: _.get(person, "homeworld.diameter", "Loading.."),
        },
        {
          label: "climate",
          value: _.get(person, "homeworld.climate", "Loading.."),
        },
        {
          label: "population",
          value: _.get(person, "homeworld.population", "Loading.."),
        },
      ];
      return fields;
    },
    displayPopUp(person, field) {
      if (field.toLowerCase() == "planet name") {
        this.activeWindow = true;
        this.activeRow = person;
      }
    },
    closePopUp() {
      this.activeWindow = false;
      this.activeRow = false;
    },
  },
  async mounted() {
    await this.LOAD_PEOPLE();
  },
  watch: {
    filteredPeople() {
      this.SET_QUERY_RESULT(this.filteredPeople.length);
    },
  },
};
</script>
