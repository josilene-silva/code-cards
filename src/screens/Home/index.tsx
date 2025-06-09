import React, { useCallback } from 'react';
import {
  CardContainer,
  CardListContainer,
  CardShadowContainer,
  CardText,
  Container,
  EmptyContainer,
  EmptyText,
  GreetingContainer,
  GreetingText,
  GreetingUseNameText,
  LogoContainer,
  SectionTitle,
  Title,
} from './styles';

import Logo from '@/assets/images/icon/logo.svg';

import JavaScript from '@/assets/images/languages/javascript.svg';
import Python from '@/assets/images/languages/python.svg';

import { CardModel, CardType } from '@/src/components/Cards/CardModel';

import EmptyCard from '@/assets/images/card/empty.svg';
import { router } from 'expo-router';

export function Home() {
  const renderCollectionItem = useCallback(
    ({ item }: { item: { title: string; subTitle: string } }) => (
      <CardModel
        title={item.title}
        subTitle={item.subTitle}
        type={CardType.collection}
        onPress={() => router.navigate('/(tabs)/(home)/collection-view')}
      />
    ),
    [],
  );

  const ListCollectionEmpty = useCallback(
    () => (
      <EmptyContainer>
        <EmptyCard width={134} height={131} />
        <EmptyText>Você ainda não possui {'\n'} coleções criadas</EmptyText>
      </EmptyContainer>
    ),
    [],
  );

  const ListCollectionHeader = () => (
    <>
      <LogoContainer>
        <Title>CodeCards</Title>
        <Logo width={49} height={52} />
      </LogoContainer>

      <GreetingContainer>
        <GreetingText>Olá,</GreetingText>
        <GreetingUseNameText>José!</GreetingUseNameText>
      </GreetingContainer>

      <SectionTitle>Linguagens/frameworks</SectionTitle>

      <CardListContainer>
        <CardShadowContainer>
          <CardContainer onPress={() => router.navigate('/(tabs)/(home)/category-list')}>
            <Python width={100} height={100} />
            <CardText>Python</CardText>
          </CardContainer>
        </CardShadowContainer>

        <CardShadowContainer>
          <CardContainer onPress={() => router.navigate('/(tabs)/(home)/category-list')}>
            <JavaScript width={100} height={100} />
            <CardText>JavaScript</CardText>
          </CardContainer>
        </CardShadowContainer>
      </CardListContainer>

      <SectionTitle>Minhas coleções</SectionTitle>
    </>
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
        { id: '2', title: 'Loops', subTitle: 'Descrição da coleção 2' },
        { id: '3', title: 'Condicionais', subTitle: 'Descrição da coleção 3' },
      ]}
      ListHeaderComponent={ListCollectionHeader}
      renderItem={renderCollectionItem}
      ListEmptyComponent={ListCollectionEmpty}
    />
  );
}
