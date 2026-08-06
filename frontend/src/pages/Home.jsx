import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiApps2Line,
  RiAddLine,
  RiFolderLine,
  RiCamera3Line,
  RiTimeLine,
  RiArrowRightLine,
  RiSearchLine,
  RiFolderAddLine,
  RiLoader4Line,
  RiPulseLine,
  RiMore2Fill,
  RiSparklingLine,
  RiCheckDoubleLine,
  RiEyeLine,
  RiSettings3Line,
} from "react-icons/ri";
import CreateProjectModal from "../components/CreateProjectModal";
import { getProjects } from "../api/projects";
import { notifyError } from "../utils/apiError";

function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [cameraCount, setCameraCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { data } = await getProjects();
      setProjects(data.message || []);
      setCameraCount(data.cameraCount || 0);
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const goToProject = (id, name) => {
    if (id)
      navigate("/projectdetails", {
        state: { project: id, projectName: name },
      });
  };

  const filteredProjects = projects.filter((p) =>
    p.project_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getProjectColor = (name) => {
    const colors = [
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-500",
      "from-emerald-500 to-teal-500",
      "from-orange-500 to-red-500",
      "from-cyan-500 to-blue-500",
      "from-rose-500 to-pink-500",
      "from-violet-500 to-purple-500",
      "from-indigo-500 to-blue-600",
    ];
    const index = name?.length ? name.length % colors.length : 0;
    return colors[index];
  };

  const getInitials = (name) => {
    if (!name) return "P";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative">
      {/* Main Content Wrapper with proper z-index */}
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-8">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#1a103d] to-slate-900 p-8 text-white shadow-2xl shadow-indigo-500/10 border border-indigo-500/10">
            {/* Animated background elements */}
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
            <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-indigo-200 border border-white/10 shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  System Online
                  <span className="w-px h-4 bg-white/20" />
                  <RiSparklingLine className="text-indigo-300" /> AI Active
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <p className="mt-2 text-sm text-slate-300 max-w-lg leading-relaxed">
                    Monitor video feeds, track project updates, and manage your
                    connected cameras seamlessly with AI-powered insights.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    document.getElementById("create_project_modal").showModal()
                  }
                  className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-95 hover:from-indigo-400 hover:to-indigo-500"
                >
                  <RiAddLine className="text-xl transition-transform group-hover:rotate-90 duration-300" />
                  <span>New Project</span>
                </button>
                <button className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-md px-6 py-3.5 text-sm font-semibold text-white border border-white/20 transition-all hover:bg-white/20 hover:scale-[1.02] active:scale-95">
                  <RiSettings3Line className="text-lg" />
                  <span className="hidden sm:inline">Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 - Total Projects */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-indigo-500/5 transition-all hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 border border-indigo-100/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center justify-between relative">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total Projects
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-900">
                    {loading ? "—" : projects.length}
                  </p>
                  <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <RiCheckDoubleLine /> Active workspace
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-110 group-hover:rotate-6">
                  <RiFolderLine className="text-2xl" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </div>

            {/* Card 2 - Cameras */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-emerald-500/5 transition-all hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 border border-emerald-100/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center justify-between relative">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Connected Cameras
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-900">
                    {loading ? "—" : cameraCount}
                  </p>
                  <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <RiEyeLine /> Live feeds active
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 transition-transform group-hover:scale-110 group-hover:rotate-6">
                  <RiCamera3Line className="text-2xl" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </div>

            {/* Card 3 - Status */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-purple-500/5 transition-all hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 border border-purple-100/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center justify-between relative">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    System Status
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
                    </span>
                    <span className="text-lg font-bold text-slate-800">
                      Operational
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-emerald-600 font-medium">
                    All systems go
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 transition-transform group-hover:scale-110 group-hover:rotate-6">
                  <RiPulseLine className="text-2xl" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </div>

            {/* Card 4 - Storage Usage */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-orange-500/5 transition-all hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 border border-orange-100/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center justify-between relative">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Storage Usage
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-900">64%</p>
                  <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full w-[64%] transition-all duration-1000 group-hover:w-[75%]" />
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 transition-transform group-hover:scale-110 group-hover:rotate-6">
                  <RiApps2Line className="text-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col gap-4 rounded-2xl bg-white/80 backdrop-blur-sm p-4 shadow-lg shadow-indigo-500/5 border border-indigo-100/50 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg transition-colors group-focus-within:text-indigo-500" />
              <input
                type="text"
                placeholder="Search projects by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-12 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:shadow-lg focus:shadow-indigo-500/5 hover:border-indigo-300"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-sm">
                ⌘K
              </kbd>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-slate-800"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-slate-800"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  List
                </button>
              </div>

              <select
                onChange={(e) =>
                  goToProject(
                    e.target.value,
                    e.target.options[e.target.selectedIndex]?.text,
                  )
                }
                defaultValue=""
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 hover:border-indigo-300 cursor-pointer"
              >
                <option value="" disabled>
                  Quick View...
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.project_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Modal Container */}
          <CreateProjectModal onCreated={loadProjects} />

          {/* Projects Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 px-1">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  {searchTerm ? "Search Results" : "Recent Workspaces"}
                  <span className="text-sm font-normal text-slate-400">
                    ({filteredProjects.length})
                  </span>
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {searchTerm
                    ? `Showing results for "${searchTerm}"`
                    : "Manage and monitor your active projects"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gradient-to-r from-indigo-50 to-indigo-100/50 px-3 py-1 text-xs font-semibold text-indigo-600 border border-indigo-200/50">
                  {filteredProjects.length} Projects
                </span>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex h-80 flex-col items-center justify-center gap-4 rounded-3xl bg-white/80 backdrop-blur-sm border border-indigo-100/50 shadow-lg shadow-indigo-500/5">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 animate-pulse" />
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-500 animate-pulse">
                  Loading workspaces...
                </p>
              </div>
            ) : filteredProjects.length === 0 ? (
              /* Empty State */
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-indigo-50/50 border border-indigo-100/50 p-16 text-center shadow-lg shadow-indigo-500/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-xl shadow-indigo-500/30 mx-auto mb-6">
                    <RiFolderAddLine className="text-4xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {searchTerm
                      ? "No projects match your search"
                      : "Start your first project"}
                  </h3>
                  <p className="mt-2 text-slate-500 max-w-md mx-auto">
                    {searchTerm
                      ? "Try adjusting your search terms or clear the filter to see all projects."
                      : "Create your first workspace to begin monitoring cameras and managing video feeds."}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() =>
                        document
                          .getElementById("create_project_modal")
                          .showModal()
                      }
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <RiAddLine className="text-lg" /> Create Project
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Cards Grid */
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProjects.slice(0, 8).map((project) => {
                  const initials = getInitials(project.project_name);
                  const colorGradient = getProjectColor(project.project_name);
                  const modifiedDate = project.date_modify
                    ? new Date(project.date_modify)
                    : new Date();

                  return (
                    <div
                      key={project.id}
                      onClick={() =>
                        goToProject(project.id, project.project_name)
                      }
                      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white p-5 shadow-lg shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/15 border border-indigo-100/50 hover:border-indigo-300 flex flex-col"
                    >
                      {/* Background gradient accent */}
                      <div
                        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorGradient} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity`}
                      />

                      {/* Top section */}
                      <div className="flex items-start justify-between relative">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${colorGradient} text-white shadow-lg shadow-indigo-500/20 font-bold text-base`}
                        >
                          {initials}
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                          <RiMore2Fill className="text-lg" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="mt-4 flex-1 relative">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {project.project_name}
                        </h3>
                        <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <RiCamera3Line className="text-slate-400" />
                            {Math.floor(Math.random() * 5) + 1} cameras
                          </span>
                          <span className="w-px h-3 bg-slate-200" />
                          <span className="flex items-center gap-1">
                            <RiTimeLine className="text-slate-400" />
                            {modifiedDate.toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs font-medium text-emerald-600">
                            Active
                          </span>
                        </div>
                      </div>

                      {/* Bottom action */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                        <span>View Details</span>
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                          <RiArrowRightLine className="text-sm transition-transform duration-300 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
