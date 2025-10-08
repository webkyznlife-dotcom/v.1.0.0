// src/components/Sidebar.tsx
import React, { useState, useEffect, useRef, JSX } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiChevronDown,
  FiChevronRight,
  FiBarChart,
  FiUsers,
  FiClipboard,
  FiSettings,
  FiCalendar,    // untuk Schedules
  FiFlag,        // untuk Events
  FiMapPin,      // untuk Locations
  FiFileText,
  FiCpu,          // untuk Forms
  FiLayers,
  FiSquare,
  FiMessageCircle         
} from "react-icons/fi";
import { FaRegCalendarAlt, FaBell, FaCogs, FaChartBar, FaGift } from "react-icons/fa";
import { getAuthToken } from "../../app/services/ApiService";
import axios from "axios";

interface SidebarProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface MenuItem {
  menu_id: number;
  menu_name: string;
  menu_slug: string;
  menu_url: string;
  menu_icon?: string;
  parent_id: number | null;
  label?: string;
  sub_menus: MenuItem[];
}

export interface UserMenus {
  [category: string]: MenuItem[];
}

export interface User {
  token: string;
  user_id: number;
  full_name: string;
  email: string;
  role: string;
  menus: UserMenus;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, isMobile, toggleSidebar }) => {
  const location = useLocation();
  const linkRefs = useRef<Record<number, HTMLAnchorElement | null>>({});
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [chooseMenu, setChooseMenu] = useState<number | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Mapping icon string ke komponen
  const iconMap: Record<string, JSX.Element> = {
    FiHome: <FiHome />,
    FaRegCalendarAlt: <FaRegCalendarAlt />,
    FiBarChart: <FiBarChart />,
    FiUsers: <FiUsers />,
    FiClipboard: <FiClipboard />,
    FiSettings: <FiSettings />,
    FaBell: <FaBell />,
    FaCogs: <FaCogs />,
    FaChartBar: <FaChartBar />,
    FaGift: <FaGift />,

    // Tambahan untuk menu baru
    FiCalendar: <FiCalendar />,   // Schedules
    FiFlag: <FiFlag />,           // Events
    FiMapPin: <FiMapPin />,       // Locations
    FiFileText: <FiFileText />,   // Forms
    FiClipboardAlt: <FiClipboard />, // Program Management (opsional)
    FiCpu: <FiCpu />  ,            // Forms

    FiLayers: <FiLayers />, // Facilities Management
    FiSquare: <FiSquare />, // Courts Management
    FiMessageCircle: <FiMessageCircle />
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const user = getAuthToken() as User | null;
        if (!user || !user.menus) throw new Error("User menu list is not available");

        const allMenus: MenuItem[] = Object.values(user.menus).flat();

        // Tambahkan menu Dashboard di paling awal
        const dashboardMenu: MenuItem = {
          menu_id: 0,
          menu_name: "Dashboard",
          menu_slug: "dashboard",
          menu_url: "/dashboard",
          menu_icon: "FiHome",
          parent_id: null,
          label: "KYZN Life",
          sub_menus: []
        };

        const menusWithDashboard = [dashboardMenu, ...allMenus];
        setMenuItems(menusWithDashboard);

        getIdFromUrl(menusWithDashboard);
      } catch (err) {
        localStorage.removeItem("isAuthenticated");
        window.location.href = "/admin/login";
      }
    };

    fetchMenu();

    if (chooseMenu) getLinkClass(chooseMenu);
  }, [chooseMenu, location.pathname]);

  const toggleMenu = (menuId: number) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  const setMenu = (menuId: number) => {
    Object.values(linkRefs.current).forEach((el) => el?.classList.remove("bg-[#4754fe]"));
    linkRefs.current[menuId]?.classList.add("bg-[#4754fe]");
  };

  const getLinkClass = (id: number) => {
    const linkElement = linkRefs.current[id];
    Object.values(linkRefs.current).forEach((el) => el?.classList.remove("active-link"));

    if (linkElement && location.pathname === linkElement.getAttribute("href")) {
      linkElement.classList.add("active-link");
    }
  };

  const getIdFromUrl = (paramMenuItems: MenuItem[]) => {
    const currentPath = location.pathname;

    // cari menu/sub-menu yang cocok dengan URL
    const matchedItem = paramMenuItems.find((item) => {
      if (item.menu_url === currentPath) return true;
      // cek di sub-menu
      return item.sub_menus.some((sub) => sub.menu_url === currentPath);
    });

    if (matchedItem) {
      // cek apakah current URL ada di sub-menu
      const subMatch = matchedItem.sub_menus.find((sub) => sub.menu_url === currentPath);
      if (subMatch) {
        // sub-menu aktif
        setChooseMenu(subMatch.menu_id);
        // parent menu expand
        setActiveMenu(matchedItem.menu_id);
        setMenu(subMatch.menu_id);
      } else {
        // menu utama aktif
        setChooseMenu(matchedItem.menu_id);
        setActiveMenu(matchedItem.menu_id);
        setMenu(matchedItem.menu_id);
      }
    }
  };


  // Render menu dengan label
  let lastLabel: string | null = null;
  const renderMenu = () => {
    // Tambahkan menu Home di awal
    const homeMenu = (
      <React.Fragment key="home">
        <li>
          <Link
            onClick={() => setMenu(0)}
            ref={(el) => { linkRefs.current[0] = el; }}
            id="menu_id_0"
            to="/"
            className="flex items-center p-2 text-white hover:bg-[#4754fe] rounded-md transition duration-300 ease-in-out no-underline"
          >
            <FiHome />
            <span className="ml-2">Home</span>
          </Link>
        </li>
      </React.Fragment>
    );

    // Render menu lainnya
    const otherMenus = menuItems
      .filter((item) => item.menu_slug !== "dashboard") // sembunyikan dashboard
      .map((item) => {
        const showLabel = item.label && item.label !== lastLabel;
        if (showLabel) lastLabel = item.label ?? null;

        const hasSubMenu = item.sub_menus.length > 0;

        return (
          <React.Fragment key={item.menu_id}>
            {showLabel && (
              <div className="text-gray-400 px-2 py-2 uppercase text-sm font-semibold">
                {item.label}
              </div>
            )}
            <li>
              {hasSubMenu ? (
                <>
                  <button
                    className="w-full flex items-center justify-between p-2 text-white hover:bg-[#4754fe] rounded-md transition duration-300 ease-in-out"
                    onClick={() => toggleMenu(item.menu_id)}
                  >
                    <span className="flex items-center">
                      {iconMap[item.menu_icon || ""] || null}
                      <span className="ml-2">{item.menu_name}</span>
                    </span>
                    {activeMenu === item.menu_id ? <FiChevronDown /> : <FiChevronRight />}
                  </button>
                  <ul
                    className={`pl-6 overflow-hidden transition-all duration-500 ease-in-out ${
                      activeMenu === item.menu_id ? "opacity-100 max-h-[1000px]" : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.sub_menus.map((sub) => (
                      <li key={sub.menu_id}>
                        <Link
                          onClick={() => setMenu(sub.menu_id)}
                          ref={(el) => { linkRefs.current[sub.menu_id] = el; }}
                          id={`menu_id_${sub.menu_id}`}
                          to={sub.menu_url}
                          className="block p-2 text-white hover:bg-[#4754fe] rounded-md transition duration-300 ease-in-out no-underline"
                        >
                          {sub.menu_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  onClick={() => setMenu(item.menu_id)}
                  ref={(el) => { linkRefs.current[item.menu_id] = el; }}
                  id={`menu_id_${item.menu_id}`}
                  to={item.menu_url}
                  className="flex items-center p-2 text-white hover:bg-[#4754fe] rounded-md transition duration-300 ease-in-out no-underline"
                >
                  {iconMap[item.menu_icon || ""] || null}
                  <span className="ml-2">{item.menu_name}</span>
                </Link>
              )}
            </li>
          </React.Fragment>
        );
      });

    return [homeMenu, ...otherMenus];
  };

  return (
    <>
      {isSidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar}></div>
      )}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-[274px] bg-gray-900 text-white border-r border-gray-700 transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isMobile ? "block" : "hidden md:block"}`}
      >
        <div className="p-4" style={styles.logo}>
          <h1 style={styles.title}>
            <span style={styles.titleSpan}>kyzn</span> CMS
          </h1>
          <p style={styles.version}>Version 1.0.0</p>
        </div>
        <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
          <ul className="space-y-2" style={styles.ulListItem}>
            {renderMenu()}
          </ul>
        </div>
      </aside>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  title: {
    color: "#ffffff",
    fontSize: "32px",
    textAlign: "center",
    marginBottom: "0px",
    fontWeight: 600,
    fontFamily: "Poppins, sans-serif",
  },
  titleSpan: {
    color: "#ffffff",
    fontFamily: "Raleway, sans-serif",
    fontWeight: "normal",
  },
  version: {
    color: "#bbbbbb",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "4px",
  },
  ulListItem: {
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },
  listItem: {
    color: "#FFFFFF",
  },
  logo: {},
};

export default Sidebar;
