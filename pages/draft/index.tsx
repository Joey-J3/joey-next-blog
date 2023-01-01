import LiveMarkdown from "../../components/LiveMarkdown"

function Draft() {

  const onSave = (value: string) => {
    console.log(value);
  }

  return (
    <div>
      <LiveMarkdown onSave={onSave} />
    </div>
  )
}
export default Draft