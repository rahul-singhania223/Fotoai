import Wrapper from "@/components/wrapper";
import Header from "./components/header";
import { MainComponent } from "./components/main";
import { Suspense } from "react";

export default function Home() {
  return (
    <Wrapper>
      <div className="p-3 space-y-10">
        <Header />
        <main className="space-y-8 w-full h-[calc(100vh-150px)]">
          <Suspense>
            <MainComponent />
          </Suspense>
        </main>
      </div>
    </Wrapper>
  );
}
