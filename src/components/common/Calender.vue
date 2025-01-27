<script>
import { getMonthlyDiaryImages } from "@/api/api-diary/api";

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
      monthlyDiaries: {},
    };
  },
  watch: {
    async year() {
      await this.loadMonthData();
      this.calendarData();
    },
    async month() {
      await this.loadMonthData();
      this.calendarData();
    },
  },
  async created() {
    await this.loadMonthData();
    this.calendarData();
  },
  methods: {
    async loadMonthData() {
      this.monthlyDiaries = await getMonthlyDiaryImages(this.year, this.month);
    },
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
      const firstDay = new Date(year, month - 1, 1).getDay();
      const lastDate = new Date(year, month, 0).getDate();
      let lastYear = year;
      let lastMonth = month - 1;
      if (month === 1) {
        lastMonth = 12;
        lastYear -= 1;
      }
      const prevLastDate = new Date(lastYear, lastMonth, 0).getDate();
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
      if (weekOfDays.length > 0) dates.push(weekOfDays);
      return dates;
    },
  },
};
</script>

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
              <RouterLink
                :to="
                  monthlyDiaries[day]?.id
                    ? `/diary/details/${monthlyDiaries[day].id}`
                    : ''
                "
              >
                <div class="calendar-box">
                  <div
                    class="calendar-square-background"
                    :style="{
                      backgroundImage: `url(${
                        monthlyDiaries[day]
                          ? monthlyDiaries[day].imgUrl ||
                            '/assets/imgs/img_placeholder.png'
                          : '/assets/imgs/calender_placeholder.png'
                      })`,
                    }"
                  >
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
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.calendar-box {
  margin-top: 0.3125rem; /* 5px */
}
.calendar-square-background {
  position: relative;
  width: 6.25rem; /* 100px */
  height: 6.25rem; /* 100px */
  background-image: url("/assets/imgs/img_placeholder.png");
  background-size: cover;
  margin-left: 0.5rem; /* 8px */
  margin-right: 0.3rem; /* 5px */
  cursor: pointer;
  transition: opacity 0.2s;
}

.calendar-square-background:hover {
  opacity: 0.8;
}

.calendar-date-circle {
  @apply inline-block leading-5 rounded-full text-hc-white text-center text-xs;
  position: absolute;
  width: 1.25rem; /* 20px */
  height: 1.25rem; /* 20px */
  margin: 0.4375rem; /* 7px */
  background-color: rgba(0, 0, 0, 0.5);
  font-family: "pretendard";
}

.calendar-date-circle--weekend {
  @apply bg-hc-coral;
}
.day-header {
  font-family: "Cafe24Meongi-B-v1.0";
  font-size: 1.25rem; /* 20px */
  @apply text-hc-white;
}

.day-header--weekend {
  @apply text-hc-coral;
}
</style>
