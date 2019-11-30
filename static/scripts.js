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
      if (confirm("Подтверждаете удаление всех " + (key == "habits" ? "привычек" : "оценок") + "?")) localStorage.removeItem(key);
    },

    setCellClass: function(selHabit, selValue) {
      var cssclass = "calendar__row__cell";

      if (typeof this.habits_val[selHabit] === "object")
        if (typeof this.habits_val[selHabit][selValue] === "string") {
          cssclass += " habit-" + this.habits_val[selHabit][selValue];
        }

      return cssclass;
    },

    addHabit: function() {
      if (this.newHabit.length > 3) {
        const id = `f${(~~(Math.random() * 1e8)).toString(16)}`;

        this.habits = Object.assign({}, this.habits, { [id]: this.newHabit });
        this.habits_val = Object.assign({}, this.habits_val, { [id]: {} });

        this.newHabit = "";
      }
    },

    delHabit: function(selHabit) {
      if (confirm('Подтверждаете удаление "' + this.habits[selHabit] + '"?')) {
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
        } else {
          this.habits_val = Object.assign({}, this.habits_val, { [selHabit]: {} });
        }
        console.log("--- new stage ---");
        console.log(this.habits_val[selHabit][selValue]);
        switch (this.habits_val[selHabit][selValue]) {
          case "yes":
            this.habits_val[selHabit][selValue] = "no";
            console.log("Стал: " + this.habits_val[selHabit][selValue]);
            break;
          case "no":
            this.habits_val[selHabit][selValue] = "skip";
            console.log("Стал: " + this.habits_val[selHabit][selValue]);
            break;
          case "skip":
            console.log("Был удален ");
            Vue.delete(this.habits_val[selHabit], selValue);
            //            if (Object.keys(this.habits_val[selHabit]).length == 0) Vue.delete(this.habits_val, selHabit);
            break;

          default:
            this.habits_val[selHabit][selValue] = "yes";
            console.log("Стал: " + this.habits_val[selHabit][selValue]);
        }
      }
    }
  }
});
