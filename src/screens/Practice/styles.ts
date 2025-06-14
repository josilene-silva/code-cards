import { getFontSize } from '@/src/shared/utils/styles';
import { Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  background-color: ${({ theme }: any) => theme.colors.secondary};
  padding-right: 20px;
  padding-left: 20px;
  padding-top: 10px;
`;

export const ProgressBar = styled.View`
  border-radius: 100px;
  width: 100%;
  background-color: #e6e6e6;
  height: 20px;
  margin-bottom: 50px;
`;

export const Progress = styled(ProgressBar)<{ percentage: number }>`
  width: ${({ percentage }: any) => percentage}%;
  background-color: ${({ theme }: any) => theme.colors.tertiary};
`;

type CardProps = {
  type: 'front' | 'back';
  visible: boolean;
};

export const Card = styled(Animated.View)<CardProps>`
  width: ${Dimensions.get('screen').width - 40}px;
  background-color: ${({ theme, type }: any) =>
    type === 'front' ? theme.colors.background : theme.colors.tertiary};

  border-radius: 15px;
  padding: 22px 24px;
  align-items: center;
  justify-content: center;
  min-height: ${Dimensions.get('screen').height * 0.6}px;
`;

type ContainerProps = {
  visible: boolean;
};

export const ButtonContainer = styled.View<ContainerProps>`
  display: ${({ visible }: any) => (visible ? 'flex' : 'none')};
  flex-direction: row;
  justify-content: space-between;
  margin-top: 40px;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36px;
  margin-top: 10px;
`;

export const HeaderTitle = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.large)};
  color: ${({ theme }: any) => theme.colors.tertiary};
  font-family: ${({ theme }: any) => theme.fonts.semiBold};
`;

export const FrontText = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.extraLarge)};
  color: ${({ theme }: any) => theme.colors.text};
  font-family: ${({ theme }: any) => theme.fonts.regular};
  text-align: center;
`;

export const BackText = styled(FrontText)`
  color: ${({ theme }: any) => theme.colors.textInvert};
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.medium)};
`;
