import * as Yup from 'yup';
import dayjs from 'dayjs';

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

export default Yup;
