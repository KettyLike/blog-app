import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { fetchArticleById, fetchArticles } from './src/services/articlesApi';
import { postComment } from './src/services/commentsApi';
import { colors } from './src/theme/colors';

export default function App() {
  const [articleItems, setArticleItems] = useState([]);
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

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {isLoading ? (
        <View style={[styles.loader, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <AppNavigator
          articles={articleItems}
          onAddComment={handleAddComment}
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
