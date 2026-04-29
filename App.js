import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import { createArticle, fetchArticleById, fetchArticles } from './src/services/articlesApi';
import { loginUser, registerUser } from './src/services/authApi';
import { postComment } from './src/services/commentsApi';
import { setUserAvatar } from './src/services/usersApi';
import { colors } from './src/theme/colors';

export default function App() {
  const [articleItems, setArticleItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleRefreshArticles = useCallback(async () => {
    try {
      const backendArticles = await fetchArticles();
      setArticleItems(backendArticles);
      return true;
    } catch (error) {
      console.warn('Failed to load articles from backend.', error);
      return false;
    }
  }, []);

  useEffect(() => {
    const loadArticles = async () => {
      await handleRefreshArticles();
      setIsLoading(false);
    };

    loadArticles();
  }, [handleRefreshArticles]);

  const handleAddComment = useCallback(async (articleId, comment) => {
    try {
      const createdComment = await postComment(articleId, comment);

      setArticleItems((currentArticles) =>
        currentArticles.map((article) =>
          article.id === articleId
            ? {
                ...article,
                comments: [...article.comments, createdComment],
              }
            : article
        )
      );

      return true;
    } catch (error) {
      console.warn('Failed to save comment to backend.', error);
      return false;
    }
  }, []);

  const handleRefreshArticle = useCallback(async (articleId) => {
    try {
      const refreshedArticle = await fetchArticleById(articleId);

      setArticleItems((currentArticles) =>
        currentArticles.map((article) =>
          article.id === articleId ? refreshedArticle : article
        )
      );

      return refreshedArticle;
    } catch (error) {
      console.warn('Failed to refresh article from backend.', error);
      return null;
    }
  }, []);

  const handleLogin = useCallback(async (credentials) => {
    try {
      const user = await loginUser(credentials);
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.warn('Failed to log in.', error);
      return false;
    }
  }, []);

  const handleRegister = useCallback(async (payload) => {
    try {
      const user = await registerUser(payload);
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.warn('Failed to register.', error);
      return false;
    }
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const handleSetAvatar = useCallback(async (avatar) => {
    try {
      const updatedUser = await setUserAvatar(currentUser.id, avatar);
      setCurrentUser(updatedUser);
      return true;
    } catch (error) {
      console.warn('Failed to set avatar.', error);
      return false;
    }
  }, [currentUser?.id]);

  const handleCreateArticle = useCallback(async (articleInput) => {
    try {
      const createdArticle = await createArticle(articleInput);
      setArticleItems((currentArticles) => [createdArticle, ...currentArticles]);
      return true;
    } catch (error) {
      console.warn('Failed to create article.', error);
      return false;
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {isLoading ? (
        <View style={[styles.loader, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : !currentUser ? (
        <LoginScreen onLogin={handleLogin} onRegister={handleRegister} theme={colors} />
      ) : (
        <AppNavigator
          articles={articleItems}
          currentUser={currentUser}
          onAddComment={handleAddComment}
          onCreateArticle={handleCreateArticle}
          onLogout={handleLogout}
          onSetAvatar={handleSetAvatar}
          onRefreshArticle={handleRefreshArticle}
          onRefreshArticles={handleRefreshArticles}
          theme={colors}
        />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
