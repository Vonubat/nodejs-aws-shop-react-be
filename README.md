## Description

There are few AWS microservices for the React shop (link below)
[FE repository](https://github.com/Vonubat/nodejs-aws-shop-react/)

## Instruction

0. Go to the service folder

```bash
$ cd product-service/
```

1. Rename **.env.example** to the **.env** and fill with your variables

2. Install dependencies

```bash
$ npm install
```

3. AWS CDK bootstrapping

```bash
$ npm run cdk:bootstrap
```

4. AWS CDK deploying

```bash
$ npm run cdk:deploy
```

5. Seed the base

```bash
$ npm run db:seed
```

#### Additional info:

1. Run tests

```bash
$ npm run test
```

2. Swagger spec **(./openapi.json)**. Just copy content of file to the https://editor-next.swagger.io/
