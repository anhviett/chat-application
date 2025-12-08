import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { FORM_ITEM_LAYOUT, TAIL_FORM_ITEM_LAYOUT } from '@/constants/formLayouts';
import { Link } from "react-router-dom";
import { authApi } from '@/api/auth';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  // Form fields are managed by antd Form (controlled by name), no local state required
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values?: any) => {
    // values comes from antd Form onFinish
    const payload = values ?? {};
    setLoading(true);
    try {
      const data = await authApi.login(payload);

      // Support multiple possible response shapes
      const accessToken = data?.accessToken ?? data?.access_token ?? data?.token;
      const refreshToken = data?.refreshToken ?? data?.refresh_token ?? null;
      const user = data?.user ?? data?.userData ?? null;

      if (!accessToken) {
        message.error('Login failed: no access token returned');
        setLoading(false);
        return;
      }

      // Prefer using AuthContext login if available
      try {
        if (login) {
          login(accessToken, refreshToken, user);
        } else {
          localStorage.setItem('accessToken', accessToken);
          if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
          if (user) localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (err) {
        // fallback to localStorage
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        if (user) localStorage.setItem('user', JSON.stringify(user));
      }

        message.success('Login successful');
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('Login error', err);
      const errMsg = err?.response?.data?.message ?? err?.message ?? 'Login failed';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Form
      {...FORM_ITEM_LAYOUT}
      name="login"
      initialValues={{ remember: true }}
      style={{ maxWidth: 360 }}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
        className="flex-1"
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input className="flex-1" prefix={<LockOutlined />} type="password" placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <div className="flex justify-between items-center">
          <Form.Item name="remember" valuePropName="checked" noStyle style={{ flex: 1 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <a href="">Forgot password</a>
        </div>
      </Form.Item>

      <Form.Item {...TAIL_FORM_ITEM_LAYOUT}>
        <Button block className="!bg-primary !text-white mb-2" type="primary" htmlType="submit" loading={loading} disabled={loading}>
          Log in
        </Button>
        or <Link to="/register">Register now!</Link>
      </Form.Item>
    </Form>
  );
}
