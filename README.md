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
  "cards_amount: 5,
  "cards_amount_easy": 10,
  "cards_amount_medium": 5,
  "cards_amount_hard": 2,
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
collections/{collectionId}/cards/{cardId}
{
  "difficulty_level": "easy",
  "front": "Hello",
  "back": "Olá",
  "created_at": <timestamp>,
  "updated_at": <timestamp>
}
```
