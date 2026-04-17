import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArticleCard from '../components/ArticleCard';
import { spacing } from '../theme/spacing';

export default function HomeScreen({ articles, onOpenArticle, theme }) {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.kicker, { color: theme.accent }]}>BlogApp</Text>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              Article feed with previews
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Base blog structure with a feed screen, article details, formatted content, and
              comments.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ArticleCard article={item} onPress={() => onOpenArticle(item.id)} theme={theme} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  kicker: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  separator: {
    height: spacing.md,
  },
});
