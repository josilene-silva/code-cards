import { Feather } from '@expo/vector-icons';
import { PressableProps } from 'react-native';
import {
  ActionsContainer,
  CardSubTitle,
  CardSubTitleLight,
  CardTitle,
  Container,
  ShadowContainer,
} from './styles';

export enum CardType {
  card = 'card',
  collection = 'collection',
  statistic = 'statistic',
}

interface ICardModelProps extends PressableProps {
  title: string;
  subTitle: string;
  type: CardType;
  amount?: number;
}

export function CardModel({ title, subTitle, type, amount, ...props }: ICardModelProps) {
  const getLabel = () => {
    return amount === 1 ? `${amount} cartão` : `${amount} cartões`;
  };

  return (
    <ShadowContainer>
      <Container {...props}>
        <CardTitle numberOfLines={1}>{title}</CardTitle>
        {type !== CardType.statistic ? (
          <CardSubTitle numberOfLines={1}>{subTitle}</CardSubTitle>
        ) : (
          <>
            <CardSubTitle>{getLabel()}</CardSubTitle>
            <CardSubTitleLight>Última revisão: 5 de maio de 2025</CardSubTitleLight>
          </>
        )}

        {type === CardType.card && (
          <ActionsContainer>
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
          </ActionsContainer>
        )}
      </Container>
    </ShadowContainer>
  );
}
