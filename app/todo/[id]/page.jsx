import React from "react";
import TodoPage from "./todo-client";

const Page = async ({ params }) => {
  const { id } = await params;
  return (
    <div className="bg-gray-100 min-h-screen">
      <TodoPage props={id} />
    </div>
  );
};

export default Page;
