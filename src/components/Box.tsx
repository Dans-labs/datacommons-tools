export function GradientBox({ children, color, ...rest }: React.ComponentPropsWithoutRef<'div'> & {
  color: 'green' | 'red' | 'blue'; 
}) {
  return (
    <div 
      {...rest}
      className={`
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
      <div className="bg-black rounded-lg py-4 px-5">
        {children}
      </div>
    </div>
  );
}

export function Tags({ label, tags, color }: { label: string; tags: string[]; color: 'green' | 'blue' | 'orange' | 'indigo' }) {
  if (tags.length === 0) return null;
  return (
    <div className="mb-2">
      <h4 className="text-sm">{label}</h4>
      <div className="flex gap-1 flex-wrap">
        {tags.map((t) => (
          <span key={t} className={`bg-linear-to-b from-${color}-500 to-${color}-600 text-xs px-1.5 py-0.5 rounded-xl`}>{t}</span>
        ))}
      </div>
    </div>
  );
}