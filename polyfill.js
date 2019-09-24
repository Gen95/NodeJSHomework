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

        promise.prototype.then = function (onResolve, onReject {
            const self = this;
            return new promise(((resolve, reject) => {
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
                });
            }));
        };
    }
}());

const a = new promise(((resolve, reject) => {
    setTimeout(() => {
      resolve('Success!');
    }, 1000);
  }));

console.log(this);
a.then((result) => {
    console.log('a', result);
});
