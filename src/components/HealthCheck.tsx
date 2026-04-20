import { useHealth } from '../hooks/useTools';

export function HealthCheck() {
  const { data, isLoading, isError } = useHealth();

  return (
    <div className={`text-xs text-center rounded-lg py-2 px-4 font-bold bg-linear-to-r ${isError ? 'from-red-500 to-red-600' : isLoading ? 'from-yellow-500 to-yellow-600' : 'from-green-500 to-green-600'}`}>
      {
        isLoading ? 
        <span>Checking API health…</span> : 
        isError ? 
        <span>API is down.</span> :
        <span>API status: {data?.status} (v{data?.version})</span>
      }
    </div>
  );
}   