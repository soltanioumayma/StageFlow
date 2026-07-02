// ============================================================
// services/email.service.js
// Envoie des emails automatiques via Nodemailer
// ============================================================
const nodemailer = require('nodemailer');
const Notification = require('../models/Notification.model');
const { logger } = require('../utils/logger');

// Crée le transporteur email (Gmail SMTP)
const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true pour 465, false pour les autres ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Templates d'emails ──────────────────────────────────────

const templates = {
  // Email envoyé au candidat après soumission du formulaire
  confirmation: (prenom, reference) => ({
    sujet: `Candidature reçue – Référence ${reference}`,
    corps: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #1a56ff;">Groupe RIF – Confirmation de candidature</h2>
        <p>Bonjour <strong>${prenom}</strong>,</p>
        <p>Votre candidature a bien été reçue. Voici votre référence de suivi :</p>
        <div style="background: #f0f4ff; padding: 16px; border-radius: 8px; text-align: center;">
          <h1 style="color: #1a56ff; margin: 0;">${reference}</h1>
        </div>
        <p>Utilisez cette référence et votre email pour suivre l'avancement de votre dossier.</p>
        <p>Nous reviendrons vers vous prochainement.</p>
        <br/>
        <p>Cordialement,<br/><strong>L'équipe RH – Groupe RIF</strong></p>
      </div>
    `,
  }),

  // Email envoyé au candidat si candidature acceptée
  acceptation: (prenom, reference) => ({
    sujet: `Félicitations ! Votre candidature est acceptée – ${reference}`,
    corps: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #16a34a;">Groupe RIF – Candidature acceptée 🎉</h2>
        <p>Bonjour <strong>${prenom}</strong>,</p>
        <p>Nous avons le plaisir de vous informer que votre candidature <strong>${reference}</strong> a été <strong>acceptée</strong>.</p>
        <p>Notre équipe vous contactera prochainement pour les prochaines étapes.</p>
        <br/>
        <p>Cordialement,<br/><strong>L'équipe RH – Groupe RIF</strong></p>
      </div>
    `,
  }),

  // Email envoyé au candidat si candidature refusée
  refus: (prenom, reference) => ({
    sujet: `Résultat de votre candidature – ${reference}`,
    corps: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #dc2626;">Groupe RIF – Résultat de candidature</h2>
        <p>Bonjour <strong>${prenom}</strong>,</p>
        <p>Après examen de votre dossier <strong>${reference}</strong>, nous n'avons pas pu donner suite à votre candidature pour cette période.</p>
        <p>Nous vous encourageons à postuler à nouveau lors de la prochaine session.</p>
        <br/>
        <p>Cordialement,<br/><strong>L'équipe RH – Groupe RIF</strong></p>
      </div>
    `,
  }),
};

// ── Fonction principale d'envoi ─────────────────────────────

/**
 * Envoie un email et le trace dans la table "notifications"
 * @param {string} type       - 'confirmation' | 'acceptation' | 'refus'
 * @param {string} emailDest  - Email du destinataire
 * @param {string} prenom     - Prénom du candidat
 * @param {string} reference  - Référence du dossier
 * @param {number} candidatureId - ID du dossier en base
 */
const sendEmail = async (type, emailDest, prenom, reference, candidatureId) => {
  const template = templates[type](prenom, reference);

  let statut = 'envoye';

  try {
    await transporter.sendMail({
      from:    process.env.EMAIL_FROM || 'StageFlow <noreply@grouperif.com>',
      to:      emailDest,
      subject: template.sujet,
      html:    template.corps,
    });
    logger.info(`Email "${type}" envoyé à ${emailDest}`, { candidatureId });
  } catch (err) {
    // On ne bloque pas la candidature si l'email échoue
    logger.error(`Email "${type}" échoué pour ${emailDest}`, { error: err.message, candidatureId });
    statut = 'echec';
  }

  // On trace l'envoi dans la base de données
  await Notification.create({
    candidature_id: candidatureId,
    type_notif: type,
    email_dest: emailDest,
    sujet: template.sujet,
    statut,
  });
};

module.exports = { sendEmail };
