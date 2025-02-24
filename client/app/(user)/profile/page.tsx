import { UserInfo } from "@/common/components/ux/UserInfo";

import { Suspense } from "react";



export default async function ProfilePage() {
  
  
  

  return (
    <div>
      <Suspense fallback = { <div>Loading...</div> }>
        <UserInfo />
      </Suspense>
    </div>
  )
}
  