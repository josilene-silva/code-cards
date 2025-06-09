import { useCallback } from 'react';
import {
  AboutContainer,
  AboutText,
  AboutTitle,
  ActionsContainer,
  ActionsSubContainer,
  CardContainer,
  CardsList,
  HeaderContainer,
  HeaderTitle,
} from './styles';

import { Button } from '@/src/components/Buttons';
import theme from '@/src/shared/theme/theme';
import { router } from 'expo-router';

import { AddCardButton } from '@/src/components/Buttons/AddCardButton';
import { CardModel, CardType } from '@/src/components/Cards/CardModel';
import { Modal } from '@/src/components/Modals/Modal';
import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';

export function CollectionView() {
  const renderCardItem = useCallback(
    ({ item }: { item: { title: string; subTitle: string } }) => (
      <CardContainer>
        <CardModel
          title={item.title}
          subTitle={item.subTitle}
          type={CardType.card}
          onPress={() => router.navigate('/(tabs)/(home)/collection-view')}
        />
      </CardContainer>
    ),
    [],
  );

  const ListCollectionHeader = useCallback(() => {
    return (
      <View>
        <Modal
          isVisible={false}
          title="Tem certeza que deseja excluir este cartão?"
          subTitle="Essa ação não poderá ser revertida"
          rightButtonText="Excluir"
          leftButtonText="Manter"
          onClose={() => console.log('Modal closed')}
          leftButtonOnPress={() => console.log('Manter pressed')}
          rightButtonOnPress={() => console.log('Excluir pressed')}
        />

        <HeaderContainer>
          <Feather
            name="chevron-left"
            size={40}
            color={theme.colors.textInvert}
            style={{ marginRight: 10 }}
            onPress={() => router.back()}
          />
          <HeaderTitle> Estudo de estruturas de repetição</HeaderTitle>
        </HeaderContainer>

        <AboutContainer>
          <ActionsContainer>
            <Button
              onPress={() => router.push('/(tabs)/(home)/practice')}
              bgColor={theme.colors.tertiary}
            >
              Iniciar prática
            </Button>
            <ActionsSubContainer>
              <Feather
                name="trash"
                size={24}
                onPress={() => console.log('Delete pressed')}
                color="#F23333"
              />
              <Feather
                name="edit-3"
                size={24}
                color="#000"
                onPress={() => console.log('Edit pressed')}
              />
            </ActionsSubContainer>
          </ActionsContainer>

          <AboutTitle>Sobre</AboutTitle>
          <AboutText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra ipsum ac tempor
            ornare. Sed imperdiet at lectus non tristique. Ut pellentesque lorem quis
          </AboutText>

          <AddCardButton />
        </AboutContainer>
      </View>
    );
  }, []);

  return (
    <CardsList
      data={[
        {
          title: 'Estruturas de repetição',
          subTitle:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra ipsum ac tempor ornare. Sed imperdiet at lectus non tristique. Ut pellentesque lorem quis',
        },
        {
          title: 'Lorem ipsum',
          subTitle:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra ipsum ac tempor ornare. Sed imperdiet at lectus non tristique. Ut pellentesque lorem quis',
        },
      ]}
      ListHeaderComponent={ListCollectionHeader}
      renderItem={renderCardItem}
    />
  );
}
