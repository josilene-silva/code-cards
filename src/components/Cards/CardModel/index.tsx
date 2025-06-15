import { Feather } from '@expo/vector-icons';
import { PressableProps } from 'react-native';
import {
  ActionsContainer,
  CardSubTitle,
  CardSubTitleLight,
  CardTagPublic,
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

  lastDate?: string;
  isPublic?: boolean;

  editing?: boolean;
  actions?: {
    onDelete?: () => void;
    onEdit?: () => void;
  };
}

export function CardModel({
  title,
  subTitle,
  type,
  lastDate,
  isPublic,
  editing,
  actions,
  ...props
}: Readonly<ICardModelProps>) {
  return (
    <ShadowContainer>
      <Container {...props}>
        {isPublic && <CardTagPublic>Pública</CardTagPublic>}
        <CardTitle numberOfLines={1}>{title}</CardTitle>
        {type !== CardType.statistic ? (
          <CardSubTitle numberOfLines={1}>{subTitle}</CardSubTitle>
        ) : (
          <>
            <CardSubTitle>{subTitle}</CardSubTitle>
            <CardSubTitleLight>{lastDate}</CardSubTitleLight>
          </>
        )}

        {type === CardType.card && editing && (
          <ActionsContainer>
            <Feather name="trash" size={24} onPress={actions?.onDelete} color="#F23333" />
            <Feather name="edit-3" size={24} color="#000" onPress={actions?.onEdit} />
          </ActionsContainer>
        )}
      </Container>
    </ShadowContainer>
  );
}
