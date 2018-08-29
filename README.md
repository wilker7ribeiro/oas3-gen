# Open Api Specification 3 Generator

Um gerenciador de geradores de código utilizando a especificação [open api 3](https://github.com/OAI/OpenAPI-Specification).

## Installation
Instalação utilizando o npm:
```
npm install -g oas3-gen
```
Será instalado globalmente no sistema.

## Usage
Exemplos:
```
oas3-gen angular -f petstore-expanded.json
oas3-gen angular -y -f petstore-expanded.yaml
oas3-gen angular -y -u https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore-expanded.yaml 
oas3-gen angular -swg2 -f petstore-expanded-swg2.json
oas3-gen angular -swg2 -u https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/json/petstore-expanded.json
oas3-gen angular -swg2 -y -u https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore-expanded.yaml
```


```
oas3-gen -h
```
```
Usage: oas3-gen [options] [command]

Options:

    -V, --version             output the version number
    -h, --help                output usage information
    -f, --file <path>  OpenApi3 Json file path
    -u, --url <path>   OpenApi3 Json url path (GET Request)
    -d, --dist <path>  Caminho para a pasta onde será gerado os arquivos. Default: "./oas2-generated"
    -y, --yaml         Se o arquivo é do tipo yaml
    --swg2             Se a spec é do tipo swagger2

Commands:

    angular|ng [options]      Gerarador para AngularIo (v2+)
    angularjs|ngjs [options]  Gerarador para AngularJs
    express [options]         Gerarador para Express
    typescript|ts [options]   Gerarador para Typescript
```

### Angular
```
oas3-gen angular -h
```
```
Usage: angular|ng [options]

Gerarador para AngularIo (v2+)

Options:

    -i --inherance     Define que as entitys sigam o padrão de herança
    --no-entity        Define que não sejam gerados entitys
    --no-services      Define que não sejam geradas services
    -h, --help         output usage information
```

### AngularJs
```
oas3-gen angularjs -h
```
```
Usage: angularjs|ngjs [options]

Gerarador para AngularJs

Options:

    -i --inherance     Define que as factorys sigam o padrão de herança
    --no-factory       Define que não sejam gerados factorys
    --no-services      Define que não sejam geradas services
    -h, --help         output usage information

```

### Express
```
oas3-gen express -h
```
```
Usage: express [options]

Gerarador para Express

Options:

    -l, --deep-level <n>   Define até qual profundidade deve ser gerados os valores dos mocks
    -s, --serve            Sobe um servidor servindo as api mockadas
    -p, --port <port>      Define a porta para o servidor subido com -s --serve. Default: 4200
    -n, --host <hostname>  Define o host para o servidor subido com -s --serve. Default: localhost
    -h, --help             output usage information

```

### Typescript
```
oas3-gen typescript -h
```
```
Usage: typescript|ts [options]

Gerarador para Typescript

Options:
    -h, --help         output usage information
```