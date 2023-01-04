import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import Router from "next/router";
import { useEffect, useState } from "react";
import { IPost } from "../types";
import Layout from "./Layout";
import LiveMarkdown from "./LiveMarkdown";

interface Props {
  isEdit?: boolean;
  post?: IPost;
  onSubmit: (data: Partial<IPost>, e: React.SyntheticEvent) => Promise<void>;
}

const Draft: React.FC<Props> = ({ isEdit, post, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content };
      await onSubmit(body, e)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (post) {
      setTitle(post?.title)
      setContent(post?.content)
    }
  }, [post]);

  return (
    <Layout>
      <Box
        component="form"
        noValidate={true}
        sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        onSubmit={submitData}
        autoComplete="off"
        className="w-full"
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <h1>{title || "New Draft"}</h1>
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Button
              disabled={!content || !title}
              variant="contained"
              type="submit"
              color="primary"
            >
              { isEdit ? "Save" : "Create" }
            </Button>
            <Button variant="outlined" type="reset" onClick={() => Router.back() }>
              Cancel
            </Button>
          </Box>
        </Box>
        <TextField
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          type="text"
          value={title}
          className="w-full p-2 my-2 rounded border-2 border-solid"
        />
        <LiveMarkdown
          markdownInput={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Box>
    </Layout>
  );
}
 
export default Draft;