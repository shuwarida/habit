new Vue({
  el: "#app",

  data: {
    days: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
    habits: {},
    habits_val: {},
    newHabit: ""
  },
  mounted() {
    this.habits = JSON.parse(localStorage.getItem("habits")) || {};
    this.habits_val = JSON.parse(localStorage.getItem("habits_val")) || {};
  },
  watch: {
    habits: {
      handler: function(data) {
        localStorage.habits = JSON.stringify(data);
      },
      deep: true
    },
    habits_val: {
      handler: function(data) {
        localStorage.habits_val = JSON.stringify(data);
      },
      deep: true
    }
  },
  methods: {
    clearLocalStorageKey: function(key) {
      if (confirm("Хотите удалить все " + (key == "habits" ? "привычки" : "оценки") + "?")) {
        this.habits_val = {};
        if (key == "habits") this.habits = {};
      }
    },

    setCellClass: function(selHabit, selValue) {
      var cssclass = "calendar__row__cell";

      if (typeof this.habits_val[selHabit] === "object")
        if (typeof this.habits_val[selHabit][selValue] === "string") cssclass += " habit-" + this.habits_val[selHabit][selValue];

      return cssclass;
    },

    addHabit: function() {
      if (this.newHabit.length > 3) {
        navigator.vibrate(50);
        const id = `f${(~~(Math.random() * 1e8)).toString(16)}`;

        this.habits = Object.assign({}, this.habits, { [id]: this.newHabit });
        this.habits_val = Object.assign({}, this.habits_val, { [id]: {} });

        this.newHabit = "";
      }
    },

    delHabit: function(selHabit) {
      if (confirm('Хотите удалить "' + this.habits[selHabit] + '"?')) {
        Vue.delete(this.habits, selHabit);
        Vue.delete(this.habits_val, selHabit);
      }
    },

    setHabitVal: function(selHabit, selValue) {
      if (typeof this.habits_val === "object") {
        if (typeof this.habits_val[selHabit] === "object") {
          if (typeof this.habits_val[selHabit][selValue] !== "string") {
            this.habits_val[selHabit] = Object.assign({}, this.habits_val[selHabit], { [selValue]: {} });
          }
        } else this.habits_val = Object.assign({}, this.habits_val, { [selHabit]: {} });

        var vibrato = 50
        switch (this.habits_val[selHabit][selValue]) {
          case "yes":
            this.habits_val[selHabit][selValue] = "no";
            break;
          case "no":
            this.habits_val[selHabit][selValue] = "skip";
            break;
          case "skip":
            vibrato = 75
            Vue.delete(this.habits_val[selHabit], selValue);
            break;

          default:
            this.habits_val[selHabit][selValue] = "yes";
        }
        navigator.vibrate([vibrato]);
      }
    }
  }
}
