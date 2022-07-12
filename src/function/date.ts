import dayjs from 'dayjs';
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(isoWeeksInYear)
dayjs.extend(isLeapYear)
dayjs.extend(weekOfYear)

const createDayjs = (timestamp: number): dayjs.Dayjs => {
  // unix time
  if (String(timestamp).length === 10) {
    return dayjs.unix(timestamp)
  } else {
    return dayjs(timestamp)
  }
}

export const DateFunctions = {
  'DATE(': function(...args: Array<string | number>) {
    let date;
    const dateArr = [...args]
    if (dateArr.length === 6) {
      // year month day hour minute second
      date = new Date(
        parseInt(String(dateArr[0]), 10),
        parseInt(String(dateArr[1]), 10) - 1,
        parseInt(String(dateArr[2]), 10),
        parseInt(String(dateArr[3]), 10),
        parseInt(String(dateArr[4]), 10),
        parseInt(String(dateArr[5]), 10),
      );
    } else if ([...args].length === 3) {
    // year month day
      date = new Date(
        parseInt(String(dateArr[0]), 10),
        parseInt(String(dateArr[1]), 10) - 1,
        parseInt(String(dateArr[2]), 10),
      );
    } else {
    // timestamp
      if (dateArr[0] === undefined) {
        return undefined;
      }
      date = createDayjs(Number(dateArr[0])).toDate();
    }
    return date;
  },
  'DATEDELTA(': function(a: number, b: number): number {
    return a + b * (60 * 60 * 24);
  },
  'DAY(': function(time: number): number | undefined {
    if (time === undefined) return;
    return createDayjs(time).day();
  },
  'DAYS(': function(start: number, end: number): number | undefined {
    if (start === undefined || end === undefined) return;
    const startTime = createDayjs(start);
    const endTime = createDayjs(end).format('YYYY-MM-DD');
    return startTime.diff(endTime, 'day');
  },
  'HOUR(': function(timestamp: number) {
    if (timestamp === undefined) return
    return createDayjs(timestamp).hour()
  },
  'ISOWEEKNUM(': function(timestamp: number) {
    return createDayjs(timestamp).isoWeeksInYear()
  },
  'MINUTE(': function(timestamp: number) {
    if (timestamp === undefined) return
    return createDayjs(timestamp).minute()
  },
  'MONTH(': function(timestamp: number) {
    if (timestamp === undefined) return
    return createDayjs(timestamp).month()
  },
  'TIME(': function(h: number, m: number, s: number) {
    return (3600 * h + 60 * m + s) / 86400;
  },
  'TIMESTAMP(': function(a: Date | number) {
    return Number(a) / 1000;
  },
  'NOW(': function() {
    return parseInt(String(new Date().getTime()));
  },
  'ONEYEARRANGDAY(': function(start: number, end: number, year: string) {
    if (!start || !end) return 0
    const startTime = createDayjs(start);
    const endTime = createDayjs(end);
    if (!year) return startTime.diff(endTime.format('YYYY-MM-DD'), 'day');
    let minTime = +start - +end > 0 ? +end : +end
    let maxTime = +start - +end > 0 ? +end : +end
    // the year's first day
    let preDate = String(start).length === 10 ? dayjs(`${year}-1-1 00:00:00`).unix() : dayjs(`${year}-1-1 00:00:00`)
    // the year's last day
    let nextDate = String(start).length === 10 ? dayjs(`${year}-12-12 23:59:59`).unix() : dayjs(`${year}-12-12 23:59:59`)
    if (minTime > nextDate || maxTime < preDate) {
      return 0
    }
    let arr = [minTime, maxTime, preDate, nextDate].sort()
    return (Number(arr[2]) - Number(arr[1])) / (1 * 60 * 60 * 24)
  },
  'TODAY(': function() {
    return new Date().getTime()
  },
  'WEEKDAY': function(timestamp: number) {
    return createDayjs(timestamp).date();
  },
  'WEEKNUM': function(timestamp: number) {
    return createDayjs(timestamp).week();
  },
  'YEAR': function(timestamp: number) {
    return createDayjs(timestamp).year();
  }
};
