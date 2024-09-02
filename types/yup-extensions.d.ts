import * as Yup from 'yup';
import dayjs from 'dayjs';
import { ITimezoneOption } from 'react-timezone-select';

declare module 'yup' {
  interface MixedSchema<TType = any, TContext = any, TOut = any> {
    dayjs(): Yup.DateSchema<dayjs.Dayjs | null | undefined, TContext>;
    timezone(): Yup.ObjectSchema<ITimezoneOption | null | undefined, TContext>;
  }
}
