---
title: 'React Navigationを導入する'
shortTitle: 'React Navigation導入'
tag: 'React Native Expo'
category: ''
---

```
npm install @react-navigation/native
```

then

```
npx expo install react-native-screens react-native-safe-area-context
```

if you need iOS

```
npx pod-install ios
```

edit App.js

```
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>{/* Rest of your app code */}</NavigationContainer>
  );
}
```

if you use stack
```
npm install @react-navigation/native-stack
```

then
```
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/HomeScreen'

export default function App() {
  const Stack = createNativeStackNavigator()

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

[https://reactnavigation.org/docs/getting-started](https://reactnavigation.org/docs/getting-started){:target=”_blank”}
