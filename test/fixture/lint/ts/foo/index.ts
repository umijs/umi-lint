interface IHello {
    name: string;
}

function foo(param: IHello) {
    return param.name;
}

function bar(str: any) {
    console.log(str);
}

foo({name: 111});

console.log(foo);
