import { Suspense } from "react";

import { UserInfo } from "@/common/components/ux/UserInfo";

export default async function ProfilePage() {
  return (
    <div className="w-full flex justify-center items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <UserInfo />
      </Suspense>
    </div>
  );
}
