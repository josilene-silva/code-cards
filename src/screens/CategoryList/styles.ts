import { GenericList } from '@/src/components/GenericList';
import styled from 'styled-components/native';

export const Container = styled(GenericList)`
  background-color: ${({ theme }: any) => theme.colors.background};
  padding: 36px 24px 50px;
`;
