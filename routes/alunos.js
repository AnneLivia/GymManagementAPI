const bodyParser = require('body-parser');
var admin = require("firebase-admin");

module.exports = app => {

  var jsonParser = bodyParser.json()

  // cadastrar alunos (funcionando)
  app.post('/alunos', jsonParser, async function (req, res) {
    var nomeAluno = req.body.nome
    var cpfAluno = req.body.cpf
    var celular = req.body.numeroCelular
    var emailAluno = req.body.email
    var data = req.body.dataNascimento
    var generoAluno = req.body.genero

    const conexao = admin.firestore();

    const result = await conexao.collection('anne_gym_alunos').add(
      {
        nome: nomeAluno,
        dataMatricula: new Date(),
        cpf: cpfAluno,
        numeroCelular: celular,
        email: emailAluno,
        dataNascimento: data,
        genero: generoAluno
      }
    );
    res.send('Cadastrado com sucesso.')
  });

  // obter todos os alunos (funcionado)
  app.get("/alunos", async (req, res) => {
    const conexao = admin.firestore();
    var dados = []

    // busca todos os itens da coleção alunos (await aguarda até obter todos os dados)
    let alunosLista = await conexao.collection("anne_gym_alunos").get()

    for (let alunoDoc of alunosLista.docs) {
      // pega o dado de cada documento e insere na lista dados, para exibir todos 
      dados.push(alunoDoc.data())
    }

    if (!dados.length) {
      res.send('Sem alunos cadastrados')
    }
    res.send({
      alunosMatriculados: dados
    });
  });

  // obter aluno por email (funcionando)
  app.get("/alunos/email/:email", async (req, res) => {
    const conexao = admin.firestore();

    // busca todos os itens da coleção alunos (await aguarda até obter todos os dados)
    let alunosLista = await conexao.collection("anne_gym_alunos").get()

    var email = req.params.email

    for (let alunoDoc of alunosLista.docs) {
      // pega o dado de cada documento 
      var alunoData = alunoDoc.data();
      if (alunoData.email.toString().toLowerCase() == email.toString().toLowerCase())
        res.send({ aluno: alunoData });
    }

    res.send('Aluno não encontrado')
  });

  // obter todos os alunos por genero (funcionando)
  app.get("/alunos/genero/:genero", async (req, res) => {
    const conexao = admin.firestore();

    // busca todos os itens da coleção alunos (await aguarda até obter todos os dados)
    let alunosLista = await conexao.collection("anne_gym_alunos").get()

    var genero = req.params.genero

    var dados = []

    for (let alunoDoc of alunosLista.docs) {
      // pega o dado de cada documento 
      var alunoData = alunoDoc.data();
      if (alunoData.genero.toString().toLowerCase() == genero.toLowerCase())
        dados.push(alunoData);
    }

    if (!dados.length)
      res.send('nenhum aluno de genero ' + genero + ' foi encontrado')

    res.send({ alunos: dados })
  });


  // obter alunos por nome (funcionando)
  app.get("/alunos/nome/:nome", async (req, res) => {
    const conexao = admin.firestore();

    // busca todos os itens da coleção alunos (await aguarda até obter todos os dados)
    let alunosLista = await conexao.collection("anne_gym_alunos").get()

    var nome = req.params.nome

    var dados = []

    for (let alunoDoc of alunosLista.docs) {
      // pega o dado de cada documento 
      var alunoData = alunoDoc.data();
      if (alunoData.nome.toLowerCase().includes(nome.toLowerCase())) {
        dados.push(alunoData)
      }
    }

    if (!dados.length) {
      res.send('Sem alunos com o nome especificado')
    }

    res.send({ aluno: dados });

  });

  // deletar por email (funcionado)
  app.delete("/alunos/:email", async (req, res) => {

    const conexao = admin.firestore();

    // busca todos os itens da coleção alunos (await aguarda até obter todos os dados)
    let alunosLista = await conexao.collection("anne_gym_alunos").get()

    var email = req.params.email
    var idAluno = ""

    for (let alunoDoc of alunosLista.docs) {
      // pega o dado de cada documento 
      var alunoData = alunoDoc.data();
      // se o email for igual ao passado por parametro, obter id do doc 
      if (alunoData.email.toString().toLowerCase() == email.toString().toLowerCase()) {
        // obtendo o id do doc do aluno com o email especificado  
        idAluno = alunoDoc.id;
        break;
      }
    }

    if (idAluno == "") {
      res.send('Aluno não encontrado');
    }

    let deleteDoc = await conexao.collection("anne_gym_alunos").doc(idAluno).delete()

    // remover o mapemaneto endereco_aluno, se houver, também, já que esse aluno não existe mais
    let end_alunoLista = await conexao.collection("anne_gym_endereco_aluno").get()

    for (let endeAlunoDoc of end_alunoLista.docs) {
      // se o dado contiver o id do aluno, remover o mapeamento endereço aluno
      var endeAlunoData = endeAlunoDoc.data();
      if (endeAlunoData.idAluno == idAluno) {
        let deleteDoc = await conexao.collection("anne_gym_endereco_aluno").doc(endeAlunoDoc.id).delete()
      }
    }

    // remover as avaliacoes referentes ao aluno a ser removido, se houver, também, já que esse aluno não existe mais
    let avaliacaoLista = await conexao.collection("anne_gym_avaliacao_fisica").get()

    for (let avaDoc of avaliacaoLista.docs) {
      // se o dado contiver o id do aluno, remover a avaliacao
      var avaData = avaDoc.data();
      if (avaData.idAluno == idAluno) {
        let deleteDoc = await conexao.collection("anne_gym_avaliacao_fisica").doc(avaDoc.id).delete()
      }
    }

    // se aluno for removido, precisa remover sua matricula em quaisquer modalidades
    let matriculasLista = await conexao.collection("anne_gym_matriculados_modalidades").get()

    for (let matrDoc of matriculasLista.docs) {
      // se o dado contiver o id do aluno, remover a matricula
      var matrData = matrDoc.data();
      if (matrData.idAluno == idAluno) {
        let deleteDoc = await conexao.collection("anne_gym_matriculados_modalidades").doc(matrDoc.id).delete()
      }
    }

    // se aluno for removido, precisa remover as mensalidades também
    let mensalidadesLista = await conexao.collection("anne_gym_mensalidades").get()

    for (let mesDoc of mensalidadesLista.docs) {
      // se o dado contiver o id do aluno, remover a mensalidade
      var mesData = mesDoc.data();
      if (mesData.idAluno == idAluno) {
        let deleteDoc = await conexao.collection("anne_gym_mensalidades").doc(mesDoc.id).delete()
      }
    }

    res.send("Aluno removido do sistema");
  });

  // atualizar dados dos alunos (email)
  app.put('/alunos/:email', jsonParser, async function (req, res) {
    var email = req.params.email

    // pegar dados put request 
    var nomeAluno = req.body.nome
    var cpfAluno = req.body.cpf
    var celular = req.body.numeroCelular
    var emailAluno = req.body.email
    var data = req.body.dataNascimento
    var generoAluno = req.body.genero

    const conexao = admin.firestore();

    // busca todos os itens da coleção alunos (await aguarda até obter todos os dados)
    let alunosLista = await conexao.collection("anne_gym_alunos").get()

    var idAluno = ""

    for (let alunoDoc of alunosLista.docs) {
      // pega o dado de cada documento 
      var alunoData = alunoDoc.data();
      // se o email for igual ao passado por parametro, obter id do doc 
      if (alunoData.email.toString().toLowerCase() == email.toString().toLowerCase()) {
        // obtendo o id do doc do aluno com o email especificado  
        idAluno = alunoDoc.id;

        // se algum variavel estiver undefined é porque o usuario nao quer atualizar ela
        // então pegar os dados atuais armazenados no firestore, para nao alterar para undefined
        if (nomeAluno == undefined)
          nomeAluno = alunoData.nome
        if (cpfAluno == undefined)
          cpfAluno = alunoData.cpf
        if (celular == undefined)
          celular = alunoData.numeroCelular
        if (emailAluno == undefined)
          emailAluno = alunoData.email
        if (data == undefined)
          data = alunoData.dataNascimento
        if (generoAluno == undefined)
          generoAluno = alunoData.genero

        break;
      }
    }

    if (idAluno == "") {
      res.send('Aluno não encontrado');
    }

    // const cityRef = db.collection('cities').doc('DC');
    // const res = await cityRef.update({capital: true});



    // atualizando dados necessarios
    const result = await conexao.collection('anne_gym_alunos').doc(idAluno).update(
      {
        nome: nomeAluno,
        dataMatricula: new Date(),
        cpf: cpfAluno,
        numeroCelular: celular,
        email: emailAluno,
        dataNascimento: data,
        genero: generoAluno
      }
    );
    res.send('Atualizado com sucesso.')
  });
};