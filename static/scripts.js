new Vue({
  el: "#app",

  data: {
    days: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
    habits: {},
    habits_val: {},
    newHabit: ""
  },
  mounted() {
    this.habits = localStorage.getItem("habits").length > 0 ? JSON.parse(localStorage.getItem("habits")) : {};
    this.habits_val = JSON.parse(localStorage.getItem("habits_val")) || { 1: { 1: "yes", 2: "no", 3: "yes", 4: "yes" } };
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
    getHabitsVal: function(selHabit, selValue) {
      var cssclass = "calendar__row__cell";
      if (typeof this.habits_val[selHabit] === "object" && typeof this.habits_val[selHabit][selValue] === "string") {
        cssclass += " habit-" + this.habits_val[selHabit][selValue];
      }
      return cssclass;
    },
    getHabitsVal_demo: function(selHabit, selValue) {
      var habits_val = { 1: { 1: "yes", 2: "no", 3: "yes", 4: "yes" } };
      var cssclass = "calendar__row__cell";
      if (typeof habits_val[selHabit] === "object" && typeof habits_val[selHabit][selValue] === "string") {
        cssclass += " habit-" + habits_val[selHabit][selValue];
      }
      return cssclass;
    },

    addHabit: function() {
      if (this.newHabit.length > 3) {
        navigator.vibrate(50);
        const id = `f${(~~(Math.random() * 1e8)).toString(16)}`;

        this.habits = Object.assign({}, this.habits, { [id]: this.newHabit });

        gtag("event", "addHabit", { event_category: "habit", event_label: this.newHabit });
        this.newHabit = "";
      }
    },

    setHabitVal: function(selHabit, selValue) {
      if (typeof this.habits_val[selHabit] !== "object") {
        this.habits_val = Object.assign({}, this.habits_val, { [selHabit]: { [selValue]: " " } });
      }
      if (typeof this.habits_val[selHabit][selValue] !== "string") {
        this.habits_val[selHabit] = Object.assign({}, this.habits_val[selHabit], { [selValue]: " " });
      }

      if (this.habits_val[selHabit][selValue] !== "skip") {
        var vibrato = 50;
        this.habits_val[selHabit][selValue] = { " ": "yes", yes: "no", no: "skip" }[this.habits_val[selHabit][selValue]];
      } else {
        vibrato = 75;
        Vue.delete(this.habits_val[selHabit], selValue);
        if (Object.keys(this.habits_val[selHabit]).length === 0) Vue.delete(this.habits_val, selHabit);
      }

      navigator.vibrate([vibrato]);
      gtag("event", "setHabitVal", { event_category: "habit", event_label: this.habits[selHabit] });
    },

    delHabit: function(selHabit) {
      if (confirm('Хотите удалить "' + this.habits[selHabit] + '"?')) {
        gtag("event", "delHabit", { event_category: "habit", event_label: this.habits[selHabit] });

        Vue.delete(this.habits, selHabit);
        Vue.delete(this.habits_val, selHabit);
      }
    },

    delHabitsAll: function() {
      if (confirm("Хотите удалить все привычки?")) {
        this.habits = {};
      }
    },

    delHabitsValAll: function() {
      if (confirm("Хотите удалить все оценки?")) {
        this.habits_val = {};
      }
    }
  }
});
