import { Feather } from '@expo/vector-icons';
import React, { useCallback } from 'react';

import EmptyCard from '@/assets/images/card/empty.svg';
import Logo from '@/assets/images/icon/logo.svg';
import JavaScript from '@/assets/images/languages/javascript.svg';
import Python from '@/assets/images/languages/python.svg';
import { CardModel, CardType } from '@/src/components/Cards/CardModel';
import { ICollection } from '@/src/shared/interfaces/ICollection';
import theme from '@/src/shared/theme';
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

import { useHome } from './useHome';

export function Home() {
  const { userName, onLogoutPress, collections, onPressCollection, router } = useHome();

  const renderCollectionItem = useCallback(
    ({ item }: { item: ICollection }) => (
      <CardModel
        title={item.name}
        subTitle={item.description}
        type={CardType.collection}
        onPress={() => onPressCollection(item)}
      />
    ),
    [onPressCollection],
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
        <GreetingUseNameText>{userName}!</GreetingUseNameText>
        <Feather name="log-out" size={24} color={theme.colors.tertiary} onPress={onLogoutPress} />
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
      data={collections}
      ListHeaderComponent={ListCollectionHeader}
      renderItem={renderCollectionItem}
      ListEmptyComponent={ListCollectionEmpty}
    />
  );
}
