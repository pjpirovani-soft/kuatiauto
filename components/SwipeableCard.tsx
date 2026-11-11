'use client';

import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { ReactNode } from 'react';

type SwipeAction = {
  label: string;
  color: string;
  onAction: () => void;
};

type Props = {
  children: ReactNode;
  leftAction?: SwipeAction; // Deslizar hacia la derecha
  rightAction?: SwipeAction; // Deslizar hacia la izquierda
};

const SWIPE_THRESHOLD = 100; // píxeles para activar la acción

export default function SwipeableCard({ children, leftAction, rightAction }: Props) {
  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const bind = useDrag(
    ({ down, movement: [mx], last, velocity: [vx] }) => {
      // Si está arrastrando, mueve la tarjeta con el dedo
      if (down) {
        api.start({ x: mx, immediate: true });
        return;
      }

      // Al soltar, decidir si se activa una acción o vuelve al centro
      const shouldTriggerRight = rightAction && (mx < -SWIPE_THRESHOLD || vx < -0.5);
      const shouldTriggerLeft = leftAction && (mx > SWIPE_THRESHOLD || vx > 0.5);

      if (shouldTriggerRight && rightAction) {
        api.start({ x: -window.innerWidth, immediate: true });
        setTimeout(() => {
          rightAction.onAction();
          api.start({ x: 0, immediate: true }); // Reset después de la acción
        }, 150);
        return;
      }

      if (shouldTriggerLeft && leftAction) {
        api.start({ x: window.innerWidth, immediate: true });
        setTimeout(() => {
          leftAction.onAction();
          api.start({ x: 0, immediate: true });
        }, 150);
        return;
      }

      // Si no supera el umbral, vuelve al centro
      api.start({ x: 0 });
    },
    {
      axis: 'x', // Solo horizontal
      filterTaps: true, // Ignora taps rápidos
      rubberband: true, // Resistencia al arrastrar
      bounds: { left: -window.innerWidth, right: window.innerWidth },
    }
  );

  return (
    <div className='relative overflow-hidden rounded-xl'>
      {/* Fondo de la acción derecha (deslizar a la izquierda) */}
      {rightAction && (
        <div
          className={`absolute inset-y-0 right-0 w-1/2 flex items-center justify-end pr-6 ${rightAction.color}`}
        >
          <span className='text-white font-semibold'>{rightAction.label}</span>
        </div>
      )}

      {/* Fondo de la acción izquierda (deslizar a la derecha) */}
      {leftAction && (
        <div
          className={`absolute inset-y-0 left-0 w-1/2 flex items-center justify-start pl-6 ${leftAction.color}`}
        >
          <span className='text-white font-semibold'>{leftAction.label}</span>
        </div>
      )}

      {/* Tarjeta deslizable */}
      <animated.div
        {...bind()}
        style={{ x, touchAction: 'pan-y' }}
        className='relative bg-kuati-blanco'
      >
        {children}
      </animated.div>
    </div>
  );
}