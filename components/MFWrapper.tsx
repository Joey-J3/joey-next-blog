import { Suspense } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { CircularProgress } from "@mui/material";

export default function MFWrapper({ children }: { children: JSX.Element }) {
  return (
    <Suspense fallback={<CircularProgress />}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </Suspense>
  )
}