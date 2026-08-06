import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateProject />} />
        <Route path="/projectdetails" element={<ProjectDetails />} />
      </Routes>
    </Layout>
  );
}

export default App;








