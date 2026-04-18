import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { articles } from './src/data/articles';
import { colors } from './src/theme/colors';

export default function App() {
  const [articleItems, setArticleItems] = useState(articles);

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
