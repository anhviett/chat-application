import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import useLoginFacebook from '@/services/useLoginFacebook';
import { Layout, Breadcrumb } from 'antd';
import Sidebar from "@/components/Sidebar/Index";

const MainLayout: React.FC = () => {
  const { Header, Footer, Content } = Layout;
  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem("sidebar_collapsed") === "1";
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("sidebar_collapsed", collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);
  const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
  };
  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
  };

  const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '80px',
    color: '#fff',
  };

  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
  };

  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const breadcrumbNameMap: Record<string, string> = {
    '': 'Dashboard',
    'lookup': 'Tra cứu điểm tín dụng',
    'new': 'Khách hàng mới',
    'existing': 'Khách hàng hiện hữu',
  };

  const breadcrumbLinkStyle: React.CSSProperties = { color: 'rgba(255,255,255,0.95)' };

  const breadcrumbItems = [
    {
      title: <Link to="/" style={breadcrumbLinkStyle}>Dashboard</Link>,
    },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const key = pathSnippets[index];
      // don't make the 'lookup' parent clickable — user requested no redirect for Tra cứu điểm tín dụng
      if (key === 'lookup') {
        return {
          title: breadcrumbNameMap[key] ? <span style={breadcrumbLinkStyle}>{breadcrumbNameMap[key]}</span> : <span style={breadcrumbLinkStyle}>{key}</span>,
        };
      }
      return {
        title: breadcrumbNameMap[key] ? <Link to={url} style={breadcrumbLinkStyle}>{breadcrumbNameMap[key]}</Link> : <Link to={url} style={breadcrumbLinkStyle}>{key}</Link>,
      };
    }),
  ];

  const { logout } = useLoginFacebook();

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout className="h-screen">
        <Sidebar collapsed={collapsed} onCollapse={(v) => setCollapsed(v)} />
        <Layout>
          <Header className="leading-[64px] flex items-center justify-between text-white transition-colors duration-300" style={{ background: 'linear-gradient(90deg, #00B74F 0%, #017196 100%)' }}>
            <div className="flex items-center justify-between">
              <Breadcrumb items={breadcrumbItems} separator={<span style={breadcrumbLinkStyle}>/</span>} className="text-white" />
              <div>{/* right-side header actions (user avatar, settings) can go here */}</div>
            </div>
            <div className="mr-6 cursor-pointer text-white" onClick={() => logout()}>
              Logout
            </div>
          </Header>
          <Content style={contentStyle}>
            <main className="p-4 md:p-6">
              <Outlet /> {/* This renders your page content */}
            </main>
          </Content>
          <Footer style={footerStyle}>
            © 2025 My App
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default MainLayout;