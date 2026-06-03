import { type ReactNode } from 'react';
import { VisualShell } from './VisualShell';

type ScreenContainerProps = {
  children: ReactNode;
  scroll?: boolean;
  tone?: 'atlas' | 'playoff';
  onRefresh?: () => void;
  refreshing?: boolean;
  /** Extra bottom padding so content clears the tab bar. */
  contentBottomPadding?: number;
};

/** Backward-compatible screen shell using the editorial Playoff visual layer. */
export function ScreenContainer({
  children,
  scroll = true,
  tone = 'atlas',
  onRefresh,
  refreshing = false,
  contentBottomPadding = 92,
}: ScreenContainerProps) {
  return (
    <VisualShell
      scroll={scroll}
      tone={tone}
      onRefresh={onRefresh}
      refreshing={refreshing}
      contentBottomPadding={contentBottomPadding}
    >
      {children}
    </VisualShell>
  );
}
