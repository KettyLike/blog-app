import { Alert, Share, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MessageCircle, Share2 } from 'lucide-react-native';
import CommentList from '../components/CommentList';
import ContentRenderer from '../components/ContentRenderer';
import { spacing } from '../theme/spacing';

export default function ArticleScreen({ article, navigation, onAddComment, theme }) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\n${article.preview}`,
      });
    } catch (error) {
      console.warn(error);
    }
  };

  const handleSubmitComment = ({ author, text }) => {
    if (!author.trim() || !text.trim()) {
      Alert.alert('Incomplete form', 'Please enter your name and comment text.');
      return false;
    }

    return onAddComment(article.id, {
      author: author.trim(),
      text: text.trim(),
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.iconButton, { backgroundColor: theme.surface }]}
          >
            <ArrowLeft color={theme.textPrimary} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShare}
            style={[styles.iconButton, { backgroundColor: theme.surface }]}
          >
            <Share2 color={theme.textPrimary} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.meta}>
          <Text style={[styles.category, { color: theme.accent }]}>{article.category}</Text>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{article.title}</Text>
          <Text style={[styles.preview, { color: theme.textSecondary }]}>{article.preview}</Text>

          <View style={styles.row}>
            <Text style={[styles.metaText, { color: theme.textMuted }]}>
              {article.author} - {article.readTime}
            </Text>
            <View style={styles.commentBadge}>
              <MessageCircle color={theme.textMuted} size={14} />
              <Text style={[styles.metaText, { color: theme.textMuted }]}>
                {article.comments.length}
              </Text>
            </View>
          </View>
        </View>

        <ContentRenderer content={article.content} theme={theme} />
        <CommentList comments={article.comments} onSubmit={handleSubmitComment} theme={theme} />
      </ScrollView>
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
    gap: spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    gap: spacing.sm,
  },
  category: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  preview: {
    fontSize: 16,
    lineHeight: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  commentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
