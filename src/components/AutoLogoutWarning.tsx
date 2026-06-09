import { useOidc } from "@/oidc";
import { Dialog } from "@base-ui/react/dialog";
import { m } from "@/paraglide/messages";

export default function AutoLogoutWarning() {
  const { autoLogoutState } = useOidc();

  if (!autoLogoutState.shouldDisplayWarning) {
    return null;
  }

  return (
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/50 h-screen w-screen z-100" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg z-110">
          <div className="">
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {m.logout_modal_header()}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-600 dark:text-gray-400">
              {m.logout_modal_body({ count: autoLogoutState.secondsLeftBeforeAutoLogout })}
            </Dialog.Description>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
