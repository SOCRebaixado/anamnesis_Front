import { useState, useEffect } from 'react'
import { ArrowUp, ArrowDown, Trash2, Search, User, MoreVertical, RotateCcw, Filter, GripVertical, Shield, AlertTriangle, BarChart3, TrendingUp, Activity } from 'lucide-react'
import './App.css'

// Dados mock para desenvolvimento
const mockVulnerabilities = [
  {
    id: '1',
    title: 'SQL Injection na página de login',
    description: 'Vulnerabilidade de injeção de SQL na página de login, permitindo acesso não autorizado ao banco de dados.',
    criticality: 'CRITICAL',
    priority: 1,
    custom_order: 1,
    is_deleted: false,
    created_at: '2025-08-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Cross-Site Scripting (XSS) em formulário de contato',
    description: 'Falha de XSS refletido no formulário de contato, permitindo a execução de scripts maliciosos no navegador do usuário.',
    criticality: 'HIGH',
    priority: 1,
    custom_order: 2,
    is_deleted: false,
    created_at: '2025-08-02T11:30:00Z'
  },
  {
    id: '3',
    title: 'Exposição de dados sensíveis em API REST',
    description: 'Endpoint da API expondo informações de usuários sem autenticação adequada.',
    criticality: 'CRITICAL',
    priority: 1,
    custom_order: 3,
    is_deleted: false,
    created_at: '2025-08-03T14:00:00Z'
  },
  {
    id: '4',
    title: 'Insecure Direct Object Reference (IDOR) em perfil de usuário',
    description: 'Usuário pode acessar e modificar perfis de outros usuários alterando o ID na URL.',
    criticality: 'HIGH',
    priority: 1,
    custom_order: 4,
    is_deleted: false,
    created_at: '2025-08-04T09:15:00Z'
  },
  {
    id: '5',
    title: 'Broken Authentication em sistema de recuperação de senha',
    description: 'Mecanismo de recuperação de senha fraco, permitindo a redefinição de senhas sem validação robusta.',
    criticality: 'HIGH',
    priority: 1,
    custom_order: 5,
    is_deleted: false,
    created_at: '2025-08-05T16:45:00Z'
  },
  {
    id: '6',
    title: 'Missing Security Headers em resposta HTTP',
    description: 'Cabeçalhos de segurança como Content-Security-Policy e X-Frame-Options ausentes.',
    criticality: 'MEDIUM',
    priority: 2,
    custom_order: 1,
    is_deleted: false,
    created_at: '2025-08-06T10:00:00Z'
  },
  {
    id: '7',
    title: 'Denial of Service (DoS) via XML External Entities (XXE)',
    description: 'Processamento de XML vulnerável a ataques XXE, podendo levar a negação de serviço.',
    criticality: 'MEDIUM',
    priority: 2,
    custom_order: 2,
    is_deleted: false,
    created_at: '2025-08-07T13:00:00Z'
  },
  {
    id: '8',
    title: 'Insecure Deserialization em módulo de upload',
    description: 'Vulnerabilidade de desserialização insegura em um módulo de upload de arquivos.',
    criticality: 'MEDIUM',
    priority: 2,
    custom_order: 3,
    is_deleted: false,
    created_at: '2025-08-08T08:45:00Z'
  },
  {
    id: '9',
    title: 'Informative Error Messages',
    description: 'Mensagens de erro detalhadas expondo informações sensíveis sobre o sistema.',
    criticality: 'LOW',
    priority: 3,
    custom_order: 1,
    is_deleted: false,
    created_at: '2025-08-09T11:00:00Z'
  },
  {
    id: '10',
    title: 'Clickjacking em página de configurações',
    description: 'Página de configurações vulnerável a clickjacking.',
    criticality: 'LOW',
    priority: 3,
    custom_order: 2,
    is_deleted: false,
    created_at: '2025-08-10T15:30:00Z'
  }
]

// Componente de Gráfico de Barras Simples
const SimpleBarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value))
  
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="w-20 text-sm text-slate-300 font-medium">
            {item.name}
          </div>
          <div className="flex-1 bg-slate-700 rounded-full h-6 relative">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${item.color}`}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
              {item.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Componente de Medidor de Risco (Score Gauge)
const RiskScoreGauge = ({ score, maxScore = 1000 }) => {
  const percentage = (score / maxScore) * 100
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  const getRiskLevel = (score) => {
    if (score >= 800) return { level: 'Crítico', color: 'text-red-400', bgColor: 'from-red-500 to-red-600' }
    if (score >= 600) return { level: 'Alto', color: 'text-orange-400', bgColor: 'from-orange-500 to-orange-600' }
    if (score >= 400) return { level: 'Médio', color: 'text-yellow-400', bgColor: 'from-yellow-500 to-yellow-600' }
    if (score >= 200) return { level: 'Baixo', color: 'text-green-400', bgColor: 'from-green-500 to-green-600' }
    return { level: 'Muito Baixo', color: 'text-blue-400', bgColor: 'from-blue-500 to-blue-600' }
  }
  
  const riskInfo = getRiskLevel(score)
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-700"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={riskInfo.color}
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-2xl font-bold ${riskInfo.color}`}>
            {score}
          </div>
          <div className="text-xs text-slate-400">
            de {maxScore}
          </div>
        </div>
      </div>
      <div className="text-center">
        <div className={`text-lg font-semibold ${riskInfo.color}`}>
          {riskInfo.level}
        </div>
        <div className="text-sm text-slate-400">
          Nível de Risco
        </div>
      </div>
    </div>
  )
}

function App() {
  const [currentView, setCurrentView] = useState('vulnerabilities')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [draggedCard, setDraggedCard] = useState(null)
  const [dragOverCard, setDragOverCard] = useState(null)
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    criticality: '',
    priority: ''
  })

  // Estados para dados
  const [vulnerabilities, setVulnerabilities] = useState(mockVulnerabilities)
  const [deletedVulnerabilities, setDeletedVulnerabilities] = useState([])

  const handlePriorityChange = (vulnId, direction) => {
    const vuln = vulnerabilities.find(v => v.id === vulnId)
    if (!vuln) return

    const newPriority = direction === 'up' 
      ? Math.max(1, vuln.priority - 1)
      : Math.min(3, vuln.priority + 1)

    const priorityToCriticality = {
      1: vuln.criticality === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      2: 'MEDIUM',
      3: 'LOW'
    }

    const newCriticality = priorityToCriticality[newPriority]

    setVulnerabilities(prevVulns => 
      prevVulns.map(v => 
        v.id === vulnId ? { ...v, criticality: newCriticality, priority: newPriority } : v
      )
    )
  }

  const handleDelete = (vulnId) => {
    const vulnToDelete = vulnerabilities.find(vuln => vuln.id === vulnId)
    if (vulnToDelete) {
      setDeletedVulnerabilities(prev => [...prev, { ...vulnToDelete, deleted_at: new Date().toISOString() }])
      setVulnerabilities(prevVulns => prevVulns.filter(vuln => vuln.id !== vulnId))
    }
  }

  const handleRestore = (vulnId) => {
    const vulnToRestore = deletedVulnerabilities.find(vuln => vuln.id === vulnId)
    if (vulnToRestore) {
      const { deleted_at, ...restoredVuln } = vulnToRestore
      setVulnerabilities(prev => [...prev, restoredVuln])
      setDeletedVulnerabilities(prev => prev.filter(vuln => vuln.id !== vulnId))
    }
  }

  const handleEmptyTrash = () => {
    setDeletedVulnerabilities([])
  }

  // Drag and Drop
  const handleDragStart = (e, vuln) => {
    setDraggedCard(vuln)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', '')
  }

  const handleDragOver = (e, vuln) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    
    if (draggedCard && draggedCard.id !== vuln.id && draggedCard.priority === vuln.priority) {
      setDragOverCard(vuln)
    }
  }

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverCard(null)
    }
  }

  const handleDrop = (e, targetVuln) => {
    e.preventDefault()
    
    if (!draggedCard || draggedCard.id === targetVuln.id) {
      setDraggedCard(null)
      setDragOverCard(null)
      return
    }

    if (draggedCard.priority !== targetVuln.priority) {
      setDraggedCard(null)
      setDragOverCard(null)
      return
    }

    const allVulns = [...vulnerabilities]
    const draggedVulnIndex = allVulns.findIndex(v => v.id === draggedCard.id)
    const targetVulnIndex = allVulns.findIndex(v => v.id === targetVuln.id)
    
    const [movedVuln] = allVulns.splice(draggedVulnIndex, 1)
    allVulns.splice(targetVulnIndex, 0, movedVuln)
    
    const samesPriorityVulns = allVulns.filter(v => v.priority === draggedCard.priority)
    const updatedVulns = allVulns.map(vuln => {
      if (vuln.priority === draggedCard.priority) {
        const newIndex = samesPriorityVulns.findIndex(v => v.id === vuln.id)
        return { ...vuln, custom_order: newIndex + 1 }
      }
      return vuln
    })

    setVulnerabilities(updatedVulns)
    setDraggedCard(null)
    setDragOverCard(null)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "" ? "" : value
    }))
  }

  const clearFilters = () => {
    setFilters({
      criticality: '',
      priority: ''
    })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-800 border-red-200'
      case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 3: return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case 1: return 'Alta'
      case 2: return 'Média'
      case 3: return 'Baixa'
      default: return 'Normal'
    }
  }

  const getCriticalityText = (criticality) => {
    const criticalityMap = {
      'CRITICAL': 'Crítica',
      'HIGH': 'Alta',
      'MEDIUM': 'Média',
      'LOW': 'Baixa'
    }
    return criticalityMap[criticality] || 'Desconhecida'
  }

  const getCriticalityColor = (criticality) => {
    const colorMap = {
      'CRITICAL': 'bg-red-100 text-red-800 border-red-200',
      'HIGH': 'bg-orange-100 text-orange-800 border-orange-200',
      'MEDIUM': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'LOW': 'bg-green-100 text-green-800 border-green-200'
    }
    return colorMap[criticality] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Filtrar vulnerabilidades
  const getFilteredVulnerabilities = () => {
    let filteredVulns = [...vulnerabilities].filter(vuln => !vuln.is_deleted)
    
    if (filters.criticality && filters.criticality !== '') {
      filteredVulns = filteredVulns.filter(vuln => vuln.criticality === filters.criticality)
    }
    
    if (filters.priority && filters.priority !== '') {
      filteredVulns = filteredVulns.filter(vuln => vuln.priority === parseInt(filters.priority))
    }
    
    filteredVulns.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority
      }
      return a.custom_order - b.custom_order
    })
    
    return filteredVulns
  }

  // Agrupar vulnerabilidades por prioridade
  const groupedVulnerabilities = getFilteredVulnerabilities().reduce((acc, vuln) => {
    if (!acc[vuln.priority]) {
      acc[vuln.priority] = []
    }
    acc[vuln.priority].push(vuln)
    return acc
  }, {})

  // Calcular estatísticas para dashboard
  const getVulnerabilityStats = () => {
    const stats = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
      total: vulnerabilities.length
    }

    vulnerabilities.forEach(vuln => {
      if (stats.hasOwnProperty(vuln.criticality)) {
        stats[vuln.criticality]++
      }
    })

    return stats
  }

  // Calcular score de risco
  const calculateRiskScore = () => {
    const stats = getVulnerabilityStats()
    // Pesos para cada criticidade (inspirado na Cisco)
    const weights = {
      CRITICAL: 200,
      HIGH: 100,
      MEDIUM: 50,
      LOW: 10
    }
    
    const score = (stats.CRITICAL * weights.CRITICAL) + 
                  (stats.HIGH * weights.HIGH) + 
                  (stats.MEDIUM * weights.MEDIUM) + 
                  (stats.LOW * weights.LOW)
    
    return Math.min(score, 1000) // Máximo de 1000
  }

  const stats = getVulnerabilityStats()
  const riskScore = calculateRiskScore()

  // Dados para o gráfico de barras
  const chartData = [
    { name: 'Crítica', value: stats.CRITICAL, color: 'bg-red-500' },
    { name: 'Alta', value: stats.HIGH, color: 'bg-orange-500' },
    { name: 'Média', value: stats.MEDIUM, color: 'bg-yellow-500' },
    { name: 'Baixa', value: stats.LOW, color: 'bg-green-500' }
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="h-6 w-6 text-blue-500" />
            <h1 className="text-xl font-semibold text-white">Anamnesis</h1>
            <span className="text-sm text-slate-400">Security Operations Center</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar vulnerabilidades..."
                className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
              />
            </div>
            <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen p-6">
          <nav className="space-y-2">
            <button 
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center ${
                currentView === 'dashboard' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              onClick={() => setCurrentView('dashboard')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </button>
            
            <button 
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center ${
                currentView === 'vulnerabilities' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              onClick={() => setCurrentView('vulnerabilities')}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Vulnerabilidades
            </button>
            
            <button 
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center ${
                currentView === 'trash' 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              onClick={() => setCurrentView('trash')}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Lixeira ({deletedVulnerabilities.length})
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {currentView === 'dashboard' ? (
            /* Dashboard View */
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Dashboard de Segurança</h2>
                <p className="text-slate-400">Visão geral do risco e vulnerabilidades da organização</p>
              </div>

              {/* Métricas Principais */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Score de Risco */}
                <div className="lg:col-span-1 bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Score de Risco</h3>
                    <Activity className="h-5 w-5 text-blue-400" />
                  </div>
                  <RiskScoreGauge score={riskScore} />
                  <div className="mt-4 text-center">
                    <p className="text-sm text-slate-400">
                      Baseado em {stats.total} vulnerabilidades ativas
                    </p>
                  </div>
                </div>

                {/* Gráfico de Vulnerabilidades por Criticidade */}
                <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Vulnerabilidades por Criticidade</h3>
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                  <SimpleBarChart data={chartData} />
                </div>
              </div>

              {/* Cards de Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total</p>
                      <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-green-400 text-sm">↓ 12% vs mês anterior</span>
                  </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Críticas</p>
                      <p className="text-2xl font-bold text-red-400">{stats.CRITICAL}</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-red-400 text-sm">↑ 5% vs mês anterior</span>
                  </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Altas</p>
                      <p className="text-2xl font-bold text-orange-400">{stats.HIGH}</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-green-400 text-sm">↓ 8% vs mês anterior</span>
                  </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Médias + Baixas</p>
                      <p className="text-2xl font-bold text-yellow-400">{stats.MEDIUM + stats.LOW}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-green-400 text-sm">↓ 15% vs mês anterior</span>
                  </div>
                </div>
              </div>

              {/* Tabela de Resumo */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Resumo Detalhado</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-300">Criticidade</th>
                        <th className="text-left py-3 px-4 text-slate-300">Quantidade</th>
                        <th className="text-left py-3 px-4 text-slate-300">Percentual</th>
                        <th className="text-left py-3 px-4 text-slate-300">Impacto no Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(stats).filter(([key]) => key !== 'total').map(([criticality, count]) => {
                        const weights = { CRITICAL: 200, HIGH: 100, MEDIUM: 50, LOW: 10 }
                        const impact = count * weights[criticality]
                        return (
                          <tr key={criticality} className="border-b border-slate-700">
                            <td className="py-3 px-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCriticalityColor(criticality)}`}>
                                {getCriticalityText(criticality)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-white">{count}</td>
                            <td className="py-3 px-4 text-slate-300">
                              {stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0}%
                            </td>
                            <td className="py-3 px-4 text-slate-300">
                              {impact} pontos
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : currentView === 'vulnerabilities' ? (
            /* Vulnerabilities View */
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Vulnerabilidades Ativas</h2>
                  <p className="text-slate-400">Gerencie vulnerabilidades de segurança identificadas automaticamente</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg flex items-center"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </button>
                </div>
              </div>

              {/* Painel de Filtros */}
              {showFilters && (
                <div className="mb-6 p-4 bg-slate-800 border border-slate-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Criticidade</label>
                      <select 
                        value={filters.criticality} 
                        onChange={(e) => handleFilterChange('criticality', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Todas as criticidades</option>
                        <option value="CRITICAL">Crítica</option>
                        <option value="HIGH">Alta</option>
                        <option value="MEDIUM">Média</option>
                        <option value="LOW">Baixa</option>
                      </select>
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Prioridade</label>
                      <select 
                        value={filters.priority} 
                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Todas as prioridades</option>
                        <option value="1">Alta</option>
                        <option value="2">Média</option>
                        <option value="3">Baixa</option>
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg"
                      >
                        Limpar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Vulnerabilidades agrupadas por prioridade */}
              <div className="space-y-8">
                {[1, 2, 3].map(priority => {
                  const priorityVulns = groupedVulnerabilities[priority] || []
                  if (priorityVulns.length === 0) return null

                  return (
                    <div key={priority} className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-white">
                          Prioridade {getPriorityText(priority)}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(priority)}`}>
                          {priorityVulns.length} vulnerabilidades
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {priorityVulns.map((vuln) => (
                          <div 
                            key={vuln.id} 
                            className="relative"
                            draggable
                            onDragStart={(e) => handleDragStart(e, vuln)}
                            onDragOver={(e) => handleDragOver(e, vuln)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, vuln)}
                          >
                            <div 
                              className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-slate-800 border border-slate-700 text-white rounded-lg p-4 ${
                                dragOverCard?.id === vuln.id ? 'border-blue-500 bg-slate-700 scale-105' : ''
                              } ${
                                draggedCard?.id === vuln.id ? 'opacity-50' : ''
                              }`}
                              onClick={() => setOpenMenuId(openMenuId === vuln.id ? null : vuln.id)}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="text-lg font-semibold text-white line-clamp-2 flex-1">
                                  {vuln.title}
                                </h4>
                                <div className="flex flex-col gap-2 ml-2">
                                  <GripVertical className="h-4 w-4 text-slate-500 cursor-grab" />
                                  <button className="h-6 w-6 p-0 text-slate-400 hover:text-white">
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-slate-400 line-clamp-3 mb-3">
                                {vuln.description}
                              </p>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCriticalityColor(vuln.criticality)}`}>
                                {getCriticalityText(vuln.criticality)}
                              </span>
                            </div>
                            
                            {/* Menu Contextual */}
                            {openMenuId === vuln.id && (
                              <div className="absolute top-16 right-4 z-50 bg-slate-800 border border-slate-600 rounded-lg shadow-lg py-2 min-w-[200px]">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handlePriorityChange(vuln.id, 'up')
                                    setOpenMenuId(null)
                                  }}
                                  className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
                                >
                                  <ArrowUp className="h-4 w-4 text-green-400" />
                                  <span>Subir Prioridade</span>
                                </button>
                                
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handlePriorityChange(vuln.id, 'down')
                                    setOpenMenuId(null)
                                  }}
                                  className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
                                >
                                  <ArrowDown className="h-4 w-4 text-blue-400" />
                                  <span>Baixar Prioridade</span>
                                </button>
                                
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(vuln.id)
                                    setOpenMenuId(null)
                                  }}
                                  className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-red-900/50 text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Excluir</span>
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {getFilteredVulnerabilities().length === 0 && (
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">Nenhuma vulnerabilidade encontrada</p>
                  <p className="text-slate-500 text-sm mt-2">O sistema criará novas vulnerabilidades automaticamente</p>
                </div>
              )}
            </>
          ) : (
            /* Trash View */
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Lixeira</h2>
                  <p className="text-slate-400">Vulnerabilidades excluídas que podem ser restauradas</p>
                </div>
                {deletedVulnerabilities.length > 0 && (
                  <button 
                    onClick={handleEmptyTrash}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Esvaziar Lixeira
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {deletedVulnerabilities.map((vuln) => (
                  <div key={vuln.id} className="bg-slate-800 border border-slate-700 text-white opacity-75 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-slate-300 line-clamp-1">
                          {vuln.title}
                        </h4>
                        <p className="text-slate-500 line-clamp-2 mt-1">
                          {vuln.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(vuln.criticality)}`}>
                            {getCriticalityText(vuln.criticality)}
                          </span>
                          {vuln.deleted_at && (
                            <p className="text-xs text-slate-500">
                              Excluído em: {new Date(vuln.deleted_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRestore(vuln.id)}
                        className="ml-4 px-4 py-2 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg flex items-center"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Restaurar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {deletedVulnerabilities.length === 0 && (
                <div className="text-center py-12">
                  <Trash2 className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">Lixeira vazia</p>
                  <p className="text-slate-500 text-sm mt-2">Vulnerabilidades excluídas aparecerão aqui</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default App

