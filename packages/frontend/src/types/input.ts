export interface InputCustom {
    type: string;
    value?: string;
    placeholder?: string;
    className?: string;
    required?: boolean;
    id?: string;
    name?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}