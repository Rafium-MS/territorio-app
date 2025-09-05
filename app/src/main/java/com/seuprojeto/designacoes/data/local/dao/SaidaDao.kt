package com.seuprojeto.designacoes.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.seuprojeto.designacoes.data.model.Saida

@Dao
interface SaidaDao {
    @Query("SELECT * FROM saidas")
    suspend fun getAll(): List<Saida>

    @Insert
    suspend fun insert(saida: Saida)
}
