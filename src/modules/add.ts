import { Container } from "pixi.js";

declare global {
  namespace PixiMixins {
    interface Container extends AddMixin { }
  }
}

interface AddMixin {
  add<T extends new (...args: any[]) => any>(target: T, ...args: ConstructorParameters<T>): InstanceType<T>;
}

Container.prototype.add = function (target, ...args: any[]) {
  return this.addChild(new target(...args));
};