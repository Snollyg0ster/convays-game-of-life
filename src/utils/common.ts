export const copy = <T>(val: T) => JSON.parse(JSON.stringify(val));

export const append = <T>(array: T[] | undefined, item: T) => array ? [...array, item] : [item];

export function assertEventTarget<Element extends Function>(
  event: any,
  element: Element //@ts-ignore
): asserts event is (Omit<Event, 'target'> & { target: InstanceType<Element> }) {
  if (event.target && event.target instanceof element) {
    return;
  }

  throw Error(`Target is not instance of ${element}`);
};

export const doNothing = <T = any>() => (val: string) => val as T;

export const voidExecutor = (...fns: VoidFn[]) => () => fns.forEach(fn => fn());
