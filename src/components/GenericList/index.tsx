import React from 'react';
import { FlatList, FlatListProps, StyleProp, ViewStyle } from 'react-native';

interface GenericListProps<T> extends FlatListProps<T> {
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function GenericList<T>(props: GenericListProps<T>) {
  const { data, renderItem, ListHeaderComponent, ListFooterComponent, ...restProps } = props;

  return (
    <FlatList<T>
      data={data}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      keyExtractor={(item: any, index: number) => item.id || String(index)}
      contentContainerStyle={{ gap: 15 }}
      {...restProps}
    />
  );
}
