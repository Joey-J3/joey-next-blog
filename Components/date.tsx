import dayjs from 'dayjs';
import { TIME_FORMAT } from '../utils';


export default function Date({ dateString }: { dateString: string | number | Date | dayjs.Dayjs | null | undefined }) {
  const date = dayjs(dateString);
  return <time className="text-gray-400" dateTime={date.toISOString()}>{date.format(TIME_FORMAT)}</time>;
}