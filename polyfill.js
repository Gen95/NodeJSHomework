/* eslint-disable wrap-iife */
/* eslint-disable no-inner-declarations */
/* eslint-disable indent */
(function () {
    let outerContext;
    if (typeof self !== 'undefined') {
        outerContext = self;
    } else if (typeof window !== 'undefined') {
        outerContext = window;
    } else if (typeof global !== 'undefined') {
        outerContext = global;
    }

    if (!('Promise' in outerContext)) {
        function onResolve(value) {
                this.state = 'fulfilled';
                this.value = value;
        }

        function onReject(error) {
                this.state = 'failed';
                this.value = error;
        }

        function promise(executor) {
                this.state = 'pending';
                this.value = null;
                this.queue = [];
                executor(onResolve.bind(this),
                         onReject.bind(this));
        }

        promise.prototype.then = function (onResolve, onReject) {
                const self = this;
                return new promise((resolve, reject) => {
                    self.queue.push({
                        onResolve(value) {
                            try {
                                let result;
                                if (typeof onResolve === 'function') {
                                    result = onResolve(value);
                                } else {
                                    result = value;
                                }
                                if (result instanceof promise) {
                                    result.then(resolve, reject);
                                } else {
                                    resolve(result);
                                }
                            } catch (error) {
                                reject(error);
                            }
                        },
                        onReject(reason) {
                            try {
                                let result;
                                if (typeof onReject === 'function') {
                                    result = onReject(reason);
                                } else {
                                    result = reason;
                                }
                                if (result instanceof promise) {
                                    result.then(resolve, reject);
                                } else {
                                    reject(result);
                                }
                            } catch (error) {
                                reject(error);
                            }
                        },
                    });
                    self._fulFilled();
                });
        };

        _fulFilled() {
            while (this.state !== 'pending' && this.queue.length) {
                const {
                    resolve,
                    reject
                } = this.queue.shift();
                if (this.state === 'fulfilled') {
                    resolve(this.value);
                }
                if (this.state === 'rejected') {
                    reject(this.value);
                };
            };
        };

        // eslint-disable-next-line dot-notation
        outerContext['Promise'] = promise;
    }
})();

const promise = new Promise(((resolve) => {
    resolve(42);
}));

promise
    .then((value) => value + 1)
    .then((value) => {
        console.log(value); // 43
        return new Promise(((resolve) => { resolve(137); }));
    })
    .then((value) => {
        console.log(value); // 137
        throw new Error();
    })
    .then(
        () => { console.log('Будет проигнорировано'); },
        () => 'ошибка обработана',
    )
    .then((value) => {
        console.log(value); // "ошибка обработана"
    });
