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
  AvatarText,
  CardContainer,
  CardListContainer,
  CardRanking,
  CardRankingSubTitle,
  CardRankingTitle,
  CardShadowContainer,
  CardTagPublic,
  CardText,
  CardTitleContainer,
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

import { LoadingOverlay } from '@/src/components/LoadingOverlay';
import { useHome } from './useHome';
import { getLanguageImage } from '@/src/shared/utils/getLanguageImage';
import { Image } from 'react-native';

export function Home() {
  const {
    userName,
    onLogoutPress,
    collections,
    onPressCollection,
    router,
    loadData,
    isLoading,
    categories,
    isLoadingCategories,
    users,
    isLoadingUsers,
  } = useHome();

  const renderCollectionItem = useCallback(
    ({ item }: { item: ICollection }) => (
      <CardModel
        title={item.name}
        subTitle={item.description}
        type={CardType.collection}
        level={item.level}
        category={item.categoryName}
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

      <SectionTitle>Linguagens de programação</SectionTitle>

      <CardListContainer>
        {categories.map((category) => (
          <CardShadowContainer key={category.id}>
            <CardContainer
              onPress={() =>
                router.navigate({
                  pathname: '/(tabs)/(home)/category-list',
                  params: { categoryId: category.id, categoryName: category.name },
                })
              }
            >
              {category.withPublic && (
                <CardTagPublic isPublic={category.withPublic}>Com coleções públicas</CardTagPublic>
              )}

              {React.createElement(getLanguageImage(category.name), {
                width: 50,
                height: 50,
              })}
              <CardText>{category.name}</CardText>
            </CardContainer>
          </CardShadowContainer>
        ))}
      </CardListContainer>

      <SectionTitle>Ranking de usuários</SectionTitle>

      <CardListContainer>
        {users?.map((user) => (
          <CardShadowContainer key={user.id}>
            <CardRanking>
              <CardTitleContainer>
                {user?.photo ? (
                  <Image
                    source={{ uri: user.photo }}
                    style={{ width: 40, height: 40, borderRadius: 100 }}
                  />
                ) : (
                  <AvatarText>{user.name[0]}</AvatarText>
                )}
                <CardRankingTitle>{user.name}</CardRankingTitle>
              </CardTitleContainer>

              <CardRankingSubTitle>Total de</CardRankingSubTitle>
              <CardRankingSubTitle>Cartões | Práticas</CardRankingSubTitle>
              <CardRankingSubTitle>
                {user.totalCardsPracticed} | {user.totalPracticeSessions}
              </CardRankingSubTitle>
            </CardRanking>
          </CardShadowContainer>
        ))}
      </CardListContainer>

      <SectionTitle>Minhas coleções</SectionTitle>
    </>
  );

  if (isLoading || isLoadingCategories || isLoadingUsers) {
    return <LoadingOverlay isVisible />;
  }

  return (
    <Container
      data={collections}
      ListHeaderComponent={ListCollectionHeader}
      renderItem={renderCollectionItem}
      ListEmptyComponent={ListCollectionEmpty}
      handleRefresh={loadData}
    />
  );
}
