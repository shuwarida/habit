new Vue({
  el: "#app",

  data: {
    days: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
    habits: JSON.parse(localStorage.getItem("habits")) || {},
    newHabit: "",
    habits_val: JSON.parse(localStorage.getItem("habits_val")) || {},
    arr_x: 0,
    arr_y: 0
  },

  methods: {
    clearHabits: function() {
      if (confirm("Подтверждаете удаление всех оценок?")) {
        localStorage.removeItem("habits");
        this.habits = JSON.parse(localStorage.getItem("habits")) || {};
      }
    },
    clearHabitsVal: function() {
      if (confirm("Подтверждаете удаление всех привычек?")) {
        this.clearLocalStorage("habits_val");
        this.habits_val = JSON.parse(localStorage.getItem("habits_val")) || {};
      }
    },
    clearLocalStorage: function(key) {
      localStorage.removeItem(key);
    },
    setCellClass: function(habbit, day_id) {
      var cssclass = "calendar__row__cell";
      if (typeof this.habits_val === "object" && this.habits_val !== null) {
        if (typeof this.habits_val[habbit] === "object" && this.habits_val[habbit] !== null) {
          if (typeof this.habits_val[habbit][day_id] === "string" && this.habits_val[habbit][day_id] !== null) {
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
      if (confirm('Подтверждаете удаление "' + this.habits[index] + '"?')) {
        Vue.delete(this.habits, index);
        localStorage.setItem("habits", JSON.stringify(this.habits));

        Vue.delete(this.habits_val, index);
        localStorage.setItem("habits_val", JSON.stringify(this.habits_val));
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
    setHabitVal: function(val) {
      if (typeof this.habits_val === "object" && this.habits_val !== null) {
        if (typeof this.habits_val[this.arr_x] === "object" && this.habits_val[this.arr_x] !== null) {
          if (typeof this.habits_val[this.arr_x][this.arr_y] === "string" && this.habits_val[this.arr_x][this.arr_y] !== null) {
            this.habits_val[this.arr_x][this.arr_y] = val;
          } else {
            this.habits_val[this.arr_x] = Object.assign({}, this.habits_val[this.arr_x], { [this.arr_y]: val });
          }
        } else {
          this.habits_val = Object.assign({}, this.habits_val, { [this.arr_x]: { [this.arr_y]: val } });
        }
      }

      localStorage.setItem("habits_val", JSON.stringify(this.habits_val));
      var elem = document.querySelector('div[data-habit="' + this.arr_x + '"]');
      elem.style.display = "none";
    }
  },
  computed: {
    habits_count: function() {
      return this.habits.length;
    }
  }
});
