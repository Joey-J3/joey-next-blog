
interface Prop {
  children?: JSX.Element | null;
}

const Card: React.FC<Prop> = function({ children }) {
  return (
    <div className="bg-slate-100 p-4 shadow-2xl rounded-2xl w-full">
      {children}
    </div>
  )
}

export default Card;