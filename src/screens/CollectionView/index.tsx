import { Feather } from '@expo/vector-icons';
import React, { useCallback } from 'react';
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
  HeaderSubContainer,
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
import { getLanguageImage } from '@/src/shared/utils/getLanguageImage';
import { DropdownForm } from '@/src/components/Forms/DropdownForm';

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
    refBSCard,
    onSubmitCard,
    handleEditCard,
    cardId,
    setFocusCollection,
    refBSCollection,
    controlCollection,
    handleEditCollection,
    onSubmitCollection,
    formattedCategories,
    formStateCollection,
  } = useCollectionView();

  const renderCardItem = useCallback(
    ({ item }: { item: ICard }) => (
      <CardContainer>
        <CardModel
          actions={{
            onDelete: () => handleOpenModalDeleteCard(item.id),
            onEdit: () => handleEditCard(item.id),
          }}
          title={item.front}
          subTitle={item.back}
          type={CardType.card}
          editing={!selectedCollection?.isPublic}
        />
      </CardContainer>
    ),
    [handleOpenModalDeleteCard, selectedCollection?.isPublic, handleEditCard],
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
            onPress={handleGoBack}
          />
          <HeaderSubContainer>
            <HeaderTitle>{selectedCollection?.name}</HeaderTitle>

            {selectedCollection?.categoryName &&
              selectedCollection.categoryId &&
              React.createElement(getLanguageImage(selectedCollection?.categoryName ?? ''), {
                width: 40,
                height: 40,
              })}
          </HeaderSubContainer>
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
                <Feather name="edit-3" size={24} color="#000" onPress={handleEditCollection} />
              </ActionsSubContainer>
            )}
          </ActionsContainer>

          <AboutTitle>Sobre</AboutTitle>
          <AboutText>{selectedCollection?.description}</AboutText>

          {selectedCollection?.isPublic ? null : (
            <AddCardButton onButtonPress={() => refBSCard.current?.open()} />
          )}
        </AboutContainer>

        <BottomSheetContainer
          ref={refBSCard}
          onOpen={() => setTimeout(() => setFocusCard('front'), 500)}
        >
          <BottomSheetTitleContainer>
            <Feather size={40} name="x" style={{ opacity: 0 }} />
            <BottomSheetTitle>
              {cardId !== null ? 'Atualizar Cartão' : 'Adicionar Cartão'}
            </BottomSheetTitle>
            <Feather
              size={40}
              color={theme.colors.tertiary}
              name="x"
              onPress={() => refBSCard?.current?.close()}
            />
          </BottomSheetTitleContainer>
          <Input
            control={controlCard}
            name="front"
            placeholder="Frente"
            required
            maxLength={1000}
            numberOfLines={10}
            multiline
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
            {cardId !== null ? 'Atualizar' : 'Adicionar'}
          </Button>
        </BottomSheetContainer>

        <BottomSheetContainer
          ref={refBSCollection}
          onOpen={() => setTimeout(() => setFocusCollection('name'), 500)}
        >
          <BottomSheetTitleContainer>
            <Feather size={40} name="x" style={{ opacity: 0 }} />
            <BottomSheetTitle>Editar Coleção</BottomSheetTitle>
            <Feather
              size={40}
              color={theme.colors.tertiary}
              name="x"
              onPress={() => refBSCollection?.current?.close()}
            />
          </BottomSheetTitleContainer>
          <Input
            control={controlCollection}
            name="name"
            placeholder="Nome da Coleção"
            required
            maxLength={200}
            onSubmitEditing={() => setFocusCollection('description')}
            returnKeyType="next"
          />

          <Input
            control={controlCollection}
            name="description"
            numberOfLines={10}
            multiline
            placeholder="Descrição da Coleção"
            required
            maxLength={1000}
          />

          <DropdownForm
            items={formattedCategories}
            placeholder={{
              label: 'Selecione uma categoria',
              value: '',
              inputLabel: 'Selecione uma categoria',
            }}
            name="categoryId"
            control={controlCollection}
            error={formStateCollection.errors?.categoryId?.message}
          />

          <Button
            marginTop={24}
            onPress={onSubmitCollection}
            width="100%"
            bgColor={theme.colors.tertiary}
          >
            Atualizar
          </Button>
        </BottomSheetContainer>
      </View>
    );
  }, [
    onSubmitCollection,
    handleGotToPractice,
    selectedCollection?.description,
    selectedCollection?.name,
    selectedCollection?.isPublic,
    selectedCollection?.categoryName,
    handleOpenModalDeleteCollection,
    handleDeleteCard,
    handleDeleteCollection,
    isModalVisible.deleteCard,
    isModalVisible.deleteCollection,
    handleGoBack,
    controlCard,
    setFocusCard,
    onSubmitCard,
    refBSCard,
    cardId,
    refBSCollection,
    controlCollection,
    setFocusCollection,
    handleEditCollection,
    formattedCategories,
    formStateCollection.errors?.categoryId?.message,
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
