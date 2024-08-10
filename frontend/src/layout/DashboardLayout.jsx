import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useUser from "../hooks/useUser";
import logo from "/logo.png";
import { BiHomeAlt, BiLogInCircle } from "react-icons/bi";
import { FaRegUserCircle, FaUsers, FaViruses } from "react-icons/fa";
import { GiFertilizerBag, GiFigurehead } from "react-icons/gi";
import { MdOfflineBolt, MdPayments } from "react-icons/md";
import Swal from "sweetalert2";
import Scroll from "../hooks/useScroll";
import Loader from "../components/Loader/Loader";

const adminNavItems = [
  {
    to: "/dashboard/admin-home",
    icon: <BiHomeAlt className="text-2xl" />,
    label: "Dashboard",
  },
  {
    to: "/dashboard/manage-users",
    icon: <FaUsers className="text-2xl" />,
    label: "Manage Users",
  },
  {
    to: "/dashboard/manage-fertilizers",
    icon: <GiFertilizerBag className="text-2xl" />,
    label: "Manage Fertilizers",
  },
  {
    to: "/dashboard/manage-plant",
    icon: <FaViruses className="text-2xl" />,
    label: "Plant Mangement",
  },
];

const farmerNavItems = [
  {
    to: "/dashboard/farmer-home",
    icon: <BiHomeAlt className="text-2xl" />,
    label: "Dashboard",
  },
  {
    to: "/dashboard/user-profile",
    icon: <FaRegUserCircle className="text-2xl" />,
    label: "Profile",
  },
  {
    to: "/dashboard/my-payments",
    icon: <MdPayments className="text-2xl" />,
    label: "Payment History",
  },
];

const lastMenuItems = [
  { to: "/", icon: <BiHomeAlt className="text-2xl" />, label: "Main Home" },
  {
    to: "/trending",
    icon: <MdOfflineBolt className="text-2xl" />,
    label: "Trending",
  },
  {
    to: "/following",
    icon: <GiFigurehead className="text-2xl" />,
    label: "Following",
  },
];

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const { loader, logout } = useAuth();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const role = currentUser?.role;

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure want to logout?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout me!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout().then(
          Swal.fire({
            title: "Logged Out!",
            text: "You have been successfully logged out.",
            icon: "success",
          })
        );
        navigate("/").catch((error) => console.log(error));
      }
    });
  };

  if (loader) {
    return <Loader />;
  }

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-72 overflow-y-auto" : "w-[90px] overflow-auto"
        } bg-white h-screen p-5 md:block hidden pt-8 relative duration-300`}
      >
        <div className="flex gap-x-4 items-center">
          <img
            onClick={() => setOpen(!open)}
            src={logo}
            alt="logo"
            className={`cursor-pointer h-[40px] duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            onClick={() => setOpen(!open)}
            className={`text-secondary cursor-pointer font-bold origin-left text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            AgriPeace
          </h1>
        </div>

        {/* NavLinks */}

        {/* admin role */}
        {role === "admin" && (
          <ul className="pt-6">
            <p
              className={`uppercase ml-3 text-gray-500 mb-3 ${
                !open && "hidden"
              }`}
            >
              <small>Menu</small>
            </p>
            {role === "admin" &&
              adminNavItems.map((menuItem, index) => (
                <li key={index} className="mb-2">
                  <NavLink
                    to={menuItem.to}
                    className={({ isActive }) =>
                      `flex ${
                        isActive ? "bg-secondary text-white" : "text-[#413F44]"
                      } duration-150 rounded-md p-2 cursor-pointer hover:bg-red-500 hover:text-white font-bold text-sm items-center gap-x-4`
                    }
                  >
                    {menuItem.icon}
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200`}
                    >
                      {menuItem.label}
                    </span>
                  </NavLink>
                </li>
              ))}
          </ul>
        )}

        {/* farmer role */}
        {role === "user" && (
          <ul className="pt-6">
            <p
              className={`uppercase ml-3 text-gray-500 mb-3 ${
                !open && "hidden"
              }`}
            >
              <small>Menu</small>
            </p>
            {role === "user" &&
              farmerNavItems.map((menuItem, index) => (
                <li key={index} className="mb-2">
                  <NavLink
                    to={menuItem.to}
                    className={({ isActive }) =>
                      `flex ${
                        isActive ? "bg-secondary text-white" : "text-[#413F44]"
                      } duration-150 rounded-md p-2 cursor-pointer hover:bg-red-500 hover:text-white font-bold text-sm items-center gap-x-4`
                    }
                  >
                    {menuItem.icon}
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200`}
                    >
                      {menuItem.label}
                    </span>
                  </NavLink>
                </li>
              ))}
          </ul>
        )}

        <ul className="pt-6">
          <p
            className={`uppercase ml-3 text-gray-500 mb-3 ${!open && "hidden"}`}
          >
            <small>Useful links</small>
          </p>
          {lastMenuItems.map((menuItem, index) => (
            <li key={index} className="mb-2">
              <NavLink
                to={menuItem.to}
                className={({ isActive }) =>
                  `flex ${
                    isActive ? "bg-secondary text-white" : "text-[#413F44]"
                  } duration-150 rounded-md p-2 cursor-pointer hover:bg-red-500 hover:text-white font-bold text-sm items-center gap-x-4`
                }
              >
                {menuItem.icon}
                <span
                  className={`${!open && "hidden"} origin-left duration-200`}
                >
                  {menuItem.label}
                </span>
              </NavLink>
            </li>
          ))}

          <li>
            <button
              onClick={handleLogout}
              className={`flex w-full text-[#413F44] duration-150 rounded-md p-2 cursor-pointer hover:bg-red-500 hover:text-white font-bold text-sm items-center gap-x-4`}
            >
              <BiLogInCircle className="text-2xl" />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Logout
              </span>
            </button>
          </li>
        </ul>
      </div>

      <div className="h-screen overflow-y-auto px-8 flex-1">
        <Scroll />
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
