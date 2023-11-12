type TParams = string | number | boolean | object | null;

type TObserver = {
  name: string;
  callback: (...params: TParams[]) => void;
};

export class Observer {
  private listeners: TObserver[] = [];

addListener(name: string, callback: (...params: TParams[]) => void) {
  this.listeners.push({ name, callback });

}

dispatch (name: string, ...params: TParams[]): void{
    this.listeners
    .filter((it) => it.name === name)
    .forEach((it) => it.callback(...params));
  }

}
