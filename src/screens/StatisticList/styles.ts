import { GenericList } from '@/src/components/GenericList';
import { getFontSize } from '@/src/shared/utils/styles';
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

export const SectionTitle = styled.Text`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.medium)};
  font-family: ${(props: any) => props.theme.fonts.medium};
  color: ${(props: any) => props.theme.colors.title};
  margin-bottom: 20px;
  margin-top: 30px;
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
