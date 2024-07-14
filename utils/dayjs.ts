import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

export { Dayjs } from 'dayjs';

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export { dayjs };
