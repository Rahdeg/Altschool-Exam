export default async function ErrorPage({ params }) {
  // Simulate an error
  throw new Error("Test error from error page");

  return (
    <div>
      <h1>This won't render</h1>
    </div>
  );
}
