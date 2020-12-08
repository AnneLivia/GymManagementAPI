const bodyParser = require('body-parser');
var admin = require("firebase-admin");

module.exports = app => {

  var jsonParser = bodyParser.json()

  // incluir mensalidade (funcionando)
  app.post('/mensalidades', jsonParser, async function (req, res) {

    var idAlunoRecebido = req.body.idAluno
    var mesRecebido = req.body.mes
    var valorRecebido = req.body.valor
    var mensalidadePaga = req.body.pago

    const conexao = admin.firestore();

    const result = await conexao.collection('anne_gym_mensalidades').add(
      {
        idAluno: idAlunoRecebido,
        valor: valorRecebido,
        mes: mesRecebido,
        pago: mensalidadePaga
      }
    );
    res.send('Mensalidade inserida com sucesso.')
  });

  // obter todas as mensalidades (funcionando)
  app.get("/mensalidades", async (req, res) => {
    const conexao = admin.firestore();
    var dados = []

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let mensalidadeList = await conexao.collection("anne_gym_mensalidades").get()

    for (let mensalidadeDoc of mensalidadeList.docs) {
      // pega o dado de cada documento e inserir na lista
      dados.push(mensalidadeDoc.data())
    }

    if (!dados.length) {
      res.send('Sem mensalidade cadastrada')
    }

    res.send({
      mensalidades: dados
    });
  });

  // obter todas as mensalidades pagas (funcionando)
  app.get("/mensalidades/pago", async (req, res) => {
    const conexao = admin.firestore();
    var dados = []

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let mensalidadeList = await conexao.collection("anne_gym_mensalidades").get()

    for (let mensalidadeDoc of mensalidadeList.docs) {
      // pega o dado de cada documento que já foi pago e inserir na lista
      if (mensalidadeDoc.data().pago == true)
        dados.push(mensalidadeDoc.data())
    }

    if (!dados.length) {
      res.send('Sem mensalidade cadastrada ou sem mensalidade paga')
    }

    res.send({
      mensalidades_pagas: dados
    });
  });


  // obter todas as mensalidades nao pagas (funcionando)
  app.get("/mensalidades/naopago", async (req, res) => {
    const conexao = admin.firestore();
    var dados = []

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let mensalidadeList = await conexao.collection("anne_gym_mensalidades").get()

    for (let mensalidadeDoc of mensalidadeList.docs) {
      // pega o dado de cada documento que nao foi pago e inserir na lista
      if (mensalidadeDoc.data().pago == false)
        dados.push(mensalidadeDoc.data())
    }

    if (!dados.length) {
      res.send('Sem mensalidade cadastrada ou todas as mensalidades foram pagas')
    }

    res.send({
      mensalidades_naopagas: dados
    });
  });


  // todas as mensalidades de um determinado usuario (por email) (funcionando)
  app.get("/mensalidades/aluno/email/:email", async (req, res) => {
    const conexao = admin.firestore();
    // vai salvar todas as mensalidades
    var dados = []

    var emailAluno = req.params.email

    // primeiro pegar o id do aluno
    var alunoIdDoc = ""
    let alunoList = await conexao.collection("anne_gym_alunos").get()
    for (let alunoDoc of alunoList.docs) {
      // pega o dado de cada documento que nao foi pago e inserir na lista
      if (alunoDoc.data().email.toLowerCase() == emailAluno.toLowerCase()) {
        alunoIdDoc = alunoDoc.id;
        break;
      }
    }

    if (alunoIdDoc == "") {
      res.send("Aluno não foi encontrado")
    }

    // busca todos os itens da coleção mensalidade e comparar com o id do aluno (await aguarda até obter todos os dados)
    let mensalidadeList = await conexao.collection("anne_gym_mensalidades").get()

    for (let mensalidadeDoc of mensalidadeList.docs) {
      // pega o dado de cada documento que nao foi pago e inserir na lista
      if (mensalidadeDoc.data().idAluno == alunoIdDoc)
        dados.push(mensalidadeDoc.data())
    }

    if (!dados.length) {
      res.send('Sem mensalidade cadastrada para o aluno especificado')
    }

    res.send({
      email: emailAluno,
      mensalidades: dados
    });
  });

  // atualizar mensalidade passando id 
  app.put('/mensalidades/:idMensalidade', jsonParser, async function (req, res) {

    var idMensalidadeRecebida = req.params.idMensalidade

    var idMensalidadeDoc = ""

    // pegar dados put request 
    var valorRecebido = req.body.valor
    var idAlunoRecebido = req.body.idAluno
    var mensalidadePaga = req.body.pago
    var mesRecebido = req.body.mes

    const conexao = admin.firestore();

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let mensalidadesList = await conexao.collection("anne_gym_mensalidades").get()


    for (let mensalidadesDoc of mensalidadesList.docs) {
      // pega o dado de cada documento 
      var mensalidadesData = mensalidadesDoc.data();
      // se o id for igual ao passado por parametro, obter id do doc 
      if (mensalidadesDoc.id == idMensalidadeRecebida) {


        // se alguma variavel estiver undefined é porque o usuario nao quer atualizar ela
        // então pegar os dados atuais armazenados no firestore para nao alterar para undefined
        if (valorRecebido == undefined)
          valorRecebido = mensalidadesData.valor
        if (idAlunoRecebido == undefined)
          idAlunoRecebido = mensalidadesData.idAluno
        if (mesRecebido == undefined)
          mesRecebido = mensalidadesData.mes
        if (mensalidadePaga == undefined)
          mensalidadePaga = mensalidadesData.pago

        idMensalidadeDoc = mensalidadesDoc.id

        break;
      }
    }

    if (idMensalidadeDoc == "") {
      res.send('Mensalidade inexistente no sistema');
    }

    // const cityRef = db.collection('cities').doc('DC');
    // const res = await cityRef.update({capital: true});

    // atualizando dados necessarios
    const result = await conexao.collection('anne_gym_mensalidades').doc(idMensalidadeDoc).update(
      {
        idAluno: idAlunoRecebido,
        valor: valorRecebido,
        pago: mensalidadePaga,
        mes: mesRecebido
      }
    );
    res.send('Atualizado com sucesso.')
  });

  // deletar mensalidade por id  (funcionado)
  app.delete("/mensalidades/:idMensalidade", async (req, res) => {

    const conexao = admin.firestore();

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let mensalidadesList = await conexao.collection("anne_gym_mensalidades").get()

    var idMensalidade = req.params.idMensalidade
    var removeu = false
    for (let mensalidadesDoc of mensalidadesList.docs) {
      if (idMensalidade == mensalidadesDoc.id) {
        let deleteDoc = await conexao.collection("anne_gym_mensalidades").doc(idMensalidade).delete()
        removeu = true
        break;
      }
    }

    if (removeu)
      res.send("Mensalidade removida do sistema");
    else
      res.send('Mensalidade especificada não foi encontrada');
  });
}