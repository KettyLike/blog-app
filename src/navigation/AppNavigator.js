import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ArticleScreen from '../screens/ArticleScreen';

const Stack = createStackNavigator();

export default function AppNavigator({ articles, onAddComment, theme }) {
  const initialArticleId = articles[0]?.id ?? null;

  const renderArticleScreen = ({ route, navigation }) => {
    const articleId = route.params?.articleId ?? initialArticleId;
    const article = articles.find((item) => item.id === articleId) ?? articles[0];

    return (
      <ArticleScreen
        article={article}
        navigation={navigation}
        onAddComment={onAddComment}
        theme={theme}
      />
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} articles={articles} theme={theme} />}
        </Stack.Screen>
        <Stack.Screen
          name="Article"
          component={renderArticleScreen}
          initialParams={{ articleId: initialArticleId }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
