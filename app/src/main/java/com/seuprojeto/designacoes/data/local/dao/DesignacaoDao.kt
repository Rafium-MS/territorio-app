package com.seuprojeto.designacoes.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.seuprojeto.designacoes.data.model.Designacao

@Dao
interface DesignacaoDao {
    @Query("SELECT * FROM designacoes")
    suspend fun getAll(): List<Designacao>

    @Insert
    suspend fun insert(designacao: Designacao)
}
