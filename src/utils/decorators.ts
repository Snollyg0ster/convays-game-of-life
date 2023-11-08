type ClassType = { new (...args: any[]): {} };

interface ObserverId {
  key: string;
  id: symbol;
}

export type Observed<T> = T & {
  observe<K extends keyof T>(
    key: K,
    cb: (val: T[K], key: K) => void
  ): ObserverId;
  unsubscribe(id: ObserverId): void;
};

class Observer {
  observers: Indexed<Map<symbol, (val: any, key: any) => void>> = {};

  observe = (key: string, cb: (val: any, key: string) => void) => {
    const id = Symbol("id");

    if (this.observers[key]) {
      this.observers[key].set(id, cb);
    } else {
      this.observers[key] = new Map([[id, cb]]);
    }

    return { key, id };
  };

  unsubscribe = ({ key, id }: { key: string; id: symbol }) => {
    this.observers[key]?.delete(id);
  };

  emit = (key: string, val: any) => {
    this.observers[key]?.forEach((cb) => cb(val, key));
  };
}

export function observe<T extends ClassType>(constructor: T) {
  return class Observed extends constructor {
    constructor(...args: any[]) {
      super(...args);
      const object = new constructor();
      Object.assign(object, new Observer());

      return new Proxy(object, {
        set(target: Indexed, key: string, value) {
          target[key] = value;
          target.emit(key, value);
          return true;
        },
      });
    }
  };
}

export function bind<T extends Function>(
  target: object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void {
  if (!descriptor || typeof descriptor.value !== "function") {
    throw new TypeError(
      `Only methods can be decorated with @bind. <${propertyKey}> is not a method!`
    );
  }

  return {
    configurable: true,
    get(this: T): T {
      const bound: T = descriptor.value!.bind(this);

      Object.defineProperty(this, propertyKey, {
        value: bound,
        configurable: true,
        writable: true,
      });
      return bound;
    },
  };
}
