export const copy = <T>(val: T) => JSON.parse(JSON.stringify(val));

export function assertEventTarget<Element extends Function>(
  event: any,
  element: Element //@ts-ignore
): asserts event is (Omit<Event, 'target'> & { target: InstanceType<Element> }) {
  if (event.target && event.target instanceof element) {
    return;
  }

  throw Error(`Target is not instance of ${element}`);
};
