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
      const dates = [];
      let day = 1;
      const weekOfDays = [];

      const prevMonth = this.month === 1 ? 12 : this.month - 1;
      const prevYear = this.month === 1 ? this.year - 1 : this.year;
      const nextMonth = this.month === 12 ? 1 : this.month + 1;
      const nextYear = this.month === 12 ? this.year + 1 : this.year;

      // 지난 달
      for (let j = 0; j < monthFirstDay; j++) {
        weekOfDays.push({
          day: prevMonthLastDate - monthFirstDay + 1 + j,
          month: prevMonth,
          year: prevYear,
        });
      }

      // 이번 달
      while (day <= monthLastDate) {
        weekOfDays.push({
          day: day++,
          month: this.month,
          year: this.year,
        });

        if (weekOfDays.length === 7) {
          dates.push([...weekOfDays]);
          weekOfDays.length = 0;
        }
      }

      // 다음 달
      let nextDay = 1;
      while (weekOfDays.length > 0 && weekOfDays.length < 7) {
        weekOfDays.push({
          day: nextDay++,
          month: nextMonth,
          year: nextYear,
        });
      }

      if (weekOfDays.length) dates.push(weekOfDays);
      return dates;
    },
  },
};
</script>
<template>
  <section class="calendar-section">
    <div class="calendar-grid">
      <!-- 요일 헤더 -->
      <div
        v-for="(day, index) in days"
        :key="day"
        :class="[
          'day-header',
          { 'day-header--weekend': index === 0 || index === 6 },
        ]"
      >
        {{ day }}
      </div>

      <!-- 날짜 렌더링 -->
      <div
        v-for="(dayObj, idx) in dates.flat()"
        :key="idx"
        class="calendar-cell"
      >
        <RouterLink
          :to="
            monthlyDiaries[
              `${dayObj.year}-${String(dayObj.month).padStart(2, '0')}-${String(
                dayObj.day
              ).padStart(2, '0')}`
            ]?.id
              ? `/diary/${
                  monthlyDiaries[
                    `${dayObj.year}-${String(dayObj.month).padStart(
                      2,
                      '0'
                    )}-${String(dayObj.day).padStart(2, '0')}`
                  ].id
                }`
              : ''
          "
        >
          <div class="calendar-box">
            <div
              class="calendar-square-background w-[12vw] lg:w-[6.25rem] aspect-square"
              :style="{
                backgroundImage: `url(${
                  monthlyDiaries[
                    `${dayObj.year}-${String(dayObj.month).padStart(
                      2,
                      '0'
                    )}-${String(dayObj.day).padStart(2, '0')}`
                  ]
                    ? monthlyDiaries[
                        `${dayObj.year}-${String(dayObj.month).padStart(
                          2,
                          '0'
                        )}-${String(dayObj.day).padStart(2, '0')}`
                      ].imgUrl || '/assets/imgs/img_placeholder.png'
                    : '/assets/imgs/calender_placeholder.png'
                })`,
              }"
            >
              <span
                :class="[
                  'calendar-date-circle',
                  {
                    'calendar-date-circle--weekend':
                      idx % 7 === 0 || idx % 7 === 6,
                  },
                ]"
                >{{ dayObj.day }}</span
              >
              <div
                class="calendar-square-background w-[12vw] lg:w-[6.25rem] aspect-square dark:block hidden"
                :style="{
                  backgroundImage: `url(${
                    monthlyDiaries[
                      `${dayObj.year}-${String(dayObj.month).padStart(
                        2,
                        '0'
                      )}-${String(dayObj.day).padStart(2, '0')}`
                    ]
                      ? monthlyDiaries[
                          `${dayObj.year}-${String(dayObj.month).padStart(
                            2,
                            '0'
                          )}-${String(dayObj.day).padStart(2, '0')}`
                        ].imgUrl || '/assets/imgs/img_placeholder_dark.png'
                      : '/assets/imgs/calender_placeholder.png'
                  })`,
                }"
              >
                <span
                  :class="[
                    'calendar-date-circle',
                    {
                      'calendar-date-circle--weekend':
                        idx % 7 === 0 || idx % 7 === 6,
                    },
                  ]"
                  >{{ dayObj.day }}</span
                >
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.calendar-section {
  display: flex;
  justify-content: center;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-box {
  margin-top: 0.3125rem; /* 5px */
}

.calendar-square-background {
  position: relative;
  background-size: cover;
  cursor: pointer;
  transition: opacity 0.2s;
}

.calendar-square-background:hover {
  scale: 1.05;
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
  text-align: center;
}

.day-header--weekend {
  @apply text-hc-coral;
}

.calendar-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
