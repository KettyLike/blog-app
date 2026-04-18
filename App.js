import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { articles } from './src/data/articles';
import {
  COMMENTS_STORAGE_KEY,
  buildStoredCommentsMap,
  mergeArticlesWithStoredComments,
} from './src/utils/commentStorage';
import { colors } from './src/theme/colors';

export default function App() {
  const [articleItems, setArticleItems] = useState(articles);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadStoredComments = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(COMMENTS_STORAGE_KEY);

        if (!storedValue) {
          setIsHydrated(true);
          return;
        }

        const storedComments = JSON.parse(storedValue);
        setArticleItems(mergeArticlesWithStoredComments(articles, storedComments));
      } catch (error) {
        console.warn('Failed to load comments from storage.', error);
      } finally {
        setIsHydrated(true);
      }
    };

    loadStoredComments();
  }, []);

  const storedCommentsMap = useMemo(() => buildStoredCommentsMap(articleItems), [articleItems]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const persistComments = async () => {
      try {
        await AsyncStorage.setItem(
          COMMENTS_STORAGE_KEY,
          JSON.stringify(storedCommentsMap)
        );
      } catch (error) {
        console.warn('Failed to save comments to storage.', error);
      }
    };

    persistComments();
  }, [isHydrated, storedCommentsMap]);

  const handleAddComment = (articleId, comment) => {
    setArticleItems((currentArticles) =>
      currentArticles.map((article) =>
        article.id === articleId
          ? {
              ...article,
              comments: [
                ...article.comments,
                {
                  id: `c-${Date.now()}`,
                  ...comment,
                },
              ],
            }
          : article
      )
    );

    return true;
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
