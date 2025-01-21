<template>
  <section class="calendar-section">
    <div class="calendar-container">
      <table class="calendar-table has-text-centered is-fullwidth">
        <thead>
          <tr>
            <th
              v-for="(day, index) in days"
              :key="day"
              :class="[
                'day-header',
                { 'day-header--weekend': index === 0 || index === 6 },
              ]"
            >
              {{ day }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(date, idx) in dates" :key="idx">
            <td v-for="(day, secondIdx) in date" :key="secondIdx">
              <div class="calendar-box">
                <div class="calendar-square-background">
                  <span
                    :class="[
                      'calendar-date-circle',
                      {
                        'calendar-date-circle--weekend':
                          secondIdx === 0 || secondIdx === 6,
                      },
                    ]"
                    >{{ day }}</span
                  >
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
const imgPlaceholder = "/assets/imgs/img_placeholder.png";
export default {
  props: {
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      days: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
      dates: [],
    };
  },
  watch: {
    year: "calendarData", // 연도 변경 시 달력 재계산
    month: "calendarData", // 월 변경 시 달력 재계산
  },
  created() {
    this.calendarData();
  },
  methods: {
    calendarData() {
      const [monthFirstDay, monthLastDate, lastMonthLastDate] =
        this.getFirstDayLastDate(this.year, this.month);
      this.dates = this.getMonthOfDays(
        monthFirstDay,
        monthLastDate,
        lastMonthLastDate
      );
    },
    getFirstDayLastDate(year, month) {
      const firstDay = new Date(year, month - 1, 1).getDay(); // 이번 달 시작 요일
      const lastDate = new Date(year, month, 0).getDate(); // 이번 달 마지막 날짜
      let lastYear = year;
      let lastMonth = month - 1;
      if (month === 1) {
        lastMonth = 12;
        lastYear -= 1;
      }
      const prevLastDate = new Date(lastYear, lastMonth, 0).getDate(); // 지난 달 마지막 날짜
      return [firstDay, lastDate, prevLastDate];
    },
    getMonthOfDays(monthFirstDay, monthLastDate, prevMonthLastDate) {
      let day = 1;
      let prevDay = prevMonthLastDate - monthFirstDay + 1;
      const dates = [];
      let weekOfDays = [];
      while (day <= monthLastDate) {
        if (day === 1) {
          for (let j = 0; j < monthFirstDay; j += 1) {
            weekOfDays.push(prevDay);
            prevDay += 1;
          }
        }
        weekOfDays.push(day);
        if (weekOfDays.length === 7) {
          dates.push(weekOfDays);
          weekOfDays = [];
        }
        day += 1;
      }
      const len = weekOfDays.length;
      if (len > 0 && len < 7) {
        for (let k = 1; k <= 7 - len; k += 1) {
          weekOfDays.push(k);
        }
      }
      if (weekOfDays.length > 0) dates.push(weekOfDays); // 남은 날짜 추가
      return dates;
    },
  },
};
</script>

<style scoped>
.calendar-box {
  margin-top: 5px;
}
.calendar-square-background {
  position: relative;
  width: 100px;
  height: 100px;
  background-image: url("/assets/imgs/img_placeholder.png");
  background-size: cover;
  margin-left: 8px;
  margin-right: 5px;
}

.calendar-date-circle {
  @apply inline-block w-5 h-5 leading-5 rounded-full text-hc-white text-center m-1 text-xs;
  position: absolute;
  margin: 7px;
  background-color: rgba(0, 0, 0, 0.5);
  font-family: "pretendard";
}

.calendar-date-circle--weekend {
  @apply bg-hc-coral;
}
.day-header {
  font-family: "Cafe24Meongi-B-v1.0";
  font-size: 20px;
  @apply text-hc-white;
}

.day-header--weekend {
  @apply text-hc-coral;
}
</style>
