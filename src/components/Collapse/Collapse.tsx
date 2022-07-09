import {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import styles from './Collapse.module.scss';

const TRANSITION_DURATION = 0.225;
const CONTAINER_PADDING = 1;

// prevent margin collapsing
const containerStyle = {
  paddingTop: CONTAINER_PADDING,
  paddingBottom: CONTAINER_PADDING,
  marginTop: -CONTAINER_PADDING,
  marginBottom: -CONTAINER_PADDING,
};

interface Props {
  onTransitionEnd?: () => void;
  expanded: boolean;
  transitionDuration?: number;
}

export const Collapse: FC<PropsWithChildren<Props>> = ({
  children,
  expanded,
  transitionDuration,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerHeight = useRef(containerRef.current?.offsetHeight || 0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (!expanded) {
      root.style.visibility = 'hidden';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    containerHeight.current = containerRef.current?.offsetHeight || 0;
  }, [children]);

  const rootStyle = useMemo(
    () => ({
      transitionDuration: (transitionDuration ?? TRANSITION_DURATION) + 's',
    }),
    [transitionDuration]
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (expanded) {
      root.style.visibility = 'visible';
      root.style.maxHeight =
        containerHeight.current - 2 * CONTAINER_PADDING + 'px';
    } else {
      root.style.maxHeight =
        containerHeight.current - 2 * CONTAINER_PADDING + 'px';
      root.offsetHeight;
      root.style.maxHeight = '0';
    }
  }, [expanded]);

  const handleTransitionEnd = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;

    if (expanded) {
      root && (root.style.maxHeight = 'none');
    } else {
      root.style.visibility = 'hidden';
    }
  }, [expanded]);

  useEffect(() => {
    const root = rootRef.current;
    root?.addEventListener('transitionend', handleTransitionEnd);

    return () => {
      root?.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [handleTransitionEnd]);

  return (
    <div ref={rootRef} className={styles.root} style={rootStyle}>
      <div style={containerStyle} ref={containerRef}>
        {children}
      </div>
    </div>
  );
};
