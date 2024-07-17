import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';

export { Dayjs } from 'dayjs';

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(timezone);
dayjs.extend(isBetween);

export { dayjs };

export default dayjs;
