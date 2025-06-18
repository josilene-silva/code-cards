import React from 'react';
import { PickerSelectProps } from 'react-native-picker-select';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Dropdown } from '../Dropdown';

import { Container, Error } from './styles';
import theme from '@/src/shared/theme';

interface Props<T extends FieldValues> extends Omit<PickerSelectProps, 'onValueChange'> {
  control: Control<T>;
  name: Path<T>;
  error: string | undefined;
}

export function DropdownForm<T extends FieldValues = any>({
  control,
  items,
  name,
  error,
  ...rest
}: Readonly<Props<T>>) {
  return (
    <Container>
      <Controller<T>
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Dropdown
            items={items}
            onValueChange={onChange}
            useNativeAndroidPickerStyle={false}
            value={value}
            textInputProps={{
              placeholderTextColor: theme.colors.tertiary,
            }}
            placeholder={{
              label: 'Nenhuma',
              value: '',
              inputLabel: 'Selecione uma categoria',
            }}
            {...rest}
          />
        )}
      />
      {error && <Error>{error}</Error>}
    </Container>
  );
}
