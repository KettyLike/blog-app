import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ArticleScreen from '../screens/ArticleScreen';

export default function AppNavigator({
  articles,
  selectedArticle,
  onSelectArticle,
  theme,
}) {
  const [activeScreen, setActiveScreen] = useState('home');

  const openArticle = (articleId) => {
    onSelectArticle(articleId);
    setActiveScreen('article');
  };

  const goBack = () => {
    setActiveScreen('home');
  };

  return (
    <View style={styles.container}>
      {activeScreen === 'home' ? (
        <HomeScreen articles={articles} onOpenArticle={openArticle} theme={theme} />
      ) : (
        <ArticleScreen article={selectedArticle} onGoBack={goBack} theme={theme} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
