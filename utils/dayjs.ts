import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

export { Dayjs } from 'dayjs';

dayjs.extend(utc);

export { dayjs };
