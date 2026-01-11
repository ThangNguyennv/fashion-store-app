import moment from 'moment'

interface Props {
  time: Date | null
}

const FormatDateTime = ({ time }: Props) => {
  if (!time) return <p>Chưa có cập nhật thời gian</p>

  return <p>{moment(time).format('DD/MM/YYYY | HH:mm:ss')}</p>
}

export default FormatDateTime