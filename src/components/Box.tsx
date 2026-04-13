export function GradientBox({ children, color, ...rest }: React.ComponentPropsWithoutRef<'div'> & {
  color: 'green' | 'red' | 'blue'; 
}) {
  return (
    <div 
      {...rest}
      className={`
        shadow-lg
        p-1 
        rounded-xl 
        bg-linear-to-b 
        ${color === 'blue' ? 
          "from-primary to-indigo-500" :
          color === 'red' ? 
          "from-primary to-red-500" :
          "from-primary to-green-500"
        }
      `}
    >
      <div className="bg-white dark:bg-black rounded-lg py-4 px-5">
        {children}
      </div>
    </div>
  );
}

const colorMap = {
  green: 'from-green-500 to-green-600',
  blue: 'from-blue-500 to-blue-600',
  orange: 'from-orange-500 to-orange-600',
  indigo: 'from-indigo-500 to-indigo-600',
};

export function Tags({ label, tags, color }: { label: string; tags: string[]; color: 'green' | 'blue' | 'orange' | 'indigo' }) {
  if (tags.length === 0) return null;
  return (
    <div className="mb-2">
      <h4 className="text-sm">{label}</h4>
      <div className="flex gap-1 flex-wrap">
        {tags.map((t) => (
          <span key={t} className={`bg-linear-to-b ${colorMap[color]} text-xs px-1.5 py-0.5 rounded-md text-white`}>{t}</span>
        ))}
      </div>
    </div>
  );
}