import { GenericList } from '@/src/components/GenericList';
import { getFontSize } from '@/src/shared/utils/styles';
import RBSheet from 'react-native-raw-bottom-sheet';
import styled from 'styled-components/native';

export const CardsList = styled(GenericList)`
  background-color: ${({ theme }: any) => theme.colors.background};
`;

export const HeaderContainer = styled.View`
  align-items: flex-start;
  background-color: ${({ theme }: any) => theme.colors.tertiary};
  padding: 50px 24px 40px;
`;

export const HeaderTitle = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.extraLarge)};
  color: ${({ theme }: any) => theme.colors.textInvert};
  font-family: ${({ theme }: any) => theme.fonts.bold};
  flex-shrink: 1;
`;

export const HeaderSubContainer = styled.View`
  flex-direction: row;
  flex: 1;
  width: 100%;
  align-items: center;
  margin-top: 43px;
  justify-content: space-between;
`;

export const AboutContainer = styled.View`
  padding: 20px 20px 0;
`;

export const ActionsContainer = styled.View`
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-direction: row;
  gap: 20px;
`;

export const ActionsSubContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
`;

export const AboutTitle = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.medium)};
  font-family: ${({ theme }: any) => theme.fonts.medium};
  color: ${({ theme }: any) => theme.colors.title};
  margin-top: 30px;
  margin-bottom: 8px;
`;

export const AboutText = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.medium)};
  font-family: ${({ theme }: any) => theme.fonts.medium};
  color: ${({ theme }: any) => theme.colors.text};
`;

export const CardContainer = styled.View`
  margin: 0 20px;
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

export const BottomSheetContainer = styled(RBSheet).attrs(({ theme }: any) => ({
  customModalProps: {
    animationType: 'fade',
  },
  customStyles: {
    container: {
      height: 'auto',
      backgroundColor: theme.colors.themedBackground,
      paddingVertical: 17,
      paddingHorizontal: 20,
      paddingBottom: 30,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    wrapper: {},
    draggableIcon: {
      backgroundColor: theme.colors.themedBackground,
      opacity: 0.5,
    },
  },
}))``;
