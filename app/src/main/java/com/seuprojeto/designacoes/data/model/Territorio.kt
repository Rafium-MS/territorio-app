package com.seuprojeto.designacoes.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "territorios")
data class Territorio(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val nome: String
)
