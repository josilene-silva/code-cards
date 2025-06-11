import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { TextInputProps } from 'react-native';

export interface InputProps<T extends FieldValues> extends TextInputProps {
  name: FieldPath<T>;
  control: Control<T>;
  extensiveText?: string;
  required?: boolean;
  pattern?: (value: string) => string;
}

export type VariantInput = 'initial' | 'error';

export interface InputModifier {
  variant: VariantInput;
  isDisabled?: boolean;
}
