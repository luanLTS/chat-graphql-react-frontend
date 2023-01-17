const nome = "Luan";
console.log(`Meu nome é ${nome}`);

const helloTaggedTemplate = () => {
    console.log("Hello, Tagged Tamplate");
};

// helloTaggedTemplate();

const podeDirigir = (strings, idade) =>
    strings[0] + (idade >= 18 ? "" : "não ") + "pode dirigir";

console.log(podeDirigir`Com 17 anos uma pessoa ${17} `);

// escrever uma tagged template para remover palavras proibidas de um texto
/* 



*/
