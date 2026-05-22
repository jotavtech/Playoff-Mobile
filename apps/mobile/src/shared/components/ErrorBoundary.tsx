import { Component, type ErrorInfo, type ReactNode } from 'react';
import { View } from 'react-native';
import { Text, Button } from '@playoff/ui';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-background px-6">
          <Text variant="title" className="mb-2 text-center">
            Algo deu errado
          </Text>
          <Text variant="body" className="mb-6 text-center text-muted-foreground">
            Tente novamente. Se persistir, reinicie o app.
          </Text>
          <Button label="Tentar novamente" onPress={() => this.setState({ hasError: false })} />
        </View>
      );
    }
    return this.props.children;
  }
}
