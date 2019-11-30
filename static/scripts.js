var app = new Vue({
  el: "#app",

  data: {
    days: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
    habits: JSON.parse(localStorage.getItem("habits")) || {},
    newHabit: "",
    habits_val: JSON.parse(localStorage.getItem("habits_val")) || {},
    arr_x: -1,
    arr_y: -1
  },

  methods: {
    clearLocalStorage: function() {
      if (confirm("Подтверждаете удаление всех привычек?")) {
        console.log(app.habits);
        localStorage.removeItem("habits");
        localStorage.removeItem("habits_val");
        app.habits = JSON.parse(localStorage.getItem("habits")) || {};
        app.habits_val = JSON.parse(localStorage.getItem("habits_val")) || {};
      }
    },
    setCellClass: function(habbit, day_id) {
      var cssclass = "calendar__row__cell";
      if (typeof this.habits_val === "object" && this.habits_val !== null) {
        if (
          typeof this.habits_val[habbit] === "object" &&
          this.habits_val[habbit] !== null
        ) {
          if (
            typeof this.habits_val[habbit][day_id] === "string" &&
            this.habits_val[habbit][day_id] !== null
          ) {
            console.log("im in");
            cssclass = cssclass + " habit_" + this.habits_val[habbit][day_id];
          }
        }
      }
      return cssclass;
    },

    addToLocalStorage: function(newHabit) {
      const id = `f${(~~(Math.random() * 1e8)).toString(16)}`;

      var newKey = {};
      newKey[id] = newHabit;

      this.habits = Object.assign({}, this.habits, newKey);

      localStorage.setItem("habits", JSON.stringify(this.habits));
      this.newHabit = "";
    },

    remLocalStorage: function(index) {
      if (confirm('Подтверждаете удаление "' + app.habits[index] + '"?')) {
        Vue.delete(app.habits, index);
        localStorage.setItem("habits", JSON.stringify(app.habits));

        Vue.delete(app.habits_val, index);
        localStorage.setItem("habits_val", JSON.stringify(app.habits_val));
      }
    },
    clickHabit: function(index, day_id) {
      for (i = 0; i < this.habits_count; i++) {
        var elem = document.querySelector('div[data-habit="' + i + '"]');
        elem.style.display = "none";
      }

      var elem = document.querySelector('div[data-habit="' + index + '"]');
      elem.style.display = "block";

      this.arr_x = index;
      this.arr_y = day_id;
    },
    setHabitVal: function(arr_x, arr_y, val) {
      if (typeof this.habits_val === "object" && this.habits_val !== null) {
        if (
          typeof this.habits_val[arr_x] === "object" &&
          this.habits_val[arr_x] !== null
        ) {
          if (
            typeof this.habits_val[arr_x][arr_y] === "string" &&
            this.habits_val[arr_x][arr_y] !== null
          ) {
            this.habits_val[arr_x][arr_y] = val;
          } else {
            var newVal = {};
            newVal[arr_y] = val;
            this.habits_val[arr_x] = Object.assign(
              {},
              this.habits_val[arr_x],
              newVal
            );
          }
        } else {
          var newKey = {};
          var newVal = {};
          newVal[arr_y] = val;
          newKey[arr_x] = newVal;
          this.habits_val = Object.assign({}, this.habits_val, newKey);
        }
      }

      localStorage.setItem("habits_val", JSON.stringify(this.habits_val));
      var elem = document.querySelector('div[data-habit="' + arr_x + '"]');
      elem.style.display = "none";
    }
  },
  computed: {
    habits_count: function() {
      return this.habits.length;
    }
  }
});
