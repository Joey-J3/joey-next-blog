// pages/create.tsx

import React, { useState } from "react";
import Layout from "@/components/Layout";
import Router from "next/router";
import Link from "next/link";
import { Box, Button, TextField } from "@mui/material";
import LiveMarkdown from "@/components/LiveMarkdown";

const Draft: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content };
      await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/drafts");
    } catch (error) {
      console.error(error);
    }
  };

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
              Create
            </Button>
            <Button variant="outlined" type="reset">
              <Link href={"/"}>or Cancel</Link>
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
};

export default Draft;
