import theme from '@/src/shared/theme';
import React from 'react';
import { StyleSheet } from 'react-native';
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';

type Props = PickerSelectProps;

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: theme.fontSizes.medium,
    paddingHorizontal: 25,
    paddingVertical: 19,
    borderRadius: 8,
    color: theme.colors.tertiary,
    backgroundColor: '#eeeeee',
    fontFamily: theme.fonts.regular,
  },
});

export function Dropdown({ ...rest }: Props) {
  return <RNPickerSelect style={pickerSelectStyles} {...rest} />;
}
