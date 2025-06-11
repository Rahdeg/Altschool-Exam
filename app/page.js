import TodosPage from "@/components/todo";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <Suspense>
      <TodosPage />
    </Suspense>
  );
};

export default Page;
