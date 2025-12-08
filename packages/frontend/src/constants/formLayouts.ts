import type { FormItemProps } from 'antd';

/**
 * Standard form layout with labels on the left (desktop) or top (mobile)
 */
export const FORM_ITEM_LAYOUT: FormItemProps = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 }, lg: { span: 24 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 }, lg: { span: 24 } },
};

/**
 * Layout for form items without labels (e.g., submit buttons)
 * Aligns with the input field column
 */
export const TAIL_FORM_ITEM_LAYOUT: FormItemProps = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 }, lg: { span: 24, offset: 0 } },
  rootClassName: 'text-center',
};

/**
 * Compact inline form layout
 */
export const INLINE_FORM_LAYOUT: FormItemProps = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

/**
 * Vertical form layout (label on top of input)
 */
export const VERTICAL_FORM_LAYOUT: FormItemProps = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
