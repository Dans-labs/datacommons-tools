import { Button } from "./Button";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { useOidc } from "@/oidc";
import { m } from "@/paraglide/messages";

export function AuthButtons({ expanded, className }: { expanded?: boolean; className?: string }) {
  const { isOidcReady, isUserLoggedIn } = useOidc();

  return (
    <div className="mt-4">
      {isOidcReady ? (
        isUserLoggedIn ? (
          <LogoutButton hideTextOnSmall={!expanded} className={className} />
        ) : (
          <LoginButton hideTextOnSmall={!expanded} className={className} />
        )
      ) : (
        <Button className={className} disabled>
          {m.loading()}
        </Button>
      )}
    </div>
  );
}

export function LoginButton({
  className,
  hideTextOnSmall,
}: {
  className?: string;
  hideTextOnSmall?: boolean;
}) {
  const { login } = useOidc({ assert: "user not logged in" });

  return (
    <Button className={className} onClick={() => login()}>
      <div className="flex justify-center items-center gap-1">
        <LockClosedIcon className="w-5 h-5 md:mr-2" />
        <span className={hideTextOnSmall ? "hidden md:block" : ""}>{m.login()}</span>
      </div>
    </Button>
  );
}

export function LogoutButton({
  className,
  hideTextOnSmall,
}: {
  className?: string;
  hideTextOnSmall?: boolean;
}) {
  const { logout } = useOidc({ assert: "user logged in" });

  return (
    <Button className={className} onClick={() => logout({ redirectTo: "home" })}>
      <div className="flex justify-center items-center gap-1">
        <LockOpenIcon className="w-5 h-5 md:mr-2" />
        <span className={hideTextOnSmall ? "hidden md:block" : ""}>{m.logout()}</span>
      </div>
    </Button>
  );
}
