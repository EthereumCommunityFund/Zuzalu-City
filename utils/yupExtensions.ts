import * as Yup from 'yup';
import dayjs from 'dayjs';
import { ITimezoneOption } from 'react-timezone-select';

Yup.addMethod(Yup.mixed, 'dayjs', function dayjsSchema() {
  return this.test(
    'is-dayjs',
    '${path} must be a valid Day.js object',
    function (value) {
      if (value === null || value === undefined) {
        return true;
      }
      return dayjs.isDayjs(value);
    },
  ).transform((value) => {
    return dayjs.isDayjs(value) ? value : dayjs(value);
  });
});

Yup.addMethod(Yup.mixed, 'timezone', function timezoneSchema() {
  return this.test(
    'is-timezone',
    '${path} must be a valid timezone',
    function (value) {
      return value === null || value === undefined || typeof value === 'string';
    },
  ).transform((value) => {
    return value as ITimezoneOption;
  });
});

export default Yup;
