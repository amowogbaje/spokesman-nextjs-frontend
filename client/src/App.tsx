import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Locations from "@/pages/Locations";
import Watch from "@/pages/Watch";
import About from "@/pages/About";
import Care from "@/pages/Care";
import Give from "@/pages/Give";
import Events from "@/pages/Events";
import Welcome from "@/pages/Welcome";
import ChatScript from "./components/ChatScript";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/locations" component={Locations}/>
      <Route path="/watch" component={Watch}/>
      <Route path="/welcome" component={Welcome}/>
      <Route path="/about" component={About}/>
      <Route path="/care" component={Care}/>
      <Route path="/give" component={Give}/>
      <Route path="/events" component={Events}/>
      <Route path="/events/:slug" component={Events}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ChatScript />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
