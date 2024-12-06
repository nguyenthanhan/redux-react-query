import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainStack from "./pages/MainStack";

//---------------------------------------------------------------

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MainStack />
    </QueryClientProvider>
  );
};

export default App;
