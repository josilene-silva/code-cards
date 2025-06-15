import crashlytics from '@react-native-firebase/crashlytics';

export const Crash = {
  recordError: (error: any) => crashlytics().recordError(error),
  setUserId: (id: any) => crashlytics().setUserId(id),
  log: (value: string) => crashlytics().log(value),
  crash: () => crashlytics().crash(),
  setAttributes: (attributes: { [key: string]: any }) => crashlytics().setAttributes(attributes),
};
