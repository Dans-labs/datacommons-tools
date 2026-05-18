import { Button as BaseButton } from '@base-ui/react/button';

export function Button({ children, className, ...rest }: React.ComponentPropsWithoutRef<'button'>) {
  return (
    <BaseButton
      {...rest}
      className={`
        px-3 sm:px-4 
        py-2 
        rounded-lg
        bg-linear-to-r from-indigo-500 to-indigo-600
        hover:from-indigo-400 hover:to-indigo-500
        transition-colors
        duration-300
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
    </BaseButton>
  );
}

export function OutlineButton({ children, className, ...rest }: React.ComponentPropsWithoutRef<'button'>) {
  return (
    <BaseButton
      {...rest}
      className={`
        p-0.5
        rounded-lg
        bg-linear-to-r from-indigo-500 to-indigo-600
        font-bold
        dark:text-white 
        cursor-pointer
        disabled:bg-gray-400 
        disabled:cursor-not-allowed 
        disabled:hover:bg-gray-400
        ${className}
      `}
    >
      <div className="bg-white dark:bg-gray-900 px-3.5 py-1.5 rounded-md hover:bg-gray-900/70 transition-colors duration-300">
        {children}
      </div>
    </BaseButton>
  );
}