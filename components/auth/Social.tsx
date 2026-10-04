/* 
import { Button } from "../ui/button";


export const Social = () => {

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full flex items-center gap-x-2"
        variant="outline"
        onClick={() => {
          window.location.href = "https://boring-anny-wilsonide-708b7cef.koyeb.app/auth/google"
        }}
      >
        <p>google signup</p>
        <img src="/google.png" alt="Google" width={20} height={20} />
      </Button>
      <Button
        size="lg"
        className="w-full flex items-center gap-x-2"
        variant="outline"
        onClick={() => {
          window.location.href = "https://boring-anny-wilsonide-708b7cef.koyeb.app/auth/github"
        }}
      >
        <p>github signup</p>
        <img
          src="/github.png"
          alt="Github"
          width={20}
          height={20}
          className="dark:bg-white dark:rounded-2xl dark:shadow-md"
        />
      </Button>
    </div>
  );
};


 */

import { Button } from "../ui/button";

export const Social = () => {
  return (
    <div className="space-y-3">
      <Button variant="outline" className="w-full py-3 rounded-xl font-medium">
        Continue with Google
      </Button>

      <Button variant="outline" className="w-full py-3 rounded-xl font-medium">
        Continue with GitHub
      </Button>
    </div>
  );
};
