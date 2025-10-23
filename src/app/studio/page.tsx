import Wrapper from "@/components/wrapper";
import { Main } from "./components/main";
import { Suspense } from "react";

export default function Studio() {
  return (
    <Wrapper className="max-w-7xl relative">
      <div className="p-3 lg:p-5 space-y-4 lg:space-y-2 flex flex-col h-screen">
        <Suspense>
          <Main />
        </Suspense>
      </div>
    </Wrapper>
  );
}
