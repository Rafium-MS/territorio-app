package com.seuprojeto.designacoes.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "designacoes")
data class Designacao(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val territorioId: Long,
    val data: String
)
