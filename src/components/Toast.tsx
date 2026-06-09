import { Toast } from "@base-ui/react/toast";
import { XMarkIcon } from "@heroicons/react/24/outline";

type ToastVariant = "success" | "error" | "info";

type CustomToastData = {
  variant?: ToastVariant;
};

export const toastManager = Toast.createToastManager<CustomToastData>();

export default function ToastProvider() {
  return (
    <Toast.Provider toastManager={toastManager}>
      <Toast.Portal>
        <Toast.Viewport className="fixed bottom-4 right-4">
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
        shadow-lg
        w-full box-border rounded-lg
        py-4 px-8 relative
        z-[calc(1000-var(--toast-index))]
        h-(--toast-height)
        ${
          toast.data?.variant === "error"
            ? "bg-red-700"
            : toast.data?.variant === "success"
              ? "bg-green-700"
              : "bg-blue-700"
        }
        text-white
        transition-[transform,opacity,height]
        duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]
        h-(--height)
        transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]
        data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]
        data-expanded:h-(--toast-height)
        data-starting-style:transform-[translateY(150%)]
        data-ending-style:transform-[translateY(150%)]
        data-ending-style:opacity-0
        data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]
        data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]
        data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]
        data-limited:opacity-0
        [--scale:calc(max(0,1-(var(--toast-index)*0.1)))]
        [--shrink:calc(1-var(--scale))]
        [--height:var(--toast-frontmost-height,var(--toast-height))]
        [--offset-y:calc(var(--toast-offset-y)*-1+(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]
        [--gap:0.75rem]
        [--peek:0.75rem]
      `}
    >
      <Toast.Content className="w-100 overflow-hidden">
        <Toast.Title className="text-sm mb-1" />
        <Toast.Description className="text-sm mb-0" />
        <Toast.Close className="absolute top-4 right-4 cursor-pointer" aria-label="Close">
          <XMarkIcon className="w-4 h-4" />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}
