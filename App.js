import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { articles } from './src/data/articles';
import { colors } from './src/theme/colors';

export default function App() {
  const [selectedArticleId, setSelectedArticleId] = useState(articles[0]?.id ?? null);

  const selectedArticle = useMemo(
    () => articles.find((article) => article.id === selectedArticleId) ?? articles[0],
    [selectedArticleId]
  );

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppNavigator
        articles={articles}
        selectedArticle={selectedArticle}
        onSelectArticle={setSelectedArticleId}
        theme={colors}
      />
    </SafeAreaProvider>
  );
}
