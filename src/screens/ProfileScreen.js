import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, CircleUserRound, LogOut } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { spacing } from '../theme/spacing';
import { imageAssetToDataUrl } from '../utils/imageProcessing';

export default function ProfileScreen({ currentUser, onLogout, onSetAvatar, theme }) {
  const handlePickAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Allow photo library access to upload an avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      base64: true,
      quality: 0.85,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      Alert.alert('Image error', 'Could not read the selected image.');
      return;
    }

    let avatar = null;
    try {
      avatar = await imageAssetToDataUrl(asset, { maxWidth: 320, compress: 0.75 });
    } catch (error) {
      console.warn(error);
      Alert.alert('Image error', 'Could not process the selected image.');
      return;
    }

    const isSaved = await onSetAvatar(avatar);

    if (!isSaved) {
      Alert.alert('Avatar update failed', 'Check the backend server and try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.avatarRow}>
          <View style={[styles.badge, { backgroundColor: theme.surfaceAlt }]}>
            {currentUser.avatar ? (
              <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
            ) : (
              <CircleUserRound color={theme.accent} size={28} />
            )}
          </View>
          <Pressable
            onPress={handlePickAvatar}
            style={({ pressed }) => [
              styles.avatarButton,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Camera color={theme.textPrimary} size={18} />
            <Text style={[styles.avatarButtonText, { color: theme.textPrimary }]}>
              Set avatar
            </Text>
          </Pressable>
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.name, { color: theme.textPrimary }]}>{currentUser.name}</Text>
          <Text style={[styles.email, { color: theme.textSecondary }]}>{currentUser.email}</Text>
        </View>

        <Pressable
          onPress={onLogout}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? theme.accentPressed : theme.accent,
            },
          ]}
        >
          <LogOut color={theme.surface} size={18} />
          <Text style={[styles.buttonText, { color: theme.surface }]}>Log out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
  },
  avatarButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    borderRadius: 28,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
  },
  email: {
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: 16,
    paddingVertical: 15,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
