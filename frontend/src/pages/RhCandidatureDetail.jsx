import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { hrService } from '../services/hrService';
import { authService } from '../services/authService';
import { useToast } from '../components/Toast';
import { getStatusColor } from '../utils/statusHelpers';
import { formatDateShort, formatDateTime } from '../utils/dateHelpers';

const RhCandidatureDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { success, error } = useToast();
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decisionLoading, setDecisionLoading] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/rh/login');
      return;
    }
    loadDossier();
  }, [id]);

  const loadDossier = async () => {
    try {
      const response = await hrService.detailCandidature(id);
      setDossier(response.dossier);

      const notesRes = await hrService.getNotes(id);
      setNotes(notesRes.notes || []);
    } catch (err) {
      console.error('Erreur chargement dossier:', err);
    } finally {
      setLoading(false);
    }
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingDecision, setPendingDecision] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editNoteText, setEditNoteText] = useState('');

  const handleDecision = async (decision) => {
    setPendingDecision(decision);
    setShowConfirmDialog(true);
  };

  const confirmDecision = async () => {
    setShowConfirmDialog(false);
    setDecisionLoading(true);
    
    const previousStatus = dossier.status;
    setDossier({ ...dossier, status: pendingDecision });
    
    try {
      await hrService.prendreDecision(id, pendingDecision);
      success(`Candidature ${pendingDecision === 'acceptee' ? 'acceptée' : 'refusée'} avec succès`);
      loadDossier();
    } catch (err) {
      setDossier({ ...dossier, status: previousStatus });
      error('Erreur lors de la décision');
    } finally {
      setDecisionLoading(false);
    }
  };

  const cancelDecision = () => {
    setShowConfirmDialog(false);
    setPendingDecision(null);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    const tempNote = {
      id: Date.now(),
      note: newNote,
      prenom: JSON.parse(localStorage.getItem('user') || '{}').prenom,
      nom: JSON.parse(localStorage.getItem('user') || '{}').nom,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setNotes([...notes, tempNote]);
    const previousNotes = [...notes];
    setNewNote('');
    
    try {
      const res = await hrService.addNote(id, newNote);
      setNotes(notes.map(n => n.id === tempNote.id ? res.note : n));
      success('Note ajoutée avec succès');
    } catch (err) {
      setNotes(previousNotes);
      setNewNote(newNote);
      error('Erreur lors de l\'ajout de la note');
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note.id);
    setEditNoteText(note.note);
  };

  const handleUpdateNote = async (noteId) => {
    if (!editNoteText.trim()) return;
    try {
      const res = await hrService.updateNote(noteId, editNoteText);
      setNotes(notes.map(n => n.id === noteId ? res.note : n));
      setEditingNote(null);
      setEditNoteText('');
    } catch (err) {
      setErrorMessage('Erreur lors de la mise à jour de la note');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await hrService.deleteNote(noteId);
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (err) {
      setErrorMessage('Erreur lors de la suppression de la note');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const cancelEditNote = () => {
    setEditingNote(null);
    setEditNoteText('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          <div className="absolute top-10 -right-20 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[140px]" />
          <div className="absolute -bottom-10 -left-20 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          <div className="absolute top-10 -right-20 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[140px]" />
          <div className="absolute -bottom-10 -left-20 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
        </div>
        <Card className="w-full max-w-md text-center relative z-10">
          <p className="text-gray-600 mb-4">Dossier introuvable</p>
          <Button onClick={() => navigate('/rh/dashboard')}>Retour</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8 relative overflow-hidden">
      {}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <div className="absolute top-10 -right-20 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[140px]" />
        <div className="absolute -bottom-10 -left-20 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
      </div>
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/rh/dashboard')} 
              className="shadow-sm hover:shadow-md transition-all duration-200"
            >
              ← Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dossier {dossier.reference}</h1>
              <p className="text-gray-600 mt-1">Candidature de {dossier.prenom} {dossier.nom}</p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${getStatusColor(dossier.status)}`}>
            {dossier.status}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Candidat</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Nom complet</span>
                <span className="font-semibold text-gray-900">{dossier.prenom} {dossier.nom}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Email</span>
                <span className="font-semibold text-gray-900">{dossier.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Téléphone</span>
                <span className="font-semibold text-gray-900">{dossier.telephone || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Soumis le</span>
                <span className="font-semibold text-gray-900">{formatDateShort(dossier.submitted_at)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Formation</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Établissement</span>
                <span className="font-semibold text-gray-900">{dossier.etablissement}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Spécialité</span>
                <span className="font-semibold text-gray-900">{dossier.specialite}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Niveau</span>
                <span className="font-semibold text-gray-900">{dossier.niveau}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Type de stage</span>
                <span className="font-semibold text-gray-900">{dossier.type_stage}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Liens</h2>
            </div>
            <div className="space-y-3">
              {dossier.lien_github && (
                <a
                  href={dossier.lien_github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">GitHub</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              {dossier.lien_linkedin && (
                <a
                  href={dossier.lien_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">LinkedIn</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              {!dossier.lien_github && !dossier.lien_linkedin && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <p className="text-gray-500">Aucun lien fourni</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Statut</h2>
            </div>
            <div className="mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${getStatusColor(dossier.status)}`}>
                {dossier.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Soumis le {formatDateShort(dossier.submitted_at)}
            </p>
            
            {!['acceptee', 'refusee'].includes(dossier.status) && (
              <div className="space-y-3">
                <Button
                  variant="success"
                  onClick={() => handleDecision('acceptee')}
                  disabled={decisionLoading}
                  className="w-full shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {decisionLoading ? 'Traitement...' : 'Accepter la candidature'}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDecision('refusee')}
                  disabled={decisionLoading}
                  className="w-full shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {decisionLoading ? 'Traitement...' : 'Refuser la candidature'}
                </Button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
            </div>
            {dossier.cv_chemin ? (
              <a
                href={`http://localhost:5000/${dossier.cv_chemin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-semibold">{dossier.cv_nom_original || 'CV'}</span>
              </a>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-500">Aucun CV</p>
              </div>
            )}
            
            {dossier.lettre_motivation && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Lettre de motivation</h3>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{dossier.lettre_motivation}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Notes RH</h2>
            </div>
            
            <div className="mb-6">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Ajouter une note privée..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all duration-200"
              />
              <div className="mt-3 flex justify-end">
                <Button onClick={handleAddNote} disabled={!newNote.trim()} className="shadow-sm hover:shadow-md transition-all duration-200">
                  Ajouter
                </Button>
              </div>
            </div>

            {notes.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <p className="text-gray-500">Aucune note</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="bg-gradient-to-br from-gray-50 to-blue-50/30 border border-gray-200 rounded-xl p-5">
                    {editingNote === note.id ? (
                      <div>
                        <textarea
                          value={editNoteText}
                          onChange={(e) => setEditNoteText(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none mb-3 transition-all duration-200"
                        />
                        <div className="flex gap-3 justify-end">
                          <Button variant="secondary" onClick={cancelEditNote} className="shadow-sm hover:shadow-md transition-all duration-200">
                            Annuler
                          </Button>
                          <Button onClick={() => handleUpdateNote(note.id)} className="shadow-sm hover:shadow-md transition-all duration-200">
                            Sauvegarder
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">
                                {note.prenom[0]}{note.nom[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {note.prenom} {note.nom}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDateTime(note.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditNote(note)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Modifier"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Supprimer"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{note.note}</p>
                        {note.updated_at !== note.created_at && (
                          <p className="text-xs text-gray-400 mt-3">
                            Modifié le {formatDateTime(note.updated_at)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl border border-blue-200 shadow-2xl max-w-md w-full p-6 transform transition-all">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                pendingDecision === 'acceptee' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <svg className={`w-6 h-6 ${
                  pendingDecision === 'acceptee' ? 'text-green-600' : 'text-red-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {pendingDecision === 'acceptee' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">
                {pendingDecision === 'acceptee' ? 'Accepter la candidature' : 'Refuser la candidature'}
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Êtes-vous sûr de vouloir {pendingDecision === 'acceptee' ? 'accepter' : 'refuser'} cette candidature ?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={cancelDecision}
                  className="flex-1 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Annuler
                </Button>
                <Button
                  variant={pendingDecision === 'acceptee' ? 'success' : 'danger'}
                  onClick={confirmDecision}
                  className="flex-1 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {pendingDecision === 'acceptee' ? 'Accepter' : 'Refuser'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {showSuccessMessage && (
          <div className="fixed top-4 right-4 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400 text-green-800 px-6 py-4 rounded-xl shadow-lg z-50 flex items-center gap-3 animate-in slide-in-from-right duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Candidature {pendingDecision === 'acceptee' ? 'acceptée' : 'refusée'} avec succès</span>
          </div>
        )}

        {errorMessage && (
          <div className="fixed top-4 right-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 text-red-800 px-6 py-4 rounded-xl shadow-lg z-50 flex items-center gap-3 animate-in slide-in-from-right duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RhCandidatureDetail;

