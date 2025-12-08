import React, { useEffect, useState } from "react";
import { Layout, Menu, Button } from "antd";
import type { MenuProps } from 'antd';
import {
  RadarChartOutlined,
  UserAddOutlined,
  UserOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate, NavLink, Link } from "react-router-dom";
import "@assets/css/style.css";
import mobileBg from '@/assets/images/mobile-bg.webp';

const { Sider } = Layout;

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed: collapsedProp, onCollapse }) => {
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sidebar_collapsed") === "1";
    } catch {
      return false;
    }
  });

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  // persist only when using internal state
  useEffect(() => {
    if (typeof collapsedProp === "boolean") return;
    try {
      localStorage.setItem("sidebar_collapsed", internalCollapsed ? "1" : "0");
    } catch {}
  }, [internalCollapsed, collapsedProp]);

  useEffect(() => {
    // open lookup submenu if current path is under /lookup
    if (location.pathname.startsWith("/lookup")) setOpenKeys(["lookup"]);
  }, [location.pathname]);

  const selectedKeys = [location.pathname];

  const isControlled = typeof collapsedProp === "boolean";
  const collapsed = isControlled ? (collapsedProp as boolean) : internalCollapsed;

  const handleCollapseChange = (val: boolean) => {
    try {
      onCollapse && onCollapse(val);
    } finally {
      if (!isControlled) setInternalCollapsed(val);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(val) => handleCollapseChange(val)}
      // when viewport is below `lg` breakpoint, `onBreakpoint` will be called with true
      breakpoint="lg"
      collapsedWidth={80}
      onBreakpoint={(broken) => handleCollapseChange(broken)}
      className={`sidebar site-layout-sider bg-gray-800 leading-[60px] ${collapsed ? "!min-w-0" : "!min-w-[250px] !w-full"}`}
      style={{
        height: "100vh",
        position: "sticky",
        top: 0,
        backgroundImage: `url(${mobileBg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="px-4 leading-[64px] flex items-center justify-between">
        {!collapsed && <div className="font-semibold">
          <Link className="!text-white text-xl font-semibold" to="/">Credit Score</Link>
        </div>}

        <Button
          type="text"
          onClick={() => handleCollapseChange(!collapsed)}
          style={{ fontSize: '16px', color: 'white' }}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        />
      </div>

      {/* use `items` API to avoid deprecated children/SubMenu */}
      {
        (() => {
          const menuItems: MenuProps['items'] = [
            {
              key: 'lookup',
              icon: <RadarChartOutlined />, 
              label: collapsed ? undefined : 'Tra cứu điểm tín dụng',
              children: [
                {
                  key: '/lookup/new',
                  icon: <UserAddOutlined />,
                  label: (
                    <span onClick={() => navigate('/lookup/new')}>Khách hàng mới</span>
                  ),
                },
                {
                  key: '/lookup/existing',
                  icon: <UserOutlined />,
                  label: (
                    <span onClick={() => navigate('/lookup/existing')}>Khách hàng hiện hữu</span>
                  ),
                },
              ],
            },
          ];

          return (
            <Menu
              theme="light"
              mode="inline"
              className="w-full"
              selectedKeys={selectedKeys}
              openKeys={collapsed ? [] : openKeys}
              onOpenChange={(keys) => setOpenKeys(keys as string[])}
              style={{ borderRight: 0, color: "white" }}
              items={menuItems}
            />
          );
        })()
      }

    </Sider>
  );
};

export default Sidebar;