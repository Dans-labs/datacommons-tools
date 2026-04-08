export function Button({ children, ...rest }: React.ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      {...rest}
      className="
        px-4 
        py-2 
        rounded-lg
        bg-linear-to-b from-primary to-indigo-500
        font-bold
        text-white 
        hover:bg-primary-dark
        cursor-pointer
        disabled:bg-gray-400 
        disabled:cursor-not-allowed 
        disabled:hover:bg-gray-400
      "
    >
      {children}
    </button>
  );
}