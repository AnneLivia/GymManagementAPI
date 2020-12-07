const bodyParser = require('body-parser');
var admin = require("firebase-admin");

module.exports = app => {

  app.use(bodyParser.urlencoded({ extended: true }));

  var jsonParser = bodyParser.json()

  // cadastrar endereco (funcionando)
  app.post('/enderecos', jsonParser, async function (req, res) {
    var numeroRecebido = req.body.numero
    var cepRecebido = req.body.cep
    var cidadeRecebido = req.body.cidade
    var bairroRecebido = req.body.bairro
    var estadoRecebido = req.body.estado
    var complementoRecebido = req.body.complemento

    const conexao = admin.firestore();

    const result = await conexao.collection('anne_gym_enderecos').add(
      {
        numero: numeroRecebido,
        cep: cepRecebido,
        cidade: cidadeRecebido,
        bairro: bairroRecebido,
        estado: estadoRecebido,
        complemento: complementoRecebido
      }
    );
    res.send('Endereço cadastrado com sucesso.')
  });

  // obter todos os enderecos (funcionado)
  app.get("/enderecos", async (req, res) => {
    const conexao = admin.firestore();
    var dados = []

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let enderecoLista = await conexao.collection("anne_gym_enderecos").get()

    for (let enderecoDoc of enderecoLista.docs) {
      // pega o dado de cada documento 
      dados.push(enderecoDoc.data())
    }

    if (!dados.length) {
      res.send('Sem endereço cadastrado')
    }
    res.send({
      enderecos: dados
    });
  });

  // obter endereco de determinado aluno (email) (funcionando)
  app.get("/enderecos/aluno/email/:email", async (req, res) => {
    const conexao = admin.firestore();

    // busca todos os itens da coleção alunos (await aguarda até obter todos os dados)
    let alunosLista = await conexao.collection("anne_gym_alunos").get()

    var email = req.params.email
    var idAluno = ""
    for (let alunoDoc of alunosLista.docs) {
      // pega o dado de cada documento 
      var alunoData = alunoDoc.data();
      if (alunoData.email.toString().toLowerCase() == email.toString().toLowerCase()) {
        idAluno = alunoDoc.id
        break;
      }
    }


    if (idAluno == "") {
      res.send("Email não cadastrado no sistema")
    }

    // obter da lista de endereco_aluno, o id do endereco
    let endeAlunoLista = await conexao.collection("anne_gym_endereco_aluno").get()
    var idEndereco = ""
    for (let endAlunoList of endeAlunoLista.docs) {
      // pega o dado de cada documento 
      var endeAlunoData = endAlunoList.data();
      if (endeAlunoData.idAluno == idAluno) {
        idEndereco = endeAlunoData.idEndereco
        break;
      }
    }

    if (idEndereco == "") {
      res.send("Endereço do aluno não foi cadastrado ainda")
    }

    // obter lista de enderecos e exibir o endereco referente ao id obtido em endereco_aluno
    let endeLista = await conexao.collection("anne_gym_enderecos").get()

    for (let endList of endeLista.docs) {
      // pega o dado de cada documento 
      if (endList.id == idEndereco)
        res.send({
          email: email,
          endereco: endList.data()
        });
    }
  });


  // obter endereco de determinado instrutor (email) (funcionando)
  app.get("/enderecos/instrutor/email/:email", async (req, res) => {
    const conexao = admin.firestore();

    // busca todos os itens da coleção instrutor (await aguarda até obter todos os dados)
    let instrutorLista = await conexao.collection("anne_gym_instrutores").get()

    var email = req.params.email
    var idInstrutor = ""
    for (let instrutorDoc of instrutorLista.docs) {
      // pega o dado de cada documento 
      var istrutorData = instrutorDoc.data();
      if (istrutorData.email.toString().toLowerCase() == email.toString().toLowerCase()) {
        idInstrutor = instrutorDoc.id
        break;
      }
    }


    if (idInstrutor == "") {
      res.send("Email não cadastrado no sistema")
    }

    // obter da lista de endereco_instrutor, o id do endereco
    let endeInstrutorLista = await conexao.collection("anne_gym_endereco_instrutor").get()
    var idEndereco = ""
    for (let endInstrutorDoc of endeInstrutorLista.docs) {
      // pega o dado de cada documento 
      var endInstrutorData = endInstrutorDoc.data();
      if (endInstrutorData.idInstrutor == idInstrutor) {
        idEndereco = endInstrutorData.idEndereco
        break;
      }
    }

    if (idEndereco == "") {
      res.send("Endereço do instrutor não foi cadastrado ainda")
    }

    // obter lista de enderecos e exibir o endereco referente ao id obtido em endereco_instrutor
    let endeLista = await conexao.collection("anne_gym_enderecos").get()

    for (let endList of endeLista.docs) {
      // pega o dado de cada documento 
      if (endList.id == idEndereco)
        res.send({
          email: email,
          endereco: endList.data()
        });
    }
  });


  // obter todos os alunos de um cep
  app.get("/enderecos/aluno/cep/:cep", async (req, res) => {
    const conexao = admin.firestore();

    // busca todos os itens da coleção alunos (await aguarda até obter todos os dados)
    let enderecoLista = await conexao.collection("anne_gym_enderecos").get()

    var cep = req.params.cep

    var dados = []

    for (let endeDoc of enderecoLista.docs) {
      // todos os ends que tiver o mesmo cep são inseridos na lista dados
      var endeData = endeDoc.data();
      if (endeData.cep == cep) {
        dados.push(endeDoc.id);
      }
    }

    if (!dados.length) {
      res.send('Nenhum endereço cadastrado no sistema com o cep especificado')
    }


    let end_alunoLista = await conexao.collection("anne_gym_endereco_aluno").get()

    var todosOsAlunosIds = []

    for (let endeAlunoDoc of end_alunoLista.docs) {
      // se o dados contiver o id do endereco, entao salvar id do aluno
      var endeAlunoData = endeAlunoDoc.data();
      if (dados.includes(endeAlunoData.idEndereco)) {
        todosOsAlunosIds.push(endeAlunoData.idAluno);
      }
    }

    if (!todosOsAlunosIds.length) {
      res.send('Nenhum aluno residente no endereço especificado')
    }

    // busca todos os itens da coleção alunos (await aguarda até obter todos os dados)
    let alunosLista = await conexao.collection("anne_gym_alunos").get()
    var dadosAlunos = []
    for (let alunoDoc of alunosLista.docs) {
      // pega o dado de cada documento 
      var alunoData = alunoDoc.data();
      if (todosOsAlunosIds.includes(alunoDoc.id)) {
        dadosAlunos.push(alunoData);
      }
    }


    res.send({ alunos: dadosAlunos });

  });


  // obter todos os instrutor de um cep
  app.get("/enderecos/instrutor/cep/:cep", async (req, res) => {
    const conexao = admin.firestore();

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let enderecoLista = await conexao.collection("anne_gym_enderecos").get()

    var cep = req.params.cep

    var dados = []

    for (let endeDoc of enderecoLista.docs) {
      // todos os ends que tiver o mesmo cep são inseridos na lista dados
      var endeData = endeDoc.data();
      if (endeData.cep == cep) {
        dados.push(endeDoc.id);
      }
    }

    if (!dados.length) {
      res.send('Nenhum endereço cadastrado no sistema com o cep especificado')
    }


    let end_InstrutorLista = await conexao.collection("anne_gym_endereco_instrutor").get()

    var todosOsInstrutoresIds = []

    for (let endInstrutorDoc of end_InstrutorLista.docs) {
      // se o dados contiver o id do endereco, entao salvar id do instrutor
      var endeInstrutorData = endInstrutorDoc.data();
      if (dados.includes(endeInstrutorData.idEndereco)) {
        todosOsInstrutoresIds.push(endeInstrutorData.idInstrutor);
      }
    }

    if (!todosOsInstrutoresIds.length) {
      res.send('Nenhum instrutor residente no endereço especificado')
    }

    // busca todos os itens da coleção instrutor (await aguarda até obter todos os dados)
    let instrutorLista = await conexao.collection("anne_gym_instrutores").get()
    var dadosInstrutores = []
    for (let intrutorDoc of instrutorLista.docs) {
      // pega o dado de cada documento 
      var instrutorData = intrutorDoc.data();
      if (todosOsInstrutoresIds.includes(intrutorDoc.id)) {
        dadosInstrutores.push(instrutorData);
      }
    }


    res.send({ instrutores: dadosInstrutores });

  });

  // deletar por id do endereco (funcionado)
  app.delete("/enderecos/:id", async (req, res) => {

    const conexao = admin.firestore();


    var idEndereco = req.params.id


    // primeira verificar enderecos_alunos collections, se houver endereco la, remover também
    let end_alunoLista = await conexao.collection("anne_gym_endereco_aluno").get()

    for (let endeAlunoDoc of end_alunoLista.docs) {
      // se o dados contiver o id do endereco, entao salvar id do aluno
      var endeAlunoData = endeAlunoDoc.data();
      if (endeAlunoData.idEndereco == idEndereco) {
        let deleteDoc = await conexao.collection("anne_gym_endereco_aluno").doc(endeAlunoDoc.id).delete()
      }
    }

    // primeira verificar enderecos_instrutor collections, se houver endereco la, remover também
    let end_instrutorLista = await conexao.collection("anne_gym_endereco_instrutor").get()

    for (let endeInstrutorDoc of end_instrutorLista.docs) {
      // se o dados contiver o id do endereco, entao salvar id do instrutor
      var endeInstrutorData = endeInstrutorDoc.data();
      if (endeInstrutorData.idEndereco == idEndereco) {
        let deleteDoc = await conexao.collection("anne_gym_endereco_instrutor").doc(endeInstrutorDoc.id).delete()
      }
    }


    // apos remover todos os endereocs_alunos e endereco_instrtuor, pode remover o endereco
    let deleteDoc = await conexao.collection("anne_gym_enderecos").doc(idEndereco).delete()

    res.send(deleteDoc);
  });

  // atualizar endereco pelo id do endereco
  app.put('/enderecos/:idendereco', jsonParser, async function (req, res) {
    var idendereco = req.params.idendereco

    // pegar dados put request 
    var cidadeRecebido = req.body.cidade
    var cepRecebido = req.body.cep
    var bairroRecebido = req.body.bairro
    var complementoRecebido = req.body.complemento
    var estadoRecebido = req.body.estado
    var numeroRecebido = req.body.numero

    const conexao = admin.firestore();

    // busca todos os itens da coleção enderecos (await aguarda até obter todos os dados)
    let endLista = await conexao.collection("anne_gym_enderecos").get()

    var found = false;

    for (let endDoc of endLista.docs) {
      // pega o dado de cada documento 
      var endData = endDoc.data();
      // se o email for igual ao passado por parametro, obter id do doc 
      if (endDoc.id == idendereco) {

        // se algum variavel estiver undefined é porque o usuario nao quer atualizar ela
        // então pegar os dados atuais para nao alterar para undefined
        if (cidadeRecebido == undefined)
          cidadeRecebido = endData.cidade
        if (bairroRecebido == undefined)
          bairroRecebido = endData.bairro
        if (cepRecebido == undefined)
          cepRecebido = endData.cep
        if (complementoRecebido == undefined)
          complementoRecebido = endData.complemento
        if (numeroRecebido == undefined)
          numeroRecebido = endData.numero
        if (estadoRecebido == undefined)
          estadoRecebido = endData.estado

        found = true;
        break;
      }
    }

    if (!found) {
      res.send("Id do endereço especificado é inexistente");

    }
    // const cityRef = db.collection('cities').doc('DC');
    // const res = await cityRef.update({capital: true});



    // atualizando dados necessarios
    const result = await conexao.collection('anne_gym_enderecos').doc(idendereco).update(
      {
        cidade: cidadeRecebido,
        bairro: bairroRecebido,
        complemento: complementoRecebido,
        estado: estadoRecebido,
        numero: numeroRecebido,
        cep: cepRecebido
      }
    );
    res.send('Atualizado com sucesso.')
  });
};