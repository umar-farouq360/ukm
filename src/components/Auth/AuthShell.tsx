import type { PropsWithChildren } from "react";
import AuthArt from "./AuthArt";
import { authArtCaption } from "../../data/auth";

const AuthShell: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen bg-au-page text-au-ink p-3 sm:p-6 lg:px-[5vw] lg:py-8 flex items-center">
      <div className="w-full gri ">
        {children}
        <div
          className="relative hidden lg:block overflow-hidden bg-black"
          aria-hidden="true"
        >
          <AuthArt />
          <div className="absolute left-6 bottom-6 flex items-center gap-2.5 text-[13px] text-white">
            <span
              className="size-6 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #D9CBFF, #A78BFA)",
              }}
            />
            <span>
              {authArtCaption.before}{" "}
              <span className="text-white/70">{authArtCaption.by}</span>{" "}
              {authArtCaption.author}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
