import { Header } from '@/src/components/Header';
import { Container, EmptyContainer, EmptyText } from './styles';

import EmptyCard from '@/assets/images/card/empty.svg';

import { CardModel, CardType } from '@/src/components/Cards/CardModel';
import { LoadingOverlay } from '@/src/components/LoadingOverlay';
import { ICollection } from '@/src/shared/interfaces/ICollection';
import React, { useCallback } from 'react';
import { useCategoryList } from './useCategoryList';
import { getLanguageImage } from '@/src/shared/utils/getLanguageImage';

export function CategoryList() {
  const { collections, categoryName, isLoading, router, loadData } = useCategoryList();

  const HeaderCategoryComponent = () => (
    <Header
      RightIcon={React.createElement(getLanguageImage(categoryName), { width: 40, height: 40 })}
      onBackPress={() => router.back()}
      title={categoryName}
    />
  );

  const ListCollectionEmpty = useCallback(
    () => (
      <EmptyContainer>
        <EmptyCard width={134} height={131} />
        <EmptyText>Nenhuma coleção foi cadastrada {'\n'} para essa categoria</EmptyText>
      </EmptyContainer>
    ),
    [],
  );

  const renderCollectionItem = useCallback(
    ({ item }: { item: ICollection }) => (
      <CardModel
        title={item.name}
        subTitle={item.description}
        type={CardType.collection}
        isPublic={item?.isPublic}
        onPress={() =>
          router.navigate({
            pathname: '/(tabs)/(home)/collection-view',
            params: {
              collectionId: item.id,
            },
          })
        }
      />
    ),
    [router],
  );

  if (isLoading) {
    return <LoadingOverlay isVisible />;
  }

  return (
    <Container<ICollection>
      data={collections}
      ListHeaderComponent={HeaderCategoryComponent}
      renderItem={renderCollectionItem}
      ListEmptyComponent={ListCollectionEmpty}
      handleRefresh={loadData}
    />
  );
}
