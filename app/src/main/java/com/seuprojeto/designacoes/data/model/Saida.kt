package com.seuprojeto.designacoes.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "saidas")
data class Saida(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val descricao: String
)
