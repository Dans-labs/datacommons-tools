import { createFileRoute } from '@tanstack/react-router'
import { useHealth } from '../hooks/useTools'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, isError } = useHealth();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="col-span-2">
          <h1 className="text-2xl font-bold mb-4">EOSC Data Commons Tools</h1>
          <p className="text-lg mb-4">Explore and create tools to enhance your data experience.</p>
        </div>
        <div>
          API Status:
          <div className="mt-2 p-4 rounded">
            {
              isLoading ? 
              <p>Checking API health…</p> : 
              isError ? 
              <p>API is down.</p> :
              <p>{data?.status} {data?.version}</p>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
