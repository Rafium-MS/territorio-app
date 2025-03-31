// public/assets/js/data.js

const DataService = {
    // Métodos para territórios
    async getTerritories() {
        try {
            return await API.getTerritorios();
        } catch (error) {
            console.error('Erro ao obter territórios:', error);
            return [];
        }
    },
    
    async saveTerritory(territory) {
        try {
            return await API.createTerritorio(territory);
        } catch (error) {
            console.error('Erro ao salvar território:', error);
            return null;
        }
    },
    
    async getTerritoryById(id) {
        try {
            return await API.getTerritorioById(id);
        } catch (error) {
            console.error('Erro ao obter território por ID:', error);
            return null;
        }
    },
    
    // Métodos para atendimentos
    async getAttendances() {
        try {
            return await API.getAtendimentos();
        } catch (error) {
            console.error('Erro ao obter atendimentos:', error);
            return {};
        }
    },
    
    async saveAttendance(propertyId, attendanceData) {
        try {
            const data = {
                imovelId: propertyId,
                ...attendanceData
            };
            return await API.createAtendimento(data);
        } catch (error) {
            console.error('Erro ao salvar atendimento:', error);
            return null;
        }
    },
    
    // Métodos para saídas de campo
    async getFieldExits() {
        try {
            return await API.getSaidasCampo();
        } catch (error) {
            console.error('Erro ao obter saídas de campo:', error);
            return [];
        }
    },
    
    async saveFieldExit(fieldExit) {
        try {
            return await API.createSaidaCampo(fieldExit);
        } catch (error) {
            console.error('Erro ao salvar saída de campo:', error);
            return null;
        }
    },
    
    // Métodos para designações
    async getAssignments() {
        try {
            return await API.getDesignacoes();
        } catch (error) {
            console.error('Erro ao obter designações:', error);
            return [];
        }
    },
    
    async saveAssignment(assignment) {
        try {
            return await API.createDesignacao(assignment);
        } catch (error) {
            console.error('Erro ao salvar designação:', error);
            return null;
        }
    },
    
    // Método para estatísticas (dashboard)
    async getStatistics() {
        try {
            const territories = await this.getTerritories();
            const attendances = await this.getAttendances();
            
            // Calcular estatísticas
            return {
                totalTerritories: territories.length,
                // Outras estatísticas
            };
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            return {};
        }
    }
};

const SystemState = {
    currentUser: null,
    currentTerritory: null,
    
    setCurrentTerritory(territoryId) {
        this.currentTerritory = territoryId;
        sessionStorage.setItem('currentTerritory', territoryId);
    },
    
    getCurrentTerritory() {
        if (!this.currentTerritory) {
            this.currentTerritory = sessionStorage.getItem('currentTerritory');
        }
        return this.currentTerritory;
    }
};