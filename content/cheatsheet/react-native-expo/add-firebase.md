---
title: 'Firebaseを導入する'
shortTitle: 'Firebase'
tag: 'React Native Expo'
category: ''
---

```
npm install firebase
```

edit App.js

```
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
```

[https://reactnavigation.org/docs/bottom-tab-navigator](https://reactnavigation.org/docs/bottom-tab-navigator){:target=”_blank”}
