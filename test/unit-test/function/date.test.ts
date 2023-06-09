import { DateFunctions } from '../../../src/function/date';

describe('DateFunction', () => {
  it('DATE', () => {
    expect(DateFunctions.DATE(1657699891483)).toEqual(new Date(1657699891483));
    expect(DateFunctions.DATE(1657699891)).toEqual(new Date(1657699891000));
    expect(DateFunctions.DATE('2022', '07', '13')).toEqual(
      new Date(2022, 6, 13),
    );
    expect(DateFunctions.DATE('2022', '07', '13', '13', '14', '59')).toEqual(
      new Date(2022, 6, 13, 13, 14, 59),
    );
    expect(DateFunctions.DATE()).toEqual(undefined);
  });
  it('DATEDELTA', () => {
    expect(DateFunctions.DATEDELTA(1657670400000, 30)).toEqual(1660262400000);
  });
  it('DAY', () => {
    expect(DateFunctions.DAY(1657704045734)).toEqual(13);
  });
  it('DAYS', () => {
    expect(DateFunctions.DAYS(1660262400000, 1657670400000)).toEqual(30);
  });
  it('HOUR', () => {
    expect(DateFunctions.HOUR(1657704045734)).toEqual(17);
  });
  it('ISOWEEKNUM', () => {
    expect(DateFunctions.ISOWEEKNUM(1657670400000)).toEqual(28);
  });
  it('MINUTE', () => {
    expect(DateFunctions.MINUTE(1657709844063)).toEqual(57);
  });
  it('MONTH', () => {
    expect(DateFunctions.MONTH(1657709844063)).toEqual(7);
  });
  it('TIME', () => {
    expect(DateFunctions.TIME(13, 14, 59)).toEqual(0.5520717592592592);
  });
  it('TIMESTAMP', () => {
    const date = new Date();
    expect(DateFunctions.TIMESTAMP(date)).toEqual(date.getTime());
  });
  it('NOW', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2022-07-13 00:00:00'));
    expect(DateFunctions.NOW()).toEqual(
      new Date('2022-07-13 00:00:00').getTime(),
    );
  });
  it('ONEYEARRANGDAY', () => {
    expect(
      DateFunctions.ONEYEARRANGDAY(1636416000, 1657324800, '2022'),
    ).toEqual(189);
    expect(
      DateFunctions.ONEYEARRANGDAY(1657324800, 1636416000, '2029'),
    ).toEqual(0);
  });
  it('TODAY', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2022-07-13 00:00:00'));
    expect(DateFunctions.TODAY()).toEqual(
      new Date('2022-07-13 00:00:00').getTime(),
    );
  });
  it('WEEKDAY', () => {
    expect(DateFunctions.WEEKDAY(1657704045734)).toEqual(3);
  });
  it('WEEKNUM', () => {
    expect(DateFunctions.WEEKNUM(1657704045734)).toEqual(29);
  });
  it('YEAR', () => {
    expect(DateFunctions.YEAR(1657704045734)).toEqual(2022);
  });
});
