export default function Error({ message = "An unexpected error occurred." }: { message?: string }) {
  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 md:p-8 w-full">
      <h1>Something went wrong</h1>
      <p>{message}</p>
    </div>
  );
}