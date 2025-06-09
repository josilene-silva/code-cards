import { BaseButton } from '@/src/components/Buttons';
import { GenericList } from '@/src/components/GenericList';
import { Shadow } from '@/src/components/Shadow';
import { getFontSize } from '@/src/shared/utils/styles';
import styled from 'styled-components/native';

export const Container = styled(GenericList)`
  background-color: ${({ theme }: any) => theme.colors.background};
  padding: 36px 24px 50px;
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
`;

export const SectionTitle = styled.Text`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.medium)};
  font-family: ${(props: any) => props.theme.fonts.medium};
  color: ${(props: any) => props.theme.colors.title};
  margin-bottom: 20px;
  margin-top: 40px;
`;

export const CardListContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
`;

export const CardShadowContainer = styled(Shadow)``;

export const CardContainer = styled(BaseButton)`
  padding: 14px 40px;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  border: 0.33px solid ${(props: any) => props.theme.colors.border};
  background-color: ${(props: any) => props.theme.colors.background};
`;

export const CardText = styled.Text`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.large)};
  font-family: ${(props: any) => props.theme.fonts.bold};
  color: ${(props: any) => props.theme.colors.title};
  margin-top: 10px;
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
