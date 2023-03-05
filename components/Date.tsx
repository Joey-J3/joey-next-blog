import dayjs from 'dayjs';
import { TIME_FORMAT } from '../utils';
import Typography from '@mui/material/Typography'


export default function Date({ dateString }: { dateString: string | number | Date | dayjs.Dayjs | null | undefined }) {
  const date = dayjs(dateString);
  return <Typography component='span' variant="subtitle2">
    <time className="text-gray-400" dateTime={date.toISOString()}>{date.format(TIME_FORMAT)}</time>
  </Typography>;
}