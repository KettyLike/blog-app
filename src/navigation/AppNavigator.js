import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ArticleScreen from '../screens/ArticleScreen';

const Stack = createStackNavigator();

export default function AppNavigator({
  articles,
  onAddComment,
  onRefreshArticle,
  onRefreshArticles,
  theme,
}) {
  const initialArticleId = articles[0]?.id ?? null;

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
          {(props) => (
            <HomeScreen
              {...props}
              articles={articles}
              onRefreshArticles={onRefreshArticles}
              theme={theme}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Article" initialParams={{ articleId: initialArticleId }}>
          {({ route, navigation }) => {
            const articleId = route.params?.articleId ?? initialArticleId;
            const article = articles.find((item) => item.id === articleId) ?? articles[0];

            return (
              <ArticleScreen
                article={article}
                navigation={navigation}
                onAddComment={onAddComment}
                onRefreshArticle={onRefreshArticle}
                theme={theme}
              />
            );
          }}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
