import styled from 'styled-components/native';

import { getFontSize } from '@/src/shared/utils/styles';
import RBSheet from 'react-native-raw-bottom-sheet';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }: any) => theme.colors.background};
`;

export const ScrollContainer = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    paddingBottom: 200,
  },
})`
  padding: 20px 24px 00px;
  padding-bottom: 100px;
`;

export const ButtonContainer = styled.View`
  position: absolute;
  margin: 0 24px;
  bottom: 24px;
  left: 0;
  right: 0;
`;

export const BottomSheetTitle = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.large)};
  color: ${({ theme }: any) => theme.colors.tertiary};
  margin-bottom: 10px;
  text-align: center;
  width: 100%;
  padding: 0 20px;
  line-height: 24px;
  font-family: ${({ theme }: any) => theme.fonts.semiBold};
  flex-shrink: 1;
`;

export const BottomSheetTitleContainer = styled.View`
  width: 100%;
  padding: 8px 0px;
  margin-bottom: 24px;
  align-items: space-between;
  justify-content: space-between;
  width: 100%;
  flex-direction: row;
`;

export const BottomSheetContainer = styled(RBSheet).attrs(({ theme }: any) => ({
  customModalProps: { animationType: 'fade' },
  customStyles: {
    container: {
      height: 'auto',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.themedBackground,
      paddingVertical: 17,
      paddingHorizontal: 20,
      paddingBottom: 30,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
  },
}))``;
