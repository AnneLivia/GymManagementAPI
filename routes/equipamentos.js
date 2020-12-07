const bodyParser = require('body-parser');
var admin = require("firebase-admin");

module.exports = app => {

  var jsonParser = bodyParser.json()

  // cadastrar equipamentos (funcionando)
  app.post('/equipamentos', jsonParser, async function(req, res) {

    var nomeEquipamento = req.body.nome
    var precoEquipamento = req.body.preco
    var quantidadeEquipamento = req.body.quantidade
    var equipamentoFoiPago = req.body.pago

    const conexao = admin.firestore();

    const result = await conexao.collection('anne_gym_equipamentos').add(
      {
        nome: nomeEquipamento,
        preco: precoEquipamento,
        quantidade: quantidadeEquipamento,
        pago: equipamentoFoiPago
      }
    );
    res.send('Equipamento inserido com sucesso.')
  });

  // obter todos os equipamentos (funcionando)
  app.get("/equipamentos", async (req, res) => {
    const conexao = admin.firestore();
    var dados = []

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let equipamentoList = await conexao.collection("anne_gym_equipamentos").get()

    for (let equipamentoDoc of equipamentoList.docs) {
      // pega o dado de cada documento e inserir na lista
      dados.push(equipamentoDoc.data())
    }

    if (!dados.length) {
      res.send('Sem equipamento cadastrado')
    }

    res.send({
      equipamentos: dados
    });
  });

  // obter todos os equipamentos pagos (funcionando)
  app.get("/equipamentos/pago", async (req, res) => {
    const conexao = admin.firestore();
    var dados = []

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let equipamentoList = await conexao.collection("anne_gym_equipamentos").get()

    for (let equipamentoDoc of equipamentoList.docs) {
      // pega o dado de cada documento que já foi pago e inserir na lista
      if (equipamentoDoc.data().pago == true)
        dados.push(equipamentoDoc.data())
    }

    if (!dados.length) {
      res.send('Sem equipamento cadastrado ou sem equipamento pago')
    }

    res.send({
      equipamentos_pagos: dados
    });
  });


  // obter todos os equipamentos ainda nao pagos (funcionando)
  app.get("/equipamentos/naopago", async (req, res) => {
    const conexao = admin.firestore();
    var dados = []

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let equipamentoList = await conexao.collection("anne_gym_equipamentos").get()

    for (let equipamentoDoc of equipamentoList.docs) {
      // pega o dado de cada documento que já ainda não foi pago e inserir na lista
      if (equipamentoDoc.data().pago == false)
        dados.push(equipamentoDoc.data())
    }

    if (!dados.length) {
      res.send('Sem equipamento cadastrado ou todos os equipamentos já foram pagos')
    }

    res.send({
      equipamentos_nao_pagos: dados
    });
  });

  // atualizar equipamento passando id do equipamneto
  app.put('/equipamentos/:idEquipamento', jsonParser, async function(req, res) {

    var idEquipamentoRecebido = req.params.idEquipamento

    var idEquipamentoDoc = ""

    // pegar dados put request 
    var quantidadeEquipamento = req.body.quantidade
    var nomeEquipamento = req.body.nome
    var precoEquipamento = req.body.preco
    var equipamentoFoiPago = req.body.pago

    const conexao = admin.firestore();

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let equipamentoList = await conexao.collection("anne_gym_equipamentos").get()


    for (let equipamentoDoc of equipamentoList.docs) {
      // pega o dado de cada documento 
      var equipamentoData = equipamentoDoc.data();
      // se o id do equipamento for igual ao passado por parametro, obter id do doc 
      if (equipamentoDoc.id == idEquipamentoRecebido) {


        // se alguma variavel estiver undefined é porque o usuario nao quer atualizar ela
        // então pegar os dados atuais armazenados no firestore para nao alterar para undefined
        if (quantidadeEquipamento == undefined)
          quantidadeEquipamento = equipamentoData.quantidade
        if (nomeEquipamento == undefined)
          nomeEquipamento = equipamentoData.nome
        if (precoEquipamento == undefined)
          precoEquipamento = equipamentoData.preco
        if (equipamentoFoiPago == undefined)
          equipamentoFoiPago = equipamentoData.pago

        idEquipamentoDoc = equipamentoDoc.id

        break;
      }
    }

    if (idEquipamentoDoc == "") {
      res.send('Equipamento inexistente no sistema');
    }

    // const cityRef = db.collection('cities').doc('DC');
    // const res = await cityRef.update({capital: true});

    // atualizando dados necessarios
    const result = await conexao.collection('anne_gym_equipamentos').doc(idEquipamentoDoc).update(
      {
        nome: nomeEquipamento,
        preco: precoEquipamento,
        quantidade: quantidadeEquipamento,
        pago: equipamentoFoiPago
      }
    );
    res.send('Atualizado com sucesso.')
  });

  // deletar equipamento por id do equipamento (funcionado)
  app.delete("/equipamentos/:idEquipamento", async (req, res) => {

    const conexao = admin.firestore();

    // busca todos os itens da coleção (await aguarda até obter todos os dados)
    let equipamentosList = await conexao.collection("anne_gym_equipamentos").get()

    var idEquipamento = req.params.idEquipamento
    var removeu = false
    for (let equipamentoDoc of equipamentosList.docs) {
      if (idEquipamento == equipamentoDoc.id) {
        let deleteDoc = await conexao.collection("anne_gym_equipamentos").doc(idEquipamento).delete()
        removeu = true
        break;
      }
    }

    if (removeu)
      res.send("Equipamento removido do sistema");
    else
      res.send('Equipamento especificado não foi encontrado');
  });
}