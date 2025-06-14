import { Feather } from '@expo/vector-icons';
import { useCallback } from 'react';
import { View } from 'react-native';

import {
  AboutContainer,
  AboutText,
  AboutTitle,
  ActionsContainer,
  ActionsSubContainer,
  BottomSheetContainer,
  BottomSheetTitle,
  BottomSheetTitleContainer,
  CardContainer,
  CardsList,
  HeaderContainer,
  HeaderTitle,
} from './styles';

import { Button } from '@/src/components/Buttons';
import theme from '@/src/shared/theme';

import { AddCardButton } from '@/src/components/Buttons/AddCardButton';
import { CardModel, CardType } from '@/src/components/Cards/CardModel';
import { Input } from '@/src/components/Forms/Input';
import { LoadingOverlay } from '@/src/components/LoadingOverlay';
import { Modal } from '@/src/components/Modals/Modal';
import { ICard } from '@/src/shared/interfaces/ICard';

import { useCollectionView } from './useCollectionView';

export function CollectionView() {
  const {
    selectedCollection,
    cardsInSelectedCollection,
    handleGotToPractice,
    handleOpenModalDeleteCollection,
    handleOpenModalDeleteCard,
    isModalVisible,
    handleDeleteCollection,
    handleDeleteCard,
    handleGoBack,
    isLoading,
    controlCard,
    setFocusCard,
    refRBSheet,
    onSubmitCard,
  } = useCollectionView();

  const renderCardItem = useCallback(
    ({ item }: { item: ICard }) => (
      <CardContainer>
        <CardModel
          actions={{
            onDelete: () => handleOpenModalDeleteCard(item.id),
            onEdit: () => console.log('Edit pressed'),
          }}
          title={item.front}
          subTitle={item.back}
          type={CardType.card}
          editing={!selectedCollection?.isPublic}
        />
      </CardContainer>
    ),
    [handleOpenModalDeleteCard, selectedCollection?.isPublic],
  );

  const ListCollectionHeader = useCallback(() => {
    return (
      <View>
        <Modal {...isModalVisible.deleteCard} rightButtonOnPress={handleDeleteCard} />
        <Modal {...isModalVisible.deleteCollection} rightButtonOnPress={handleDeleteCollection} />

        <HeaderContainer>
          <Feather
            name="chevron-left"
            size={40}
            color={theme.colors.textInvert}
            style={{ marginRight: 10 }}
            onPress={handleGoBack}
          />
          <HeaderTitle>{selectedCollection?.name}</HeaderTitle>
        </HeaderContainer>

        <AboutContainer>
          <ActionsContainer>
            <Button onPress={handleGotToPractice} bgColor={theme.colors.tertiary}>
              Iniciar prática
            </Button>
            {selectedCollection?.isPublic ? null : (
              <ActionsSubContainer>
                <Feather
                  name="trash"
                  size={24}
                  onPress={handleOpenModalDeleteCollection}
                  color="#F23333"
                />
                <Feather
                  name="edit-3"
                  size={24}
                  color="#000"
                  onPress={() => console.log('Edit pressed')}
                />
              </ActionsSubContainer>
            )}
          </ActionsContainer>

          <AboutTitle>Sobre</AboutTitle>
          <AboutText>{selectedCollection?.description}</AboutText>

          {selectedCollection?.isPublic ? null : (
            <AddCardButton onButtonPress={() => refRBSheet.current?.open()} />
          )}
        </AboutContainer>

        <BottomSheetContainer ref={refRBSheet}>
          <BottomSheetTitleContainer>
            <Feather size={40} name="x" style={{ opacity: 0 }} />
            <BottomSheetTitle>
              {/* {cardIndex !== null ? 'Atualizar Cartão' : 'Adicionar Cartão'} */}
              Adiconar Cartão
            </BottomSheetTitle>
            <Feather
              size={40}
              color={theme.colors.tertiary}
              name="x"
              onPress={() => refRBSheet?.current?.close()}
            />
          </BottomSheetTitleContainer>
          <Input
            control={controlCard}
            name="front"
            placeholder="Frente"
            required
            maxLength={200}
            onSubmitEditing={() => setFocusCard('back')}
            returnKeyType="next"
          />

          <Input
            control={controlCard}
            name="back"
            numberOfLines={10}
            multiline
            placeholder="Verso"
            required
            maxLength={1000}
          />

          <Button
            marginTop={24}
            onPress={onSubmitCard}
            width="100%"
            bgColor={theme.colors.tertiary}
          >
            {/* {cardIndex !== null ? 'Atualizar' : 'Adicionar'} */}
            Adicionar
          </Button>
        </BottomSheetContainer>
      </View>
    );
  }, [
    handleGotToPractice,
    selectedCollection?.description,
    selectedCollection?.name,
    selectedCollection?.isPublic,
    handleOpenModalDeleteCollection,
    handleDeleteCard,
    handleDeleteCollection,
    isModalVisible.deleteCard,
    isModalVisible.deleteCollection,
    handleGoBack,
    controlCard,
    setFocusCard,
    onSubmitCard,
    refRBSheet,
  ]);

  if (isLoading || !selectedCollection) {
    return <LoadingOverlay isVisible />;
  }

  return (
    <CardsList<ICard>
      data={cardsInSelectedCollection}
      ListHeaderComponent={ListCollectionHeader}
      renderItem={renderCardItem}
    />
  );
}
