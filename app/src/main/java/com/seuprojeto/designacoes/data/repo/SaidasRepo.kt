package com.seuprojeto.designacoes.data.repo

import com.seuprojeto.designacoes.data.local.dao.SaidaDao
import com.seuprojeto.designacoes.data.model.Saida

class SaidasRepo(private val dao: SaidaDao) {
    suspend fun listar(): List<Saida> = dao.getAll()
    suspend fun inserir(saida: Saida) = dao.insert(saida)
}
