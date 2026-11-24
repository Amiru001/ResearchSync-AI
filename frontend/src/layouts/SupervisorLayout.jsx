import SupervisorSidebar from "../components/supervisor/layout/SupervisorSidebar";
import Topbar from "../components/dashboard/Topbar";


const SupervisorLayout = ({ children }) => {

  return (
    <div className="flex h-screen bg-[#020617]">

      {/* Supervisor Sidebar */}

      <SupervisorSidebar />

      {/* Main Content */}

      <div className="flex flex-col flex-1 overflow-hidden">

        <Topbar />

        <main className="flex-1 overflow-y-auto bg-[#030712] p-8">
          {children}
        </main>

      </div>

    </div>
  );
};

export default SupervisorLayout;