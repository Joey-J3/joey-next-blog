import Box from "@mui/material/Box";

interface Prop {
  children?: JSX.Element | null;
}

const Card: React.FC<Prop> = function({ children }) {
  return (
    <Box className="bg-slate-100 p-4 shadow-2xl rounded-2xl w-full">
      {children}
    </Box>
  )
}

export default Card;