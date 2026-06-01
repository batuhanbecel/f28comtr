// React 19.2 ships `unstable_ViewTransition` at runtime, but the
// @types/react package hasn't surfaced it yet. This file re-exports it
// with a typed signature so consumers don't need ts-expect-error.

import * as React from 'react';

interface ViewTransitionProps {
  name?: string;
  children?: React.ReactNode;
}

const Runtime = (React as unknown as { unstable_ViewTransition?: React.ComponentType<ViewTransitionProps> })
  .unstable_ViewTransition;

export const ViewTransition: React.ComponentType<ViewTransitionProps> =
  Runtime ?? (({ children }: ViewTransitionProps) => <>{children}</>);
