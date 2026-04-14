import { createFileRoute } from '@tanstack/react-router'
import ToolForm from '../../../components/ToolForm';

export const Route = createFileRoute('/_authenticated/tools/new')({
  component: RouteComponent,
})

function RouteComponent() { 
  return (
    <div className="max-w-4xl mx-auto px-8 py-8 w-full">
      <h1>Register New Tool</h1>
      <p>Fill out the form below to register a new tool in the Tools Registry API.</p>
      <ToolForm />
    </div>
  );
}
