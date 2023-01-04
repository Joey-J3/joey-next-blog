// pages/create.tsx

import Router from "next/router";
import Draft from "@/components/Draft";
import { IPost } from "../types";


const Create: React.FC = () => {
  const submitData = async (data: Partial<IPost>) => {
    try {
      await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      await Router.push("/drafts");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Draft onSubmit={submitData} />
  );
};

export default Create;
