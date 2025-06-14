import { Header } from '@/src/components/Header';
import { Container, EmptyContainer, EmptyText } from './styles';

import EmptyCard from '@/assets/images/card/empty.svg';
import Logo from '@/assets/images/icon/logo.svg';
import JavaScript from '@/assets/images/languages/javascript.svg';
import Python from '@/assets/images/languages/python.svg';

import { CardModel, CardType } from '@/src/components/Cards/CardModel';
import { LoadingOverlay } from '@/src/components/LoadingOverlay';
import { ICollection } from '@/src/shared/interfaces/ICollection';
import { useCallback } from 'react';
import { useCategoryList } from './useCategoryList';

export function CategoryList() {
  const { collections, handleRefresh, categoryName, isLoading, router } = useCategoryList();

  const HeaderCategoryComponent = () => (
    <Header
      RightIcon={
        categoryName === 'Python' ? (
          <Python width={40} height={40} />
        ) : categoryName === 'JavaScript' ? (
          <JavaScript width={40} height={40} />
        ) : (
          <Logo width={40} height={40} />
        )
      }
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
    [],
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
      handleRefresh={handleRefresh}
    />
  );
}
