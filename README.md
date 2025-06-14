# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with
[`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses
[file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app**
directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with
  our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step
  tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

```
users/{userId}
{
  "name": "João Silva",
  "email": "joao@example.com",
  "created_at": <timestamp>,
  "updated_at": <timestamp>
}
```

```
users/{userId}/practices/{practiceId}
{
  "collection_id": "uuid-do-collection-A",
  "collection_name": "Vocabulário Inglês Básico",
  "cards_amount: 5,
  "amount_easy": 10,
  "amount_medium": 5,
  "amount_hard": 2,
  "start_time": <timestamp>,
  "end_time": <timestamp>,
  "created_at": <timestamp>,
  "updated_at": <timestamp>
}
```

```
user_collections/{docId} // ID auto-gerado
{
  "user_id": "uuid-do-usuario-1",
  "collection_id": "uuid-do-collection-A",
  "created_at": <timestamp>,
  "updated_at": <timestamp>
}
```

```
collections/{collectionId}
{
  "name": "Vocabulário Inglês Básico",
  "description": "500 palavras essenciais",
  "category_id": 1,      // Opcional, se o ID for significativo
  "category_name": "Línguas", // Desnormalizado para fácil exibição
  "is_public": true,
  "created_at": <timestamp>,
  "updated_at": <timestamp>
}
```

```
user_collections/{docId} // ID auto-gerado
{
  "user_id": "uuid-do-usuario-1",
  "collection_id": "uuid-do-collection-A",
  "created_at": <timestamp>,
  "updated_at": <timestamp>
}
```

```
collections/{collectionId}/cards/{cardId}
{
  "difficulty_level": "easy",
  "front": "Hello",
  "back": "Olá",
  "created_at": <timestamp>,
  "updated_at": <timestamp>
}
```
