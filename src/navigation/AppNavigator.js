import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { House, SquarePen, UserRound } from 'lucide-react-native';
import ArticleScreen from '../screens/ArticleScreen';
import CreateArticleScreen from '../screens/CreateArticleScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStackNavigator({
  articles,
  onAddComment,
  onRefreshArticle,
  onRefreshArticles,
  theme,
}) {
  const initialArticleId = articles[0]?.id ?? null;

  return (
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
  );
}

export default function AppNavigator({
  articles,
  currentUser,
  onAddComment,
  onCreateArticle,
  onLogout,
  onRefreshArticle,
  onRefreshArticles,
  theme,
}) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textMuted,
          tabBarStyle: {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            height: 72,
            paddingTop: 8,
            paddingBottom: 10,
          },
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'HomeTab') {
              return <House color={color} size={size} />;
            }

            if (route.name === 'WriteTab') {
              return <SquarePen color={color} size={size} />;
            }

            return <UserRound color={color} size={size} />;
          },
        })}
      >
        <Tab.Screen
          name="HomeTab"
          options={{
            title: 'Home',
          }}
        >
          {() => (
            <HomeStackNavigator
              articles={articles}
              onAddComment={onAddComment}
              onRefreshArticle={onRefreshArticle}
              onRefreshArticles={onRefreshArticles}
              theme={theme}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="WriteTab"
          options={{
            title: 'Write',
          }}
        >
          {(props) => (
            <CreateArticleScreen
              {...props}
              currentUser={currentUser}
              onCreateArticle={onCreateArticle}
              theme={theme}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="ProfileTab"
          options={{
            title: 'Profile',
          }}
        >
          {() => <ProfileScreen currentUser={currentUser} onLogout={onLogout} theme={theme} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
