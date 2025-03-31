// public/assets/js/api.js

const API = {
    // Territórios
    async getTerritorios() {
      try {
        const response = await fetch('/api/territorios');
        if (!response.ok) {
          throw new Error('Erro ao obter territórios');
        }
        return await response.json();
      } catch (error) {
        console.error('Erro na API:', error);
        // Fallback: usar localStorage se disponível
        const territoriosJSON = localStorage.getItem('territorios');
        return territoriosJSON ? JSON.parse(territoriosJSON) : [];
      }
    },
    
    async getTerritorioById(id) {
      try {
        const response = await fetch(`/api/territorios/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao obter território');
        }
        return await response.json();
      } catch (error) {
        console.error('Erro na API:', error);
        // Fallback: usar localStorage se disponível
        const territoriosJSON = localStorage.getItem('territorios');
        if (territoriosJSON) {
          const territorios = JSON.parse(territoriosJSON);
          return territorios.find(t => t.id === id);
        }
        return null;
      }
    },
    
    async createTerritorio(territorioData) {
      try {
        const response = await fetch('/api/territorios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(territorioData)
        });
        
        if (!response.ok) {
          throw new Error('Erro ao criar território');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Erro na API:', error);
        // Fallback: usar localStorage
        const territoriosJSON = localStorage.getItem('territorios');
        let territorios = territoriosJSON ? JSON.parse(territoriosJSON) : [];
        
        const novoTerritorio = {
          id: Date.now().toString(),
          ...territorioData,
          ruas: []
        };
        
        territorios.push(novoTerritorio);
        localStorage.setItem('territorios', JSON.stringify(territorios));
        
        return novoTerritorio;
      }
    },
    
    // Saídas de Campo
    async getSaidasCampo() {
      try {
        const response = await fetch('/api/saidas');
        if (!response.ok) {
          throw new Error('Erro ao obter saídas de campo');
        }
        return await response.json();
      } catch (error) {
        console.error('Erro na API:', error);
        // Fallback: usar localStorage
        const saidasJSON = localStorage.getItem('saidasCampo');
        return saidasJSON ? JSON.parse(saidasJSON) : [];
      }
    },
    
    async createSaidaCampo(saidaData) {
      try {
        const response = await fetch('/api/saidas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(saidaData)
        });
        
        if (!response.ok) {
          throw new Error('Erro ao criar saída de campo');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Erro na API:', error);
        // Fallback: usar localStorage
        const saidasJSON = localStorage.getItem('saidasCampo');
        let saidas = saidasJSON ? JSON.parse(saidasJSON) : [];
        
        const novaSaida = {
          id: Date.now().toString(),
          ...saidaData
        };
        
        saidas.push(novaSaida);
        localStorage.setItem('saidasCampo', JSON.stringify(saidas));
        
        return novaSaida;
      }
    },
    
    // Designações
    async getDesignacoes() {
      try {
        const response = await fetch('/api/designacoes');
        if (!response.ok) {
          throw new Error('Erro ao obter designações');
        }
        return await response.json();
      } catch (error) {
        console.error('Erro na API:', error);
        // Fallback: usar localStorage
        const designacoesJSON = localStorage.getItem('designacoes');
        return designacoesJSON ? JSON.parse(designacoesJSON) : [];
      }
    },
    
    async createDesignacao(designacaoData) {
      try {
        const response = await fetch('/api/designacoes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(designacaoData)
        });
        
        if (!response.ok) {
          throw new Error('Erro ao criar designação');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Erro na API:', error);
        // Fallback: usar localStorage
        const designacoesJSON = localStorage.getItem('designacoes');
        let designacoes = designacoesJSON ? JSON.parse(designacoesJSON) : [];
        
        const novaDesignacao = {
          id: Date.now().toString(),
          ...designacaoData
        };
        
        designacoes.push(novaDesignacao);
        localStorage.setItem('designacoes', JSON.stringify(designacoes));
        
        return novaDesignacao;
      }
    },
    
    // Atendimentos
    async getAtendimentos() {
      try {
        const response = await fetch('/api/atendimentos');
        if (!response.ok) {
          throw new Error('Erro ao obter atendimentos');
        }
        return await response.json();
      } catch (error) {
        console.error('Erro na API:', error);
        // Fallback: usar localStorage
        const atendimentosJSON = localStorage.getItem('atendimentos');
        return atendimentosJSON ? JSON.parse(atendimentosJSON) : {};
      }
    },
    
    async createAtendimento(atendimentoData) {
      try {
        const response = await fetch('/api/atendimentos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(atendimentoData)
        });
        
        if (!response.ok) {
          throw new Error('Erro ao criar atendimento');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Erro na API:', error);
        // Fallback: usar localStorage
        const atendimentosJSON = localStorage.getItem('atendimentos');
        let atendimentos = atendimentosJSON ? JSON.parse(atendimentosJSON) : {};
        
        // No modelo localStorage, os atendimentos são armazenados usando o ID do imóvel como chave
        atendimentos[atendimentoData.imovelId] = {
          data: atendimentoData.data,
          resultado: atendimentoData.resultado,
          observacoes: atendimentoData.observacoes
        };
        
        localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
        
        return atendimentoData;
      }
    }
  };
  
  // Exportar para uso global
  window.API = API;