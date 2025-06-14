import theme from '@/src/shared/theme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { FlatList, FlatListProps, RefreshControl, StyleProp, ViewStyle } from 'react-native';

interface GenericListProps<T> extends FlatListProps<T> {
  contentContainerStyle?: StyleProp<ViewStyle>;
  handleRefresh?: () => void;
}

export function GenericList<T>(props: Readonly<GenericListProps<T>>) {
  const {
    data,
    horizontal,
    renderItem,
    ListHeaderComponent,
    ListFooterComponent,
    handleRefresh,
    ...restProps
  } = props;
  const tabBarHeight = useBottomTabBarHeight();
  const [isRefreshing] = useState(false); // NOVO ESTADO AQUI

  return (
    <FlatList<T>
      data={data}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item: any, index: number) => item.id || String(index)}
      contentContainerStyle={{ gap: 15, paddingBottom: !horizontal ? tabBarHeight * 2.5 : 0 }}
      refreshControl={
        handleRefresh && (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary, theme.colors.secondary, theme.colors.tertiary]} // Cores do spinner no Android
            tintColor={theme.colors.tertiary} // Cor do spinner no iOS
          />
        )
      }
      {...restProps}
    />
  );
}
