const bodyParser = require('body-parser');
var admin = require("firebase-admin");

module.exports = app => {

  var jsonParser = bodyParser.json()

  // cadastrar avaliacao fisica de determinado aluno (funcionando)
  app.post('/avaliacao_fisica', jsonParser, async function(req, res) {

    var id_aluno = req.body.idAluno
    // responsavel pela avaliação
    var id_instrutor = req.body.idInstrutor

    var pesoAluno = req.body.peso
    var alturaAluno = req.body.altura
    var imcAluno = req.body.imc
    var classificacao_imc_aluno = req.body.classificaoImc
    var cinturaAluno = req.body.cintura
    var quadrilAluno = req.body.quadril
    var coxaDireitaAluno = req.body.coxaDireita
    var pernaDireitaAluno = req.body.pernaDireita
    var coxaEsquerdaAluno = req.body.coxaEsquerda
    var pernaEsquerdaAluno = req.body.pernaEsquerda
    var abdomenAluno = req.body.abdomen
    var bracoDireitoAluno = req.body.bracoDireito
    var bracoEsquerdoAluno = req.body.bracoEsquerdo

    const conexao = admin.firestore();

    const result = await conexao.collection('anne_gym_avaliacao_fisica').add(
      {
        idAluno: id_aluno,
        idInstrutor: id_instrutor,
        peso: pesoAluno,
        altura: alturaAluno,
        imc: imcAluno,
        classificaoImc: classificacao_imc_aluno,
        cintura: cinturaAluno,
        quadril: quadrilAluno,
        pernaDireita: pernaDireitaAluno,
        pernaEsquerda: pernaEsquerdaAluno,
        coxaDireita: coxaDireitaAluno,
        coxaEsquerda: coxaEsquerdaAluno,
        abdomen: abdomenAluno,
        bracoDireito: bracoDireitoAluno,
        bracoEsquerdo: bracoEsquerdoAluno,
        dataAvaliacao: new Date()
      }
    );
    res.send('Avaliação física cadastrada com sucesso.')
  });

  // obter todos as avaliacoes físicas cadastradas (funcionando)
  app.get("/avaliacao_fisica", async (req, res) => {
    const conexao = admin.firestore();
    var dados = []

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let avaliacaoLista = await conexao.collection("anne_gym_avaliacao_fisica").get()

    for (let avaliacaoDoc of avaliacaoLista.docs) {
      // pega o dado de cada documento e inserir na lista
      dados.push(avaliacaoDoc.data())
    }

    if (!dados.length) {
      res.send('Sem avaliações físicas cadastradas')
    }

    res.send({
      avaliacoes: dados
    });
  });


  // obter todos as avaliacoes físicas de um determinado aluno (passar email de aluno) (funcionando)
  app.get("/avaliacao_fisica/aluno/email/:email", async (req, res) => {
   
    const conexao = admin.firestore();

    // pegar id do doc do aluno com o email especificado
    var idAlunoDoc = ""

    var emailAluno = req.params.email

    // busca em todos os itens da coleção aluno, o email especificado (await aguarda até obter todos os dados)
    let alunosLista = await conexao.collection("anne_gym_alunos").get()

    for (let alunosDoc of alunosLista.docs) {
      // pega o dado em que o email é igual ao especificado
      if (alunosDoc.data().email.toString().toLowerCase() == emailAluno.toLowerCase()) {
        idAlunoDoc = alunosDoc.id
        break;
      }
    }

    if (idAlunoDoc == "") {
      res.send('Aluno não foi encontrado')
    }

    // vai salvar todas as avaliacoes
    var dados = []

    let avaliacaoLista = await conexao.collection("anne_gym_avaliacao_fisica").get()

    for (let avaliacaoDoc of avaliacaoLista.docs) {
      // pega o dado em que o id do aluno é igual ao obtido
      if (avaliacaoDoc.data().idAluno == idAlunoDoc) {
        dados.push(avaliacaoDoc.data());
      }
    }

    if (!dados.length) {
      res.send("Aluno não possui avaliações cadastradas")
    }

    res.send({
      email: emailAluno,
      avaliacoes: dados,
    });
  });


   // obter todos as avaliacoes físicas realizadas por um determinado instrutor (passar email do instrutor) (funcionando)
  app.get("/avaliacao_fisica/instrutor/email/:email", async (req, res) => {
   
    const conexao = admin.firestore();

    // pegar id do doc do instrutor com o email especificado
    var idInstrutorDoc = ""

    var emailInstrutor= req.params.email

    // busca em todos os itens da coleção instrutor, o email especificado (await aguarda até obter todos os dados)
    let instrutoresLista = await conexao.collection("anne_gym_instrutores").get()

    for (let instrutorDoc of instrutoresLista.docs) {
      // pega o dado em que o email é igual ao especificado
      if (instrutorDoc.data().email.toString().toLowerCase() == emailInstrutor.toLowerCase()) {
        idInstrutorDoc = instrutorDoc.id
        break;
      }
    }

    if (idInstrutorDoc == "") {
      res.send('Instrutor não foi encontrado')
    }

    // vai salvar todas as avaliacoes do instrutor: idInstrutorDoc
    var dados = []

    let avaliacaoLista = await conexao.collection("anne_gym_avaliacao_fisica").get()

    for (let avaliacaoDoc of avaliacaoLista.docs) {
      // pega o dado em que o id do aluno é igual ao obtido
      if (avaliacaoDoc.data().idInstrutor == idInstrutorDoc) {
        dados.push(avaliacaoDoc.data());
      }
    }

    if (!dados.length) {
      res.send("Instrutor não efetuou nenhuma avaliação")
    }

    res.send({
      email: emailInstrutor,
      avaliacoes: dados,
    });
  });


  // atualizar avalicao fisica passando id da avaliacao
  app.put('/avaliacao_fisica/:idAvaliacao', jsonParser, async function(req, res) {

    var idAvaliacaoRecebida = req.params.idAvaliacao

    var idAvaliacaoDoc = ""

    // pegar dados put request 
    // o id do aluno não muda. 

    // responsavel pela avaliação
    var id_instrutor = req.body.idInstrutor

    var pesoAluno = req.body.peso
    var alturaAluno = req.body.altura
    var imcAluno = req.body.imc
    var classificacao_imc_aluno = req.body.classificaoImc
    var cinturaAluno = req.body.cintura
    var quadrilAluno = req.body.quadril
    var coxaDireitaAluno = req.body.coxaDireita
    var pernaDireitaAluno = req.body.pernaDireita
    var coxaEsquerdaAluno = req.body.coxaEsquerda
    var pernaEsquerdaAluno = req.body.pernaEsquerda
    var abdomenAluno = req.body.abdomen
    var bracoDireitoAluno = req.body.bracoDireito
    var bracoEsquerdoAluno = req.body.bracoEsquerdo
    
    const conexao = admin.firestore();

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let avaliacaoList = await conexao.collection("anne_gym_avaliacao_fisica").get()


    for (let avaliacaoDoc of avaliacaoList.docs) {
      // pega o dado de cada documento 
      var avaliacaoData = avaliacaoDoc.data();
      // se o id da avaliaao for igual ao passado por parametro, obter id do doc 
      if (avaliacaoDoc.id == idAvaliacaoRecebida) {

        // se alguma variavel estiver undefined é porque o usuario nao quer atualizar ela
        // então pegar os dados atuais armazenados no firestore para nao alterar para undefined
        if (id_instrutor == undefined)
          id_instrutor = avaliacaoData.idInstrutor
        if (pesoAluno == undefined)
          pesoAluno = avaliacaoData.peso
        if (alturaAluno == undefined)
          alturaAluno = avaliacaoData.altura
        if (imcAluno == undefined)
          imcAluno = avaliacaoData.imc
        if (classificacao_imc_aluno == undefined)
          classificacao_imc_aluno = avaliacaoData.classificaoImc
        if (cinturaAluno == undefined)
          cinturaAluno = avaliacaoData.cintura
        if (quadrilAluno == undefined)
          quadrilAluno = avaliacaoData.quadril
        if (coxaDireitaAluno == undefined)
          coxaDireitaAluno = avaliacaoData.coxaDireita
        if (coxaEsquerdaAluno == undefined)
          coxaEsquerdaAluno = avaliacaoData.coxaEsquerda
        if (pernaDireitaAluno == undefined)
          pernaDireitaAluno = avaliacaoData.pernaDireita
        if (pernaEsquerdaAluno == undefined)
          pernaEsquerdaAluno = avaliacaoData.pernaEsquerda
        if (abdomenAluno == undefined)
          abdomenAluno = avaliacaoData.abdomen
        if (bracoDireitoAluno == undefined)
          bracoDireitoAluno = avaliacaoData.bracoDireito
        if (bracoEsquerdoAluno == undefined)
          bracoEsquerdoAluno = avaliacaoData.bracoEsquerdo

        idAvaliacaoDoc = avaliacaoDoc.id

        break;
      }
    }

    if (idAvaliacaoDoc == "") {
      res.send('Avaliação inexistente');
    }

    // const cityRef = db.collection('cities').doc('DC');
    // const res = await cityRef.update({capital: true});



    // atualizando dados necessarios
    const result = await conexao.collection('anne_gym_avaliacao_fisica').doc(idAvaliacaoDoc).update(
      {
        idInstrutor: id_instrutor,
        peso: pesoAluno,
        altura: alturaAluno,
        imc: imcAluno,
        classificaoImc: classificacao_imc_aluno,
        cintura: cinturaAluno,
        quadril: quadrilAluno,
        pernaDireita: pernaDireitaAluno,
        pernaEsquerda: pernaEsquerdaAluno,
        coxaDireita: coxaDireitaAluno,
        coxaEsquerda: coxaEsquerdaAluno,
        abdomen: abdomenAluno,
        bracoDireito: bracoDireitoAluno,
        bracoEsquerdo: bracoEsquerdoAluno,
        dataAvaliacao: new Date()
      }
    );
    res.send('Atualizado com sucesso.')
  });

  // deletar avaliacao de aluno por id da avaliacao (funcionado)
  app.delete("/avaliacao_fisica/:idAvaliacao", async (req, res) => {

    const conexao = admin.firestore();

    // busca todos os itens da coleção  (await aguarda até obter todos os dados)
    let avaliacaoList = await conexao.collection("anne_gym_avaliacao_fisica").get()

    var idAvaliacao = req.params.idAvaliacao
    var idAvaliacaoDoc = ""

    for (let avaliacaoDoc of avaliacaoList.docs) {
      if (idAvaliacao == avaliacaoDoc.id) {
        idAvaliacaoDoc = avaliacaoDoc.id;
        break;
      }
    }

    if (idAvaliacaoDoc == "") {
      res.send('Avaliação física não foi encontrada');
    }

    let deleteDoc = await conexao.collection("anne_gym_avaliacao_fisica").doc(idAvaliacaoDoc).delete()

    res.send("Avaliação física removida do sistema");
  });
}