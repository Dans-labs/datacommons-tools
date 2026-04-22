import { useHealth } from '../hooks/useTools';
import { ExclamationCircleIcon, CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import Tooltip from './Tooltip';

export function HealthCheck() {
  const { data, isLoading, isError } = useHealth();

  return (
    <Tooltip 
      pos="right" 
      text={isLoading ? "Checking API health..." : isError ? "API is down." : `API status: ${data?.status} (v${data?.version})`} 
      className="sm:hidden"
    >    
      <div 
        className={`
        text-xs text-center 
        rounded-lg 
        py-2 px-1 sm:px-4 w-full
        font-bold 
        text-white
        bg-linear-to-r ${isError ? 'from-red-500 to-red-600' : isLoading ? 'from-yellow-500 to-yellow-600' : 'from-green-500 to-green-600'}
      `}>
        {
          isLoading ?
          <span className="flex items-center justify-center gap-1">
            <QuestionMarkCircleIcon className="w-5 h-5" />
            <span className="hidden sm:block">Checking API health…</span>
          </span> : 
          isError ? 
          <span className="flex items-center justify-center gap-1">
            <ExclamationCircleIcon className="w-5 h-5" />
            <span className="hidden sm:block">API is down.</span>
          </span> :
          <span className="flex items-center justify-center gap-1">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="hidden sm:block">API status: {data?.status} (v{data?.version})</span>
          </span>
        }
      </div>
    </Tooltip>
  );
}   