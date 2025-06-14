import { CardModel, CardType } from '@/src/components/Cards/CardModel';
import { Container, LogoContainer, SectionTitle, Title } from './styles';

import Logo from '@/assets/images/icon/logo.svg';
import { LoadingOverlay } from '@/src/components/LoadingOverlay';
import { CollectionWithUserPractices } from '@/src/shared/interfaces/ICollection';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '../../shared/hooks';
import {
  fetchCollectionsWithUserPractices,
  selectCollectionState,
  setSelectedCollectionWithPractices,
} from '../../shared/store/collection';

export function StatisticList() {
  const dispatch = useAppDispatch();
  const { collectionsWithUserPractices, loadingCollections } =
    useAppSelector(selectCollectionState);

  const getLabel = (amount: number) => {
    return amount === 1 ? `${amount} vez praticada` : `${amount} vezes praticadas`;
  };

  const getLastPracticeTime = (date?: string) => {
    if (!date) {
      return 'Nenhuma prática registrada';
    }

    return `Última prática: ${new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  const loadData = useCallback(() => {
    try {
      console.log('Carregando coleções com práticas do usuário...');
      dispatch(fetchCollectionsWithUserPractices());
    } catch (error) {
      console.error('Erro ao carregar coleções com práticas do usuário:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar coleções',
        text2: 'Ocorreu um erro ao carregar suas coleções. Tente novamente mais tarde.',
      });
    }
  }, [dispatch]);

  useFocusEffect(loadData);

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
    ({ item }: { item: CollectionWithUserPractices }) => (
      <CardModel
        title={item.name}
        subTitle={getLabel(item.totalPracticeSessions)}
        lastDate={getLastPracticeTime(item.lastPracticeTime)}
        type={CardType.statistic}
        onPress={() => {
          dispatch(setSelectedCollectionWithPractices(item));
          router.navigate('/(tabs)/(statistics)/statistic');
        }}
      />
    ),
    [dispatch],
  );

  if (loadingCollections) {
    return <LoadingOverlay isVisible={true} />;
  }

  return (
    <Container
      data={collectionsWithUserPractices}
      ListHeaderComponent={ListHeader}
      renderItem={renderCollectionItem}
      handleRefresh={loadData}
    />
  );
}
