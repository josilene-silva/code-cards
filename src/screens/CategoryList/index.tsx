import { Header } from '@/src/components/Header';
import { router } from 'expo-router';
import { Container } from './styles';

import Python from '@/assets/images/languages/python.svg';
import { CardModel, CardType } from '@/src/components/Cards/CardModel';
import { useCallback } from 'react';

export function CategoryList() {
  const HeaderCategoryComponent = () => (
    <Header
      RightIcon={<Python width={40} height={40} />}
      onBackPress={() => router.back()}
      title="Python"
    />
  );

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
      ListHeaderComponent={HeaderCategoryComponent}
      renderItem={renderCollectionItem}
    />
  );
}
