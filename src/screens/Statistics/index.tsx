import { CardModel, CardType } from '@/src/components/Cards/CardModel';
import { Container, LogoContainer, SectionTitle, Title } from './styles';

import Logo from '@/assets/images/icon/logo.svg';
import { router } from 'expo-router';
import { useCallback } from 'react';

export function Statistics() {
  const ListHeader = () => (
    <>
      <LogoContainer>
        <Title>CodeCards</Title>
        <Logo width={49} height={52} />
      </LogoContainer>
      <SectionTitle>Minhas coleções</SectionTitle>
    </>
  );

  const renderCollectionItem = useCallback(
    ({ item }: { item: { title: string; subTitle: string } }) => (
      <CardModel
        title={item.title}
        subTitle={item.subTitle}
        type={CardType.statistic}
        amount={5}
        onPress={() => router.navigate('/(tabs)/(statistics)/statistic')}
      />
    ),
    [],
  );

  return (
    <Container
      data={[
        {
          id: '1',
          title: 'Estruturas de repetição',
          subTitle:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra ipsum ac tempor ornare. Sed imperdiet at lectus non tristique. Ut pellentesque lorem quis',
        },
        {
          id: '2',
          title: 'Estudo de algoritmo e estrutura de dados',
          subTitle: 'Descrição da coleção 2',
        },
        { id: '3', title: 'Condicionais', subTitle: 'Descrição da coleção 3' },
      ]}
      ListHeaderComponent={ListHeader}
      renderItem={renderCollectionItem}
    />
  );
}
