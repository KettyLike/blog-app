import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MessageCircle, Share2 } from 'lucide-react-native';
import CommentList from '../components/CommentList';
import ContentRenderer from '../components/ContentRenderer';
import { spacing } from '../theme/spacing';
import { shareArticle } from '../utils/shareArticle';

export default function ArticleScreen({
  article,
  navigation,
  onAddComment,
  onRefreshArticle,
  theme,
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const refreshArticle = async () => {
        if (!article?.id) {
          return;
        }

        setIsRefreshing(true);
        await onRefreshArticle(article.id);

        if (isActive) {
          setIsRefreshing(false);
        }
      };

      refreshArticle();

      return () => {
        isActive = false;
      };
    }, [article?.id, onRefreshArticle])
  );

  const handleShare = async () => {
    try {
      await shareArticle(article);
    } catch (error) {
      console.warn(error);
      Alert.alert('Sharing unavailable', 'Try again in a moment.');
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
    }).then((isSaved) => {
      if (!isSaved) {
        Alert.alert(
          'Backend unavailable',
          'Make sure the local server is running before posting a comment.'
        );
      }

      return isSaved;
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

        {article.coverImage ? (
          <Image source={{ uri: article.coverImage }} style={styles.coverImage} />
        ) : null}

        <View style={styles.meta}>
          {article.category ? (
            <Text style={[styles.category, { color: theme.accent }]}>{article.category}</Text>
          ) : null}
          <Text style={[styles.title, { color: theme.textPrimary }]}>{article.title}</Text>

          {isRefreshing ? (
            <View style={styles.refreshRow}>
              <ActivityIndicator size="small" color={theme.accent} />
              <Text style={[styles.refreshText, { color: theme.textMuted }]}>
                Refreshing article...
              </Text>
            </View>
          ) : null}

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
  coverImage: {
    width: '100%',
    height: 240,
    borderRadius: 22,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  refreshRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  refreshText: {
    fontSize: 13,
    fontWeight: '500',
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
