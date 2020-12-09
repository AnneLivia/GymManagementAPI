# Gym Management API Documentation
## Developed by [Anne Livia da F. Macedo](https://github.com/annelivia)
### Sistema de gerenciamento de academias que permite o controle das informações referentes aos alunos, instrutores, equipamentos adquiridos, matrículas, mensalidades, exercícios, modalidades, e muito mais.

- Este sistema utiliza o Node JS para a criação de uma API REST e o Cloud Firestore para o armazenamento dos dados.
- Em cada um dos componentes da aplicação faz-se o uso das requisições GET, POST, DELETE e PUT.
- Todas as informações são recebidas no formato JSON. 
- Todas as requisições PUT e POST devem incluir no header um 'content-type' de 'application/json' e o corpo da informação inserida deve ser um JSON válido.

### Para acessar o link do projeto no repl.it [clique aqui](https://repl.it/@Anne_LiviaLivia/GymManagementAPI)
## Componentes do sistema

```json
Alunos
Avaliação física
Endereços
Equipamentos
Exercicios
Fichas de Treinos
Instrutores
Modalidades
Matriculados na modalidade 
Mensalidade
```

## Funcionalidades de cada componente
**Alunos:**
```
POST:
{
  "nome" : "Nome do Aluno",
  "dataNascimento" : "00/00/0000",
  "cpf" : "000.000.000-00",
  "numeroCelular" : "(00) 90000-0000",
  "email" : "emailAluno@gmail.com",
  "genero" : "genero do aluno",
  "idEndereco" : "id do doc do endereco no firestore"
}

GET : 
  - url da aplicação no servidor/alunos -> obtém todos os alunos inclusos no sistema
  - url da aplicação no servidor/alunos/genero/:genero -> obtém todos os alunos de um determinado genero
  - url da aplicação no servidor/alunos/email/:email -> obtém os dados do aluno com o email especificado
  - url da aplicação no servidor/alunos/nome/:nome" -> obtém todos os alunos com o nome especificado

PUT: 
  - url da aplicação no servidor/alunos/:email_do_aluno -> altera os dados referentes ao 
    aluno do email especificado
  
DELETE: 
  - url da aplicação no servidor/alunos/:email_do_aluno -> exclui todos os dados do aluno 
    referente ao email especificado
  
  Observação: ao remover um aluno do sistema, seus dados referentes as avaliações, treinos, mensalidades 
  e matriculas em modalidades são igualmente removidos
```

**Instrutores:**
```
POST:
{
  "nome" : "Nome do Instrutor",
  "dataNascimento" : "00/00/0000",
  "cpf" : "000.000.000-00",
  "numeroCelular" : "(00) 90000-0000",
  "email" : "emailInstrutor@gmail.com",
  "genero" : "genero do intrutor",
  "idEndereco" : "id do doc do endereco no firestore"
}

GET : 
  - url da aplicação no servidor/instrutores -> obtém todos os instrutores inclusos no sistema
  - url da aplicação no servidor/instrutores/genero/:genero -> obtém todos os instrutores 
    de um determinado genero
  - url da aplicação no servidor/instrutores/email/:email -> obtém os dados do intrutor com 
    o email especificado
  - url da aplicação no servidor/instrutores/nome/:nome" -> obtém todos os instrutores com 
    o nome especificado

PUT: 
  - url da aplicação no servidor/intrutores/:email_do_instrutor -> altera os dados referentes 
    ao instrutor do email especificado
  
DELETE: 
  - url da aplicação no servidor/alunos/:email_do_instrutor -> exclui todos os dados do instrutor 
    referente ao email especificado
  
  Observação: as informações do instrutor presentes em avaliações e treinos permanecem
```

**Equipamentos:**
```
POST:
{
  "nome" : "Nome do Equipamento",
  "quantidade" : "6",
  "preco" : "3.099,99",
  "pago" : true
}


GET : 
  - url da aplicação no servidor/equipamentos -> obtém todos os equipamentos inclusos no sistema
  - url da aplicação no servidor/equipamentos/pago -> obtém todos os equipamentos que foram pagos
  - url da aplicação no servidor/equipamentos/naopago -> obtém todos os equipamentos que não foram pagos

PUT: 
  - url da aplicação no servidor/equipamentos/:idEquipamento -> altera os dados do equipamento ao 
    informar o id do doc do equipamento correspondente. 
  
DELETE: 
  - url da aplicação no servidor/equipamentos/:idEquipamento -> exclui os dados do equipamento ao 
    informar o id do doc do equipamento correspondente.
```


**Exercícios:**
```
POST:
{
  "nome" : "Nome do exercicio",
  "descricao" : "descrição do exercício como os benefícios e para que serve",
}


GET : 
  - url da aplicação no servidor/exercicios -> obtém todos os exercícios inclusos no sistema

PUT: 
  - url da aplicação no servidor/exercicios/:idExercicio -> altera os dados do exercício ao 
    informar o id do doc do exercício correspondente. 
  
DELETE: 
  - url da aplicação no servidor/exercicios/:idExercicio -> exclui os dados do exercício ao 
    informar o id do doc do exercício correspondente.
    
    Observação: ao remover o exercício do sistema, qualquer ficha de treino que utilize esse exercício 
    também é removida.
    
```

**Mensalidades:**
```
POST:
{
  "idAluno": "id do doc do aluno no firestore",
  "mes": "fevereiro",
  "pago": false,
  "valor": "70,00"
}

GET : 
  - url da aplicação no servidor/mensalidades -> obtém todas as mensalidades inclusas no sistema
  - url da aplicação no servidor/mensalidades/pago -> obtém todas as mensalidades que foram pagas
  - url da aplicação no servidor/mensalidades/naopago -> obtém todas as mensalidades que não foram pagas
  - url da aplicação no servidor/mensalidades/aluno/email/:email -> obtém todas as mensalidades de um 
    determinado usuario ao indicar o email

PUT: 
  - url da aplicação no servidor/mensalidades/:idMensalidade -> altera os dados da mensalidade ao 
    informar o id do doc da mensalidade correspondente. 
  
DELETE: 
  - url da aplicação no servidor/mensalidades/:idMensalidade -> exclui os dados da mensalidade ao 
    informar o id do doc da mensalidade correspondente.

```


**Modalidades:**
```
POST:
{
  "nome" : "Nome da modalidade",
  "descricao" : "Descrição da modalidade como os benefícios e para que serve"
}


GET : 
  - url da aplicação no servidor/modalidades -> obtém todas as modalidades inclusas no sistema

PUT: 
  - url da aplicação no servidor/modalidades/:idModalidade -> altera os dados da modalidade ao 
    informar o id do doc da modalidade correspondente. 
  
DELETE: 
  - url da aplicação no servidor/modalidades/:idModalidade -> exclui os dados da modalidade ao 
    informar o id do doc da modalidade correspondente.
    
    Observação: ao remover a modalidade do sistema, todas as informações referente a alunos matriculados
    nesta modalidade são removidas.
```

**Endereços:**
```
POST:
{
  "cidade" : "Castanhal",
  "estado" : "Pará",
  "cep" : "00000-00",
  "bairro": "Bairro XXXX",
  "complemento" : "Próximo a algum lugar",
  "numero" : "0000"
}


GET : 
  - url da aplicação no servidor/enderecos -> obtém todos os endereços inclusos no sistema
  - url da aplicação no servidor/enderecos/aluno/email/:email -> obtém o endereço do aluno 
    com o email especificado
  - url da aplicação no servidor/enderecos/instrutor/email/:email -> obtém o endereço do 
    instrutor com o email especificado
  - url da aplicação no servidor/enderecos/aluno/cep/:cep -> obtém todos os alunos 
    residentes no cep informado
  - url da aplicação no servidor/enderecos/instrutor/cep/:cep -> obtém todos os instrutores 
    residentes no cep informado

PUT: 
  - url da aplicação no servidor/enderecos/:idendereco -> altera os dados do endereço ao 
    informar o id do doc do endereço correspondente. 
  
DELETE: 
  - url da aplicação no servidor/enderecos/:id-> exclui os dados do endereço ao 
    informar o id do doc do endereço correspondente.
    
    Observação: se algum endereço for removido do sistema e este estiver especificado
    como endereço de algum aluno ou instrutor, será necessário atualizar a informação referente 
    ao idEndereco neste/nestes alunos e/ou instrutores em questão.
```

**Matriculados em modalidades:**
```
POST:
{
  "idAluno" : "id do doc do aluno no firestore",
  "idModalidade" : "id do doc da modalidade no firestore"
}


GET : 
  - url da aplicação no servidor/matriculados_modalidades -> obtém todos os matriculados em modalidades
  - url da aplicação no servidor/matriculados_modalidades/matriculaspormodalidade/:idModalidade -> obtém 
    todos os matriculados em uma modalidade ao passar id do doc da modalidade correspondente.
  - url da aplicação no servidor/matriculados_modalidades/aluno/:idAluno ->  obtém todas as 
    modalidades de um aluno ao passar o id do aluno correspondente

PUT: 
  - url da aplicação no servidor/matriculados_modalidades/:idMatriculaModalidade -> altera os 
    dados da matricula em modalidade ao informar o id do doc da matricula-modalidade correspondente. 
  
DELETE: 
  - url da aplicação no servidor/matriculados_modalidades/:idMatriculaModalidade -> exclui os 
    dados da matricula-modalidade ao informar o id do doc da matricula-modalidade correspondente.
```

**Avaliação Física:**
```
POST:
{
  "idAluno": "id do doc do aluno no firestore",
  "idInstrutor": "id do doc do instrutor no firestore",
  "peso": "00,0",
  "altura": "0.00",
  "imc": "00,00",
  "classificaoImc": "Normal",
  "cintura": "00,0",
  "quadril": "00,0",
  "pernaDireita": "00,0",
  "pernaEsquerda": "00,0",
  "coxaDireita": "00,0",
  "coxaEsquerda": "00,0",
  "abdomen": "00,0",
  "bracoDireito": "00,0",
  "bracoEsquerdo": "00,0"
}


GET : 
  - url da aplicação no servidor/avaliacao_fisica -> obtém todas as avaliações físicas 
    inseridas no sistemas
  - url da aplicação no servidor/avaliacao_fisica/aluno/email/:email -> obtém todas 
    as avaliacoes físicas de um determinado aluno ao especificar o email
  - url da aplicação no servidor/avaliacao_fisica/instrutor/email/:email -> obtém todas as 
    avaliacoes físicas realizadas por um determinado instrutor ao passar email

PUT: 
  - url da aplicação no servidor/avaliacao_fisica/:idAvaliacao -> altera os dados da 
    avaliação ao informar o id do doc da avaliação correspondente. 
  
DELETE: 
  - url da aplicação no servidor/avaliacao_fisica/:idAvaliacao -> exclui os dados da avaliação ao 
    informar o id do doc da avaliação correspondente.
```

**Ficha de Treino:**
```
POST:
{
  "idAluno": "id do doc do aluno no firestore",
  "idExercicio": "id do doc do exercicio no firestore",
  "idInstrutor": "id do doc do instrutor no firestore",
  "series": "3",
  "repeticao": "10",
  "intervalo": "1",
  "mesInicio": "janeiro",
  "quantidadeDias": 5,
}


GET : 
  - url da aplicação no servidor/fichas_treinos -> obtém todas as fichas de treino inseridas no sistemas
  - url da aplicação no servidor/fichas_treinos/aluno/:idAluno -> obtém todas as fichas de treino de 
    um determinado aluno ao especificar o id do doc do aluno correspondente
  - url da aplicação no servidor/fichas_treinos/exercicio/:idExercicio -> obtém todas as fichas de treino 
    de um determinado exercício ao passar o id do doc do exercício correspondente

PUT: 
  - url da aplicação no servidor/fichas_treinos/:idFicha -> altera os dados de uma ficha 
    de treino ao informar o id do doc da ficha correspondente. 
  
DELETE: 
  - url da aplicação no servidor/fichas_treinos/:idFicha -> exclui os dados de uma ficha ao 
    informar o id do doc da ficha correspondente.
```
