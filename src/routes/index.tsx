import { createFileRoute } from '@tanstack/react-router';
import { useHealth } from '../hooks/useTools';
import { useAuth } from 'react-oidc-context';
import { GradientBox } from '../components/Box';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, isError } = useHealth();
  const auth = useAuth();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-3 gap-4 p-4">
        <h1 className="text-2xl font-bold col-span-3 my-4">EOSC Data Commons Tools</h1>
        <div className="col-span-2">
          <p className="text-lg mb-4">Explore and create tools to enhance your data experience.</p>
          {!auth.isAuthenticated && (
            <p className="text-sm text-gray-400">
              <a href="/login" className="text-primary hover:underline">Log in</a> to manage your tools.
            </p>
          )}
        </div>
        <GradientBox color={isLoading ? "blue" : isError ? "red" : "green"}>
          <h2>API Status</h2>
          <div>
            {
              isLoading ? 
              <p>Checking API health…</p> : 
              isError ? 
              <p>API is down.</p> :
              <>
                <div className="mb-1">Status: {data?.status}</div>
                <div>Version: {data?.version}</div>
              </>
            }
          </div>
        </GradientBox>
      </div>
    </div>
  )
}
