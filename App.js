import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { articles } from './src/data/articles';
import { fetchComments, postComment } from './src/services/commentsApi';
import { colors } from './src/theme/colors';

export default function App() {
  const [articleItems, setArticleItems] = useState(articles);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const commentsMap = await fetchComments();
        setArticleItems((currentArticles) =>
          currentArticles.map((article) => ({
            ...article,
            comments: commentsMap[article.id] ?? article.comments,
          }))
        );
      } catch (error) {
        console.warn('Failed to load comments from backend.', error);
      }
    };

    loadComments();
  }, []);

  const handleAddComment = async (articleId, comment) => {
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
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppNavigator
        articles={articleItems}
        onAddComment={handleAddComment}
        theme={colors}
      />
    </SafeAreaProvider>
  );
}
