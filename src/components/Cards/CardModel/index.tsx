import { Feather } from '@expo/vector-icons';
import { PressableProps, View } from 'react-native';
import {
  ActionsContainer,
  CardSubTitle,
  CardSubTitleLight,
  CardTagCategory,
  CardTagLevel,
  CardTagPublic,
  CardTitle,
  Container,
  ShadowContainer,
} from './styles';
import { CollectionLevels } from '@/src/shared/interfaces/ICollection';

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
  level?: CollectionLevels;
  category?: string;

  editing?: boolean;
  actions?: {
    onDelete?: () => void;
    onEdit?: () => void;
  };
}

const getLevelLabel = (level: CollectionLevels) => {
  switch (level) {
    case 'basic':
      return 'Fácil';
    case 'intermediate':
      return 'Intermediário';
    case 'advanced':
      return 'Avançada';
  }
};

export function CardModel({
  title,
  subTitle,
  type,
  lastDate,
  isPublic,
  editing,
  actions,
  level,
  category,
  ...props
}: Readonly<ICardModelProps>) {
  return (
    <ShadowContainer>
      <Container {...props}>
        {(type === CardType.collection || type === CardType.statistic) && (
          <View style={{ flexDirection: 'row', width: '100%', gap: 8 }}>
            <CardTagPublic isPublic={isPublic}>{isPublic ? 'Pública' : 'Privada'}</CardTagPublic>
            {level && <CardTagLevel level={level}>{getLevelLabel(level)}</CardTagLevel>}
            {category && <CardTagCategory>{category}</CardTagCategory>}
          </View>
        )}

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
