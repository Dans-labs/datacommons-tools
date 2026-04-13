export function Button({ children, className, ...rest }: React.ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      {...rest}
      className={`
        px-4 
        py-2 
        rounded-lg
        bg-linear-to-b from-primary to-indigo-500
        font-bold
        text-white 
        cursor-pointer
        disabled:bg-gray-400 
        disabled:cursor-not-allowed 
        disabled:hover:bg-gray-400
        ${className}
      `}
    >
      {children}
    </button>
  );
}