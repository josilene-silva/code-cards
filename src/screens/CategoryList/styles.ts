import { GenericList } from '@/src/components/GenericList';
import { getFontSize } from '@/src/shared/utils/styles';
import styled from 'styled-components/native';

export const Container = styled(GenericList)`
  background-color: ${({ theme }: any) => theme.colors.background};
  padding: 20px 24px 50px;
`;

export const EmptyContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 20%;
`;

export const EmptyText = styled.Text`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.medium)};
  font-family: ${(props: any) => props.theme.fonts.regular};
  color: ${(props: any) => props.theme.colors.title};
  margin-top: 22px;
  width: 85%;
  text-align: center;
`;
