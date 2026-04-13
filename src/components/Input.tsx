export function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative my-4 max-w-full group">
      <input type="text" {...props} className="outline-none px-3 py-3 peer" placeholder=" "/>
      <label className="absolute left-[9px] top-px text-sm text-gray-400 transition-all duration-300 px-1 transform -translate-y-1/2 pointer-events-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-lg group-focus-within:!top-px group-focus-within:!text-sm group-focus-within:!text-primary">
        {label}
      </label>

      <fieldset className="inset-0 absolute border-2 border-gray-300 dark:border-gray-600 rounded-xl pointer-events-none mt-[-9px] invisible peer-placeholder-shown:visible transition-all duration-300 group-focus-within:!border-primary group-focus-within:border-2 group-hover:border-gray-300">
        <legend className="ml-2 px-0 text-sm transition-all duration-300 invisible max-w-[0.01px] group-focus-within:max-w-full group-focus-within:px-1 whitespace-nowrap">
          {label}
        </legend>
      </fieldset>

      <fieldset className="inset-0 absolute border-2 border-gray-300 dark:border-gray-600 rounded-xl pointer-events-none mt-[-9px] visible peer-placeholder-shown:invisible transition-all duration-300 group-focus-within:border-2 group-focus-within:!border-primary group-hover:border-gray-300">
        <legend className="ml-2 text-sm invisible px-1 max-w-full whitespace-nowrap">
          {label}
        </legend>
      </fieldset>
    </div>
  );
}
