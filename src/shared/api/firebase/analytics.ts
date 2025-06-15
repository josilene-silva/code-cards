import analytics from "@react-native-firebase/analytics";

type EventType = {
  [key: string]: string
};

export const Analytics = {
  logEvent: async (key: string, value: EventType) => {
    console.log(`[analytics] logEvent [${key}]: ${JSON.stringify(value)}`);
    return await analytics().logEvent(key, value)
  },
  logSelectContent: async (data: {
    content_type: string,
    item_id: string
  }) => {
    console.log(`[analytics] logSelectContent ${JSON.stringify(data)}`);
    return await analytics().logSelectContent(data)
  },
  logScreenView: async (data: {
    screen_name: string,
    screen_class: string
  }) => {
    console.log(`[analytics] logScreenView ${JSON.stringify(data)}`);
    return await analytics().logScreenView(data)
  },
}
