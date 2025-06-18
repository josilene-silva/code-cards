import { BaseButton } from '@/src/components/Buttons';
import { GenericList } from '@/src/components/GenericList';
import { Shadow } from '@/src/components/Shadow';
import { getFontSize } from '@/src/shared/utils/styles';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled(GenericList)`
  background-color: ${({ theme }: any) => theme.colors.background};
  padding: 20px 24px 50px;
`;

export const LogoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  justify-content: space-between;
  width: 100%;
`;

export const Title = styled.Text`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.doubleExtraLarge)};
  font-family: ${(props: any) => props.theme.fonts.regular};
  color: ${(props: any) => props.theme.colors.primary};
`;

export const GreetingContainer = styled.View`
  flex-direction: row;
  margin-top: 24px;
  width: 100%;
  align-items: center;
  margin-bottom: 10%;
`;

export const GreetingText = styled.Text`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.extraLarge)};
  font-family: ${(props: any) => props.theme.fonts.regular};
  color: ${(props: any) => props.theme.colors.tertiary};
`;

export const GreetingUseNameText = styled.Text`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.extraLarge)};
  font-family: ${(props: any) => props.theme.fonts.semiBold};
  color: ${(props: any) => props.theme.colors.tertiary};
  margin-left: 4px;
  margin-right: 10px;
`;

export const SectionTitle = styled.Text`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.medium)};
  font-family: ${(props: any) => props.theme.fonts.medium};
  color: ${(props: any) => props.theme.colors.title};
`;

export const CardListContainer = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  flex-direction: row;
  gap: 16px;
  width: 100%;
  padding: 20px 0;
`;

export const CardShadowContainer = styled(Shadow)`
  flex-grow: 1;
  flex-basis: content;
`;

export const CardContainer = styled(BaseButton)`
  padding: 20px 14px;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  margin-right: 10px;

  border: 0.33px solid ${(props: any) => props.theme.colors.border};
  background-color: ${(props: any) => props.theme.colors.background};
  width: ${Dimensions.get('window').width / 3}px;
`;

export const CardRanking = styled(CardContainer)`
  width: ${Dimensions.get('window').width / 2}px;
  margin-right: 10px;
  padding: 14px;
  background-color: ${(props: any) => props.theme.colors.background};
`;

export const CardTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 10px;
`;

export const CardTagPublic = styled.Text`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.small)};
  font-family: ${(props: any) => props.theme.fonts.regular};
  color: ${(props: any) => props.theme.colors.textInvert};
  background-color: ${(props: any) => props.theme.colors.primary};
  padding: 2px 8px;

  border-radius: 0px;
  border-top-right-radius: 18px;
  border-top-left-radius: 18px;
  text-align: center;

  position: absolute;
  top: 0;
  right: 0;
  left: 0;
`;

export const CardText = styled.Text.attrs({
  numberOfLines: 1,
})`
  width: 100%;
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.medium)};
  font-family: ${(props: any) => props.theme.fonts.bold};
  color: ${(props: any) => props.theme.colors.title};
  margin-top: 10px;
  text-align: center;
`;

export const CardRankingTitle = styled(CardText)`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.medium)};
  font-family: ${(props: any) => props.theme.fonts.semiBold};
  text-align: justify;
  color: ${(props: any) => props.theme.colors.tertiary};
  flex-shrink: 1;
  margin-top: 0;
`;

export const CardRankingSubTitle = styled(CardRankingTitle).attrs({
  numberOfLines: 3,
})`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.small)};
  font-family: ${(props: any) => props.theme.fonts.regular};
  color: ${(props: any) => props.theme.colors.text};
  line-height: 10px;
  text-align: center;
  margin-top: 5px;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 50px;
`;

export const EmptyText = styled.Text`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.medium)};
  font-family: ${(props: any) => props.theme.fonts.regular};
  color: ${(props: any) => props.theme.colors.title};
  margin-top: 22px;
  width: 85%;
  text-align: center;
`;

export const AvatarText = styled.Text`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.medium)};
  font-family: ${(props: any) => props.theme.fonts.bold};
  color: ${(props: any) => props.theme.colors.textInvert};

  text-align: center;
  background-color: ${(props: any) => props.theme.colors.themedBackground};

  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 5px;
  border-radius: 500px;
`;
