import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// react components (layout).
import Navbar from "@/components/layout/Navbar";

// react components (page)
import Task from "@/pages/tasks/Task";
import Login from "@/pages/auth/Login";
import Tasks from "@/pages/tasks/Tasks";
import Register from "@/pages/auth/Register";
import EditTask from "@/pages/tasks/EditTask";
import CreateTask from "@/pages/tasks/CreateTask";

// react components (route).
import PublicRoutes from "@/components/routes/PublicRoute";
import PrivateRoutes from "@/components/routes/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Tasks />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:taskId" element={<Task />} />

        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<PrivateRoutes />}>
          <Route path="/tasks/create" element={<CreateTask />} />
          <Route path="/tasks/:taskId/edit" element={<EditTask />} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
