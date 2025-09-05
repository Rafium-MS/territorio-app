package com.seuprojeto.designacoes.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.seuprojeto.designacoes.data.local.dao.DesignacaoDao
import com.seuprojeto.designacoes.data.local.dao.SaidaDao
import com.seuprojeto.designacoes.data.local.dao.TerritorioDao
import com.seuprojeto.designacoes.data.model.Designacao
import com.seuprojeto.designacoes.data.model.Saida
import com.seuprojeto.designacoes.data.model.Territorio

@Database(entities = [Territorio::class, Saida::class, Designacao::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun territorioDao(): TerritorioDao
    abstract fun saidaDao(): SaidaDao
    abstract fun designacaoDao(): DesignacaoDao
}
