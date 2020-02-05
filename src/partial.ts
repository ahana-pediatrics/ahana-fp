
/**
 * Takes a function,`fn` and a list of arguments `args`, and returns a new function `g` which, when called,
 * returns the result of `fn` called with `args` followed by whatever arguments are provided to `g`
 * 
 * @param fn - a functions that takes up to 4 arguments
 * @param args - a list of up to 4 arguments
 */
export function partial<A1, R>(fn: (a:A1)=> R, ...args: [A1]): () => R;
export function partial<A1, R>(fn: (a:A1)=> R               ): (a: A1) => R;
export function partial<A1, A2, R>(fn: (a:A1, a2:A2)=> R, ...args: [A1, A2]): () =>R;
export function partial<A1, A2, R>(fn: (a:A1, a2:A2)=> R, ...args: [A1]    ): (a: A2) =>R;
export function partial<A1, A2, R>(fn: (a:A1, a2:A2)=> R                   ): (a1: A1, a2: A2) =>R;
export function partial<A1, A2, A3, R>(fn: (a:A1, a2:A2, a3: A3)=> R, ...args: [A1, A2, A3]): () =>R;
export function partial<A1, A2, A3, R>(fn: (a:A1, a2:A2, a3: A3)=> R, ...args: [A1, A2]    ): (a: A3) =>R;
export function partial<A1, A2, A3, R>(fn: (a:A1, a2:A2, a3: A3)=> R, ...args: [A1]        ): (a2: A2, a3: A3) =>R;
export function partial<A1, A2, A3, R>(fn: (a:A1, a2:A2, a3: A3)=> R                       ): (a1: A1, a2: A2, a3: A3) =>R;
export function partial<A1, A2, A3, A4, R>(fn: (a:A1, a2:A2, a3: A3, a4:A4)=> R, ...args: [A1, A2, A3, A4]): () =>R;
export function partial<A1, A2, A3, A4, R>(fn: (a:A1, a2:A2, a3: A3, a4:A4)=> R, ...args: [A1, A2, A3]    ): (a4: A4) =>R;
export function partial<A1, A2, A3, A4, R>(fn: (a:A1, a2:A2, a3: A3, a4:A4)=> R, ...args: [A1, A2]        ): (a3: A3, a4: A4) =>R;
export function partial<A1, A2, A3, A4, R>(fn: (a:A1, a2:A2, a3: A3, a4:A4)=> R, ...args: [A1]            ): (a2: A2, a3: A3, a4: A4) =>R;
export function partial<A1, A2, A3, A4, R>(fn: (a:A1, a2:A2, a3: A3, a4:A4)=> R                           ): (a1: A1, a2: A2, a3: A3, a4: A4) =>R;
export function partial(fn: Function, ...args: unknown[]) { 
    return (...args2: unknown[])=> fn.apply(null, [...args, ...args2]);
}


/**
 * Takes a function,`fn` and a list of arguments `args`, and returns a new function `g` which, when called,
 * returns the result of `fn` called with whatever arguments are provided to `g`
 * followed by `args`
 * @param fn - a functions that takes up to 4 arguments
 * @param args - a list of up to 4 arguments
 */
export function partialRight<A1, R>(fn: (a:A1)=> R, ...args: [A1]): () => R;
export function partialRight<A1, R>(fn: (a:A1)=> R               ): (a: A1) => R;
export function partialRight<A1, A2, R>(fn: (a:A1, a2:A2)=> R, ...args: [A1, A2]): () =>R;
export function partialRight<A1, A2, R>(fn: (a:A1, a2:A2)=> R, ...args: [A2]    ): (a: A1) =>R;
export function partialRight<A1, A2, R>(fn: (a:A1, a2:A2)=> R                   ): (a1: A1, a2: A2) =>R;
export function partialRight<A1, A2, A3, R>(fn: (a:A1, a2:A2, a3: A3)=> R, ...args: [A1, A2, A3]): () =>R;
export function partialRight<A1, A2, A3, R>(fn: (a:A1, a2:A2, a3: A3)=> R, ...args: [A2, A3]    ): (a1: A1) =>R;
export function partialRight<A1, A2, A3, R>(fn: (a:A1, a2:A2, a3: A3)=> R, ...args: [A3]        ): (a1: A1, a2: A2) =>R;
export function partialRight<A1, A2, A3, R>(fn: (a:A1, a2:A2, a3: A3)=> R                       ): (a1: A1, a2: A2, a3: A3) =>R;
export function partialRight<A1, A2, A3, A4, R>(fn: (a:A1, a2:A2, a3: A3, a4:A4)=> R, ...args: [A1, A2, A3, A4]): () =>R;
export function partialRight<A1, A2, A3, A4, R>(fn: (a:A1, a2:A2, a3: A3, a4:A4)=> R, ...args: [A2, A3, A4]    ): (a1: A1) =>R;
export function partialRight<A1, A2, A3, A4, R>(fn: (a:A1, a2:A2, a3: A3, a4:A4)=> R, ...args: [A3, A4]        ): (a1: A1, a2: A2) =>R;
export function partialRight<A1, A2, A3, A4, R>(fn: (a:A1, a2:A2, a3: A3, a4:A4)=> R, ...args: [A4]            ): (a1: A1, a2: A2, a3: A3) =>R;
export function partialRight<A1, A2, A3, A4, R>(fn: (a:A1, a2:A2, a3: A3, a4:A4)=> R                           ): (a1: A1, a2: A2, a3: A3, a4: A4) =>R;

export function partialRight(fn: Function, ...args: unknown[]) { 
    return (...args2: unknown[]) => fn.apply(null, [...args2, ...args]);
}
