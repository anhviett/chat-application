import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CascaderProps, FormItemProps, FormProps } from 'antd';
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from 'antd';
import { FORM_ITEM_LAYOUT, TAIL_FORM_ITEM_LAYOUT } from '@/constants/formLayouts';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fbLoading, setFbLoading] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    // fake register: you might want to call an API here
    // For now just save a demo token and redirect to home
    localStorage.setItem("token", "demo-token");
    navigate("/", { replace: true });
  };

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{ width: 70 }}
        defaultValue={'86'}
        options={[
          { label: '+86', value: '86' },
          { label: '+87', value: '87' },
        ]}
      />
    </Form.Item>
  );

  return (
    <Form
      {...FORM_ITEM_LAYOUT}
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
      layout="vertical"
    >
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            name="email"
            label="E-mail"
            className="!mb-3"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="password"
            label="Password"
            className="!mb-3"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            name="phone"
            label="Phone Number"
            className="!mb-3"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            className="!mb-3"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The new password that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select gender!' }]}
          >
            <Select
              placeholder="select your gender"
              defaultValue={'male'}
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        className="!text-left"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
          },
        ]}
        {...TAIL_FORM_ITEM_LAYOUT}
      >
        <Checkbox>
          I have read the <a href="">agreement</a>
        </Checkbox>
      </Form.Item>
      <Form.Item {...TAIL_FORM_ITEM_LAYOUT}>
        <Button type="default" className="!bg-primary !text-white" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}
