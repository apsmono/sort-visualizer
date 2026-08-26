export type Distribution = 'random' | 'nearly-sorted' | 'reversed' | 'few-unique';

export interface ArrayOptions {
  readonly size: number;
  readonly distribution: Distribution;
  /** Optional seed for reproducible runs. */
  readonly seed?: number;
}
