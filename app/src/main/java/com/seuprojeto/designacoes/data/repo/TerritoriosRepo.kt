package com.seuprojeto.designacoes.data.repo

import com.seuprojeto.designacoes.data.local.dao.TerritorioDao
import com.seuprojeto.designacoes.data.model.Territorio

class TerritoriosRepo(private val dao: TerritorioDao) {
    suspend fun listar(): List<Territorio> = dao.getAll()
    suspend fun inserir(territorio: Territorio) = dao.insert(territorio)
}
