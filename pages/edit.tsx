import Router, { useRouter } from "next/router";
import Draft from "@/components/Draft";
import { IPost } from "../types";
import { useEffect, useState } from "react";


const Edit: React.FC = () => {
  const [ID, setID] = useState("");
  const router = useRouter()
  
  const submitData = async (data: Partial<IPost>) => {
    try {
      await fetch(`/api/post/${ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      await Router.push("/drafts");
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const id = router.query.id
    if (id && typeof id === 'string') {
      setID(id)
    }
  }, [router.query.id]);

  return (
    <Draft onSubmit={submitData} />
  );
};

export default Edit;
