package com.seuprojeto.designacoes.data.repo

import com.seuprojeto.designacoes.data.local.dao.DesignacaoDao
import com.seuprojeto.designacoes.data.model.Designacao

class DesignacoesRepo(private val dao: DesignacaoDao) {
    suspend fun listar(): List<Designacao> = dao.getAll()
    suspend fun inserir(designacao: Designacao) = dao.insert(designacao)
}
