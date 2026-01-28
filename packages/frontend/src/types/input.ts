export interface InputCustom {
  type: string;
  value?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  id?: string;
  name?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
