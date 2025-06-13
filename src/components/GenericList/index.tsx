import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React from 'react';
import { FlatList, FlatListProps, StyleProp, ViewStyle } from 'react-native';

interface GenericListProps<T> extends FlatListProps<T> {
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function GenericList<T>(props: Readonly<GenericListProps<T>>) {
  const { data, horizontal, renderItem, ListHeaderComponent, ListFooterComponent, ...restProps } =
    props;
  const tabBarHeight = useBottomTabBarHeight();

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
      {...restProps}
    />
  );
}
