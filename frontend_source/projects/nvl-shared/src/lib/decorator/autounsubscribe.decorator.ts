/**
 * Auto Unsubscribe decorator
 * @param blackList subscription black list
 * @author __
 */
export function AutoUnsubscribe(blackList = []) {
  return function(constructor) {
    const original = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy = function() {
      original && typeof original === 'function' && original.apply(this, arguments);

      for (const prop in this) {
        const property = this[prop];
        if (!blackList.includes(prop)) {
          if (property && typeof property.unsubscribe === 'function') {
            property.unsubscribe();
            this[prop] = undefined;
          }
        }
      }
    };
  };
}
