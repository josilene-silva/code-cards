import DropShadow from 'react-native-drop-shadow';
import styled from 'styled-components/native';

export const Container = styled(DropShadow)<{ withShadow: boolean }>`
  shadow-color: #000000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
`;
