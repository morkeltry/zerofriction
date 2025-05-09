
// import { useEffect } from "react";
// import { invoke } from "@tauri-apps/api/core";
import { ThemeProvider } from "@/components/theme-provider";
// import { useTheme } from "@/components/theme-provider"

import { Button } from "@/components/ui/button";
import "./index.css";

function App() {
  
  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="dark container w-full h-full flex flex-col items-center justify-center gap-4">
        <h1>NZero</h1>
        <Button>Click me</Button>
      
      </main>
    </ThemeProvider>
  );
}

export default App;
