import type { FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { ShouldRender } from '../../ShouldRender';
import { Error } from '../Error';
import { InputContainer, TextInput } from '../Input/style';
import type { InputProps } from './interface';

export function Input<T extends FieldValues>({
  control,
  name,
  label,
  required,
  pattern,
  keyboardType,
  autoCapitalize,
  extensiveText,
  numberOfLines = 1,
  ...inputProps
}: InputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur, ref }, fieldState }) => {
        const isError = !!fieldState.error?.message;

        const fullActionsOnBlur = () => onBlur();

        const fullActionsOnChange = (e: string) => {
          if (pattern) {
            const formattedValue = pattern(e);
            onChange(formattedValue);
            return;
          }

          onChange(e);
        };

        return (
          <InputContainer>
            <View>
              <TextInput
                variant={isError ? 'error' : 'initial'}
                ref={ref}
                autoCapitalize={autoCapitalize}
                keyboardType={keyboardType}
                onBlur={fullActionsOnBlur}
                value={value}
                onChangeText={fullActionsOnChange}
                textAlignVertical={numberOfLines > 1 ? 'top' : 'center'}
                numberOfLines={numberOfLines}
                multiline={numberOfLines > 1 ? true : false}
                {...inputProps}
              />
            </View>

            <ShouldRender condition={isError}>
              <Error message={fieldState.error?.message} />
            </ShouldRender>
          </InputContainer>
        );
      }}
    />
  );
}
