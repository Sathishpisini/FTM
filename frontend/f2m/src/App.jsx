import { AllRoutes } from "./routes/AllRoutes";
import { Header, Footer } from "./components";
function App() {
  return (
    <div className=" App pt-16 dark:bg-slate-800 text-black dark:text-white">
      <Header/>
      <AllRoutes />
      <Footer/>
    </div>
  );
}

export default App;