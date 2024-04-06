export type InputMethod = 'mousedown' | 'keydown';

export type Measurement = {
  type: InputMethod;
  which: 'left';
  wait: number;
  delay: number;
  timestamp: number;
};
