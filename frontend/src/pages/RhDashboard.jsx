import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { SkeletonCard, SkeletonStats, SkeletonInput } from '../components/Skeleton';
import { useToast } from '../components/Toast';
import { hrService } from '../services/hrService';
import { authService } from '../services/authService';

const POLLING_INTERVAL = 15000;

const RhDashboard = () => {
  const navigate = useNavigate();
  const { error: showError } = useToast();

  const [stats, setStats] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [typeStageFilter, setTypeStageFilter] = useState('');
  const [niveauFilter, setNiveauFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/rh/login');
      return;
    }
    loadData();
  }, [filter, search, typeStageFilter, niveauFilter, dateFrom, dateTo, currentPage]);

  useEffect(() => {
    const startPolling = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        loadData(true);
      }, POLLING_INTERVAL);
    };

    startPolling();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [filter, search, typeStageFilter, niveauFilter, dateFrom, dateTo, currentPage]);

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const params = new URLSearchParams();
      if (filter) params.append('status', filter);
      if (search) params.append('search', search);
      if (typeStageFilter) params.append('type_stage', typeStageFilter);
      if (niveauFilter) params.append('niveau', niveauFilter);
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      params.append('page', currentPage);
      params.append('limit', 20);

      const [statsRes, candidaturesRes] = await Promise.all([
        hrService.getStats(),
        hrService.listerCandidatures(params.toString()),
      ]);

      setStats(statsRes.stats);
      setCandidatures(candidaturesRes.data || []);
      setPagination(candidaturesRes.pagination);
    } catch (err) {
      console.error('Erreur chargement données:', err);
      if (!silent) showError('Erreur lors du chargement des données');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/rh/login');
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const debouncedSearch = useCallback(
    (value) => {
      const timer = setTimeout(() => {
        setSearch(value);
        setCurrentPage(1);
      }, 300);
      return () => clearTimeout(timer);
    },
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  const handleExportCSV = () => {
    const headers = ['Référence', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Statut', 'Type de stage', 'Niveau', 'Date de soumission'];
    const csvContent = [
      headers.join(','),
      ...candidatures.map(c => [
        c.reference,
        c.nom,
        c.prenom,
        c.email,
        c.telephone || '',
        c.status,
        c.type_stage,
        c.niveau,
        new Date(c.submitted_at).toLocaleDateString('fr-FR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `candidatures_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setFilter('');
    setSearch('');
    setTypeStageFilter('');
    setNiveauFilter('');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente':
        return 'bg-blue-100 text-blue-800';
      case 'acceptee':
        return 'bg-green-100 text-green-800';
      case 'refusee':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden p-4 md:p-8">
        {/* Background blobs */}
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          <div className="absolute top-10 -right-20 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[140px]" />
          <div className="absolute -bottom-10 -left-20 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
            </div>
            <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonStats key={i} />
            ))}
          </div>

          <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6 mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
            <div className="grid md:grid-cols-4 gap-4">
              <SkeletonInput />
              <SkeletonInput />
              <SkeletonInput />
              <SkeletonInput />
            </div>
          </div>

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden p-4 md:p-8">
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <div className="absolute top-10 -right-20 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[140px]" />
        <div className="absolute -bottom-10 -left-20 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Espace RH</h1>
            <p className="text-gray-600 mt-1">Bienvenue, {user.prenom} {user.nom}</p>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="shadow-sm hover:shadow-md transition-all duration-200">
            Déconnexion
          </Button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-primary-600">{stats.total}</p>
                  <p className="text-sm text-gray-600 mt-1 font-medium">Total</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-yellow-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-yellow-600">{stats.en_attente}</p>
                  <p className="text-sm text-gray-600 mt-1 font-medium">En attente</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-green-600">{stats.acceptees}</p>
                  <p className="text-sm text-gray-600 mt-1 font-medium">Acceptées</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-red-600">{stats.refusees}</p>
                  <p className="text-sm text-gray-600 mt-1 font-medium">Refusées</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
              <input
                type="text"
                placeholder="Nom, email, référence..."
                onChange={handleSearchChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={filter}
                onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              >
                <option value="">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="acceptee">Acceptées</option>
                <option value="refusee">Refusées</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de stage</label>
              <select
                value={typeStageFilter}
                onChange={(e) => { setTypeStageFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              >
                <option value="">Tous les types</option>
                <option value="PFE">PFE</option>
                <option value="Stage_ete">Stage d'été</option>
                <option value="Alternance">Alternance</option>
                <option value="Observation">Observation</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select
                value={niveauFilter}
                onChange={(e) => { setNiveauFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              >
                <option value="">Tous les niveaux</option>
                <option value="BTS">BTS</option>
                <option value="Licence">Licence</option>
                <option value="Master">Master</option>
                <option value="Ingenieur">Ingénieur</option>
                <option value="Doctorat">Doctorat</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 items-stretch sm:items-center">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700">Date:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
              <span className="text-gray-500 hidden sm:block">à</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div className="flex gap-3 sm:ml-auto w-full sm:w-auto">
              <Button variant="secondary" onClick={resetFilters} className="flex-1 sm:flex-none shadow-sm hover:shadow-md transition-all duration-200">
                Réinitialiser
              </Button>
              <Button onClick={handleExportCSV} className="flex-1 sm:flex-none shadow-sm hover:shadow-md transition-all duration-200">
                Exporter CSV
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Candidatures {pagination && `(${pagination.total} total)`}</h2>
            {pagination && (
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                Page {pagination.page} sur {pagination.totalPages}
              </span>
            )}
          </div>

          {candidatures.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">Aucune candidature trouvée</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4">
                {candidatures.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/rh/candidatures/${c.id}`)}
                    className="group relative bg-gradient-to-br from-white to-blue-50/30 border-2 border-blue-200 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg hover:border-blue-400 hover:ring-2 hover:ring-blue-200"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                            <span className="text-blue-600 font-semibold text-sm">
                              {c.prenom?.[0]}{c.nom?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-lg group-hover:text-blue-700 transition-colors duration-300">
                              {c.prenom} {c.nom}
                            </p>
                            <p className="text-sm text-gray-600">{c.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-3">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {c.reference}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(c.submitted_at).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {c.type_stage}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            {c.niveau}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${getStatusColor(c.status)}`}>
                          {c.status === 'en_attente' ? 'En attente' :
                           c.status === 'acceptee' ? 'Acceptée' : 'Refusée'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-8 pt-6 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Précédent
                  </Button>

                  <div className="flex gap-2 flex-wrap justify-center">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum = pagination.page - 2 + i;
                      if (pagination.totalPages <= 5) pageNum = i + 1;
                      else if (pagination.page <= 3) pageNum = i + 1;
                      else if (pagination.page >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 min-w-[40px] ${
                            pagination.page === pageNum
                              ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="secondary"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant →
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RhDashboard;
