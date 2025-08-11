import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@redux_toolkit/store";
import Layout from "@components/layout/Layout";
import Home from "@pages/main/Home";
import Login from "@pages/auth/Login";
import Register from "@pages/auth/Register.jsx";
import CreateForm from "@pages/main/CreateForm";
import Devices from "@pages/main/device/index";
import Registers from "@pages/main/device/Registers";
import EditDevice from "@pages/main/device/EditDevice";
import Citys from "@pages/main/city/index";
import EditCity from "@pages/main/city/EditCity";
import Forms from "@pages/main/form/index";
import FormDetail from "@pages/main/form/FormDetail";
import AugmentedRealities from "@pages/main/augmentedRealities/index";
import ARDetails from "@pages/main/augmentedRealities/ARDetails";
import ProjectDetails from "@pages/main/augmentedRealities/ProjectDetails";
import SubProject from "@pages/main/augmentedRealities/SubProject";
import DeviceDetail from "@pages/main/device/DeviceDetail";
import Graphs from "@pages/main/graphs/index";
import GraphId from "@pages/main/graphs/GraphId";
import Employees from "@pages/main/employess/employees";
import EmployeesDetail from "@pages/main/employess/EmployeesDetail";
import EditEmployess from "@pages/main/employess/EditEmployess";
import CreateComponent from "@pages/main/CreateComponent";
import Settings from "@pages/main/Settings";
import NotFound from "@pages/404";

const App = () => {
  return (
    <Provider store={store}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/createform" element={<CreateForm />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/devices/deviceDetail" element={<DeviceDetail />} />
          <Route path="/devices/editdevice" element={<EditDevice />} />
          <Route path="/devices/:deviceId/registers" element={<Registers />} />
          <Route path="/citys" element={<Citys />} />
          <Route path="/citys/editcity" element={<EditCity />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/forms/formDetail" element={<FormDetail />} />
          <Route path="/augmentedRealities" element={<AugmentedRealities />} />
          <Route path="/ARDetails" element={<ARDetails />} />
          <Route path="/ProjectDetails" element={<ProjectDetails />} />
          <Route path="/SubProject/:id" element={<SubProject />} />
          <Route path="/graphs" element={<Graphs />} />
          <Route path="/graphs/:id" element={<GraphId />} />
          <Route path="/employees" element={<Employees />} />
          <Route
            path="/employees/employeesDetail"
            element={<EmployeesDetail />}
          />
          <Route path="/employees/editEmployess" element={<EditEmployess />} />
          <Route path="/createcomponent" element={<CreateComponent />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Provider>
  );
};

export default App;
