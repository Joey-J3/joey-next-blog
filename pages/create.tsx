// pages/create.tsx

import React, { useState } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import Link from "next/link";
import { Box, Button, TextField } from "@mui/material";

const Draft: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content };
      await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await Router.push('/drafts');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-200 p-12 flex justify-center items-center">
        <Box
          component="form"
          noValidate={true}
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          onSubmit={submitData}
          autoComplete="off"
          className="w-full"
        >
          <h1>New Draft</h1>
          <TextField
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
            className="w-full p-2 my-2 rounded border-2 border-solid"
          />
          <TextField
            multiline
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
            className="w-full p-2 my-2 rounded border-2 border-solid"
          />
          <Box sx={{ display: 'flex', gap: '1rem'}}>
            <Button
              disabled={!content || !title}
              variant="contained"
              type="submit"
              color="primary"
            >
              Create
            </Button>
            <Button variant="outlined" type="reset">
              <Link href={"/"}>
                or Cancel
              </Link>
            </Button>
          </Box>
        </Box>
      </div>
    </Layout>
  );
};

export default Draft;
