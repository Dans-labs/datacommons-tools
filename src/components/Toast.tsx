import { Toast } from '@base-ui/react/toast';
import { XMarkIcon } from '@heroicons/react/24/outline';

type ToastVariant = "success" | "error" | "info";

type CustomToastData = {
  variant?: ToastVariant;
};

export const toastManager = Toast.createToastManager<CustomToastData>();

export default function ToastProvider() {
  return (
    <Toast.Provider toastManager={toastManager}>
      <Toast.Portal>
        <Toast.Viewport className="fixed bottom-2 right-2">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager<CustomToastData>();
  return toasts.map((toast) => (
    <Toast.Root 
      key={toast.id} 
      toast={toast} 
      // todo : animations for entering/exiting toasts
      className={`
        ${toast.data?.variant === "error"
          ? "bg-red-500"
          : toast.data?.variant === "success"
            ? "bg-green-500"
            : "bg-gray-500"}
        text-white rounded-lg py-2 px-4 relative`}
      >
      <Toast.Content className="w-100">
        <Toast.Title className="text-sm" />
        <Toast.Description className="text-sm" />
        <Toast.Close className="absolute top-2 right-2 cursor-pointer" aria-label="Close">
          <XMarkIcon className="w-4 h-4" />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}
