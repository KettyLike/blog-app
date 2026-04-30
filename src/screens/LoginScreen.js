import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogIn, UserPlus } from 'lucide-react-native';
import { spacing } from '../theme/spacing';

export default function LoginScreen({ onLogin, onRegister, theme }) {
  const [mode, setMode] = useState('login');
  const isRegisterMode = mode === 'register';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const getInputStyle = (fieldName) => [
    styles.input,
    {
      backgroundColor: theme.surfaceAlt,
      color: theme.textPrimary,
      borderColor: focusedField === fieldName ? theme.accent : theme.border,
    },
  ];

  const handleSubmit = async () => {
    if (isRegisterMode) {
      if (!name.trim() || !email.trim() || !password.trim()) {
        Alert.alert('Incomplete form', 'Name, email, and password are required.');
        return;
      }

      setIsSubmitting(true);
      const isRegistered = await onRegister({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        bio: bio.trim(),
      });
      setIsSubmitting(false);

      if (!isRegistered) {
        Alert.alert(
          'Registration failed',
          'This email may already be in use. Check the backend server and try again.'
        );
      }

      return;
    }

    if (!email.trim() || !password.trim()) {
      Alert.alert('Incomplete form', 'Enter email and password to continue.');
      return;
    }

    setIsSubmitting(true);
    const isLoggedIn = await onLogin({
      email: email.trim(),
      password: password.trim(),
    });
    setIsSubmitting(false);

    if (!isLoggedIn) {
      Alert.alert('Login failed', 'Check your email and password, then try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={[styles.badge, { backgroundColor: theme.surfaceAlt }]}>
          {isRegisterMode ? (
            <UserPlus color={theme.accent} size={22} />
          ) : (
            <LogIn color={theme.accent} size={22} />
          )}
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {isRegisterMode ? 'Create account' : 'Welcome back'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {isRegisterMode
            ? 'Create your account to publish articles and comment from your profile.'
            : 'Sign in to open the blog dashboard, write articles, and manage your profile.'}
        </Text>

        {isRegisterMode ? (
          <>
            <TextInput
              placeholder="Name"
              placeholderTextColor={theme.textMuted}
              caretHidden={false}
              value={name}
              onChangeText={setName}
              onBlur={() => setFocusedField(null)}
              onFocus={() => setFocusedField('name')}
              style={getInputStyle('name')}
            />
            <TextInput
              placeholder="Bio (optional)"
              placeholderTextColor={theme.textMuted}
              caretHidden={false}
              value={bio}
              onChangeText={setBio}
              onBlur={() => setFocusedField(null)}
              onFocus={() => setFocusedField('bio')}
              style={getInputStyle('bio')}
            />
          </>
        ) : null}

        <TextInput
          placeholder="Email"
          placeholderTextColor={theme.textMuted}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          caretHidden={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          onBlur={() => setFocusedField(null)}
          onFocus={() => setFocusedField('email')}
          style={getInputStyle('email')}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={theme.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          caretHidden={false}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onBlur={() => setFocusedField(null)}
          onFocus={() => setFocusedField('password')}
          style={getInputStyle('password')}
        />

        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? theme.accentPressed : theme.accent,
              opacity: isSubmitting ? 0.7 : 1,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: theme.surface }]}>
            {isSubmitting
              ? isRegisterMode
                ? 'Creating...'
                : 'Signing in...'
              : isRegisterMode
                ? 'Create account'
                : 'Sign in'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setMode(isRegisterMode ? 'login' : 'register')}
          disabled={isSubmitting}
          style={({ pressed }) => [
            styles.linkButton,
            {
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Text style={[styles.linkText, { color: theme.textSecondary }]}>
            {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Register"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    borderRadius: 22,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    minHeight: 44,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
