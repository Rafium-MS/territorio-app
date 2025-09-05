package com.seuprojeto.designacoes.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.seuprojeto.designacoes.data.model.Territorio

@Dao
interface TerritorioDao {
    @Query("SELECT * FROM territorios")
    suspend fun getAll(): List<Territorio>

    @Insert
    suspend fun insert(territorio: Territorio)
}
