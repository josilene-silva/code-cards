import Logo from '@/assets/images/icon/logo.svg';
import { Button } from '@/src/components/Buttons';
import { AddCardButton } from '@/src/components/Buttons/AddCardButton';
import { Input } from '@/src/components/Forms/Input';
import { Header } from '@/src/components/Header';
import theme from '@/src/shared/theme';

import {
  SchemaCollection,
  validationCollection,
} from '@/src/shared/utils/form/validations/SchemaCollection';
import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  BottomSheetContainer,
  BottomSheetTitle,
  BottomSheetTitleContainer,
  ButtonContainer,
  Container,
  ScrollContainer,
} from './styles';

export function CollectionCreation() {
  const refRBSheet = useRef<{ open: () => void; close: () => void }>(null);

  const { control, handleSubmit, setValue, reset, trigger, setFocus, getFieldState, formState } =
    useForm<SchemaCollection>({
      resolver: zodResolver(validationCollection),
      defaultValues: {},
    });

  const onSubmit = handleSubmit((data) => {
    console.log('Form Data:', data);
    // Here you can handle the form submission, e.g., send data to an API
    // After successful submission, you can reset the form
    reset();
  });

  return (
    <Container>
      <ScrollContainer>
        <Header
          title={'Criar Coleção'}
          RightIcon={<Logo width={49} height={52} />}
          onBackPress={() => router.back()}
        />
        <Input
          control={control}
          name="name"
          placeholder="Nome da coleção"
          required
          maxLength={200}
          onSubmitEditing={() => setFocus('description')}
          returnKeyType="next"
        />

        <Input
          control={control}
          name="description"
          numberOfLines={10}
          multiline
          placeholder="Descrição"
          required
          maxLength={1000}
        />

        <AddCardButton onButtonPress={() => refRBSheet?.current?.open()} />
      </ScrollContainer>

      <ButtonContainer>
        <Button onPress={onSubmit} width="100%" bgColor={theme.colors.tertiary}>
          Salvar
        </Button>
      </ButtonContainer>

      <BottomSheetContainer ref={refRBSheet}>
        <BottomSheetTitleContainer>
          <Feather size={40} name="x" style={{ opacity: 0 }} />
          <BottomSheetTitle>Criar Cartão</BottomSheetTitle>
          <Feather
            size={40}
            color={theme.colors.tertiary}
            name="x"
            onPress={() => refRBSheet?.current?.close()}
          />
        </BottomSheetTitleContainer>
        <Input
          control={control}
          name="name"
          placeholder="Nome do cartão"
          required
          maxLength={200}
          onSubmitEditing={() => setFocus('description')}
          returnKeyType="next"
        />

        <Input
          control={control}
          name="description"
          numberOfLines={10}
          multiline
          placeholder="Verso"
          required
          maxLength={1000}
        />

        <Button marginTop={24} onPress={onSubmit} width="100%" bgColor={theme.colors.tertiary}>
          Adicionar
        </Button>
      </BottomSheetContainer>
    </Container>
  );
}
