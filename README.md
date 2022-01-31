# Projeto 3 DevInHouse BRy e Teltec - DevInBank

Projeto de uma API para gerenciamento de dados de usuários e financeiros.

## Pré-requisitos

Para rodar esse projeto é recomendado que você possua os seguintes pacotes:

```term
> Node v16.4.2

> npm v6.14.15

> yarn v1.22.10
```

Outras versões podem funcionar, mas não foram testadas.

## Clonando o repositório

```term
git clone https://github.com/mgzamboni/devinbank-nodejs.git
```

## Instalação:

Antes de rodar o projeto é necessário instalar alguns pacotes.
Siga o passo a passo para instalar cada um.


### 1 - Instalando o Express:
Framework para aplicativo da web do Node.js.
Para instalar execute o comando:

```term
yarn add express
```
### 2 - Instalando o Lodash:
Biblioteca com diversos métodos para manipulação de arrays.
Para instalar execute o comando:

```term
yarn add lodash
```
### 3 - Instalando o Multer:
Middleware do Node.js para manipulação de 'multipart/form-data', primariamente usado para upload de arquivos.
Para instalar execute o comando:

```term
yarn add multer
```
### 4 - Instalando o Nodemon:
Ferramenta que auxilia no desenvolvimento de aplicações node.js, reinicializa a aplicação node sempre que alterações em arquivos são detectadas.
Para instalar execute o comando:

```term
yarn add nodemon
```
### 5 - Instalando o Swagger-Autogen:
Ferramenta que automatiza a construção da documentação com Swagger.
Para instalar execute o comando:

```term
yarn add swagger-autogen
```

### 6 - Instalando o Swagger-UI-Express:
Módulo que interpreta a documentação .json gerada pelo Swagger-Autogen e o utiliza para subir o servidor e disponibilizar a documentação na porta especificada.
Para instalar execute o comando:

```term
yarn add swagger-ui-express
```
### 7 - Instalando o xlsx:
Ferramenta que auxília na manipulação de arquivos xlsx.
Para instalar execute o comando:

```term
yarn add xlsx
```

## Executando o Projeto

Para executar o projeto basta utilizar o seguinte comando:

```term
yarn start
```

Com isso o servidor deverá estar rodando e será possível testar os endpoints.

A documentação dos endpoints pode ser encontrada no seguinte link (enquanto o servidor estiver online): 

http://localhost:3000/doc/